# ADR 0003: Caching Model, Cache Tags Taxonomy, and Revalidation Protocol

## Status

Accepted

## Context

Next.js 16 defaults to dynamic rendering and introduces **Cache Components** (`cacheComponents: true`) with the `'use cache'` directive as its primary caching primitive. For a high-traffic e-commerce storefront like Bramhkanti (`bramhkanti.com`), we require:

1. Instant page transitions and sub-100ms TTFB for SEO-critical catalog pages (categories, products, collections).
2. Clean separation between eventual consistency (background updates via webhooks) and immediate consistency (read-your-own-writes for user actions like cart updates).
3. Protection against stale cache drift and cache stampedes.
4. Secure, rate-limited on-demand invalidation endpoints callable by Medusa webhooks or CI/CD pipelines.

## Decisions

### 1. Cache Components & Explicit Lifetimes

We enable `cacheComponents: true` and `partialPrefetching: true` in `next.config.ts`.
Every cached query explicitly declares:

- Directive: `'use cache'`
- Lifetime: Semantic profile via `cacheLife(...)`
- Tags: Hierarchical tags via `cacheTag(...)`

We configured custom `cacheLife` profiles in `next.config.ts`:

- **`catalog`**: Stale 5m, revalidate 15m, expire 1d (for products, categories, collections).
- **`navigation`**: Stale 1h, revalidate 2h, expire 7d (for category trees, menus, global layouts).
- **`redirects`**: Stale 1d, revalidate 1d, expire 30d (for 301/410 routing rules).

### 2. Cache Tag Taxonomy (`lib/cache/tags.ts`)

Cache keys are strictly typed and centralized to prevent syntax mismatches between query functions and webhook handlers:

- `catalog`: Global tag covering the entire store catalog (for bulk full-store syncs).
- `products`: All product listings.
- `product:${handle}`: Specific product detail by canonical handle.
- `products:category:${slug}`: Products filtered by category.
- `products:collection:${handle}`: Products belonging to a collection.
- `categories`: All categories list.
- `category:${slug}`: Specific category by slug.
- `navigation`: Category navigation tree.
- `collections`: Curated collections list.
- `collection:${handle}`: Specific collection by handle.
- `redirects`: URL redirect rules.
- `search`: Search queries cache.

### 3. Revalidation Mechanisms: Server Actions vs Route Handlers

- **Route Handlers (`POST /api/revalidate`)**:
  - Uses `revalidateTag(tag, 'max')` (stale-while-revalidate).
  - Background workers and webhooks invalidate tags asynchronously without penalizing incoming shopper requests with blocking cache misses.
- **Server Actions (User Mutations, e.g. Cart)**:
  - Uses `updateTag('cart:<id>')` (immediate expiration / read-your-own-writes).
  - Guaranteed fresh data on the immediate subsequent render for the active shopper.

### 4. Security & Rate Limiting (`POST /api/revalidate`)

1. **Timing-safe authentication**: Compares authorization tokens against `REVALIDATE_SECRET` using `crypto.timingSafeEqual` to prevent side-channel timing attacks.
2. **Token Bucket Rate Limiting (`lib/security/rate-limiter.ts`)**: In-memory token bucket permitting up to 30 requests/minute with a burst capacity of 10. Rejects abuse with `429 Too Many Requests` and `Retry-After` header.
3. **Payload validation**: Uses Zod to parse `{ tags: string[], profile?: string }` or `{ tag: string }`.

### 5. Health Probes (`GET /api/health`)

Provides an operational health check returning process uptime, build version, adapter type, and upstream Medusa reachability status with round-trip latency.

## Consequences

- **Positive**: Blazing fast TTFB via Edge/CDN stale-while-revalidate; surgical, tag-based cache purging down to single products; zero hardcoded tag strings across features; immune to timing and brute-force revalidation attacks.
- **Negative**: Memory overhead for the token bucket rate limiter in long-running Node processes (mitigated via automatic 5-minute idle key eviction).
