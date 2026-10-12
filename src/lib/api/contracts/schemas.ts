import { z } from 'zod';
import { ValidationError } from '../errors';
import type {
  AcharAttributes,
  Category,
  Collection,
  FoodAttributes,
  MakhanaAttributes,
  Money,
  Product,
  ProductVariant,
  Redirect,
  SweetsAttributes,
} from './domain';

export const moneySchema: z.ZodType<Money> = z.object({
  amount: z
    .number()
    .int()
    .nonnegative('Money amount must be a non-negative integer in minor units'),
  currencyCode: z.string().length(3).default('INR'),
});

export const seoMetadataSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  canonicalOverride: z.string().optional(),
  noindex: z.boolean().optional(),
  ogImage: z.string().optional(),
});

export const faqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const categoryBreadcrumbSchema = z.object({
  id: z.string().min(1),
  handle: z.string().min(1),
  name: z.string().min(1),
});

export const categorySchema: z.ZodType<Category> = z.lazy(() =>
  z.object({
    id: z.string().min(1),
    handle: z
      .string()
      .min(1)
      .regex(/^[a-z0-9-]+$/, 'Category handle must be a clean URL slug'),
    name: z.string().min(1),
    parentId: z.string().nullable(),
    path: z.array(categoryBreadcrumbSchema),
    description: z.string(),
    introContent: z.string().optional(),
    faqs: z.array(faqItemSchema).default([]),
    image: z
      .object({
        url: z.string(),
        altText: z.string().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
      })
      .optional(),
    seo: seoMetadataSchema.default({}),
    children: z.array(categorySchema).optional(),
  }),
);

export const foodAttributesSchema: z.ZodType<FoodAttributes> = z.object({
  ingredients: z.array(z.string().min(1)),
  allergens: z.array(z.string()).default([]),
  shelfLife: z.string().min(1),
  storage: z.string().min(1),
  isVegetarian: z.boolean().default(true),
  netWeight: z.string().min(1),
  fssaiLicenseNumber: z.string().min(14).max(14),
  batchNumber: z.string().optional(),
  countryOfOrigin: z.string().default('India'),
});

export const acharAttributesSchema: z.ZodType<AcharAttributes> = z.object({
  spiceLevel: z.enum(['Mild', 'Medium', 'Hot', 'Extra Hot']),
  oilType: z.enum(['Mustard Oil', 'Sesame Oil', 'Groundnut Oil', 'Sun Dried / Oil Free']),
  mangoVariety: z.string().optional(),
  preservativeType: z.enum(['Natural (Salt & Oil)', 'Organic Vinegar']).optional(),
});

export const sweetsAttributesSchema: z.ZodType<SweetsAttributes> = z.object({
  milkContent: z.enum([
    'Pure Buffalo Milk',
    'Cow Milk',
    'Mawa / Khoya',
    'Vegan / Dairy Free',
  ]),
  gheeType: z.enum(['Desi Cow Ghee', 'A2 Gir Cow Ghee', 'None']),
  shelfLifeDays: z.number().int().positive(),
  refrigerationRequired: z.boolean(),
});

export const makhanaAttributesSchema: z.ZodType<MakhanaAttributes> = z.object({
  roastType: z.enum([
    'Slow Roasted in Olive Oil',
    'Air Roasted',
    'Pure Desi Ghee Roasted',
  ]),
  flavor: z.enum([
    'Himalayan Pink Salt',
    'Peri Peri',
    'Mint Pudina',
    'Jaggery Gur',
    'Cream & Onion',
    'Plain Raw',
  ]),
  sizeGrade: z.enum(['Jumbo 6+', 'Premium 5+']),
});

export const productVariantSchema: z.ZodType<ProductVariant> = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  packSize: z.string().min(1),
  sku: z.string().min(1),
  price: moneySchema,
  compareAtPrice: moneySchema.optional(),
  inStock: z.boolean(),
  stockQuantity: z.number().int().optional(),
  weightGrams: z.number().positive(),
});

export const productImageSchema = z.object({
  id: z.string().min(1),
  url: z.string(),
  altText: z.string().default(''),
  width: z.number().optional(),
  height: z.number().optional(),
});

export const productSchema: z.ZodType<Product> = z.object({
  id: z.string().min(1),
  handle: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'Product handle must be a clean URL slug'),
  title: z.string().min(1),
  description: z.string(),
  images: z.array(productImageSchema).default([]),
  primaryCategoryId: z.string().min(1),
  categoryIds: z.array(z.string()).default([]),
  collectionIds: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  variants: z
    .array(productVariantSchema)
    .min(1, 'Product must have at least one variant'),
  foodAttributes: foodAttributesSchema,
  attributes: z.record(z.string(), z.unknown()).default({}),
  seo: seoMetadataSchema.default({}),
  status: z.enum(['published', 'draft', 'archived']).default('published'),
  featured: z.boolean().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const collectionSchema: z.ZodType<Collection> = z.object({
  id: z.string().min(1),
  handle: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  description: z.string(),
  introContent: z.string().optional(),
  image: z
    .object({
      url: z.string(),
      altText: z.string().optional(),
      width: z.number().optional(),
      height: z.number().optional(),
    })
    .optional(),
  productCount: z.number().int().optional(),
  seo: seoMetadataSchema.default({}),
});

export const redirectSchema: z.ZodType<Redirect> = z.object({
  fromPath: z.string().min(1),
  toPath: z.string(),
  statusCode: z.union([z.literal(301), z.literal(302), z.literal(410)]),
});

export const productFilterParamsSchema = z.object({
  categoryHandle: z.string().optional(),
  collectionHandle: z.string().optional(),
  tags: z.array(z.string()).optional(),
  minPrice: z.number().int().nonnegative().optional(),
  maxPrice: z.number().int().nonnegative().optional(),
  inStockOnly: z.boolean().optional(),
  sort: z.enum(['price_asc', 'price_desc', 'newest', 'featured']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

/**
 * Validates domain data at adapter boundaries, throwing a typed ValidationError on failure.
 */
export function validateDomain<T>(
  schema: z.ZodType<T>,
  data: unknown,
  context: string,
): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const formatted = result.error.issues
      .map((i) => `[${i.path.join('.') || 'root'}]: ${i.message}`)
      .join('; ');
    throw new ValidationError(
      `Validation failed for ${context}: ${formatted}`,
      result.error.issues,
    );
  }
  return result.data;
}
