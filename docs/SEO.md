# Organic Search Engine Optimization (SEO) Strategy

> **Priority #1 for Bramhkanti**: Engineering organic search authority, crawl budget efficiency, and technical search dominance for Indian heritage food terms.

---

## 1. URL Taxonomy & Canonical Permalinks

To prevent duplicate content penalties and avoid fragmentation of PageRank, Bramhkanti enforces a strict, hierarchical URL taxonomy:

| Page Type           | Canonical URL Structure | Sample Real Route                 | SEO Purpose                        |
| ------------------- | ----------------------- | --------------------------------- | ---------------------------------- |
| **Root Storefront** | `/`                     | `https://bramhkanti.com/`         | Primary brand authority hub        |
| **Category Hub**    | `/[category]`           | `/achar`, `/sweets`, `/makhana`   | High-volume head-term ranking hub  |
| **Subcategory**     | `/[category]/[sub]`     | `/achar/mango-pickles`            | Long-tail intent landing page      |
| **Product Detail**  | `/products/[handle]`    | `/products/heritage-aam-ka-achar` | **Flat canonical permalink**       |
| **Collection Hub**  | `/collections/[handle]` | `/collections/diwali-gifting`     | Seasonal & gifting keyword ranking |

### Critical Rule: Flat Product URLs (`/products/[handle]`)

Products are intentionally served at flat paths (`/products/[handle]`), rather than nested under category routes (e.g. `/achar/mango/heritage-aam-ka-achar`).

- **Why**: When a product belongs to multiple categories (e.g. "Heritage Aam Ka Achar" in both _Achar_ and _Best Sellers_), nested URLs generate duplicate URLs for the same product.
- Flat URLs ensure **one canonical URL per product for life**, concentrating external backlinks and review equity into a single URL.
- Visual breadcrumbs on the PDP reflect the product's primary category hierarchy (`Home > Achar > Mango Pickles > Heritage Aam Ka Achar`) without affecting the permalink.

---

## 2. Next.js 16 Split Sitemaps (`sitemap.ts`)

Instead of a single monolithic sitemap that exceeds search engine size limits, Bramhkanti uses Next.js 16 `generateSitemaps` to generate partition-specific sitemaps:

```text
https://bramhkanti.com/sitemap.xml (Auto-generated Sitemap Index)
├── https://bramhkanti.com/sitemap/pages.xml       (Core static pages; priority 1.0)
├── https://bramhkanti.com/sitemap/categories.xml  (All primary and subcategory hubs; priority 0.9)
├── https://bramhkanti.com/sitemap/collections.xml (Curated collection hubs; priority 0.8)
└── https://bramhkanti.com/sitemap/products.xml    (All published products; priority 0.8)
```

### Key Technical Details:

- Generated on-demand and cached via `sitemap.ts`.
- Uses real `updatedAt` timestamps from the database for accurate `lastmod` declarations.
- Search engines receive exact `changeFrequency` hints (`daily` for products; `weekly` for categories).

---

## 3. Crawler Boundaries & Faceted Search Control (`proxy.ts`)

E-commerce stores often waste up to 80% of crawl budget on faceted filter URLs (`?minPrice=200&sort=price_asc`), generating millions of low-quality thin pages.

Bramhkanti guards against this at the edge via `src/proxy.ts`:

1. **Faceted Filter Noindex**:
   When a URL contains query parameters (`minPrice`, `maxPrice`, `sort`, `page > 1`, `tags`), `proxy.ts` automatically injects:
   ```http
   X-Robots-Tag: noindex, follow
   ```
   This ensures that crawlers can follow product links from filtered views, but will **never index** the thin faceted permutations.
2. **Trailing Slash Normalization**:
   Any request ending with a trailing slash (`/achar/`) is immediately issued a **301 Moved Permanently** redirect to `/achar`.
3. **Apex Canonical Host**:
   Any request to `www.bramhkanti.com` is issued a **301 Moved Permanently** redirect to `bramhkanti.com`.
