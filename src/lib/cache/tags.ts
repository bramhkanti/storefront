/**
 * Cache tag taxonomy for Bramhkanti storefront.
 *
 * All cache keys are strictly typed and centralized to avoid drift
 * between feature queries and revalidation webhooks/actions.
 */
export const CACHE_TAGS = {
  // Global catalog invalidation (e.g. bulk catalog updates or syncs)
  catalog: 'catalog',

  // Product domain tags
  products: 'products',
  product: (handle: string): string => `product:${handle}`,
  productCategory: (categorySlug: string): string => `products:category:${categorySlug}`,
  productCollection: (collectionHandle: string): string =>
    `products:collection:${collectionHandle}`,

  // Approved customer reviews
  reviews: 'reviews',
  productReviews: (productId: string): string => `reviews:${productId}`,

  // Category and navigation hierarchy tags
  categories: 'categories',
  category: (slug: string): string => `category:${slug}`,
  navigation: 'navigation',

  // Collection tags
  collections: 'collections',
  collection: (handle: string): string => `collection:${handle}`,

  // Content and redirects tags
  redirects: 'redirects',

  // Search results
  search: 'search',

  // Cart session tags
  cart: (cartId: string): string => `cart:${cartId}`,
} as const;

export type CacheTag = string;
