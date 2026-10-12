# ADR 0005: Catalog Routing, SEO Architecture, and Attribute Rendering

## Status

Accepted

## Context

For an e-commerce brand like Bramhkanti (`bramhkanti.com`), organic search ranking is priority #1. The storefront must avoid common e-commerce SEO traps:

1. Duplicate content caused by nesting products under multiple categories (e.g. `/achar/mango/product-a` vs `/products/product-a`).
2. Dropped organic rankings caused by returning 404 for temporarily out-of-stock products.
3. Search engines unable to index filtered states due to client-only JavaScript filter widgets.
4. Route collision between dynamic root category segments (`/[category]`) and system routes (`/api`, `/products`, `/collections`, `/cart`).
5. Brittle UI coupling when new food categories have differing nutritional or production attributes.

## Decisions

### 1. Flat Canonical Product URLs

- All product detail pages live at `/products/[handle]`.
- Single canonical URL declared via `<link rel="canonical" href="https://bramhkanti.com/products/[handle]">`.
- Breadcrumbs reflect the primary category hierarchy (`Home > Achar > Mango Pickles > [Product Name]`) without altering the canonical path.

### 2. Category Hub & Subcategory Routing

- Root category hubs live at `/[category]` (e.g., `/achar`, `/sweets`, `/makhana`).
- Subcategories live at `/[category]/[sub]` (e.g., `/achar/mango-pickles`).
- Each category and subcategory page embeds 300+ words of rich copy and Schema.org `CollectionPage` + `FAQPage` microdata for long-tail search ranking.

### 3. Reserved Slugs Guard (`src/lib/config/reserved-slugs.ts`)

Root dynamic route `/[category]/page.tsx` checks `isReservedSlug(category)`. If matched (e.g., `api`, `products`, `collections`, `cart`, `checkout`), it triggers `notFound()`, ensuring dynamic routing never intercepts top-level application routes.

### 4. Out-of-Stock Product Policy

- Temporarily out-of-stock products **MUST return HTTP 200 (OK)**.
- Display a clear "Sold Out / Next Sun-Cured Batch Arriving Soon" notice to shoppers.
- Output Schema.org `offers.availability: "https://schema.org/OutOfStock"`.
- This ensures Google preserves search rank, backlinks, and index standing while inventory restocks.

### 5. Open/Closed Attribute Renderer Registry (`features/product/components/AttributeRenderer.tsx`)

- Specialized visual adapters render category-specific highlights:
  - `achar`: spice meter, cold-pressed oil type, barni sun-curing period, rock salt.
  - `sweets`: pure cow ghee standard, sweetness rating, texture, serving temperature.
  - `makhana`: roast style, organic seasoning, size grade.
- **Generic Fallback**: If a new category is added without a custom renderer, key-value pairs are automatically formatted and rendered without code changes.
- **Regulatory Card**: Mandated Indian food safety section displaying 14-digit FSSAI Lic. No., 100% vegetarian mark, ingredients list, allergens, and shelf life.

### 6. Zero-JS Progressive Enhancement Filtering (`features/catalog/components/CatalogFilters.tsx`)

- Filtering uses standard HTML `<form method="GET">` submitting URL query parameters.
- Search engine crawlers and users without JavaScript can filter, sort, and navigate the entire catalog.

## Consequences

- **Positive**: Complete SEO protection; zero duplicate content; out-of-stock pages retain PageRank; instant extensibility for new food categories; resilient to JavaScript execution failures.
- **Negative**: Requires maintaining reserved slugs registry when new top-level routes are added.
