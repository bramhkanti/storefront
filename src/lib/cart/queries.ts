import 'server-only';

import { cookies } from 'next/headers';
import { getCartService } from '@/lib/api/container';
import type { Cart } from '@/lib/api/contracts/domain';
import { CART_COOKIE_NAME } from './constants';

/**
 * Server-only query to get the current cart from session cookies.
 *
 * NOTE: Does NOT use 'use cache' because it relies on per-shopper
 * dynamic session cookies.
 */
export async function getCart(): Promise<Cart | null> {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE_NAME)?.value;
  if (!cartId) return null;

  try {
    return await getCartService().getCart(cartId);
  } catch {
    return null;
  }
}
