# Bramhkanti Storefront (`bramhkanti.com`)

> Production-grade, decoupled Next.js 16 (App Router) storefront for **Bramhkanti**, an authentic Indian heritage food brand specializing in traditional sun-cured pickles (_achar_), pure desi cow ghee sweets (_mithai_), and slow-roasted foxnuts (_makhana_).

---

## 1. Architectural Priorities

1. **Organic Search Ranking (SEO)**: Server-rendered HTML with Partial Prerendering (PPR), split sitemaps via `generateSitemaps`, Schema.org microdata (`Product`, `BreadcrumbList`, `CollectionPage`, `FAQPage`), dynamic OpenGraph generation (`next/og`), and edge crawler boundary controls (`proxy.ts`).
2. **Scalability & Extensibility**: Pure domain contracts decoupled from backend SDKs. Zero-code category extensibility allowing new product categories to be added with no frontend code modifications.
3. **Maintainability & Readability**: Boring, strictly typed TypeScript (`exactOptionalPropertyTypes: true`, `noUncheckedIndexedAccess: true`), clean architecture boundaries enforced by ESLint AST rules, and SOLID design principles.
4. **Production Readiness**: Multi-stage standalone Docker container (~150MB) running under an unprivileged user, automated health probes, Caddy reverse proxy with Brotli/Zstd compression, and automated Lighthouse CI performance budgets.

---

## 2. Technology Stack

- **Framework**: Next.js 16.4.0 (App Router, Turbopack, Cache Components, Partial Prerendering)
- **UI Runtime**: React 19.3.0 with React Compiler enabled (`reactCompiler: true`)
- **Language**: TypeScript 6.0.3 (`strict`, `verbatimModuleSyntax`)
- **Styling**: Tailwind CSS v4 with custom Indian heritage color tokens (`@theme`)
- **Primitives**: Radix UI accessible headless primitives (Dialog, Sheet, Accordion, VisuallyHidden)
- **Client State**: Zustand v5 (strictly ephemeral UI state: drawer, toast, search; zero catalog data in Zustand)
- **Backend Adapter**: Decoupled Adapter Pattern (`MockAdapter` & `MedusaAdapter` via `@medusajs/js-sdk` v2)
- **Containerization**: Docker multi-stage standalone build (`output: 'standalone'`) & Docker Compose
- **Edge Proxy**: Caddy 2.9 reverse proxy with automatic HTTPS and immutable static caching
- **Quality & Auditing**: ESLint 9 (flat config + `eslint-plugin-boundaries`), Prettier, Husky, Commitlint, Lighthouse CI

---

## 3. Quickstart & Local Development

### Prerequisites

- **Node.js**: `24.x LTS` (pinned via `.nvmrc`)
- **pnpm**: `12.11.2` (pinned via `packageManager` and `corepack`)

```bash
# Enable pinned pnpm via Corepack
corepack enable
corepack prepare pnpm@12.11.2 --activate

# Clone repository and enter directory
cd bramhkanti

# Install locked dependencies
pnpm install --frozen-lockfile
```

### Environment Configuration

Copy `.env.example` to create your local environment:

```bash
cp .env.example .env.local
```

Key environment variables:

| Variable                 | Description                                                 | Default                      |
| ------------------------ | ----------------------------------------------------------- | ---------------------------- |
| `API_ADAPTER`            | Active adapter (`mock` or `medusa`)                         | `mock`                       |
| `API_BASE_URL`           | Medusa.js v2 backend URL (required if `API_ADAPTER=medusa`) | `https://api.bramhkanti.com` |
| `MEDUSA_PUBLISHABLE_KEY` | Medusa store publishable key                                | `pk_test_sample`             |
| `REVALIDATE_SECRET`      | Secret token for `POST /api/revalidate` (min 32 chars)      | &mdash;                      |
| `NEXT_PUBLIC_SITE_URL`   | Canonical site host                                         | `https://bramhkanti.com`     |
| `NEXT_PUBLIC_BRAND_NAME` | Brand display name                                          | `Bramhkanti`                 |

### Connecting to the Medusa backend (real catalog, cart, checkout, login)

