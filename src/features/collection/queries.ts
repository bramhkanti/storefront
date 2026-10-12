import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { getCollectionReader } from '@/lib/api/container';
import type { Collection } from '@/lib/api/contracts/domain';
import { CACHE_TAGS } from '@/lib/cache/tags';

/**
 * Fetch a single curated collection by slug handle (e.g. 'diwali-gifting', 'best-sellers').
 */
export async function getCollectionByHandle(handle: string): Promise<Collection | null> {
  'use cache';
  cacheLife('catalog');
  cacheTag(CACHE_TAGS.catalog, CACHE_TAGS.collections, CACHE_TAGS.collection(handle));

  const reader = getCollectionReader();
  return reader.getCollectionByHandle(handle);
}

/**
 * List all curated collections.
 */
export async function listCollections(): Promise<Collection[]> {
  'use cache';
  cacheLife('catalog');
  cacheTag(CACHE_TAGS.catalog, CACHE_TAGS.collections);

  const reader = getCollectionReader();
  return reader.listCollections();
}
