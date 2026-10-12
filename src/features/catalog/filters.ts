import { z } from 'zod';

export const CatalogSortOptionSchema = z.enum([
  'featured',
  'price_asc',
  'price_desc',
  'newest',
]);

export type CatalogSortOption = z.infer<typeof CatalogSortOptionSchema>;

export const CatalogFiltersSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(48).default(12),
  sort: CatalogSortOptionSchema.default('featured'),
  spiceLevel: z.string().optional(),
  priceRange: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  inStockOnly: z
    .enum(['true', 'false', '1', '0'])
    .optional()
    .transform((val) => val === 'true' || val === '1'),
});

export type CatalogFilters = z.infer<typeof CatalogFiltersSchema>;

/**
 * Parse raw searchParams record safely.
 */
export function parseCatalogFilters(
  searchParams?: Record<string, string | string[] | undefined>,
): CatalogFilters {
  if (!searchParams) {
    return CatalogFiltersSchema.parse({});
  }

  const normalized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      normalized[key] = value[0];
    } else if (value !== undefined) {
      normalized[key] = value;
    }
  }

  const result = CatalogFiltersSchema.safeParse(normalized);
  if (!result.success) {
    return CatalogFiltersSchema.parse({});
  }

  const data = result.data;
  if (data.priceRange === 'under-400') {
    data.minPrice = 0;
    data.maxPrice = 40000;
  } else if (data.priceRange === '400-800') {
    data.minPrice = 40000;
    data.maxPrice = 80000;
  } else if (data.priceRange === 'above-800') {
    data.minPrice = 80000;
    data.maxPrice = undefined;
  }

  return data;
}
