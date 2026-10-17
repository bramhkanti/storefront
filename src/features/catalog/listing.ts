import type { Category, Product } from '@/lib/api/contracts/domain';

/**
 * In-memory sorting, filtering and paging for product listings (collections,
 * categories, search). The catalog is small, so pages load every matching
 * product once and slice here; that also gives exact facet counts.
 */

export const LISTING_SORTS = [
  { value: 'featured', label: 'Recommended' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'newest', label: 'Newest first' },
  { value: 'name_asc', label: 'Name: A to Z' },
] as const;

export type ListingSort = (typeof LISTING_SORTS)[number]['value'];

/** Price buckets in paise. */
export const PRICE_BUCKETS = [
  { value: 'under-300', label: 'Under ₹300', min: 0, max: 29_999 },
  { value: '300-500', label: '₹300 – ₹500', min: 30_000, max: 50_000 },
  { value: 'above-500', label: 'Above ₹500', min: 50_001, max: Number.POSITIVE_INFINITY },
] as const;

export type PriceBucket = (typeof PRICE_BUCKETS)[number]['value'];

export const LISTING_PAGE_SIZE = 12;

export interface ListingParams {
  sort: ListingSort;
  /** Category facet handle. */
  type?: string | undefined;
  price?: PriceBucket | undefined;
  inStock: boolean;
  page: number;
}

/** A category chip: products belong to it when they're in any of `ids`. */
export interface ListingFacet {
  handle: string;
  name: string;
  ids: string[];
}

export interface ListingFacetCount {
  handle: string;
  name: string;
  count: number;
}

export interface ListingResult {
  items: Product[];
  /** Products after filters, before paging. */
  total: number;
  /** Products before any filter (for "x of y"). */
  unfilteredTotal: number;
  page: number;
  totalPages: number;
  facets: {
    types: ListingFacetCount[];
    prices: Array<{ value: PriceBucket; label: string; count: number }>;
    inStock: number;
  };
}

type RawParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function parseListingParams(raw: RawParams | undefined): ListingParams {
  const sortRaw = first(raw?.sort);
  const priceRaw = first(raw?.price);
  const pageRaw = Number.parseInt(first(raw?.page) ?? '1', 10);
  const type = first(raw?.type)?.trim();
  return {
    sort: LISTING_SORTS.some((s) => s.value === sortRaw)
      ? (sortRaw as ListingSort)
      : 'featured',
    type: type || undefined,
    price: PRICE_BUCKETS.some((b) => b.value === priceRaw)
      ? (priceRaw as PriceBucket)
      : undefined,
    inStock: first(raw?.inStock) === '1',
    page: Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1,
  };
}

/** True when any filter (not sort or page) is set. */
export function hasActiveFilters(params: ListingParams): boolean {
  return Boolean(params.type || params.price || params.inStock);
}

const isPriced = (p: Product) => p.variants.some((v) => v.price.amount > 0);
const isBuyable = (p: Product) => p.variants.some((v) => v.inStock && v.price.amount > 0);

/** Lowest price a shopper can pay ("From ₹x"); unpriced products sort last. */
export function fromPrice(p: Product): number {
  const prices = p.variants.filter((v) => v.price.amount > 0).map((v) => v.price.amount);
  return prices.length > 0 ? Math.min(...prices) : Number.POSITIVE_INFINITY;
}

function inBucket(p: Product, bucket: PriceBucket): boolean {
  const def = PRICE_BUCKETS.find((b) => b.value === bucket);
  if (!def || !isPriced(p)) return false;
  const price = fromPrice(p);
  return price >= def.min && price <= def.max;
}

/** Root categories as facets, each covering its subcategories. */
export function rootCategoryFacets(tree: Category[]): ListingFacet[] {
  const collect = (c: Category): string[] => [
    c.id,
    ...(c.children ?? []).flatMap(collect),
  ];
  return tree.map((c) => ({ handle: c.handle, name: c.name, ids: collect(c) }));
}

/** Direct children of a category as facets. */
export function childCategoryFacets(category: Category): ListingFacet[] {
  return rootCategoryFacets(category.children ?? []);
}

export function applyListing(
  products: Product[],
  params: ListingParams,
  facets: ListingFacet[] = [],
  pageSize: number = LISTING_PAGE_SIZE,
): ListingResult {
  const inFacet = (p: Product, handle: string) => {
    const facet = facets.find((f) => f.handle === handle);
    return facet ? p.categoryIds.some((id) => facet.ids.includes(id)) : true;
  };

  // Each facet counts against the other active filters, so counts stay honest.
  const matches = (p: Product, skip?: 'type' | 'price' | 'inStock') =>
    (skip === 'type' || !params.type || inFacet(p, params.type)) &&
    (skip === 'price' || !params.price || inBucket(p, params.price)) &&
    (skip === 'inStock' || !params.inStock || isBuyable(p));

  const filtered = products.filter((p) => matches(p));

  const sorted = [...filtered];
  const byName = (a: Product, b: Product) => a.title.localeCompare(b.title);
  switch (params.sort) {
    case 'price_asc':
      sorted.sort((a, b) => fromPrice(a) - fromPrice(b) || byName(a, b));
      break;
    case 'price_desc':
      sorted.sort((a, b) => {
        // Unpriced products stay at the end in both directions.
        const pa = Number.isFinite(fromPrice(a)) ? fromPrice(a) : -1;
        const pb = Number.isFinite(fromPrice(b)) ? fromPrice(b) : -1;
        return pb - pa || byName(a, b);
      });
      break;
    case 'newest':
      sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      break;
    case 'name_asc':
      sorted.sort(byName);
      break;
    case 'featured':
    default: {
      // Buyable first, then items flagged `featured` in the admin. Stable otherwise.
      const score = (p: Product) => (isBuyable(p) ? 2 : 0) + (p.featured ? 1 : 0);
      sorted.sort((a, b) => score(b) - score(a));
    }
  }

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(params.page, totalPages);

  return {
    items: sorted.slice((page - 1) * pageSize, page * pageSize),
    total,
    unfilteredTotal: products.length,
    page,
    totalPages,
    facets: {
      types: facets
        .map((f) => ({
          handle: f.handle,
          name: f.name,
          count: products.filter((p) => matches(p, 'type') && inFacet(p, f.handle))
            .length,
        }))
        .filter((f) => f.count > 0 || f.handle === params.type),
      prices: PRICE_BUCKETS.map((b) => ({
        value: b.value,
        label: b.label,
        count: products.filter((p) => matches(p, 'price') && inBucket(p, b.value)).length,
      })),
      inStock: products.filter((p) => matches(p, 'inStock') && isBuyable(p)).length,
    },
  };
}
