import * as React from 'react';
import Link from 'next/link';
import type { Category } from '@/lib/api/contracts/domain';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils/cn';

export interface CategoryHeroProps {
  category: Category;
  activeSubHandle?: string;
  className?: string;
}

export function CategoryHero({
  category,
  activeSubHandle,
  className,
}: CategoryHeroProps) {
  const hasChildren = (category.children && category.children.length > 0) ?? false;

  return (
    <div className={cn('space-y-6', className)}>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="vegetarian">100% Pure Veg</Badge>
          <span className="text-heritage-saffron-dark text-xs font-semibold tracking-wider uppercase">
            Heritage Category
          </span>
        </div>

        <h1 className="text-heritage-maroon font-serif text-3xl font-extrabold tracking-tight sm:text-5xl">
          {category.name}
        </h1>

        <div className="text-heritage-muted max-w-4xl space-y-3 text-sm leading-relaxed sm:text-base">
          <p>{category.description}</p>
        </div>
      </div>

      {/* Subcategory Pills */}
      {hasChildren && (
        <div className="pt-2">
          <div className="text-heritage-muted mb-2.5 text-xs font-semibold tracking-wider uppercase">
            Explore Varieties:
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/${category.handle}`}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors',
                !activeSubHandle
                  ? 'bg-heritage-maroon border-heritage-maroon text-white shadow-xs'
                  : 'bg-heritage-cream text-heritage-charcoal border-heritage-border hover:bg-heritage-cream-dark',
              )}
            >
              All {category.name}
            </Link>

            {category.children?.map((sub) => {
              const isActive = activeSubHandle === sub.handle;
              return (
                <Link
                  key={sub.id}
                  href={`/${category.handle}/${sub.handle}`}
                  className={cn(
                    'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors',
                    isActive
                      ? 'bg-heritage-maroon border-heritage-maroon text-white shadow-xs'
                      : 'bg-heritage-cream text-heritage-charcoal border-heritage-border hover:bg-heritage-cream-dark',
                  )}
                >
                  {sub.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
