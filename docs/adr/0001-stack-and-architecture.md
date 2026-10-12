# ADR 0001: Technology Stack and Architecture Boundaries

## Status

Accepted

## Context

We are building a production-grade e-commerce storefront for Bramhkanti, a multi-category Indian food brand (pickles, traditional sweets, roasted makhana). Priorities in strict order are:

1. Organic search ranking (SEO)
2. Scalability and extensibility
3. Maintainability and readability
4. Production readiness

The backend is an independently deployed Medusa.js v2 service. We need a frontend architecture that ensures strict decoupling from the backend, zero leaking of server state to the client, exceptional Core Web Vitals, and strict architectural integrity.

## Decisions

### 1. Framework and Runtime

- **Next.js 16 (App Router)**: Utilizing Next.js 16 Cache Components (`cacheComponents: true` and `partialPrefetching: true`) with Node.js runtime.
- **Standalone Output**: Pinned `output: 'standalone'` for reproducible, slim multi-stage Docker builds.
- **React 19 & React Compiler**: React 19.3.0 with `reactCompiler: true`. Manual memoization (`useMemo`, `useCallback`) is avoided unless performance profiling demonstrates necessity.
- **TypeScript & Node Versions**: Node 24 LTS pinned via `.nvmrc` and `package.json` engines. TypeScript pinned to 6.0.3 to maintain compatibility with `typescript-eslint` peer dependencies.

### 2. Architectural Boundaries

We enforce strict architectural layering:

- **`components/ui`**: Pure design system primitives. Must never import from `features` or `app`.
- **`features/*`**: Domain feature modules (`catalog`, `product`, `collection`, `cart`, `checkout`, `search`, `content`). Must never import each other directly; cross-feature coordination is done via contracts in `lib/api/contracts` or utilities in `lib/`.
- **`lib/api/contracts`**: Small, role-based interfaces (ISP) and domain types with Zod validation. Zero imports from `@medusajs/js-sdk`.
- **`lib/api/adapters/*`**: Concrete adapters (`mock` and `medusa`). Only `lib/api/adapters/medusa` may import `@medusajs/js-sdk`.
- **`lib/api/container.ts`**: Single composition root. Only this module may import concrete adapters.
- **`lib/env.ts`**: Single location reading `process.env`. Guarded by `import 'server-only'`. Client-safe variables are exposed via `lib/env.public.ts`.

These boundaries are strictly enforced by automated ESLint rules (`eslint-plugin-boundaries` and `no-restricted-imports`).

### 3. State Architecture

- Server state remains exclusively on the server. Catalog items, products, categories, and collections are never stored in client-side state managers.
- Zustand is strictly restricted to ephemeral client UI state (drawer open/closed states, search overlays, toast messages, optimistic cart line state).
- Stores use the per-request factory pattern with React Context to prevent state leaking between concurrent server-side render requests.
- Filter, sort, and pagination parameters live exclusively in URL `searchParams` for crawlability and zero-JavaScript fallbacks.

## Consequences

- **Positive**: Complete backend interchangeability; mock adapter enables fully autonomous local development and CI testing; zero vendor lock-in to Medusa SDK; strict compile-time and lint-time error prevention.
- **Negative**: Requires strict discipline and mapper maintenance between backend DTOs and domain models.
