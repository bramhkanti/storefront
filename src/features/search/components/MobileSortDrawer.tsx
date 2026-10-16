import * as React from 'react';
import { ArrowUpDown, Check } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/Sheet';
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
        className="bg-surface text-fg border-line rounded-t-3xl p-0 max-h-[75vh] flex flex-col"
      >
        {/* Drawer Header */}
        <SheetHeader className="px-5 py-4 border-b border-line text-left space-y-0.5">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-brand-600" />
            <SheetTitle className="text-base font-bold text-fg">
              Sort By
            </SheetTitle>
          </div>
          <p className="text-xs text-fg-muted">
            Select display order for catalog items
          </p>
        </SheetHeader>

        {/* Options List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {SORT_OPTIONS.map((opt) => {
            const isSelected = currentSort === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={cn(
                  'w-full text-left p-3.5 rounded-2xl transition-all border flex items-center justify-between text-sm',
                  isSelected
                    ? 'border-brand-600 bg-brand-50 text-brand-700 font-bold'
                    : 'border-line bg-surface text-fg hover:border-brand-600/40 hover:bg-surface-soft',
                )}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <Check className="h-4 w-4 text-brand-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
