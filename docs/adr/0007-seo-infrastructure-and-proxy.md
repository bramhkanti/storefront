# ADR 0007: SEO Infrastructure, Split Sitemaps, and Next.js 16 proxy.ts Network Boundary

## Status

Accepted

## Context

For Bramhkanti (`bramhkanti.com`), organic search ranking is priority #1. The storefront must implement resilient, enterprise-grade SEO architecture to maximize discovery, protect crawl budget, and dominate long-tail Indian food search terms ("banarasi lal mirch achar", "authentic motichoor ladoo pure ghee", "roasted makhana snacks").

Key risks addressed:

1. **Crawl Budget Wastage**: Search engine bots crawling thousands of filter/sort permutations (`?minPrice=100&sort=price_asc`), causing index dilution and duplicate content penalties.
2. **Sitemap Size Limits**: Monolithic sitemaps crashing search engine ingestion as catalog scales beyond 50,000 SKUs.
3. **Canonical Drift**: Inconsistent indexation caused by `www` vs apex host variations and trailing-slash divergence.
4. **Discontinued Products**: Returning 404 for obsolete products drops backlink equity; discontinued items must return HTTP 410 Gone.
5. **Social Sharing Conversion**: Weak click-through rates from WhatsApp, Instagram, and Twitter when shared without branded OpenGraph previews.

## Decisions

### 1. Next.js 16 `proxy.ts` Network Boundary

`src/proxy.ts` is implemented as the single edge/server network boundary executing before route handlers:

- **Canonical Apex Redirect**: Requests to `www.bramhkanti.com` receive an immediate HTTP 301 redirect to apex `bramhkanti.com`.
- **Trailing Slash Normalization**: Non-root URLs with trailing slashes (e.g., `/achar/`) receive an HTTP 301 redirect to clean path (`/achar`).
- **RedirectReader Execution**: Checks centralized redirect repository:
  - Permanent moves emit HTTP 301.
  - Discontinued products emit **HTTP 410 Gone** with `X-Robots-Tag: noindex`.
- **Faceted Search Guard**: When query parameters contain filter/sorting keys (`minPrice`, `maxPrice`, `sort`, `tags`, `page > 1`), `proxy.ts` appends `X-Robots-Tag: noindex, follow`. Bots crawl links but do not index thin filter combinations.
- **Security Headers**: Injects `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy`.

### 2. Split Sitemaps via `generateSitemaps` (`src/app/sitemap.ts`)

Instead of a single large XML document, the sitemap is programmatically partitioned using Next.js 16 `generateSitemaps`:

- `/sitemap.xml`: Root sitemap index generated automatically.
- `/sitemap/pages.xml`: Static core pages (Home, Collections directory).
- `/sitemap/categories.xml`: All primary category hubs and subcategory pages.
- `/sitemap/collections.xml`: Curated holiday and festival gifting collections.
- `/sitemap/products.xml`: All active catalog products with real `lastModified` timestamps from `product.updatedAt`.

### 3. Crawler Control (`src/app/robots.ts`)

`robots.ts` declares:

- Unrestricted crawling on catalog hubs and product pages (`Allow: /`).
- Explicit crawl denial on private/transactional endpoints (`Disallow: /cart`, `/checkout`, `/api/`, `/search`).
- Canonical sitemap pointer (`Sitemap: https://bramhkanti.com/sitemap.xml`).

### 4. Dynamic Open Graph Image Generation (`next/og`)

Server-side JSX-to-PNG image generation using `ImageResponse` from `next/og`:

- Root brand image (`src/app/opengraph-image.tsx`).
- Product detail cards (`src/app/products/[handle]/opengraph-image.tsx`): Dynamically resolves product title, pack size, price in ₹, statutory vegetarian mark, and FSSAI badge.
- Category hub cards (`src/app/[category]/opengraph-image.tsx`): Dynamically displays category name, rich copy, and Varanasi heritage badge.

## Consequences

- **Positive**: 100% crawl budget protection; zero duplicate content indexing; automated sitemap scalability up to millions of products; rich visual sharing cards on WhatsApp/social media; adherence to modern Next.js 16 standards.
- **Negative**: Dynamic Open Graph images add compute time during generation (mitigated by Next.js static asset caching).
