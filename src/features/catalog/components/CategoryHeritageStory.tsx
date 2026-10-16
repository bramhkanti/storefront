import * as React from 'react';
import type { Category } from '@/lib/api/contracts/domain';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface CategoryHeritageStoryProps {
  category: Category;
  className?: string | undefined;
}

export function CategoryHeritageStory({
  category,
  className,
}: CategoryHeritageStoryProps): React.JSX.Element | null {
  if (!category.introContent) {
    return null;
  }

  return (
    <section
      aria-labelledby="heritage-story-heading"
      className={cn(
        'rounded-2xl sm:rounded-3xl border border-line bg-surface p-6 sm:p-8 space-y-4',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 border border-brand-600/30 px-3 py-1 text-xs font-bold text-brand-700">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>Vedic Craft & Culinary Roots</span>
        </span>
        <span className="text-fg-muted text-xs font-semibold uppercase tracking-wider">
          Traditional Wisdom
        </span>
      </div>

      <div className="max-w-4xl space-y-3">
        <h2
          id="heritage-story-heading"
          className="text-xl sm:text-2xl font-bold font-sans text-fg tracking-tight"
        >
          The Story Behind Our {category.name}
        </h2>

        <p className="text-sm sm:text-base text-fg-muted leading-relaxed">
          {category.introContent}
        </p>
      </div>

      <div className="pt-2 border-t border-line/60 flex flex-wrap items-center gap-6 text-xs font-semibold text-fg-muted">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <span>No Synthetic Chemicals</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <span>Small-Batch Artisan Prepared</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <span>Fresh Doorstep Dispatch</span>
        </div>
      </div>
    </section>
  );
}
