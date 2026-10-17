import * as React from 'react';
import { ArrowUpDown, Check } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/Sheet';
import { SORT_OPTIONS, type SortOption } from '../types';
import { cn } from '@/lib/utils/cn';

export interface MobileSortDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentSort: SortOption;
  onSelectSort: (sort: SortOption) => void;
}

export function MobileSortDrawer({
  isOpen,
  onClose,
  currentSort,
  onSelectSort,
}: MobileSortDrawerProps): React.JSX.Element {
  const handleSelect = (sort: SortOption) => {
    onSelectSort(sort);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="bottom"
        className="bg-surface text-fg border-line flex max-h-[75vh] flex-col rounded-t-3xl p-0"
      >
        {/* Drawer Header */}
        <SheetHeader className="border-line space-y-0.5 border-b px-5 py-4 text-left">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="text-brand-600 h-4 w-4" />
            <SheetTitle className="text-fg text-base font-bold">Sort By</SheetTitle>
          </div>
          <p className="text-fg-muted text-xs">Select display order for catalog items</p>
        </SheetHeader>

        {/* Options List */}
        <div className="flex-1 space-y-2 overflow-y-auto p-4">
          {SORT_OPTIONS.map((opt) => {
            const isSelected = currentSort === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={cn(
                  'flex w-full items-center justify-between rounded-2xl border p-3.5 text-left text-sm transition-all',
                  isSelected
                    ? 'border-brand-600 bg-brand-50 text-brand-700 font-bold'
                    : 'border-line bg-surface text-fg hover:border-brand-600/40 hover:bg-surface-soft',
                )}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="text-brand-600 h-4 w-4 shrink-0" />}
              </button>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
