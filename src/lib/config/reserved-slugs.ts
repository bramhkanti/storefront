/**
 * Reserved URL slugs that cannot be matched as root category handles.
 *
 * Prevents dynamic route collisions for top-level pages like /products, /collections,
 * /cart, /checkout, /api, and asset routes.
 */
export const RESERVED_SLUGS = new Set([
  'api',
  'products',
  'collections',
  'cart',
  'checkout',
  'order-confirmed',
  'search',
  'policies',
  'profile',
  'account',
  'about',
  'contact',
  'blog',
  'health',
  'sitemap',
  'sitemap.xml',
  'robots.txt',
  'favicon.ico',
  'manifest.json',
  'opengraph-image',
  'twitter-image',
  '_next',
  'static',
]);

/**
 * Check if a URL slug is reserved by the application.
 */
export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug.toLowerCase());
}
