import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { getProductReader } from '@/lib/api/container';
import type {
  PaginatedResult,
  Product,
  ProductFilterParams,
} from '@/lib/api/contracts/domain';
import { CACHE_TAGS } from '@/lib/cache/tags';

/**
 * Fetch a single product by canonical slug handle.
 * Cached with 'catalog' profile and tagged with product-specific and global tags.
 */
export async function getProductByHandle(handle: string): Promise<Product | null> {
  'use cache';
  cacheLife('catalog');
  cacheTag(CACHE_TAGS.catalog, CACHE_TAGS.products, CACHE_TAGS.product(handle));

  const reader = getProductReader();
  return reader.getProductByHandle(handle);
}

/**
 * List products with optional category, collection, price, or tag filters.
 */
export async function listProducts(
  filter?: ProductFilterParams,
): Promise<PaginatedResult<Product>> {
  'use cache';
  cacheLife('catalog');
  cacheTag(
    CACHE_TAGS.catalog,
    CACHE_TAGS.products,
    ...(filter?.categoryHandle
      ? [CACHE_TAGS.productCategory(filter.categoryHandle)]
      : []),
    ...(filter?.collectionHandle
      ? [CACHE_TAGS.productCollection(filter.collectionHandle)]
      : []),
  );

  const reader = getProductReader();
  return reader.listProducts(filter);
}

/**
 * Get featured products for homepage hero / showcases.
 */
export async function getFeaturedProducts(limit: number = 6): Promise<Product[]> {
  'use cache';
  cacheLife('catalog');
  cacheTag(CACHE_TAGS.catalog, CACHE_TAGS.products);

  const reader = getProductReader();
  return reader.getFeaturedProducts(limit);
}

/**
 * Get top product handles for generateStaticParams pre-rendering.
 */
export async function getTopProductHandles(
  limit: number = 50,
): Promise<Array<{ handle: string }>> {
  'use cache';
  cacheLife('catalog');
  cacheTag(CACHE_TAGS.catalog, CACHE_TAGS.products);

  const reader = getProductReader();
  return reader.getTopProductsForStaticParams(limit);
}

/**
 * Get products assigned to a category handle.
 */
export async function getProductsByCategory(
  categoryHandle: string,
  limit: number = 12,
): Promise<Product[]> {
  'use cache';
  cacheLife('catalog');
  cacheTag(
    CACHE_TAGS.catalog,
    CACHE_TAGS.products,
    CACHE_TAGS.productCategory(categoryHandle),
  );

  const reader = getProductReader();
  return reader.getProductsByCategory(categoryHandle, limit);
}
