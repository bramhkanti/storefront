import type {
  Address,
  Cart,
  CartItem,
  Category,
  CategoryBreadcrumb,
  Collection,
  Customer,
  FoodAttributes,
  Money,
  Order,
  OrderFulfillmentStatus,
  OrderLine,
  OrderPaymentStatus,
  Product,
  ProductImage,
  ProductReview,
  ProductVariant,
  RatingSummary,
  ShippingOption,
} from '../../contracts/domain';
import type {
  MedusaAddressDto,
  MedusaCartDto,
  MedusaCategoryDto,
  MedusaCollectionDto,
  MedusaCustomerDto,
  MedusaLineItemDto,
  MedusaOrderDto,
  MedusaProductDto,
  MedusaRatingSummaryDto,
  MedusaReviewDto,
  MedusaShippingOptionDto,
} from './dto';

/** Medusa returns major units (₹299.5); the domain uses integer paise. */
export function toMinor(amountMajor: number | null | undefined): number {
  return Math.round((amountMajor ?? 0) * 100);
}

/** Domain paise → Medusa major units. */
export function toMajor(amountMinor: number): number {
  return amountMinor / 100;
}

function money(amountMajor: number | null | undefined, currencyCode: string): Money {
  return { amount: toMinor(amountMajor), currencyCode };
}

function str(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() !== '' ? value : undefined;
}

function seoFrom(meta: Record<string, unknown>) {
  const seo = (meta.seo as Record<string, unknown> | undefined) ?? {};
  return {
    title: str(seo.title),
    description: str(seo.description),
    canonicalOverride: str(seo.canonical_override),
    noindex: typeof seo.noindex === 'boolean' ? seo.noindex : undefined,
    ogImage: str(seo.og_image),
  };
}

export function mapMedusaProductToDomain(dto: MedusaProductDto): Product {
  const meta = dto.metadata ?? {};

  // Food facts live in product metadata.food_attributes (set in the admin).
  const food = (meta.food_attributes as Record<string, unknown> | undefined) ?? {};
  const foodAttributes: FoodAttributes = {
    ingredients: Array.isArray(food.ingredients) ? (food.ingredients as string[]) : [],
    allergens: Array.isArray(food.allergens) ? (food.allergens as string[]) : [],
    shelfLife: str(food.shelf_life) ?? '',
    storage: str(food.storage) ?? '',
    isVegetarian: typeof food.is_vegetarian === 'boolean' ? food.is_vegetarian : true,
    netWeight: str(food.net_weight) ?? '',
    fssaiLicenseNumber: str(food.fssai_license) ?? '',
    countryOfOrigin: str(food.country_of_origin) ?? 'India',
  };

  const images: ProductImage[] = (dto.images ?? []).map((img) => ({
    id: img.id,
    url: img.url,
    altText: dto.title,
  }));
  if (dto.thumbnail && !images.some((img) => img.url === dto.thumbnail)) {
    images.unshift({ id: 'thumbnail', url: dto.thumbnail, altText: dto.title });
  }

  const variants: ProductVariant[] = (dto.variants ?? []).map((v) => {
    const vMeta = v.metadata ?? {};
    const packSize = str(vMeta.pack_size) ?? v.title ?? 'Standard';
    const currencyCode = (v.calculated_price?.currency_code ?? 'inr').toUpperCase();
    const amount = toMinor(v.calculated_price?.calculated_amount);
    const original = toMinor(v.calculated_price?.original_amount);
    // Inventory is only enforced when the variant manages it.
    const inStock =
      v.manage_inventory === false ||
      Boolean(v.allow_backorder) ||
      (v.inventory_quantity ?? 0) > 0;

    return {
      id: v.id,
      title: v.title ?? packSize,
      packSize,
      sku: v.sku ?? '',
      price: { amount, currencyCode },
      compareAtPrice: original > amount ? { amount: original, currencyCode } : undefined,
      // A variant without a price in the region can't be bought.
      inStock: inStock && v.calculated_price?.calculated_amount != null,
      stockQuantity:
        v.manage_inventory === false ? undefined : (v.inventory_quantity ?? 0),
      weightGrams: v.weight ?? 0,
    };
  });

  // Smallest pack first.
  variants.sort((a, b) => a.price.amount - b.price.amount);

  const categories = dto.categories ?? [];

  return {
    id: dto.id,
    handle: dto.handle,
    title: dto.title,
    subtitle: dto.subtitle ?? undefined,
    description: dto.description ?? '',
    images,
    primaryCategoryId: categories[0]?.id ?? '',
    primaryCategoryHandle: categories[0]?.handle,
    categoryIds: categories.map((c) => c.id),
    collectionIds: dto.collection_id ? [dto.collection_id] : [],
    tags: (dto.tags ?? []).map((t) => t.value),
    variants,
    foodAttributes,
    attributes: (meta.category_attributes as Record<string, unknown> | undefined) ?? {},
    seo: seoFrom(meta),
    status: (dto.status as Product['status'] | null | undefined) ?? 'published',
    featured: meta.featured === true || meta.featured === 'true',
    createdAt: dto.created_at ?? '',
    updatedAt: dto.updated_at ?? '',
  };
}

