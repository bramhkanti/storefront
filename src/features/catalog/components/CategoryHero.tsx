import * as React from 'react';
import type { Category } from '@/lib/api/contracts/domain';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils/cn';

export interface CategoryHeroProps {
  category: Category;
  activeSubHandle?: string;
  className?: string;
}

export function CategoryHero({ category, className }: CategoryHeroProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="vegetarian">100% Pure Veg</Badge>
          <span className="bg-brand-50 border-brand-600/30 text-brand-700 inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold">
            Handcrafted Heritage
          </span>
          <span className="text-fg-muted text-xs font-medium">
            Direct from Varanasi Kitchens
          </span>
        </div>

        <h1 className="text-fg font-sans text-3xl font-extrabold tracking-tight sm:text-5xl">
          {category.name}
        </h1>

        <div className="text-fg-muted max-w-4xl space-y-3 text-sm leading-relaxed sm:text-base">
          <p>{category.description}</p>
        </div>
      </div>
    </div>
  );
}
