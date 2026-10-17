import type { Category, Collection } from '@/lib/api/contracts/domain';
import type { SignatureRangeItem } from './types';

function flatten(categories: Category[]): Category[] {
  return categories.flatMap((c) => [c, ...flatten(c.children ?? [])]);
}

/**
 * Points each home card at a category or collection that exists in the
 * backend and drops cards for ranges that aren't on sale yet, so the home
 * page never links to an empty page.
 */
export function resolveSignatureRange(
  items: SignatureRangeItem[],
  categories: Category[],
  collections: Collection[],
): SignatureRangeItem[] {
  const categoryHandles = new Set(flatten(categories).map((c) => c.handle));
  const collectionHandles = new Set(collections.map((c) => c.handle));

  return items.flatMap((item) => {
    const category = item.categoryHandles?.find((h) => categoryHandles.has(h));
    if (category) return [{ ...item, href: `/${category}` }];
    if (item.collectionHandle && collectionHandles.has(item.collectionHandle)) {
      return [{ ...item, href: `/collections/${item.collectionHandle}` }];
    }
    return [];
  });
}
