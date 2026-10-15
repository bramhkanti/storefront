'use server';

import { cookies } from 'next/headers';
import { updateTag } from 'next/cache';
import {
  getCartService,
  getCheckoutService,
  getCustomerAuthService,
} from '@/lib/api/container';
import type {
  Address,
  Cart,
  PaymentMethod,
  PaymentSession,
  ShippingOption,
} from '@/lib/api/contracts/domain';
import { UserFacingError } from '@/lib/api/errors';
import { getCustomerToken } from '@/lib/auth/session';
import { CACHE_TAGS } from '@/lib/cache/tags';
import { CART_COOKIE_NAME } from '@/lib/cart/constants';

export type CheckoutResult<T> = { ok: true; data: T } | { ok: false; error: string };

export interface CheckoutAddressInput {
  fullName: string;
  phone: string;
  email?: string | undefined;
  address1: string;
  address2?: string | undefined;
  city: string;
  province: string;
  postalCode: string;
  /** Logged-in shoppers can add the address to their address book. */
  saveToAccount?: boolean | undefined;
}

export type CheckoutFieldErrors = Partial<Record<keyof CheckoutAddressInput, string>>;

function fail(error: unknown, fallback: string): { ok: false; error: string } {
  if (error instanceof UserFacingError) return { ok: false, error: error.message };
  console.error(fallback, error);
  return { ok: false, error: fallback };
}

async function currentCartId(): Promise<string | undefined> {
  return (await cookies()).get(CART_COOKIE_NAME)?.value;
}

function validate(input: CheckoutAddressInput): CheckoutFieldErrors {
  const errors: CheckoutFieldErrors = {};
  if (input.fullName.trim().length < 2) errors.fullName = 'Enter the full name';
  const phone = input.phone.replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, '');
  if (!/^[6-9]\d{9}$/.test(phone)) errors.phone = 'Enter a valid 10-digit mobile number';
  if (input.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) {
    errors.email = 'Enter a valid email or leave it empty';
  }
  if (input.address1.trim().length < 5) errors.address1 = 'Enter house number and street';
  if (input.city.trim().length < 2) errors.city = 'Enter the city';
  if (input.province.trim().length < 2) errors.province = 'Select the state';
  if (!/^[1-9]\d{5}$/.test(input.postalCode.trim()))
    errors.postalCode = 'Enter a valid 6-digit PIN code';
  return errors;
}

function toAddress(input: CheckoutAddressInput): Address {
  const parts = input.fullName.trim().split(/\s+/);
  const phone = input.phone.replace(/\D/g, '').slice(-10);
  return {
    firstName: parts.length > 1 ? parts.slice(0, -1).join(' ') : (parts[0] ?? ''),
    lastName: parts.length > 1 ? (parts[parts.length - 1] ?? '') : '',
    phone: `+91${phone}`,
    address1: input.address1.trim(),
    address2: input.address2?.trim() || undefined,
    city: input.city.trim(),
    province: input.province.trim(),
    postalCode: input.postalCode.trim(),
    countryCode: 'in',
  };
}

/**
 * Step 1: save the delivery address and return the delivery options for it.
 */
export async function saveCheckoutAddressAction(
  input: CheckoutAddressInput,
): Promise<
  | { ok: true; data: { cart: Cart; shippingOptions: ShippingOption[] } }
  | { ok: false; error: string; fieldErrors?: CheckoutFieldErrors }
> {
  const fieldErrors = validate(input);
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: 'Please check the highlighted fields', fieldErrors };
  }
  const cartId = await currentCartId();
  if (!cartId) return { ok: false, error: 'Your bag is empty' };

  try {
    const address = toAddress(input);
    const checkout = getCheckoutService();
    const cart = await checkout.updateCheckoutDetails(cartId, {
      email: input.email?.trim() || undefined,
      shippingAddress: address,
    });

    const token = await getCustomerToken();
    if (token && input.saveToAccount) {
      // Best effort: a failed address-book save must not block checkout.
      const auth = getCustomerAuthService();
      await auth
        .getCustomer(token)
        .then((customer) =>
          auth.addAddress(token, {
            ...address,
            label: 'Home',
            // The first saved address becomes the default.
            isDefault: !customer || customer.addresses.length === 0,
          }),
        )
        .catch((error: unknown) =>
          console.warn('Could not save address to account', error),
        );
    }

    const shippingOptions = await checkout.listShippingOptions(cartId);
    return { ok: true, data: { cart, shippingOptions } };
  } catch (error) {
    return fail(error, 'Could not save your address. Please try again.');
  }
}

/** Step 2: choose a delivery option. */
export async function selectShippingOptionAction(
  optionId: string,
): Promise<CheckoutResult<Cart>> {
  const cartId = await currentCartId();
  if (!cartId) return { ok: false, error: 'Your bag is empty' };
  try {
    return {
      ok: true,
      data: await getCheckoutService().setShippingOption(cartId, optionId),
    };
  } catch (error) {
    return fail(error, 'Could not set the delivery option.');
  }
}

export async function listPaymentMethodsAction(): Promise<
  CheckoutResult<PaymentMethod[]>
> {
  const cartId = await currentCartId();
  if (!cartId) return { ok: false, error: 'Your bag is empty' };
  try {
    return { ok: true, data: await getCheckoutService().listPaymentMethods(cartId) };
  } catch (error) {
    return fail(error, 'Could not load payment methods.');
  }
}

/**
 * Step 3a: create the payment session. For Razorpay the result carries the
 * Razorpay order id and public key the browser needs to open Checkout.
 */
export async function startPaymentAction(
  providerId: string,
): Promise<CheckoutResult<PaymentSession>> {
  const cartId = await currentCartId();
  if (!cartId) return { ok: false, error: 'Your bag is empty' };
  try {
    return {
      ok: true,
      data: await getCheckoutService().initPaymentSession(cartId, providerId),
    };
  } catch (error) {
    return fail(error, 'Could not start the payment. Please try again.');
  }
}

/**
 * Step 3b: ask the backend to place the order. The backend verifies the
 * payment with Razorpay itself; a browser "success" alone never creates an order.
 */
export async function placeOrderAction(): Promise<CheckoutResult<{ orderId: string }>> {
  const cartId = await currentCartId();
  if (!cartId) return { ok: false, error: 'Your bag is empty' };
  try {
    const result = await getCheckoutService().completeCart(cartId);
    if (result.type === 'cart') return { ok: false, error: result.error };

    const store = await cookies();
    store.delete(CART_COOKIE_NAME);
    updateTag(CACHE_TAGS.cart(cartId));
    return { ok: true, data: { orderId: result.order.id } };
  } catch (error) {
    return fail(error, 'Could not place the order. Please try again.');
  }
}

/** Fresh cart for the checkout page after client-side changes. */
export async function getCheckoutCartAction(): Promise<Cart | null> {
  const cartId = await currentCartId();
  return cartId ? getCartService().getCart(cartId) : null;
}
