import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { getSearchService } from '@/lib/api/container';
import type { Product } from '@/lib/api/contracts/domain';
import { CACHE_TAGS } from '@/lib/cache/tags';

/**
 * Perform a cached catalog search for products matching a user query string.
 */
export async function searchProducts(
  query: string,
  limit: number = 8,
): Promise<Product[]> {
  'use cache';
  cacheLife('catalog');
  cacheTag(CACHE_TAGS.catalog, CACHE_TAGS.search);

  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const searchService = getSearchService();
  return searchService.searchProducts(trimmed, limit);
}
