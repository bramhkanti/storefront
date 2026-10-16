import * as React from 'react';
import type { Category } from '@/lib/api/contracts/domain';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils/cn';

export interface SubcategoryHeroProps {
  parentCategory?: Category | undefined;
  subCategory: Category;
  h1Title?: string | undefined;
  badgeLabel?: string | undefined;
  className?: string | undefined;
}

export function SubcategoryHero({
  subCategory,
  h1Title,
  badgeLabel,
  className,
}: SubcategoryHeroProps): React.JSX.Element {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="space-y-3">
        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="vegetarian">100% Pure Veg</Badge>
          {badgeLabel && (
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 border border-brand-600/30 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
              {badgeLabel}
            </span>
          )}
          <span className="text-fg-muted text-xs font-medium">
            Handcrafted in Varanasi
          </span>
        </div>

        {/* Primary Subcategory H1 */}
        <h1 className="text-fg font-sans text-3xl font-extrabold tracking-tight sm:text-5xl">
          {h1Title ?? subCategory.name}
        </h1>

        {/* Unique Subcategory Description */}
        <div className="text-fg-muted max-w-4xl space-y-3 text-sm leading-relaxed sm:text-base">
          <p>{subCategory.description}</p>
        </div>
      </div>
    </div>
  );
}
