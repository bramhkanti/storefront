import type {
  Cart,
  CartItem,
  Category,
  CategoryBreadcrumb,
  Collection,
  FoodAttributes,
  Product,
  ProductImage,
  ProductVariant,
} from '../../contracts/domain';
import type {
  MedusaCartDto,
  MedusaCategoryDto,
  MedusaCollectionDto,
  MedusaProductDto,
} from './dto';

const DEFAULT_FSSAI = '12345678901234';

/**
 * Maps a Medusa StoreProduct DTO to the pure domain Product entity.
 */
export function mapMedusaProductToDomain(dto: MedusaProductDto): Product {
  const meta = dto.metadata ?? {};

  // Extract food attributes from product metadata or assign sensible defaults
  const foodAttrsRaw =
    (meta.food_attributes as Record<string, unknown> | undefined) ?? {};
  const foodAttributes: FoodAttributes = {
    ingredients: Array.isArray(foodAttrsRaw.ingredients)
      ? (foodAttrsRaw.ingredients as string[])
      : [],
    allergens: Array.isArray(foodAttrsRaw.allergens)
      ? (foodAttrsRaw.allergens as string[])
      : [],
    shelfLife:
      typeof foodAttrsRaw.shelf_life === 'string' ? foodAttrsRaw.shelf_life : '12 Months',
    storage:
      typeof foodAttrsRaw.storage === 'string'
        ? foodAttrsRaw.storage
        : 'Store in a cool, dry place away from direct sunlight.',
    isVegetarian:
      typeof foodAttrsRaw.is_vegetarian === 'boolean' ? foodAttrsRaw.is_vegetarian : true,
    netWeight:
      typeof foodAttrsRaw.net_weight === 'string' ? foodAttrsRaw.net_weight : '500g',
    fssaiLicenseNumber:
      typeof foodAttrsRaw.fssai_license === 'string'
        ? foodAttrsRaw.fssai_license
        : DEFAULT_FSSAI,
    countryOfOrigin: 'India',
  };

  const images: ProductImage[] = (dto.images ?? []).map((img) => ({
    id: img.id,
    url: img.url,
    altText: dto.title,
  }));

  if (images.length === 0 && dto.thumbnail) {
    images.push({
      id: 'thumb',
      url: dto.thumbnail,
      altText: dto.title,
    });
  }

  const variants: ProductVariant[] = (dto.variants ?? []).map((v) => {
    const vMeta = v.metadata ?? {};
    const packSize =
      typeof vMeta.pack_size === 'string' ? vMeta.pack_size : (v.title ?? 'Standard');
    const amountMinor = v.calculated_price?.amount ?? v.original_price?.amount ?? 0;
    const currencyCode = v.calculated_price?.currency_code?.toUpperCase() ?? 'INR';
    const compareAmount = v.original_price?.amount;

    return {
      id: v.id,
      title: v.title ?? packSize,
      packSize,
      sku: v.sku ?? `SKU-${v.id}`,
      price: { amount: Math.round(amountMinor), currencyCode },
      compareAtPrice:
        compareAmount && compareAmount > amountMinor
          ? { amount: Math.round(compareAmount), currencyCode }
          : undefined,
      inStock: (v.inventory_quantity ?? 1) > 0,
      stockQuantity: v.inventory_quantity ?? undefined,
      weightGrams: v.weight ?? 500,
    };
  });

  const categoryIds = (dto.categories ?? []).map((c) => c.id);
  const primaryCategoryId = categoryIds[0] ?? 'cat_general';

  const categorySpecificAttrs =
    (meta.category_attributes as Record<string, unknown> | undefined) ?? {};

  const seoMeta = (meta.seo as Record<string, unknown> | undefined) ?? {};

  return {
    id: dto.id,
    handle: dto.handle,
    title: dto.title,
    description: dto.description ?? '',
    images,
    primaryCategoryId,
    categoryIds,
    collectionIds: dto.collection_id ? [dto.collection_id] : [],
    tags: (dto.tags ?? []).map((t) => t.value),
    variants:
      variants.length > 0
        ? variants
        : [
            {
              id: `v_${dto.id}`,
              title: 'Standard',
              packSize: 'Standard',
              sku: `SKU-${dto.id}`,
              price: { amount: 0, currencyCode: 'INR' },
              inStock: true,
              weightGrams: 500,
            },
          ],
    foodAttributes,
    attributes: categorySpecificAttrs,
    seo: {
      title: typeof seoMeta.title === 'string' ? seoMeta.title : undefined,
      description:
        typeof seoMeta.description === 'string' ? seoMeta.description : undefined,
      canonicalOverride:
        typeof seoMeta.canonical_override === 'string'
          ? seoMeta.canonical_override
          : undefined,
      noindex: typeof seoMeta.noindex === 'boolean' ? seoMeta.noindex : undefined,
      ogImage: typeof seoMeta.og_image === 'string' ? seoMeta.og_image : undefined,
    },
    status: (dto.status as 'published' | 'draft' | 'archived') ?? 'published',
    featured: Boolean(meta.featured),
    createdAt: dto.created_at ?? new Date().toISOString(),
    updatedAt: dto.updated_at ?? new Date().toISOString(),
  };
}

