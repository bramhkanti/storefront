import { z } from 'zod';

export const medusaImageDtoSchema = z.object({
  id: z.string(),
  url: z.string(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
});

export const medusaPriceDtoSchema = z.object({
  amount: z.number(),
  currency_code: z.string(),
});

export const medusaVariantDtoSchema = z.object({
  id: z.string(),
  title: z.string().nullable().optional(),
  sku: z.string().nullable().optional(),
  manage_inventory: z.boolean().nullable().optional(),
  inventory_quantity: z.number().nullable().optional(),
  weight: z.number().nullable().optional(),
  calculated_price: medusaPriceDtoSchema.nullable().optional(),
  original_price: medusaPriceDtoSchema.nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
});

export const medusaProductDtoSchema = z.object({
  id: z.string(),
  title: z.string(),
  handle: z.string(),
  description: z.string().nullable().optional(),
  thumbnail: z.string().nullable().optional(),
  images: z.array(medusaImageDtoSchema).nullable().optional(),
  categories: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        handle: z.string(),
      }),
    )
    .nullable()
    .optional(),
  collection_id: z.string().nullable().optional(),
  tags: z
    .array(
      z.object({
        id: z.string(),
        value: z.string(),
      }),
    )
    .nullable()
    .optional(),
  variants: z.array(medusaVariantDtoSchema).nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
  status: z.string().nullable().optional(),
  created_at: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),
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
    description: z.string().nullable().optional(),
    parent_category_id: z.string().nullable().optional(),
    category_children: z.array(medusaCategoryDtoSchema).nullable().optional(),
    metadata: z.record(z.string(), z.unknown()).nullable().optional(),
  }),
);

export const medusaCollectionDtoSchema = z.object({
  id: z.string(),
  title: z.string(),
  handle: z.string(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
  products_count: z.number().nullable().optional(),
});

export const medusaLineItemDtoSchema = z.object({
  id: z.string(),
  product_id: z.string().nullable().optional(),
  variant_id: z.string().nullable().optional(),
  title: z.string(),
  variant_title: z.string().nullable().optional(),
  thumbnail: z.string().nullable().optional(),
  quantity: z.number(),
  unit_price: z.number(),
  total: z.number(),
  product_handle: z.string().nullable().optional(),
});

export const medusaCartDtoSchema = z.object({
  id: z.string(),
  currency_code: z.string(),
  items: z.array(medusaLineItemDtoSchema).nullable().optional(),
  subtotal: z.number().nullable().optional(),
  shipping_total: z.number().nullable().optional(),
  total: z.number().nullable().optional(),
});

export type MedusaProductDto = z.infer<typeof medusaProductDtoSchema>;
export type MedusaCategoryDto = z.infer<typeof medusaCategoryDtoSchema>;
export type MedusaCollectionDto = z.infer<typeof medusaCollectionDtoSchema>;
export type MedusaCartDto = z.infer<typeof medusaCartDtoSchema>;