```bash
# .env.local
API_ADAPTER=medusa
API_BASE_URL=http://localhost:9000            # or https://<your-backend>.onrender.com
MEDUSA_PUBLISHABLE_KEY=pk_...                 # Medusa admin > Settings > Publishable API Keys
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

What runs against Medusa (`src/lib/api/adapters/medusa/`):

| Area     | How                                                                                                                                                                                                 |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Catalog  | products with region prices (INR, GST-inclusive), stock, categories, collections (`metadata.banner_url` = collection banner)                                                                        |
| Bag      | Medusa cart; id in the httpOnly `bramhkanti_cart_id` cookie; promo codes                                                                                                                            |
| Checkout | `/checkout`: address → delivery option (from Medusa shipping options) → payment (Razorpay if enabled on the region, otherwise cash on delivery via `pp_system_default`) → `/order-confirmed?order=` |
| Login    | mobile OTP (backend `phone-otp` provider, see backend `OTP_LOGIN.md`); customer token in the httpOnly `bramhkanti_customer_token` cookie; guest bag is moved to the account on login                |
| Account  | profile (name/email), saved addresses, order history: all from Medusa                                                                                                                               |
| Wishlist | browser storage per user (no backend yet)                                                                                                                                                           |

Payments are never confirmed by the browser: `placeOrderAction` asks Medusa to complete
the cart, and Medusa verifies the payment with Razorpay itself.

`API_ADAPTER=mock` still works for UI work without a backend (demo OTP `123456`, demo delivery
options, cash on delivery only).

### Running the Application

```bash
# Start local development server with Turbopack (http://localhost:3000)
pnpm dev

# Typecheck and build standalone production distribution
pnpm build

# Start production server
pnpm start
```

---

## 4. Available Scripts

| Script              | Command                                     | Purpose                                                     |
| ------------------- | ------------------------------------------- | ----------------------------------------------------------- |
| `pnpm dev`          | `next dev`                                  | Start development server with Turbopack                     |
| `pnpm build`        | `next build`                                | Compile optimized standalone production build               |
| `pnpm start`        | `next start`                                | Run production server locally                               |
| `pnpm lint`         | `eslint --max-warnings=0 .`                 | Run ESLint flat config with architectural boundaries        |
| `pnpm typecheck`    | `next typegen && tsc --noEmit`              | Generate route types and check strict TypeScript            |
| `pnpm format`       | `prettier --write .`                        | Format code style across the workspace                      |
| `pnpm format:check` | `prettier --check .`                        | Verify formatting consistency in CI                         |
| `pnpm lhci`         | `lhci autorun`                              | Run automated Lighthouse CI budgets across canonical routes |
| `pnpm check`        | `pnpm lint && pnpm typecheck && pnpm build` | Full pre-commit / CI gate verification                      |

---

## 5. Zero-Code Category Extensibility

The Bramhkanti storefront is engineered around the **Open/Closed Principle (OCP)**. Adding a new product category (e.g. `spices`, `ghee`, or `honey`) requires **zero code changes** to the frontend.

### How It Works:

1. **Dynamic Navigation**: The global header and mobile navigation query `CategoryReader.getCategoryTree()`. Any category added upstream automatically appears in the navigation hierarchy.
2. **Category Hub (`/[category]`)**: Dynamic route resolves category metadata, breadcrumbs, subcategories, and SEO schemas at runtime.
3. **Attribute Registry (`AttributeRenderer`)**: Category-specific food attributes use an open registry. Unregistered categories gracefully fall back to a structured key-value specification card.
4. **Sitemaps (`sitemap.ts`)**: `generateSitemaps` dynamically indexes all active categories in `/sitemap/categories.xml`.

### Verification:

To verify this behavior, inject a new category into the mock fixtures (`src/lib/api/adapters/mock/fixtures.ts`) or publish a new category in your live Medusa backend. Rebuilding or revalidating the cache immediately displays the new category across all routes with complete SEO tags.

---

## 6. Production Deployment

### Docker Compose & Caddy Stack

The production setup uses a multi-stage Docker container behind Caddy:

```bash
# Build and launch production stack in background
docker compose up -d --build

# Inspect logs
docker compose logs -f

# Verify container health
curl -I http://localhost:3000/api/health
```

### Edge Caching & Cloudflare

Detailed CDN and edge caching rules (including 1-year immutable caching for `/_next/static/*` and cache-bypassing for `/cart*` and `/checkout*`) are documented in [`docs/deployment/cloudflare-cache-rules.md`](file:///Users/adityaupadhyaym/Desktop/bramhkanti/docs/deployment/cloudflare-cache-rules.md).

---

## 7. Deep Documentation Links

- [**Architecture & SOLID Principles**](file:///Users/adityaupadhyaym/Desktop/bramhkanti/docs/ARCHITECTURE.md)
- [**Organic Search Ranking Strategy (SEO.md)**](file:///Users/adityaupadhyaym/Desktop/bramhkanti/docs/SEO.md)
- [**Operational Runbook & Troubleshooting**](file:///Users/adityaupadhyaym/Desktop/bramhkanti/docs/RUNBOOK.md)
- [**Project Assumptions & Scope Boundaries**](file:///Users/adityaupadhyaym/Desktop/bramhkanti/docs/ASSUMPTIONS.md)
- [**Architectural Decision Records (ADRs 0001 - 0009)**](file:///Users/adityaupadhyaym/Desktop/bramhkanti/docs/adr)
