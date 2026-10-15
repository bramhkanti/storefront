'use server';

import { cookies } from 'next/headers';
import { getCartService, getCustomerAuthService } from '@/lib/api/container';
import type { Order, PaginatedResult } from '@/lib/api/contracts/domain';
import { UserFacingError } from '@/lib/api/errors';
import { CART_COOKIE_NAME } from '@/lib/cart/constants';
import {
  customerToProfile,
  fromSavedAddress,
  splitName,
  type SavedAddress,
  type UserProfile,
} from './profile';
import {
  clearSession,
  getCustomerToken,
  getRegistrationToken,
  setCustomerToken,
  setRegistrationToken,
} from './session';

export type ActionResult<T = undefined> =
  { ok: true; data: T } | { ok: false; error: string; unauthenticated?: boolean };

function fail(error: unknown, fallback: string): { ok: false; error: string } {
  if (error instanceof UserFacingError) return { ok: false, error: error.message };
  console.error(fallback, error);
  return { ok: false, error: fallback };
}

const SESSION_EXPIRED = {
  ok: false as const,
  error: 'Your session has expired. Please log in again.',
  unauthenticated: true,
};

function normalizePhone(input: string): string | null {
  const digits = input.replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, '');
  return /^[6-9]\d{9}$/.test(digits) ? `+91${digits}` : null;
}

/** Moves the shopper's guest bag onto their account after login. */
async function attachGuestCart(token: string): Promise<void> {
  const cartId = (await cookies()).get(CART_COOKIE_NAME)?.value;
  if (!cartId) return;
  try {
    await getCartService().transferCart(cartId, token);
  } catch (error) {
    // Non-fatal: the bag still works as a guest bag.
    console.warn('Could not attach guest cart to customer', error);
  }
}

async function loadProfile(token: string): Promise<UserProfile | null> {
  const customer = await getCustomerAuthService().getCustomer(token);
  return customer ? customerToProfile(customer) : null;
}

/** Step 1 of login: send an OTP by SMS. */
export async function requestOtpAction(phoneInput: string): Promise<ActionResult> {
  const phone = normalizePhone(phoneInput);
  if (!phone) return { ok: false, error: 'Enter a valid 10-digit mobile number' };
  try {
    await getCustomerAuthService().requestOtp(phone);
    return { ok: true, data: undefined };
  } catch (error) {
    return fail(error, 'Could not send the OTP. Please try again.');
  }
}

/** Step 2 of login: verify the OTP. New numbers continue to `completeRegistrationAction`. */
export async function verifyOtpAction(
  phoneInput: string,
  otp: string,
): Promise<
  ActionResult<{ status: 'logged_in'; user: UserProfile } | { status: 'needs_profile' }>
> {
  const phone = normalizePhone(phoneInput);
  if (!phone || !/^\d{6}$/.test(otp)) {
    return { ok: false, error: 'Enter the 6-digit OTP' };
  }
  try {
    const result = await getCustomerAuthService().verifyOtp(phone, otp);
    if (result.needsRegistration) {
      await setRegistrationToken(result.token);
      return { ok: true, data: { status: 'needs_profile' } };
    }
    await setCustomerToken(result.token);
    await attachGuestCart(result.token);
    const user = await loadProfile(result.token);
    if (!user)
      return { ok: false, error: 'Could not load your account. Please try again.' };
    return { ok: true, data: { status: 'logged_in', user } };
  } catch (error) {
    return fail(error, 'Could not verify the OTP. Please try again.');
  }
}

/** Step 3 (first login only): create the customer, optionally with a name. */
export async function completeRegistrationAction(
  fullName: string,
): Promise<ActionResult<UserProfile>> {
  const registrationToken = await getRegistrationToken();
  if (!registrationToken) {
    return { ok: false, error: 'Your OTP session expired. Please verify again.' };
  }
  try {
    const token = await getCustomerAuthService().registerCustomer(
      registrationToken,
      splitName(fullName.slice(0, 120)),
    );
    await setCustomerToken(token);
    await attachGuestCart(token);
    const user = await loadProfile(token);
    if (!user)
      return { ok: false, error: 'Could not load your account. Please try again.' };
    return { ok: true, data: user };
  } catch (error) {
    return fail(error, 'Could not create your account. Please try again.');
  }
}

/** The logged-in customer, or null. Clears a stale cookie. */
export async function getSessionAction(): Promise<UserProfile | null> {
  const token = await getCustomerToken();
  if (!token) return null;
  const user = await loadProfile(token);
  if (!user) await clearSession();
  return user;
}

export async function logoutAction(): Promise<void> {
  await clearSession();
  // The bag belongs to the account now; start a fresh guest bag.
  (await cookies()).delete(CART_COOKIE_NAME);
}

async function withCustomer<T>(
  fallback: string,
  run: (token: string) => Promise<T>,
): Promise<ActionResult<T>> {
  const token = await getCustomerToken();
  if (!token) return SESSION_EXPIRED;
  try {
    return { ok: true, data: await run(token) };
  } catch (error) {
    if (error instanceof UserFacingError && error.status === 401) {
      await clearSession();
      return SESSION_EXPIRED;
    }
    return fail(error, fallback);
  }
}

export async function updateProfileAction(input: {
  name: string;
  email?: string | undefined;
}): Promise<ActionResult<UserProfile>> {
  const { firstName, lastName } = splitName(input.name);
  if (!firstName) return { ok: false, error: 'Please enter your name' };
  const email = input.email?.trim() || undefined;
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'Please enter a valid email address' };
  }
  return withCustomer('Could not update your profile.', async (token) =>
    customerToProfile(
      await getCustomerAuthService().updateCustomer(token, {
        firstName,
        lastName,
        email,
      }),
    ),
  );
}

function validateAddress(address: Omit<SavedAddress, 'id'>): string | null {
  if (address.name.trim().length < 2) return 'Please enter the full name';
  if (!normalizePhone(address.phone))
    return 'Please enter a valid 10-digit mobile number';
  if (address.street.trim().length < 5) return 'Please enter the house number and street';
  if (address.city.trim().length < 2) return 'Please enter the city';
  if (address.state.trim().length < 2) return 'Please select the state';
  if (!/^[1-9]\d{5}$/.test(address.pincode))
    return 'Please enter a valid 6-digit PIN code';
  return null;
}

export async function addAddressAction(
  address: Omit<SavedAddress, 'id'>,
): Promise<ActionResult<UserProfile>> {
  const invalid = validateAddress(address);
  if (invalid) return { ok: false, error: invalid };
  return withCustomer('Could not save the address.', async (token) =>
    customerToProfile(
      await getCustomerAuthService().addAddress(token, fromSavedAddress(address)),
    ),
  );
}

export async function updateAddressAction(
  id: string,
  address: Omit<SavedAddress, 'id'>,
): Promise<ActionResult<UserProfile>> {
  const invalid = validateAddress(address);
  if (invalid) return { ok: false, error: invalid };
  return withCustomer('Could not update the address.', async (token) =>
    customerToProfile(
      await getCustomerAuthService().updateAddress(token, id, fromSavedAddress(address)),
    ),
  );
}

export async function deleteAddressAction(
  id: string,
): Promise<ActionResult<UserProfile>> {
  return withCustomer('Could not delete the address.', async (token) =>
    customerToProfile(await getCustomerAuthService().deleteAddress(token, id)),
  );
}

export async function listMyOrdersAction(
  page = 1,
): Promise<ActionResult<PaginatedResult<Order>>> {
  return withCustomer('Could not load your orders.', (token) =>
    getCustomerAuthService().listOrders(token, page, 10),
  );
}