export function mapMedusaCategoryToDomain(
  dto: MedusaCategoryDto,
  parentPath: CategoryBreadcrumb[] = [],
): Category {
  const path = [...parentPath, { id: dto.id, handle: dto.handle, name: dto.name }];
  const meta = dto.metadata ?? {};
  const faqsRaw = Array.isArray(meta.faqs)
    ? (meta.faqs as Array<{ question?: unknown; answer?: unknown }>)
    : [];

  return {
    id: dto.id,
    handle: dto.handle,
    name: dto.name,
    parentId: dto.parent_category_id ?? null,
    path,
    description: dto.description ?? '',
    introContent: str(meta.intro_content),
    faqs: faqsRaw
      .filter((f) => typeof f.question === 'string' && typeof f.answer === 'string')
      .map((f) => ({ question: f.question as string, answer: f.answer as string })),
    image: str(meta.image_url)
      ? { url: meta.image_url as string, altText: dto.name }
      : undefined,
    badge: str(meta.badge),
    seo: seoFrom(meta),
    children: (dto.category_children as MedusaCategoryDto[] | null | undefined)?.map(
      (child) => mapMedusaCategoryToDomain(child, path),
    ),
  };
}

export function mapMedusaCollectionToDomain(
  dto: MedusaCollectionDto,
  productCount?: number,
): Collection {
  const meta = dto.metadata ?? {};
  // `banner_url` is the admin-facing name; `image_url` kept for older data.
  const imageUrl = str(meta.banner_url) ?? str(meta.image_url);
  const mobileUrl = str(meta.banner_mobile_url);
  const alt = str(meta.banner_alt) ?? dto.title;
  return {
    id: dto.id,
    handle: dto.handle,
    title: dto.title,
    description: str(meta.description) ?? '',
    introContent: str(meta.intro_content),
    image: imageUrl ? { url: imageUrl, altText: alt } : undefined,
    mobileImage: mobileUrl ? { url: mobileUrl, altText: alt } : undefined,
    subtitle: str(meta.subtitle),
    badge: str(meta.badge),
    highlights: Array.isArray(meta.highlights)
      ? meta.highlights.filter((h): h is string => typeof h === 'string')
      : undefined,
    productCount,
    seo: seoFrom(meta),
  };
}

export function mapMedusaAddressToDomain(dto: MedusaAddressDto): Address {
  return {
    id: dto.id ?? undefined,
    firstName: dto.first_name ?? '',
    lastName: dto.last_name ?? '',
    phone: dto.phone ?? '',
    address1: dto.address_1 ?? '',
    address2: dto.address_2 ?? undefined,
    city: dto.city ?? '',
    province: dto.province ?? '',
    postalCode: dto.postal_code ?? '',
    countryCode: dto.country_code ?? 'in',
    label: dto.address_name ?? undefined,
    isDefault: dto.is_default_shipping ?? undefined,
  };
}

export function mapAddressToMedusa(address: Address) {
  return {
    first_name: address.firstName,
    last_name: address.lastName,
    phone: address.phone,
    address_1: address.address1,
    address_2: address.address2 ?? '',
    city: address.city,
    province: address.province,
    postal_code: address.postalCode,
    country_code: (address.countryCode || 'in').toLowerCase(),
  };
}

/** Customer address book entries additionally carry a label. */
export function mapCustomerAddressToMedusa(address: Address) {
  return {
    ...mapAddressToMedusa(address),
    address_name: address.label ?? '',
    is_default_shipping: Boolean(address.isDefault),
  };
}

function mapLine(line: MedusaLineItemDto, currencyCode: string): CartItem & OrderLine {
  const totalMajor = line.total ?? line.subtotal ?? line.unit_price * line.quantity;
  return {
    id: line.id,
    productId: line.product_id ?? '',
    variantId: line.variant_id ?? '',
    title: line.product_title ?? line.title,
    variantTitle: line.variant_title ?? '',
    handle: line.product_handle ?? '',
    thumbnailUrl: line.thumbnail ?? undefined,
    quantity: line.quantity,
    unitPrice: money(line.unit_price, currencyCode),
    totalPrice: money(totalMajor, currencyCode),
    total: money(totalMajor, currencyCode),
  };
}

