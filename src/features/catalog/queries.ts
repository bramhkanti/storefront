import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { getCategoryReader } from '@/lib/api/container';
import type { Category } from '@/lib/api/contracts/domain';
import { CACHE_TAGS } from '@/lib/cache/tags';

/**
 * Fetch a single category by slug handle (e.g. 'achar', 'sweets', 'makhana').
 */
export async function getCategoryByHandle(handle: string): Promise<Category | null> {
  'use cache';
  cacheLife('catalog');
  cacheTag(CACHE_TAGS.catalog, CACHE_TAGS.categories, CACHE_TAGS.category(handle));

  const reader = getCategoryReader();
  return reader.getCategoryByHandle(handle);
}

/**
 * Fetch all categories (flat list).
 */
export async function listCategories(): Promise<Category[]> {
  'use cache';
  cacheLife('navigation');
  cacheTag(CACHE_TAGS.catalog, CACHE_TAGS.categories, CACHE_TAGS.navigation);

  const reader = getCategoryReader();
  return reader.listCategories();
}

/**
 * Fetch hierarchical category tree (root categories with populated children)
 * for building dynamic, zero-hardcode navigation menus and mega-menus.
 */
export async function getCategoryTree(): Promise<Category[]> {
  'use cache';
  cacheLife('navigation');
  cacheTag(CACHE_TAGS.catalog, CACHE_TAGS.categories, CACHE_TAGS.navigation);

  const reader = getCategoryReader();
  return reader.getCategoryTree();
}

/**
 * Fetch all category handles for generateStaticParams and sitemap builders.
 */
export async function getAllCategoryHandles(): Promise<string[]> {
  'use cache';
  cacheLife('navigation');
  cacheTag(CACHE_TAGS.catalog, CACHE_TAGS.categories);

  const reader = getCategoryReader();
  return reader.getAllCategoryHandles();
}
