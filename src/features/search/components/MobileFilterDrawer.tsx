import * as React from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import type { Category } from '@/lib/api/contracts/domain';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/Sheet';
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
        className="bg-surface text-fg border-line flex max-h-[88vh] flex-col rounded-t-3xl p-0"
      >
        {/* Drawer Header */}
        <SheetHeader className="border-line flex flex-row items-center justify-between space-y-0 border-b px-5 py-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="text-brand-600 h-4 w-4" />
            <SheetTitle className="text-fg text-base font-bold">
              Filter Delicacies
            </SheetTitle>
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
              className="text-brand-700 mr-8 inline-flex items-center gap-1 text-xs font-semibold hover:underline"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </SheetHeader>

        {/* Scrollable Filter Options */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <FilterContent filters={filters} onChange={onChange} categories={categories} />
        </div>

        {/* Sticky Action Footer */}
        <div className="border-line bg-surface flex items-center gap-3 border-t p-4">
          <button
            type="button"
            onClick={onReset}
            className="border-line text-fg hover:bg-surface-soft flex-1 rounded-xl border py-3 text-center text-xs font-bold transition-colors"
          >
            Clear All
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-primary hover:bg-primary-hover flex-[2] rounded-xl py-3 text-center text-xs font-bold text-white shadow-xs transition-colors"
          >
            Show {resultsCount} {resultsCount === 1 ? 'Product' : 'Products'}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
