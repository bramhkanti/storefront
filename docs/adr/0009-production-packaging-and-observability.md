# 0009: Production Container Packaging, Edge Reverse Proxy Caching, and Observability

- **Status**: Accepted
- **Date**: 2026-10-12
- **Deciders**: Senior Staff Frontend Engineer

## Context

Deploying the Bramhkanti (`bramhkanti.com`) storefront into production demands an enterprise-grade infrastructure model that satisfies our four architectural priorities:

1. **Organic search ranking (SEO)**: Fast Time to First Byte (TTFB), instant static asset delivery, and multi-layer edge caching.
2. **Scalability & extensibility**: Decoupled, stateless container architecture ready for horizontal autoscaling.
3. **Maintainability & readability**: Clear configuration boundaries, infrastructure as code, and standard conventions.
4. **Production readiness**: Non-root execution, automated health probes, graceful shutdown, and zero-overhead telemetry.

## Decisions

### 1. Multi-Stage Docker Packaging (`output: 'standalone'`)

We implemented a 4-stage `Dockerfile` based on `node:24-alpine`:

- **`base`**: Alpine Linux with libc6-compat and pnpm 12.11.2 pinned via Corepack.
- **`deps`**: Installs strictly locked dependencies via `pnpm install --frozen-lockfile`.
- **`builder`**: Compiles the Next.js 16 standalone distribution with Turbopack and React Compiler.
- **`runner`**: Production runtime:
  - Runs under unprivileged non-root user `nextjs:nodejs` (UID 1001).
  - Copies `.next/standalone`, `.next/static`, and `public`.
  - Exposes port 3000.
  - Employs `HEALTHCHECK` querying `GET /api/health` every 30s.
  - Dispatches `STOPSIGNAL SIGTERM` to allow in-flight HTTP requests to complete before shutdown.
  - Minimal image footprint (~150MB).

### 2. Edge Reverse Proxy & Compression (`infra/caddy/Caddyfile`)

To maximize Core Web Vitals delivery:

- Integrated Caddy 2.9 Alpine reverse proxy in `docker-compose.yml`.
- Enabled Zstandard (`zstd`) and Brotli (`gzip`) compression algorithms.
- Configured immutable caching header (`Cache-Control: public, max-age=31536000, immutable`) on all `/_next/static/*` hashed bundles.
- Configured 1-day browser cache with 7-day stale-while-revalidate for public SEO assets (`favicon.ico`, `robots.txt`, `sitemap.xml`).

### 3. Cloudflare Edge Caching Strategy (`docs/deployment/cloudflare-cache-rules.md`)

Established edge cache rules aligning Cloudflare PoPs with Next.js 16 `cacheLife` tags:

- **Static Assets**: 1-year global edge cache.
- **Cart & Checkout**: Dynamic bypass based on cookie and URI match.
- **Catalog Pages**: Global edge cache honoring origin `s-maxage=900, stale-while-revalidate=85500`.

### 4. Zero-Overhead Instrumentation & Error Tracking

- Created `src/instrumentation.ts` implementing Next.js 16 `register()` hook for Sentry server and edge runtimes.
- Created `src/instrumentation-client.ts` for browser-side error boundary reporting.
- Observability code is strictly conditional: zero network calls or SDK baggage are loaded when `SENTRY_DSN` is empty.

### 5. Real User Monitoring (RUM) & Consent-Aware Analytics

- **`WebVitals.tsx`**: Uses native Next.js `useReportWebVitals` to collect LCP, INP, CLS, FCP, and TTFB from real user interactions.
- **`GoogleAnalytics.tsx`**: Loads GA4 with `strategy="afterInteractive"`, enforcing default consent denial (`ad_storage: 'denied', analytics_storage: 'denied'`) until user consent is confirmed.

## Consequences

- **Portability**: The storefront can be launched locally via `docker compose up -d` or deployed to ECS, Kubernetes, or VPS.
- **Zero-Downtime Deployments**: Standalone containers with health checks integrate seamlessly with rolling update orchestrators.
- **Preserved Performance**: Edge caching guarantees sub-300ms global TTFB and sub-0.8s LCP across all Indian regions.
