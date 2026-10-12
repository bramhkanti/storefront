# ADR 0002: Adapter Pattern, Domain Contracts, and Composition Root

## Status

Accepted

## Context

The storefront is deployed independently of the backend (Medusa.js v2). We must fulfill:

1. Strict domain decoupling: UI components and feature queries must never depend on the Medusa JS SDK or raw backend DTO shapes.
2. Complete backend interchangeability: local development, continuous integration, and automated end-to-end tests must be capable of running entirely on a rich, in-memory Mock adapter without needing a live Medusa server or internet connection.
3. SOLID principles: Single Responsibility (mappers map, readers fetch), Open/Closed (category specifications are extensible), Liskov Substitution (Mock and Medusa adapters implement identical interfaces), Interface Segregation (role-based readers), and Dependency Inversion (features consume contracts, adapters are wired exclusively at a single composition root).

## Decisions

### 1. Pure Domain Model (`lib/api/contracts/domain.ts`)

We created dedicated domain models representing the core entities of Bramhkanti:

- `Product`: Canonical slug, images, primary and secondary category assignments, tags, food attributes, category-specific attributes, SEO metadata, and variants.
- `ProductVariant`: Integer paise money units (`{ amount: number, currencyCode: 'INR' }`), SKU, pack size, stock status, weight.
- `FoodAttributes`: Regulatory Indian food information including FSSAI license number (`14 digits`), vegetarian mark, ingredients list, allergens, shelf life, and storage.
- `Category`: Hierarchical taxonomy with breadcrumb path, 300+ word rich intro copy for SEO ranking, FAQs, and SEO metadata.
- `Collection`: Curated cross-category groups (e.g. Diwali Gifting, Best Sellers).
- `Cart`: Cart items with integer paise calculations, subtotal, and shipping rules.

### 2. Role-Based Reader Interfaces (ISP) (`lib/api/contracts/readers.ts`)

Instead of a single monolithic backend client, we expose focused interfaces:

- `ProductReader`
- `CategoryReader`
- `CollectionReader`
- `RedirectReader`
- `SearchService`
- `CartService`

### 3. Concrete Adapters

- `MockAdapter` (`lib/api/adapters/mock/`): In-memory adapter loaded with 24 realistic Indian food products (Pickles, Sweets, Makhana), 3 primary categories with subcategories, 3 collections, and redirect tables.
- `MedusaAdapter` (`lib/api/adapters/medusa/`): Concrete adapter wrapping `@medusajs/js-sdk` v2. Validates upstream payloads with Zod DTO schemas and maps them to domain types.

### 4. Composition Root (`lib/api/container.ts`)

The container is the single source of truth for adapter instantiation, governed by the `API_ADAPTER` environment variable (`mock` or `medusa`). Only `lib/api/container.ts` is permitted to import concrete adapters.

### 5. Architectural Lint Enforcement

- `eslint-plugin-boundaries` and `no-restricted-imports` ensure:
  - No file outside `src/lib/api/adapters/medusa/` may import `@medusajs/js-sdk`.
  - No file outside `src/lib/api/container.ts` may import from `src/lib/api/adapters/*`.

## Consequences

- **Positive**: Seamless local and CI test execution with zero external backend dependency; 100% type safety and runtime validation at adapter boundaries; switching backends requires only env changes (`API_ADAPTER=medusa`).
- **Negative**: Requires maintaining DTO mappers when new fields are introduced on the backend.