/**
 * Maps a Medusa StoreProductCategory DTO to the pure domain Category entity.
 */
export function mapMedusaCategoryToDomain(
  dto: MedusaCategoryDto,
  parentPath: CategoryBreadcrumb[] = [],
): Category {
  const currentBreadcrumb: CategoryBreadcrumb = {
    id: dto.id,
    handle: dto.handle,
    name: dto.name,
  };
  const path = [...parentPath, currentBreadcrumb];

  const meta = dto.metadata ?? {};
  const seoMeta = (meta.seo as Record<string, unknown> | undefined) ?? {};
  const faqsRaw =
    (meta.faqs as Array<{ question: string; answer: string }> | undefined) ?? [];

  const children = (dto.category_children as MedusaCategoryDto[] | undefined)?.map(
    (child) => mapMedusaCategoryToDomain(child, path),
  );

  return {
    id: dto.id,
    handle: dto.handle,
    name: dto.name,
    parentId: dto.parent_category_id ?? null,
    path,
    description: dto.description ?? '',
    introContent: typeof meta.intro_content === 'string' ? meta.intro_content : undefined,
    faqs: faqsRaw.map((f) => ({ question: f.question, answer: f.answer })),
    image:
      typeof meta.image_url === 'string'
        ? {
            url: meta.image_url,
            altText: dto.name,
          }
        : undefined,
    seo: {
      title: typeof seoMeta.title === 'string' ? seoMeta.title : undefined,
      description:
        typeof seoMeta.description === 'string' ? seoMeta.description : undefined,
      canonicalOverride:
        typeof seoMeta.canonical_override === 'string'
          ? seoMeta.canonical_override
          : undefined,
      noindex: typeof seoMeta.noindex === 'boolean' ? seoMeta.noindex : undefined,
    },
    children,
  };
}

/**
 * Maps a Medusa StoreCollection DTO to the pure domain Collection entity.
 */
export function mapMedusaCollectionToDomain(dto: MedusaCollectionDto): Collection {
  const meta = dto.metadata ?? {};
  const seoMeta = (meta.seo as Record<string, unknown> | undefined) ?? {};

  return {
    id: dto.id,
    handle: dto.handle,
    title: dto.title,
    description: typeof meta.description === 'string' ? meta.description : '',
    introContent: typeof meta.intro_content === 'string' ? meta.intro_content : undefined,
    image:
      typeof meta.image_url === 'string'
        ? {
            url: meta.image_url,
            altText: dto.title,
          }
        : undefined,
    productCount: dto.products_count ?? undefined,
    seo: {
      title: typeof seoMeta.title === 'string' ? seoMeta.title : undefined,
      description:
        typeof seoMeta.description === 'string' ? seoMeta.description : undefined,
    },
  };
}

/**
 * Maps a Medusa StoreCart DTO to the pure domain Cart entity.
 */
export function mapMedusaCartToDomain(dto: MedusaCartDto): Cart {
  const currencyCode = dto.currency_code?.toUpperCase() ?? 'INR';
  const items: CartItem[] = (dto.items ?? []).map((line) => ({
    id: line.id,
    productId: line.product_id ?? '',
    variantId: line.variant_id ?? '',
    title: line.title,
    variantTitle: line.variant_title ?? '',
    handle: line.product_handle ?? '',
    thumbnailUrl: line.thumbnail ?? undefined,
    unitPrice: { amount: Math.round(line.unit_price), currencyCode },
    totalPrice: { amount: Math.round(line.total), currencyCode },
    quantity: line.quantity,
  }));

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotalAmount = Math.round(dto.subtotal ?? 0);
  const shippingAmount = Math.round(dto.shipping_total ?? 0);
  const totalAmount = Math.round(dto.total ?? subtotalAmount + shippingAmount);

  return {
    id: dto.id,
    items,
    itemCount,
    subtotal: { amount: subtotalAmount, currencyCode },
    shippingEstimate: { amount: shippingAmount, currencyCode },
    total: { amount: totalAmount, currencyCode },
    currencyCode,
  };
}