export function mapMedusaCartToDomain(dto: MedusaCartDto): Cart {
  const currencyCode = dto.currency_code.toUpperCase();
  const items = (dto.items ?? []).map((line) => mapLine(line, currencyCode));
  const shippingMethod = dto.shipping_methods?.[0];
  const shippingAddress =
    dto.shipping_address && dto.shipping_address.address_1
      ? mapMedusaAddressToDomain(dto.shipping_address)
      : undefined;

  return {
    id: dto.id,
    items,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: money(dto.item_total ?? dto.subtotal, currencyCode),
    shippingEstimate: shippingMethod
      ? money(dto.shipping_total, currencyCode)
      : undefined,
    discountTotal: money(dto.discount_total, currencyCode),
    taxTotal: money(dto.tax_total, currencyCode),
    total: money(dto.total, currencyCode),
    currencyCode,
    email: dto.email ?? undefined,
    customerId: dto.customer_id ?? undefined,
    shippingAddress,
    shippingOptionId: shippingMethod?.shipping_option_id ?? undefined,
    promoCodes: (dto.promotions ?? []).map((p) => p.code ?? '').filter(Boolean),
  };
}

export function mapMedusaShippingOptionToDomain(
  dto: MedusaShippingOptionDto,
  currencyCode: string,
): ShippingOption {
  return {
    id: dto.id,
    name: dto.name,
    amount: money(dto.calculated_price?.calculated_amount ?? dto.amount, currencyCode),
  };
}

const PAYMENT_STATUSES: readonly OrderPaymentStatus[] = [
  'not_paid',
  'awaiting',
  'authorized',
  'captured',
  'partially_refunded',
  'refunded',
  'canceled',
  'requires_action',
];

function paymentStatus(value: string | null | undefined): OrderPaymentStatus {
  return PAYMENT_STATUSES.find((s) => s === value) ?? 'other';
}

function fulfillmentStatus(value: string | null | undefined): OrderFulfillmentStatus {
  switch (value) {
    case 'not_fulfilled':
      return 'not_fulfilled';
    case 'fulfilled':
    case 'partially_fulfilled':
      return 'fulfilled';
    case 'shipped':
    case 'partially_shipped':
      return 'shipped';
    case 'delivered':
    case 'partially_delivered':
      return 'delivered';
    case 'canceled':
      return 'canceled';
    default:
      return 'other';
  }
}

export function mapMedusaOrderToDomain(dto: MedusaOrderDto): Order {
  const currencyCode = dto.currency_code.toUpperCase();
  const items = (dto.items ?? []).map((line) => mapLine(line, currencyCode));
  const collection = dto.payment_collections?.[0];
  const providerId =
    collection?.payments?.[0]?.provider_id ??
    collection?.payment_sessions?.[0]?.provider_id ??
    undefined;

  return {
    id: dto.id,
    displayId: dto.display_id,
    createdAt: dto.created_at,
    status: dto.status,
    paymentStatus: paymentStatus(dto.payment_status),
    fulfillmentStatus: fulfillmentStatus(dto.fulfillment_status),
    email: dto.email ?? undefined,
    items,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    shippingAddress: dto.shipping_address
      ? mapMedusaAddressToDomain(dto.shipping_address)
      : undefined,
    shippingMethodName: dto.shipping_methods?.[0]?.name ?? undefined,
    paymentProviderId: providerId,
    subtotal: money(dto.item_total ?? dto.subtotal, currencyCode),
    shippingTotal: money(dto.shipping_total, currencyCode),
    discountTotal: money(dto.discount_total, currencyCode),
    taxTotal: money(dto.tax_total, currencyCode),
    total: money(dto.total, currencyCode),
    currencyCode,
  };
}

export function mapMedusaCustomerToDomain(dto: MedusaCustomerDto): Customer {
  return {
    id: dto.id,
    firstName: dto.first_name ?? '',
    lastName: dto.last_name ?? '',
    email: dto.email ?? undefined,
    phone: dto.phone ?? undefined,
    addresses: (dto.addresses ?? []).map(mapMedusaAddressToDomain),
  };
}

export function mapMedusaRatingSummaryToDomain(
  dto: MedusaRatingSummaryDto,
): RatingSummary {
  const star = (n: number) => dto.distribution[String(n)] ?? 0;
  return {
    average: dto.average,
    count: dto.count,
    distribution: { 1: star(1), 2: star(2), 3: star(3), 4: star(4), 5: star(5) },
  };
}

export function mapMedusaReviewToDomain(dto: MedusaReviewDto): ProductReview {
  return {
    id: dto.id,
    authorName: dto.display_name,
    rating: dto.rating,
    title: dto.title ?? undefined,
    body: dto.body,
    verifiedPurchase: Boolean(dto.verified_purchase),
    createdAt: dto.created_at,
    product: dto.product
      ? {
          handle: dto.product.handle,
          title: dto.product.title,
          thumbnailUrl: dto.product.thumbnail ?? undefined,
        }
      : undefined,
  };
}
