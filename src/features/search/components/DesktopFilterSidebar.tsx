import * as React from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import type { Category } from '@/lib/api/contracts/domain';
import type { FilterState } from '../types';
import { FilterContent } from './FilterContent';
import { cn } from '@/lib/utils/cn';

export interface DesktopFilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  categories: Category[];
  activeFilterCount: number;
  className?: string | undefined;
}

export function DesktopFilterSidebar({
  filters,
  onChange,
  onReset,
  categories,
  activeFilterCount,
  className,
}: DesktopFilterSidebarProps): React.JSX.Element {
  return (
    <aside
      aria-label="Product Filters"
      className={cn(
        'border-line bg-surface sticky top-24 w-72 shrink-0 space-y-5 self-start rounded-2xl border p-5 shadow-xs',
        className,
      )}
    >
      {/* Sidebar Header */}
      <div className="border-line flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="text-brand-600 h-4 w-4" />
          <h3 className="text-fg text-sm font-bold tracking-wider uppercase">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="bg-brand-50 text-brand-700 border-brand-600/30 flex h-5 w-5 items-center justify-center rounded-full border text-[11px] font-bold">
              {activeFilterCount}
            </span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="text-brand-700 inline-flex items-center gap-1 text-xs font-semibold hover:underline"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Clear all</span>
          </button>
        )}
      </div>

      {/* Filter Sections */}
      <FilterContent filters={filters} onChange={onChange} categories={categories} />
    </aside>
  );
}
