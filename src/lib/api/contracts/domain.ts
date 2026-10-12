/**
 * Core Domain Models for the Bramhkanti Storefront.
 *
 * Strictly typed, decoupled from any backend SDK (Medusa, Shopify, etc.).
 * The UI layer consumes ONLY these types.
 *
 * Note: Typed with `| undefined` on optional fields to comply with
 * TypeScript's `exactOptionalPropertyTypes: true`.
 */

export interface Money {
  /** Integer minor units (e.g., 35000 paise = ₹350.00). No floats. */
  amount: number;
  /** ISO 4217 currency code, e.g. 'INR'. */
  currencyCode: string;
}

export interface SeoMetadata {
  title?: string | undefined;
  description?: string | undefined;
  canonicalOverride?: string | undefined;
  noindex?: boolean | undefined;
  ogImage?: string | undefined;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface CategoryBreadcrumb {
  id: string;
  handle: string;
  name: string;
}

export interface CategoryImage {
  url: string;
  altText?: string | undefined;
  width?: number | undefined;
  height?: number | undefined;
}

export interface Category {
  id: string;
  /** URL slug (e.g., 'achar', 'sweets', 'makhana'). Permanent hub. */
  handle: string;
  name: string;
  parentId: string | null;
  /** Breadcrumb trail from root to current category. */
  path: CategoryBreadcrumb[];
  description: string;
  /** Rich intro copy (300+ words) rendered above product grid for SEO ranking. */
  introContent?: string | undefined;
  faqs: FaqItem[];
  image?: CategoryImage | undefined;
  seo: SeoMetadata;
  children?: Category[] | undefined;
}

export interface CollectionImage {
  url: string;
  altText?: string | undefined;
  width?: number | undefined;
  height?: number | undefined;
}

export interface Collection {
  id: string;
  /** URL slug for curated collection, e.g. 'diwali-gifting', 'best-sellers'. */
  handle: string;
  title: string;
  description: string;
  introContent?: string | undefined;
  image?: CollectionImage | undefined;
  productCount?: number | undefined;
  seo: SeoMetadata;
}

export interface FoodAttributes {
  /** Full ingredients list in descending order of weight. */
  ingredients: string[];
  /** Allergen disclosure (e.g. ['Mustard', 'Tree Nuts']). */
  allergens: string[];
  /** Shelf life descriptor (e.g. '12 Months'). */
  shelfLife: string;
  /** Storage instructions (e.g. 'Store in a cool dry place, use dry spoon'). */
  storage: string;
  /** Compliance with Indian Food Safety veg mark regulations. */
  isVegetarian: boolean;
  /** Net quantity / weight descriptor. */
  netWeight: string;
  /** 14-digit FSSAI License / Registration number. */
  fssaiLicenseNumber: string;
  batchNumber?: string | undefined;
  countryOfOrigin: string;
}

export interface AcharAttributes {
  spiceLevel: 'Mild' | 'Medium' | 'Hot' | 'Extra Hot';
  oilType: 'Mustard Oil' | 'Sesame Oil' | 'Groundnut Oil' | 'Sun Dried / Oil Free';
  mangoVariety?: string | undefined;
  preservativeType?: ('Natural (Salt & Oil)' | 'Organic Vinegar') | undefined;
}

export interface SweetsAttributes {
  milkContent: 'Pure Buffalo Milk' | 'Cow Milk' | 'Mawa / Khoya' | 'Vegan / Dairy Free';
  gheeType: 'Desi Cow Ghee' | 'A2 Gir Cow Ghee' | 'None';
  shelfLifeDays: number;
  refrigerationRequired: boolean;
}

export interface MakhanaAttributes {
  roastType: 'Slow Roasted in Olive Oil' | 'Air Roasted' | 'Pure Desi Ghee Roasted';
  flavor:
    | 'Himalayan Pink Salt'
    | 'Peri Peri'
    | 'Mint Pudina'
    | 'Jaggery Gur'
    | 'Cream & Onion'
    | 'Plain Raw';
  sizeGrade: 'Jumbo 6+' | 'Premium 5+';
}

/** Open registry type for category-specific specifications. */
export type CategorySpecificAttributes = Record<string, unknown>;

export interface ProductVariant {
  id: string;
  title: string;
  /** Standard pack size (e.g., '250g', '500g', '1kg'). */
  packSize: string;
  sku: string;
  price: Money;
  compareAtPrice?: Money | undefined;
  inStock: boolean;
  stockQuantity?: number | undefined;
  weightGrams: number;
}

export interface ProductImage {
  id: string;
  url: string;
  altText: string;
  width?: number | undefined;
  height?: number | undefined;
}

export interface Product {
  id: string;
  /** Permanent canonical slug (e.g., 'banarasi-lal-mirch-achar'). */
  handle: string;
  title: string;
  description: string;
  images: ProductImage[];
  primaryCategoryId: string;
  categoryIds: string[];
  collectionIds: string[];
  tags: string[];
  variants: ProductVariant[];
  foodAttributes: FoodAttributes;
  /** Category-specific attributes validated via registry. */
  attributes: CategorySpecificAttributes;
  seo: SeoMetadata;
  status: 'published' | 'draft' | 'archived';
  featured?: boolean | undefined;
  createdAt: string;
  updatedAt: string;
}

export interface Redirect {
  fromPath: string;
  toPath: string;
  statusCode: 301 | 302 | 410;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  title: string;
  variantTitle: string;
  handle: string;
  thumbnailUrl?: string | undefined;
  unitPrice: Money;
  totalPrice: Money;
  quantity: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  itemCount: number;
  subtotal: Money;
  shippingEstimate?: Money | undefined;
  total: Money;
  currencyCode: string;
}

export interface ProductFilterParams {
  categoryHandle?: string | undefined;
  collectionHandle?: string | undefined;
  tags?: string[] | undefined;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  inStockOnly?: boolean | undefined;
  sort?: ('price_asc' | 'price_desc' | 'newest' | 'featured') | undefined;
  page?: number | undefined;
  limit?: number | undefined;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
