import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { getRedirectReader } from '@/lib/api/container';
import type { Redirect } from '@/lib/api/contracts/domain';
import { CACHE_TAGS } from '@/lib/cache/tags';

/**
 * Fetch a matching redirect rule for a request path (e.g. 301 moved permanently or 410 gone).
 */
export async function getRedirect(path: string): Promise<Redirect | null> {
  'use cache';
  cacheLife('redirects');
  cacheTag(CACHE_TAGS.redirects);

  const reader = getRedirectReader();
  return reader.getRedirect(path);
}

/**
 * Fetch all registered redirect rules for proxy preloading or audit.
 */
export async function listAllRedirects(): Promise<Redirect[]> {
  'use cache';
  cacheLife('redirects');
  cacheTag(CACHE_TAGS.redirects);

  const reader = getRedirectReader();
  return reader.listAllRedirects();
}
