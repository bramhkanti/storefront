import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { getCategoryReader } from '@/lib/api/container';
import type { Category } from '@/lib/api/contracts/domain';
import { CACHE_TAGS } from '@/lib/cache/tags';

/**
 * Fetch a single category by handle.
 */
export async function getCategoryByHandle(handle: string): Promise<Category | null> {
  'use cache';

  cacheLife('catalog');
  cacheTag(CACHE_TAGS.catalog, CACHE_TAGS.categories, CACHE_TAGS.category(handle));

  return getCategoryReader().getCategoryByHandle(handle);
}

/**
 * Fetch all categories as a flat list.
 */
export async function listCategories(): Promise<Category[]> {
  'use cache';

  cacheLife('navigation');
  cacheTag(CACHE_TAGS.catalog, CACHE_TAGS.categories, CACHE_TAGS.navigation);

  return getCategoryReader().listCategories();
}

/**
 * Fetch the hierarchical category tree for navigation and mega-menus.
 */
export async function getCategoryTree(): Promise<Category[]> {
  'use cache';

  cacheLife('navigation');
  cacheTag(CACHE_TAGS.catalog, CACHE_TAGS.categories, CACHE_TAGS.navigation);

  return getCategoryReader().getCategoryTree();
}

/**
 * Fetch all category handles for static params and sitemap generation.
 */
export async function getAllCategoryHandles(): Promise<string[]> {
  'use cache';

  cacheLife('navigation');
  cacheTag(CACHE_TAGS.catalog, CACHE_TAGS.categories);

  return getCategoryReader().getAllCategoryHandles();
}
