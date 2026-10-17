import * as React from 'react';
import type { Category } from '@/lib/api/contracts/domain';
import { PRICE_RANGES, SPICE_LEVELS, OIL_BASES, type FilterState } from '../types';
import { cn } from '@/lib/utils/cn';

export interface FilterContentProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  categories: Category[];
  className?: string | undefined;
}

export function FilterContent({
  filters,
  onChange,
  categories,
  className,
}: FilterContentProps): React.JSX.Element {
  // Top-level parent categories only
  const rootCategories = categories.filter((c) => !c.parentId);

  const handleCategoryChange = (handle: string) => {
    onChange({ ...filters, category: handle });
  };

  const handlePriceChange = (priceRange: string) => {
    onChange({ ...filters, priceRange });
  };

  const handleSpiceChange = (spiceLevel: string) => {
    onChange({ ...filters, spiceLevel });
  };

  const handleOilChange = (oilBase: string) => {
    onChange({ ...filters, oilBase });
  };

  const handleInStockToggle = () => {
    onChange({ ...filters, inStockOnly: !filters.inStockOnly });
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* 1. Category Filter */}
      <div className="space-y-2.5">
        <h4 className="text-fg text-xs font-bold tracking-wider uppercase">Category</h4>
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => handleCategoryChange('all')}
            className={cn(
              'flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-xs transition-all sm:text-sm',
              filters.category === 'all'
                ? 'border-brand-600 bg-brand-50 text-brand-700 font-semibold'
                : 'text-fg-muted hover:border-line hover:text-fg hover:bg-surface-soft border-transparent',
            )}
          >
            <span>All Categories</span>
            {filters.category === 'all' && (
              <span className="bg-brand-600 h-1.5 w-1.5 rounded-full" />
            )}
          </button>

          {rootCategories.map((cat) => {
            const isSelected = filters.category === cat.handle;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.handle)}
                className={cn(
                  'flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-xs transition-all sm:text-sm',
                  isSelected
                    ? 'border-brand-600 bg-brand-50 text-brand-700 font-semibold'
                    : 'text-fg-muted hover:border-line hover:text-fg hover:bg-surface-soft border-transparent',
                )}
              >
                <span>{cat.name}</span>
                {isSelected && <span className="bg-brand-600 h-1.5 w-1.5 rounded-full" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-line/60 h-px" />

      {/* 2. Price Range Filter */}
      <div className="space-y-2.5">
        <h4 className="text-fg text-xs font-bold tracking-wider uppercase">
          Price Range
        </h4>
        <div className="space-y-1.5">
          {PRICE_RANGES.map((range) => {
            const isSelected = filters.priceRange === range.value;
            return (
              <button
                key={range.value}
                type="button"
                onClick={() => handlePriceChange(range.value)}
                className={cn(
                  'flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-xs transition-all sm:text-sm',
                  isSelected
                    ? 'border-brand-600 bg-brand-50 text-brand-700 font-semibold'
                    : 'text-fg-muted hover:border-line hover:text-fg hover:bg-surface-soft border-transparent',
                )}
              >
                <span>{range.label}</span>
                {isSelected && <span className="bg-brand-600 h-1.5 w-1.5 rounded-full" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-line/60 h-px" />

      {/* 3. Spice Level Filter */}
      <div className="space-y-2.5">
        <h4 className="text-fg text-xs font-bold tracking-wider uppercase">
          Spice Level
        </h4>
        <div className="space-y-1.5">
          {SPICE_LEVELS.map((spice) => {
            const isSelected = filters.spiceLevel === spice.value;
            return (
              <button
                key={spice.value}
                type="button"
                onClick={() => handleSpiceChange(spice.value)}
                className={cn(
                  'flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-xs transition-all sm:text-sm',
                  isSelected
                    ? 'border-brand-600 bg-brand-50 text-brand-700 font-semibold'
                    : 'text-fg-muted hover:border-line hover:text-fg hover:bg-surface-soft border-transparent',
                )}
              >
                <span>{spice.label}</span>
                {isSelected && <span className="bg-brand-600 h-1.5 w-1.5 rounded-full" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-line/60 h-px" />

      {/* 4. Base / Cooking Medium */}
      <div className="space-y-2.5">
        <h4 className="text-fg text-xs font-bold tracking-wider uppercase">
          Cooking Base & Fat
        </h4>
        <div className="space-y-1.5">
          {OIL_BASES.map((oil) => {
            const isSelected = filters.oilBase === oil.value;
            return (
              <button
                key={oil.value}
                type="button"
                onClick={() => handleOilChange(oil.value)}
                className={cn(
                  'flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-xs transition-all sm:text-sm',
                  isSelected
                    ? 'border-brand-600 bg-brand-50 text-brand-700 font-semibold'
                    : 'text-fg-muted hover:border-line hover:text-fg hover:bg-surface-soft border-transparent',
                )}
              >
                <span>{oil.label}</span>
                {isSelected && <span className="bg-brand-600 h-1.5 w-1.5 rounded-full" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-line/60 h-px" />

      {/* 5. In-Stock Availability Toggle */}
      <div className="pt-1">
        <label
          htmlFor="in-stock-only-toggle"
          className="flex cursor-pointer items-center justify-between py-1 select-none"
        >
          <div className="space-y-0.5">
            <span className="text-fg block text-xs font-semibold sm:text-sm">
              In Stock Only
            </span>
            <span className="text-fg-muted block text-[11px]">
              Hide currently curing or sold-out batches
            </span>
          </div>

          <button
            id="in-stock-only-toggle"
            type="button"
            role="switch"
            aria-checked={filters.inStockOnly}
            onClick={handleInStockToggle}
            className={cn(
              'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden',
              filters.inStockOnly ? 'bg-brand-600' : 'bg-line-strong',
            )}
          >
            <span
              className={cn(
                'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out',
                filters.inStockOnly ? 'translate-x-4' : 'translate-x-0',
              )}
            />
          </button>
        </label>
      </div>
    </div>
  );
}
