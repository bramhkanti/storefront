import * as React from 'react';
import { X, RotateCcw } from 'lucide-react';
import type { Category } from '@/lib/api/contracts/domain';
import { PRICE_RANGES, SPICE_LEVELS, OIL_BASES, type FilterState } from '../types';
import { cn } from '@/lib/utils/cn';

export interface ActiveFilterChipsProps {
  filters: FilterState;
  categories: Category[];
  onRemoveCategory: () => void;
  onRemovePrice: () => void;
  onRemoveSpice: () => void;
  onRemoveOil: () => void;
  onRemoveInStock: () => void;
  onResetAll: () => void;
  className?: string | undefined;
}

export function ActiveFilterChips({
  filters,
  categories,
  onRemoveCategory,
  onRemovePrice,
  onRemoveSpice,
  onRemoveOil,
  onRemoveInStock,
  onResetAll,
  className,
}: ActiveFilterChipsProps): React.JSX.Element | null {
  const chips: Array<{ id: string; label: string; onRemove: () => void }> = [];

  if (filters.category !== 'all') {
    const cat = categories.find((c) => c.handle === filters.category);
    chips.push({
      id: 'category',
      label: cat ? cat.name : filters.category,
      onRemove: onRemoveCategory,
    });
  }

  if (filters.priceRange !== 'all') {
    const priceOpt = PRICE_RANGES.find((p) => p.value === filters.priceRange);
    chips.push({
      id: 'price',
      label: priceOpt ? priceOpt.label : filters.priceRange,
      onRemove: onRemovePrice,
    });
  }

  if (filters.spiceLevel !== 'all') {
    const spiceOpt = SPICE_LEVELS.find((s) => s.value === filters.spiceLevel);
    chips.push({
      id: 'spice',
      label: `Spice: ${spiceOpt ? spiceOpt.label.split(' ')[0] : filters.spiceLevel}`,
      onRemove: onRemoveSpice,
    });
  }

  if (filters.oilBase !== 'all') {
    const oilOpt = OIL_BASES.find((o) => o.value === filters.oilBase);
    chips.push({
      id: 'oil',
      label: oilOpt ? oilOpt.label : filters.oilBase,
      onRemove: onRemoveOil,
    });
  }

  if (filters.inStockOnly) {
    chips.push({
      id: 'instock',
      label: 'In Stock Only',
      onRemove: onRemoveInStock,
    });
  }

  if (chips.length === 0) return null;

  return (
    <div
      aria-label="Active Filters"
      className={cn('flex flex-wrap items-center gap-2 pt-1', className)}
    >
      <span className="text-fg-muted text-xs font-semibold">Active Filters:</span>

      {chips.map((chip) => (
        <button
          key={chip.id}
          type="button"
          onClick={chip.onRemove}
          className="bg-brand-50 border-brand-600/30 text-brand-700 hover:bg-brand-100 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors"
        >
          <span>{chip.label}</span>
          <X className="h-3 w-3" />
        </button>
      ))}

      <button
        type="button"
        onClick={onResetAll}
        className="text-fg-muted hover:text-brand-700 inline-flex items-center gap-1 px-2 py-1 text-xs font-bold transition-colors hover:underline"
      >
        <RotateCcw className="h-3 w-3" />
        <span>Clear All</span>
      </button>
    </div>
  );
}
