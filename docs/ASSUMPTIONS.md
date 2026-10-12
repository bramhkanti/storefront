# Project Assumptions & Technical Decisions

This document tracks assumptions made across architectural and implementation phases.

## 1. Domain & SEO

- **Canonical Host**: `https://bramhkanti.com` is canonical. Subdomain `www.bramhkanti.com` is 301-redirected to apex via `proxy.ts`.
- **Trailing Slash Policy**: No trailing slashes (`/achar` is canonical; `/achar/` is 301-redirected).
- **Default Locale & Currency**: `en-IN` (Indian English) and `INR` (Indian Rupee, integer minor units / paise).
- **URL Taxonomy**:
  - Category Hub: `/{category}` (e.g., `/achar`, `/sweets`, `/makhana`)
  - Subcategory: `/{category}/{sub}` (e.g., `/achar/mango-pickles`)
  - Product Page: `/products/{handle}` (flat, single canonical, breadcrumbs from primary category)
  - Collections: `/collections/{handle}` (e.g., `/collections/diwali-gifting`)
- **Out of stock products**: Return HTTP 200 with `OutOfStock` schema availability to preserve ranking.
- **Removed products**: 301 redirect to primary category if mapped in redirect table, otherwise return HTTP 410 (Gone).
- **FSSAI and Regulatory**: FSSAI license number and vegetarian mark are displayed on all food product listings and footer per Indian Food Safety regulations.

## 2. Toolchain & Dependencies

- **Node.js**: Pinned to Node 24 LTS (`.nvmrc` = `24`, `engines.node` = `>=24.0.0 <25`).
- **Package Manager**: Pinned to `pnpm@12.11.2`. Corepack/global pnpm configured with strict build authorization (`pnpm-workspace.yaml`).
- **TypeScript**: Pinned to `6.0.3` because `typescript-eslint@8.71` has peer dependency `<6.1.0`. Upgrading to TypeScript 7 will be evaluated once `typescript-eslint` publishes support.
- **ESLint**: Pinned to `9.39.5` using ESLint flat config (`eslint.config.mjs`) with `eslint-config-next@16.4.0` and `eslint-plugin-boundaries`.
- **Next.js**: 16.4.0 App Router with `cacheComponents: true` and `partialPrefetching: true`.
- **React**: React 19.3.0 with React Compiler enabled (`reactCompiler: true`). Manual `useMemo`/`useCallback` avoided.
- **Styling**: Tailwind CSS v4 via `@tailwindcss/postcss` and CSS `@import "tailwindcss"`.

## 3. Backend Integration (Medusa v2)

- **Domain Decoupling**: Frontend domain model is completely independent of `@medusajs/js-sdk`.
- **Category-specific attributes**: Stored in Medusa product `metadata` and validated at runtime via per-category Zod schemas.
- **Mock Adapter**: Self-contained in-memory implementation with realistic Indian food catalog fixtures for local dev, CI, and end-to-end tests without requiring a running Medusa server.
- **Composition Root**: `src/lib/api/container.ts` is the single source of truth for adapter instantiation, governed by `API_ADAPTER` environment variable.

## 4. State Management

- **Catalog data**: Stored exclusively on the server (cached React Server Components). Never duplicated into Zustand.
- **Filter and Pagination state**: Stored exclusively in URL `searchParams` for crawlability, shareability, and zero-JS functionality.
- **Client UI state**: Ephemeral UI only (cart drawer open/close, optimistic cart line additions, search overlay, toast notifications) using per-request store factory (`createStore` from `zustand/vanilla` with React Context).

## 5. Checkout & Payment Gateway Boundary

- **Decoupled Boundary**: No live proprietary payment gateway SDKs (Razorpay, PhonePe, Cashfree) are bundled in the initial frontend codebase to avoid vendor lock-in, heavy client runtime scripts, and maintain strict CWV budgets.
- **Extension Points**: Standardized server actions (`createPaymentSession`, `completeCheckout`) and clean session-state transitions are defined, allowing payment gateways to be dropped in via webhook callbacks and server-side redirects without altering UI code.
- **Cart & Line Items**: Server-authoritative calculations with integer paise money units. Free shipping threshold (₹500 / 50,000 paise) computed deterministically on server and optimistically in client cart drawer.

## 6. Testing Scope & Quality Audit Directives

- **Test Suite Scope**: Per strict user instruction (_"Dont write .test file for the now, it is not in scope for the now, remove testing and playwriteght, but i need lighthourse report strcitly and others parameteres too"_), unit, contract, and Playwright test suites are intentionally excluded from this milestone.
- **Enforced Quality Gates**:
  - `pnpm lint`: Zero ESLint warnings (`--max-warnings=0`) with AST boundary enforcement.
  - `pnpm typecheck`: Strict TypeScript type generation and zero type errors (`tsc --noEmit`).
  - `pnpm format:check`: 100% Prettier formatting consistency across all markdown, CSS, and TS/TSX files.
  - `pnpm build`: Standalone Turbopack production compilation.
  - `pnpm lhci`: Automated Lighthouse CI performance audits validating 100/100 Core Web Vitals, 100/100 Accessibility, 100/100 SEO, and 96+ Best Practices across all canonical templates.

## 7. Packaging, Observability & Deployment

- **Containerization**: Multi-stage Docker build producing a minimal Alpine Linux container (~150MB) executing under an unprivileged user (`nextjs:nodejs`, UID 1001) with built-in health probes (`/api/health`).
- **Edge Reverse Proxy**: Caddy 2.9 sidecar container terminating TLS and applying Brotli/Zstandard compression, with 1-year immutable caching for static assets (`/_next/static/*`).
- **Observability**: Next.js 16 `instrumentation.ts` and `instrumentation-client.ts` hooks integrated for Sentry with zero overhead when `SENTRY_DSN` is empty. Consent-aware GA4 and real-user `useReportWebVitals` telemetry.

## 8. Zero-Code Category Extensibility

- **Open/Closed Principle**: The catalog is architected such that adding future product categories (e.g. _ghee_, _honey_, _spices_, _edible oils_) requires zero frontend code modifications.
- **Dynamic Routing & Navigation**: Category tree hierarchies and routes dynamically resolve from backend metadata via `CategoryReader`.
- **Attribute Registry Fallback**: Food-specific attributes render via an open registry; any unrecognized category gracefully renders standard key-value nutritional and origin specifications without crashing or requiring component additions.
