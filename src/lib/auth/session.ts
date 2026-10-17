import 'server-only';

import { cookies } from 'next/headers';
import { serverEnv } from '@/lib/env';
import {
  CUSTOMER_TOKEN_COOKIE,
  CUSTOMER_TOKEN_MAX_AGE_SECONDS,
  REGISTRATION_TOKEN_COOKIE,
  REGISTRATION_TOKEN_MAX_AGE_SECONDS,
} from './constants';

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: serverEnv.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  };
}

export async function getCustomerToken(): Promise<string | undefined> {
  return (await cookies()).get(CUSTOMER_TOKEN_COOKIE)?.value;
}

export async function setCustomerToken(token: string): Promise<void> {
  const store = await cookies();
  store.set(CUSTOMER_TOKEN_COOKIE, token, cookieOptions(CUSTOMER_TOKEN_MAX_AGE_SECONDS));
  store.delete(REGISTRATION_TOKEN_COOKIE);
}

export async function getRegistrationToken(): Promise<string | undefined> {
  return (await cookies()).get(REGISTRATION_TOKEN_COOKIE)?.value;
}

export async function setRegistrationToken(token: string): Promise<void> {
  (await cookies()).set(
    REGISTRATION_TOKEN_COOKIE,
    token,
    cookieOptions(REGISTRATION_TOKEN_MAX_AGE_SECONDS),
  );
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(CUSTOMER_TOKEN_COOKIE);
  store.delete(REGISTRATION_TOKEN_COOKIE);
}
