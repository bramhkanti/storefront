'use server';

import { getSearchSeeds, searchCatalog, type CategoryMatch } from './queries';

/** Lean product row for the search dropdown (no full product payload). */
export interface SearchSuggestion {
  handle: string;
  title: string;
  subtitle?: string | undefined;
  imageUrl?: string | undefined;
  /** Lowest price in paise; undefined when not priced yet. */
  fromPrice?: number | undefined;
  currencyCode: string;
  inStock: boolean;
}

export interface SearchSuggestions {
  query: string;
  products: SearchSuggestion[];
  /** Total product matches (the dropdown shows only the first few). */
  total: number;
  categories: CategoryMatch[];
}

const MAX_QUERY_LENGTH = 80;

export async function searchSuggestionsAction(
  rawQuery: string,
): Promise<SearchSuggestions> {
  const query = String(rawQuery ?? '')
    .trim()
    .slice(0, MAX_QUERY_LENGTH);
  try {
    const result =
      query.length >= 2 ? await searchCatalog(query) : await getSearchSeeds();
    return {
      query,
      total: result.products.length,
      categories: result.categories.slice(0, query ? 4 : 10),
      products: result.products.slice(0, 6).map((p) => {
        const priced = p.variants.filter((v) => v.price.amount > 0);
        const cheapest = priced.reduce<(typeof priced)[number] | undefined>(
          (min, v) => (!min || v.price.amount < min.price.amount ? v : min),
          undefined,
        );
        return {
          handle: p.handle,
          title: p.title,
          subtitle: p.subtitle,
          imageUrl: p.images[0]?.url,
          fromPrice: cheapest?.price.amount,
          currencyCode: cheapest?.price.currencyCode ?? 'INR',
          inStock: priced.some((v) => v.inStock),
        };
      }),
    };
  } catch (error) {
    console.warn('Search suggestions failed', error);
    return { query, total: 0, categories: [], products: [] };
  }
}
