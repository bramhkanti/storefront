'use server';

import { cookies } from 'next/headers';
import { updateTag } from 'next/cache';
import { getCartService } from '@/lib/api/container';
import { UserFacingError } from '@/lib/api/errors';
import { getCustomerToken } from '@/lib/auth/session';
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

    const token = await getCustomerToken();
    // A cart that was completed (became an order) or expired can't take items.
    if (cartId && !(await cartService.getCart(cartId))) {
      cartId = undefined;
    }
    if (!cartId) {
      const newCart = await cartService.createCart(token);
      cartId = newCart.id;
      await setCartIdCookie(cartId);
    }

    const cart: Cart = await cartService.addItem(cartId, { variantId, quantity });

    // Invalidate cached cart reads immediately in Server Action
    updateTag(CACHE_TAGS.cart(cart.id));

    return { success: true, cart };
  } catch (error) {
    console.error('addToCartAction error:', error);
    return {
      success: false,
      error:
        error instanceof UserFacingError
          ? error.message
          : 'Could not add this item. Please try again.',
    };
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
    console.error('updateCartItemAction error:', error);
    return {
      success: false,
      error:
        error instanceof UserFacingError
          ? error.message
          : 'Could not update the quantity.',
    };
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
    console.error('removeCartItemAction error:', error);
    return { success: false, error: 'Could not remove the item.' };
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

/** Apply or remove a promotion code on the current cart. */
export async function updatePromoCodeAction(
  code: string,
  mode: 'apply' | 'remove',
): Promise<CartActionResult> {
  const cartId = await getCartIdFromCookie();
  const clean = code.trim();
  if (!cartId) return { success: false, error: 'Your bag is empty' };
  if (!clean) return { success: false, error: 'Enter a code' };
  try {
    const cartService = getCartService();
    const cart =
      mode === 'apply'
        ? await cartService.applyPromoCode(cartId, clean)
        : await cartService.removePromoCode(cartId, clean);
    updateTag(CACHE_TAGS.cart(cart.id));
    return { success: true, cart };
  } catch (error) {
    if (error instanceof UserFacingError) return { success: false, error: error.message };
    console.error('updatePromoCodeAction error:', error);
    return { success: false, error: 'Could not update the code. Please try again.' };
  }
}