4. **Disallowed Private Endpoints (`robots.ts`)**:
   `/cart`, `/checkout`, `/api/`, and `/search` are strictly disallowed in `robots.txt` to protect server resources.

---

## 4. Product Lifecycle: Out of Stock vs Discontinued

| Lifecycle State        | HTTP Status | SEO Directive   | Strategy                                                                                                                          |
| ---------------------- | :---------: | --------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **In Stock**           |  `200 OK`   | `index, follow` | Schema `InStock`. Regular crawl.                                                                                                  |
| **Out of Stock**       |  `200 OK`   | `index, follow` | **Never 404**. Preserves backlink equity. Schema updates to `OutOfStock`. User is offered restock alerts.                         |
| **Discontinued**       | `410 Gone`  | `noindex`       | Tells search engines the item is permanently gone. Purges the URL from the index immediately without search console 404 warnings. |
| **Renamed / Migrated** | `301 Moved` | Target indexed  | Handled via `RedirectReader` in `proxy.ts`, passing 100% PageRank to the new handle.                                              |

---

## 5. Schema.org JSON-LD Microdata Implementation

Bramhkanti injects strict, validated Schema.org microdata into the document `<head>`:

1. **`Product` Schema (`src/lib/seo/json-ld.ts`)**:
   - Includes `name`, `description`, `image`, `sku`, `brand: { "@type": "Brand", name: "Bramhkanti" }`.
   - Dynamic `offers` object specifying price in integer minor units, currency (`INR`), availability (`InStock` or `OutOfStock`), and merchant return policy.
2. **`BreadcrumbList` Schema**:
   - Expresses the hierarchical path from root to current category or product, earning Google breadcrumb rich snippets.
3. **`CollectionPage` Schema**:
   - Embeds an `ItemList` of products on category and collection hubs, enabling rich carousel results on mobile SERPs.
4. **`FAQPage` Schema**:
   - Extracted directly from category metadata (`faqs` array) and injected on category hubs (`/achar`, `/sweets`, `/makhana`), producing interactive expandable FAQ rich snippets in search results.

---

## 6. Dynamic Open Graph Card Generation (`next/og`)

Social shares directly impact referral traffic and domain authority. Bramhkanti uses `next/og` `ImageResponse` with SVG rendering:

- **Brand Card** (`/opengraph-image.tsx`): 1200x630 card with royal crimson background, Varanasi heritage seal, and tagline.
- **Product Cards** (`/products/[handle]/opengraph-image.tsx`): Dynamic card rendering the product title, primary pack size, formatted price in ₹, statutory vegetarian logo, and FSSAI badge.
- **Category Cards** (`/[category]/opengraph-image.tsx`): Dynamic card rendering the category title, rich description, and heritage motifs.

---

## 7. How to Add a New Category (Zero Code Changes)

Adding a brand new category (e.g. `spices` / "Varanasi Whole Spices & Masala") requires **no frontend deployments**:

1. **Create Category in Medusa Admin**:
   - Set `handle`: `spices`
   - Set `name`: `Artisanal Spices & Blends`
   - Set `description`: `Stone-ground whole spices and traditional masalas from Varanasi.`
   - Set `metadata`:
     - `banner_heading`: `Sacred Flavours of Kashi: Artisanal Spices`
     - `seo_title`: `Artisanal Spices & Masalas Online | Bramhkanti`
     - `seo_description`: `Buy authentic stone-ground spices from Varanasi online. 100% pure and preservative-free.`
2. **Add Products under the Category**:
   - Assign `categories: ['spices']` to products.
   - Set category-specific attributes in product `metadata` (e.g. `origin`, `grind_method`, `blend_count`).
3. **Verification**:
   - Trigger cache invalidation via `POST /api/revalidate` with `{ tag: "categories" }`.
   - Instantly, the header navigation features `Spices`.
   - `/spices` renders the complete hub page, product cards, filter form, and FAQ accordion.
   - `/sitemap/categories.xml` automatically includes `https://bramhkanti.com/spices`.
   - `/spices/opengraph-image` automatically generates a dynamic social preview card.
