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
  /** Short label such as 'Bestseller' (metadata `badge`). */
  badge?: string | undefined;
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
  /** Banner (admin: collection metadata `banner_url`). */
  image?: CollectionImage | undefined;
  /** Optional narrow banner for phones (metadata `banner_mobile_url`). */
  mobileImage?: CollectionImage | undefined;
  subtitle?: string | undefined;
  badge?: string | undefined;
  highlights?: string[] | undefined;
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
  /** Handle of the primary category when the backend provides it. */
  primaryCategoryHandle?: string | undefined;
  /** Short line under the title, e.g. the Hindi name. */
  subtitle?: string | undefined;
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
  /** Average of approved customer reviews; undefined until someone reviews it. */
  rating?: { average: number; count: number } | undefined;
  createdAt: string;
  updatedAt: string;
}

/** Approved reviews only. `distribution` counts reviews per star, 1 to 5. */
export interface RatingSummary {
  average: number;
  count: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}

export interface ProductReview {
  id: string;
  /** Public name, e.g. 'Priya S.'. */
  authorName: string;
  rating: number;
  title?: string | undefined;
  body: string;
  /** The reviewer has an order containing this product. */
  verifiedPurchase: boolean;
  createdAt: string;
  /** Set on cross-product lists (home page). */
  product?:
    { handle: string; title: string; thumbnailUrl?: string | undefined } | undefined;
}

export interface ProductReviewPage {
  reviews: ProductReview[];
  total: number;
  summary: RatingSummary;
}

export interface ReviewInput {
  productId: string;
  rating: number;
  title?: string | undefined;
  body: string;
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
  /** Item total (GST-inclusive), before shipping and discounts. */
  subtotal: Money;
  /** Shipping once a delivery method is chosen; undefined before that. */
  shippingEstimate?: Money | undefined;
  discountTotal?: Money | undefined;
  /** GST contained in the prices (prices are tax-inclusive). */
  taxTotal?: Money | undefined;
  total: Money;
  currencyCode: string;
  email?: string | undefined;
  customerId?: string | undefined;
  shippingAddress?: Address | undefined;
  /** Shipping option id of the selected delivery method. */
  shippingOptionId?: string | undefined;
  promoCodes?: string[] | undefined;
}

/** Postal address. Only India is supported, so countryCode is 'in'. */
export interface Address {
  id?: string | undefined;
  firstName: string;
  lastName: string;
  phone: string;
  address1: string;
  address2?: string | undefined;
  city: string;
  /** State, e.g. 'Uttar Pradesh'. */
  province: string;
  postalCode: string;
  countryCode: string;
  /** Short name such as 'Home' or 'Work'. */
  label?: string | undefined;
  isDefault?: boolean | undefined;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email?: string | undefined;
  /** E.164, e.g. '+919876543210'. */
  phone?: string | undefined;
  addresses: Address[];
}

export interface ShippingOption {
  id: string;
  name: string;
  amount: Money;
}

export type PaymentMethodKind = 'razorpay' | 'cod' | 'other';

export interface PaymentMethod {
  providerId: string;
  kind: PaymentMethodKind;
  label: string;
}

/** What the browser needs to open the payment UI. Never contains secrets. */
export interface PaymentSession {
  providerId: string;
  /** Razorpay: razorpay_order_id, key_id, amount (paise), currency. */
  data: Record<string, unknown>;
}

export interface OrderLine {
  id: string;
  title: string;
  variantTitle: string;
  handle: string;
  thumbnailUrl?: string | undefined;
  quantity: number;
  unitPrice: Money;
  total: Money;
}

export type OrderPaymentStatus =
  | 'not_paid'
  | 'awaiting'
  | 'authorized'
  | 'captured'
  | 'partially_refunded'
  | 'refunded'
  | 'canceled'
  | 'requires_action'
  | 'other';

export type OrderFulfillmentStatus =
  'not_fulfilled' | 'fulfilled' | 'shipped' | 'delivered' | 'canceled' | 'other';

export interface Order {
  id: string;
  /** Human-facing order number, e.g. 1042. */
  displayId: number;
  createdAt: string;
  status: string;
  paymentStatus: OrderPaymentStatus;
  fulfillmentStatus: OrderFulfillmentStatus;
  email?: string | undefined;
  items: OrderLine[];
  itemCount: number;
  shippingAddress?: Address | undefined;
  shippingMethodName?: string | undefined;
  paymentProviderId?: string | undefined;
  subtotal: Money;
  shippingTotal: Money;
  discountTotal: Money;
  taxTotal: Money;
  total: Money;
  currencyCode: string;
}

export type CompleteCartResult =
  { type: 'order'; order: Order } | { type: 'cart'; error: string };

export interface OtpVerifyResult {
  token: string;
  /** True when this phone has no customer yet; call registerCustomer next. */
  needsRegistration: boolean;
}

export interface ProductFilterParams {
  categoryHandle?: string | undefined;
  collectionHandle?: string | undefined;
  tags?: string[] | undefined;
  /** Minor units (paise), like all domain money. */
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
