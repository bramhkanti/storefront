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
        'w-72 shrink-0 rounded-2xl border border-line bg-surface p-5 space-y-5 sticky top-24 self-start shadow-xs',
        className,
      )}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between border-b border-line pb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-brand-600" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-fg">
            Filters
          </h3>
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-50 text-[11px] font-bold text-brand-700 border border-brand-600/30">
              {activeFilterCount}
            </span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Clear all</span>
          </button>
        )}
      </div>

      {/* Filter Sections */}
      <FilterContent
        filters={filters}
        onChange={onChange}
        categories={categories}
      />
    </aside>
  );
}
