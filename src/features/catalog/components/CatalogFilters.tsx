import * as React from 'react';
import Link from 'next/link';
import type { CatalogFilters } from '../filters';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

export interface CatalogFiltersProps {
  currentFilters: CatalogFilters;
  categorySlug?: string;
  className?: string;
}

/**
 * Zero-JS progressive enhancement filter bar.
 * Renders as a semantic GET form that submits cleanly with or without client JavaScript.
 */
export function CatalogFilters({
  currentFilters,
  categorySlug,
  className,
}: CatalogFiltersProps) {
  const isAchar = categorySlug?.toLowerCase().includes('achar');

  return (
    <form
      method="GET"
      className={cn(
        'border-heritage-border bg-heritage-cream rounded-xl border p-4 shadow-xs sm:flex sm:items-center sm:justify-between sm:gap-4',
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-4">
        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="sort-select"
            className="text-heritage-muted text-xs font-semibold tracking-wider uppercase"
          >
            Sort:
          </label>
          <select
            id="sort-select"
            name="sort"
            defaultValue={currentFilters.sort}
            className="border-heritage-border bg-heritage-cream-dark text-heritage-charcoal focus:ring-heritage-maroon rounded-md border px-3 py-1.5 text-xs font-medium focus:ring-2 focus:outline-hidden"
          >
            <option value="featured">Featured Heritage</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="newest">New Arrivals</option>
          </select>
        </div>

        {/* Price Range selector */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="price-select"
            className="text-heritage-muted text-xs font-semibold tracking-wider uppercase"
          >
            Price:
          </label>
          <select
            id="price-select"
            name="priceRange"
            defaultValue={currentFilters.priceRange ?? ''}
            className="border-heritage-border bg-heritage-cream-dark text-heritage-charcoal focus:ring-heritage-maroon rounded-md border px-3 py-1.5 text-xs font-medium focus:ring-2 focus:outline-hidden"
          >
            <option value="">All Prices</option>
            <option value="under-400">Under ₹400</option>
            <option value="400-800">₹400 – ₹800</option>
            <option value="above-800">Above ₹800</option>
          </select>
        </div>

        {/* Spice Level (only for Achar) */}
        {isAchar && (
          <div className="flex items-center gap-2">
            <label
              htmlFor="spice-select"
              className="text-heritage-muted text-xs font-semibold tracking-wider uppercase"
            >
              Spice:
            </label>
            <select
              id="spice-select"
              name="spiceLevel"
              defaultValue={currentFilters.spiceLevel ?? ''}
              className="border-heritage-border bg-heritage-cream-dark text-heritage-charcoal focus:ring-heritage-maroon rounded-md border px-3 py-1.5 text-xs font-medium focus:ring-2 focus:outline-hidden"
            >
              <option value="">All Spice Levels</option>
              <option value="mild">Mild</option>
              <option value="medium">Medium</option>
              <option value="spicy">Spicy</option>
              <option value="extra-spicy">Extra Spicy</option>
            </select>
          </div>
        )}

        {/* In-Stock only checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="instock-checkbox"
            name="inStockOnly"
            value="true"
            defaultChecked={currentFilters.inStockOnly}
            className="border-heritage-border text-heritage-maroon focus:ring-heritage-maroon h-4 w-4 rounded-xs"
          />
          <label
            htmlFor="instock-checkbox"
            className="text-heritage-charcoal text-xs font-medium"
          >
            In Stock Only
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-3 flex items-center gap-2 sm:mt-0">
        <Button type="submit" size="sm" variant="primary" className="h-8 px-4 text-xs">
          Apply
        </Button>
        <Link
          href={categorySlug ? `/${categorySlug}` : '/'}
          className="text-heritage-muted hover:text-heritage-maroon ml-1 text-xs underline-offset-4 hover:underline"
        >
          Reset
        </Link>
      </div>
    </form>
  );
}
