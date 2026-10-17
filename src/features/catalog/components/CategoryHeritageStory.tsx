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
        'border-line bg-surface space-y-4 rounded-2xl border p-6 sm:rounded-3xl sm:p-8',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <span className="bg-brand-50 border-brand-600/30 text-brand-700 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold">
          <Sparkles className="text-primary h-3.5 w-3.5" />
          <span>Vedic Craft & Culinary Roots</span>
        </span>
        <span className="text-fg-muted text-xs font-semibold tracking-wider uppercase">
          Traditional Wisdom
        </span>
      </div>

      <div className="max-w-4xl space-y-3">
        <h2
          id="heritage-story-heading"
          className="text-fg font-sans text-xl font-bold tracking-tight sm:text-2xl"
        >
          The Story Behind Our {category.name}
        </h2>

        <p className="text-fg-muted text-sm leading-relaxed sm:text-base">
          {category.introContent}
        </p>
      </div>

      <div className="border-line/60 text-fg-muted flex flex-wrap items-center gap-6 border-t pt-2 text-xs font-semibold">
        <div className="flex items-center gap-2">
          <span className="bg-primary h-1.5 w-1.5 rounded-full" />
          <span>No Synthetic Chemicals</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-primary h-1.5 w-1.5 rounded-full" />
          <span>Small-Batch Artisan Prepared</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-primary h-1.5 w-1.5 rounded-full" />
          <span>Fresh Doorstep Dispatch</span>
        </div>
      </div>
    </section>
  );
}
