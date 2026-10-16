import * as React from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import type { Category } from '@/lib/api/contracts/domain';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/Sheet';
import type { FilterState } from '../types';
import { FilterContent } from './FilterContent';

export interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  categories: Category[];
  activeFilterCount: number;
  resultsCount: number;
}

export function MobileFilterDrawer({
  isOpen,
  onClose,
  filters,
  onChange,
  onReset,
  categories,
  activeFilterCount,
  resultsCount,
}: MobileFilterDrawerProps): React.JSX.Element {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="bottom"
        className="bg-surface text-fg border-line rounded-t-3xl p-0 max-h-[88vh] flex flex-col"
      >
        {/* Drawer Header */}
        <SheetHeader className="px-5 py-4 border-b border-line flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-brand-600" />
            <SheetTitle className="text-base font-bold text-fg">
              Filter Delicacies
            </SheetTitle>
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
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline mr-8"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </SheetHeader>

        {/* Scrollable Filter Options */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <FilterContent
            filters={filters}
            onChange={onChange}
            categories={categories}
          />
        </div>

        {/* Sticky Action Footer */}
        <div className="border-t border-line bg-surface p-4 flex items-center gap-3">
          <button
            type="button"
            onClick={onReset}
            className="flex-1 rounded-xl border border-line py-3 text-xs font-bold text-fg hover:bg-surface-soft transition-colors text-center"
          >
            Clear All
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-[2] rounded-xl bg-primary py-3 text-xs font-bold text-white shadow-xs hover:bg-primary-hover transition-colors text-center"
          >
            Show {resultsCount} {resultsCount === 1 ? 'Product' : 'Products'}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
