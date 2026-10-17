import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import {
  getCategoryReader,
  getProductReader,
  getSearchService,
} from '@/lib/api/container';
import type { Category, Product } from '@/lib/api/contracts/domain';
import { CACHE_TAGS } from '@/lib/cache/tags';

export interface CategoryMatch {
  name: string;
  /** Storefront path, e.g. '/pickles' or '/pickles/aam-ka-achar'. */
  href: string;
}

export interface CatalogSearchResult {
  products: Product[];
  categories: CategoryMatch[];
}

function categoryHref(category: Category, byId: Map<string, Category>): string {
  const parent = category.parentId ? byId.get(category.parentId) : undefined;
  return parent ? `/${parent.handle}/${category.handle}` : `/${category.handle}`;
}

/** "sweet" should find "Sweets", "pickles" should find "Pickle". */
function matchesTerm(text: string, term: string): boolean {
  const a = text.toLowerCase();
  const stem = term.replace(/(es|s)$/, '');
  return a.includes(term) || (stem.length >= 3 && a.includes(stem));
}

/**
 * Product text search plus category-name matches. Medusa's `q` only looks at
 * product fields, so "sweets" would otherwise miss everything in Sweets.
 */
export async function searchCatalog(
  query: string,
  limit: number = 48,
): Promise<CatalogSearchResult> {
  'use cache';
  cacheLife('catalog');
  cacheTag(CACHE_TAGS.catalog, CACHE_TAGS.search);

  const trimmed = query.trim();
  if (!trimmed) return { products: [], categories: [] };

  const terms = trimmed
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length >= 3);
  const [hits, categories] = await Promise.all([
    getSearchService().searchProducts(trimmed, limit),
    getCategoryReader().listCategories(),
  ]);

  const byId = new Map(categories.map((c) => [c.id, c]));
  const matched = categories.filter((c) =>
    terms.some((t) => matchesTerm(c.name, t) || matchesTerm(c.handle, t)),
  );

  const products = [...hits];
  const seen = new Set(products.map((p) => p.id));
  const fromCategories = await Promise.all(
    matched.map((c) =>
      getProductReader()
        .listProducts({ categoryHandle: c.handle, limit })
        .then((r) => r.items),
    ),
  );
  for (const p of fromCategories.flat()) {
    if (!seen.has(p.id)) {
      seen.add(p.id);
      products.push(p);
    }
  }

  return {
    products: products.slice(0, limit),
    categories: matched.map((c) => ({ name: c.name, href: categoryHref(c, byId) })),
  };
}

/**
 * Perform a cached catalog search for products matching a user query string.
 */
export async function searchProducts(
  query: string,
  limit: number = 8,
): Promise<Product[]> {
  const { products } = await searchCatalog(query, Math.max(limit, 8));
  return products.slice(0, limit);
}

/** What the search box shows before the shopper types: popular picks and categories. */
export async function getSearchSeeds(): Promise<CatalogSearchResult> {
  'use cache';
  cacheLife('catalog');
  cacheTag(CACHE_TAGS.catalog, CACHE_TAGS.search, CACHE_TAGS.navigation);

  const [featured, tree] = await Promise.all([
    getProductReader().getFeaturedProducts(4),
    getCategoryReader().getCategoryTree(),
  ]);
  const categories: CategoryMatch[] = tree.flatMap((root) => [
    { name: root.name, href: `/${root.handle}` },
    ...(root.children ?? []).map((child) => ({
      name: child.name,
      href: `/${root.handle}/${child.handle}`,
    })),
  ]);
  return { products: featured, categories };
}
