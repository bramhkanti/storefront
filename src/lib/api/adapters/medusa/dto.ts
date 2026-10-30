import { z } from 'zod';

/**
 * Runtime schemas for the Medusa v2 Store API payloads we consume.
 * Money values from Medusa are MAJOR units (rupees, may be fractional);
 * mappers convert them to the domain's integer minor units (paise).
 */

const meta = z.record(z.string(), z.unknown()).nullable().optional();
const num = z.number().nullable().optional();
const str = z.string().nullable().optional();

export const medusaImageDtoSchema = z.object({
  id: z.string(),
  url: z.string(),
  metadata: meta,
});

export const medusaCalculatedPriceDtoSchema = z.object({
  calculated_amount: num,
  original_amount: num,
  currency_code: str,
});

export const medusaVariantDtoSchema = z.object({
  id: z.string(),
  title: str,
  sku: str,
  manage_inventory: z.boolean().nullable().optional(),
  allow_backorder: z.boolean().nullable().optional(),
  inventory_quantity: num,
  weight: num,
  calculated_price: medusaCalculatedPriceDtoSchema.nullable().optional(),
  metadata: meta,
});

export const medusaProductDtoSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: str,
  handle: z.string(),
  description: str,
  thumbnail: str,
  images: z.array(medusaImageDtoSchema).nullable().optional(),
  categories: z
    .array(z.object({ id: z.string(), name: z.string(), handle: z.string() }))
    .nullable()
    .optional(),
  collection_id: str,
  tags: z
    .array(z.object({ id: z.string(), value: z.string() }))
    .nullable()
    .optional(),
  variants: z.array(medusaVariantDtoSchema).nullable().optional(),
  metadata: meta,
  status: str,
  created_at: str,
  updated_at: str,
});

export const medusaCategoryDtoSchema: z.ZodType<{
  id: string;
  name: string;
  handle: string;
  description?: string | null | undefined;
  parent_category_id?: string | null | undefined;
  category_children?: unknown[] | null | undefined;
  metadata?: Record<string, unknown> | null | undefined;
}> = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string(),
    handle: z.string(),
    description: str,
    parent_category_id: str,
    category_children: z.array(medusaCategoryDtoSchema).nullable().optional(),
    metadata: meta,
  }),
);

export const medusaCollectionDtoSchema = z.object({
  id: z.string(),
  title: z.string(),
  handle: z.string(),
  metadata: meta,
});

export const medusaAddressDtoSchema = z.object({
  id: str,
  address_name: str,
  first_name: str,
  last_name: str,
  phone: str,
  address_1: str,
  address_2: str,
  city: str,
  province: str,
  postal_code: str,
  country_code: str,
  is_default_shipping: z.boolean().nullable().optional(),
});

export const medusaLineItemDtoSchema = z.object({
  id: z.string(),
  product_id: str,
  variant_id: str,
  title: z.string(),
  product_title: str,
  variant_title: str,
  product_handle: str,
  thumbnail: str,
  quantity: z.number(),
  unit_price: z.number(),
  total: num,
  subtotal: num,
});

export const medusaCartDtoSchema = z.object({
  id: z.string(),
  currency_code: z.string(),
  email: str,
  customer_id: str,
  items: z.array(medusaLineItemDtoSchema).nullable().optional(),
  item_total: num,
  item_subtotal: num,
  subtotal: num,
  shipping_total: num,
  discount_total: num,
  tax_total: num,
  total: num,
  shipping_address: medusaAddressDtoSchema.nullable().optional(),
  shipping_methods: z
    .array(z.object({ id: z.string(), shipping_option_id: str, amount: num }))
    .nullable()
    .optional(),
  promotions: z
    .array(z.object({ id: z.string(), code: str }))
    .nullable()
    .optional(),
  payment_collection: z
    .object({
      id: z.string(),
      payment_sessions: z
        .array(
          z.object({
            id: z.string(),
            provider_id: z.string(),
            data: meta,
          }),
        )
        .nullable()
        .optional(),
    })
    .nullable()
    .optional(),
});

export const medusaShippingOptionDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  amount: num,
  calculated_price: medusaCalculatedPriceDtoSchema.nullable().optional(),
  insufficient_inventory: z.boolean().nullable().optional(),
});

export const medusaOrderDtoSchema = z.object({
  id: z.string(),
  display_id: z.number(),
  created_at: z.union([z.string(), z.date()]).transform(String),
  status: z.string(),
  payment_status: str,
  fulfillment_status: str,
  email: str,
  currency_code: z.string(),
  items: z.array(medusaLineItemDtoSchema).nullable().optional(),
  shipping_address: medusaAddressDtoSchema.nullable().optional(),
  shipping_methods: z
    .array(z.object({ name: str }))
    .nullable()
    .optional(),
  payment_collections: z
    .array(
      z.object({
        payments: z
          .array(z.object({ provider_id: str }))
          .nullable()
          .optional(),
        payment_sessions: z
          .array(z.object({ provider_id: str }))
          .nullable()
          .optional(),
      }),
    )
    .nullable()
    .optional(),
  item_total: num,
  item_subtotal: num,
  subtotal: num,
  shipping_total: num,
  discount_total: num,
  tax_total: num,
  total: num,
});

export const medusaCustomerDtoSchema = z.object({
  id: z.string(),
  first_name: str,
  last_name: str,
  email: str,
  phone: str,
  addresses: z.array(medusaAddressDtoSchema).nullable().optional(),
});

export type MedusaProductDto = z.infer<typeof medusaProductDtoSchema>;
export type MedusaCategoryDto = z.infer<typeof medusaCategoryDtoSchema>;
export type MedusaCollectionDto = z.infer<typeof medusaCollectionDtoSchema>;
export type MedusaCartDto = z.infer<typeof medusaCartDtoSchema>;
export type MedusaLineItemDto = z.infer<typeof medusaLineItemDtoSchema>;
export type MedusaAddressDto = z.infer<typeof medusaAddressDtoSchema>;
export type MedusaShippingOptionDto = z.infer<typeof medusaShippingOptionDtoSchema>;
export type MedusaOrderDto = z.infer<typeof medusaOrderDtoSchema>;
export type MedusaCustomerDto = z.infer<typeof medusaCustomerDtoSchema>;

const ratingDistributionDtoSchema = z.record(z.string(), z.number());

export const medusaRatingSummaryDtoSchema = z.object({
  average: z.number(),
  count: z.number(),
  distribution: ratingDistributionDtoSchema,
});

export const medusaReviewDtoSchema = z.object({
  id: z.string(),
  display_name: z.string(),
  rating: z.number(),
  title: str,
  body: z.string(),
  verified_purchase: z.boolean().nullable().optional(),
  created_at: z.string(),
  product: z
    .object({ handle: z.string(), title: z.string(), thumbnail: str })
    .nullable()
    .optional(),
});

export const medusaReviewListDtoSchema = z.object({
  reviews: z.array(medusaReviewDtoSchema),
  count: z.number(),
  summary: medusaRatingSummaryDtoSchema,
});

export type MedusaRatingSummaryDto = z.infer<typeof medusaRatingSummaryDtoSchema>;
export type MedusaReviewDto = z.infer<typeof medusaReviewDtoSchema>;
