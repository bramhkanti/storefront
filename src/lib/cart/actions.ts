'use server';

import { cookies } from 'next/headers';
import { updateTag } from 'next/cache';
import { getCartService } from '@/lib/api/container';
import { CACHE_TAGS } from '@/lib/cache/tags';
import { serverEnv } from '@/lib/env';
import { CART_COOKIE_NAME, COOKIE_MAX_AGE_SECONDS } from './constants';
import type { Cart } from '@/lib/api/contracts/domain';

import type { CartActionResult } from './types';

export type { CartActionResult };

async function getCartIdFromCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(CART_COOKIE_NAME)?.value;
}

async function setCartIdCookie(cartId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(CART_COOKIE_NAME, cartId, {
    httpOnly: true,
    secure: serverEnv.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
}

/**
 * Retrieve the current shopper's active cart.
 */
export async function getCartAction(): Promise<Cart | null> {
  const cartId = await getCartIdFromCookie();
  if (!cartId) return null;

  try {
    const cart = await getCartService().getCart(cartId);
    if (!cart) {
      const cookieStore = await cookies();
      cookieStore.delete(CART_COOKIE_NAME);
      return null;
    }
    return cart;
  } catch (error) {
    console.error('Failed to retrieve cart:', error);
    return null;
  }
}

/**
 * Add a product variant to the current cart.
 * If no active cart exists, automatically creates one and sets the session cookie.
 */
export async function addToCartAction(
  variantId: string,
  quantity: number = 1,
): Promise<CartActionResult> {
  try {
    let cartId = await getCartIdFromCookie();
    const cartService = getCartService();

    if (!cartId) {
      const newCart = await cartService.createCart();
      cartId = newCart.id;
      await setCartIdCookie(cartId);
    }

    let cart: Cart;
    try {
      cart = await cartService.addItem(cartId, { variantId, quantity });
    } catch {
      // If the cart session expired or was deleted upstream, recreate and retry
      const freshCart = await cartService.createCart();
      cartId = freshCart.id;
      await setCartIdCookie(cartId);
      cart = await cartService.addItem(cartId, { variantId, quantity });
    }

    // Invalidate cached cart reads immediately in Server Action
    updateTag(CACHE_TAGS.cart(cart.id));

    return { success: true, cart };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to add item to bag';
    console.error('addToCartAction error:', message);
    return { success: false, error: message };
  }
}

/**
 * Update the quantity of an existing line item in the cart.
 */
export async function updateCartItemAction(
  lineItemId: string,
  quantity: number,
): Promise<CartActionResult> {
  try {
    const cartId = await getCartIdFromCookie();
    if (!cartId) {
      return { success: false, error: 'No active cart found' };
    }

    const cartService = getCartService();
    const cart = await cartService.updateItem(cartId, lineItemId, quantity);

    updateTag(CACHE_TAGS.cart(cart.id));

    return { success: true, cart };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to update item quantity';
    console.error('updateCartItemAction error:', message);
    return { success: false, error: message };
  }
}

/**
 * Remove a line item completely from the current cart.
 */
export async function removeCartItemAction(
  lineItemId: string,
): Promise<CartActionResult> {
  try {
    const cartId = await getCartIdFromCookie();
    if (!cartId) {
      return { success: false, error: 'No active cart found' };
    }

    const cartService = getCartService();
    const cart = await cartService.removeItem(cartId, lineItemId);

    updateTag(CACHE_TAGS.cart(cart.id));

    return { success: true, cart };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to remove item';
    console.error('removeCartItemAction error:', message);
    return { success: false, error: message };
  }
}

/**
 * Clear the current shopper's cart session upon successful checkout.
 */
export async function clearCartAction(): Promise<void> {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE_NAME)?.value;
  cookieStore.delete(CART_COOKIE_NAME);
  if (cartId) {
    updateTag(CACHE_TAGS.cart(cartId));
  }
}
