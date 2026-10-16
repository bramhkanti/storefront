import * as React from 'react';
import { Sparkles, Quote } from 'lucide-react';
import type { CollectionEditorialStory } from '@/features/collection/data/collectionContent';
import { cn } from '@/lib/utils/cn';

export interface CollectionHeritageStoryProps {
  story: CollectionEditorialStory;
  className?: string | undefined;
}

export function CollectionHeritageStory({
  story,
  className,
}: CollectionHeritageStoryProps): React.JSX.Element | null {
  if (!story) return null;

  return (
    <section
      aria-labelledby="collection-heritage-story-heading"
      className={cn(
        'rounded-3xl border border-line bg-surface p-6 sm:p-8 lg:p-10 space-y-6',
        className,
      )}
    >
      <div className="space-y-1.5 border-b border-line pb-4">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-700 tracking-wider uppercase">
          <Sparkles className="h-3.5 w-3.5 text-brand-600" />
          <span>Artisanal Heritage Lineage</span>
        </div>
        <h2
          id="collection-heritage-story-heading"
          className="text-xl sm:text-2xl lg:text-3xl font-bold font-sans text-fg tracking-tight"
        >
          {story.title}
        </h2>
        {story.subtitle && (
          <p className="text-xs sm:text-sm text-fg-muted">
            {story.subtitle}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-4 text-sm sm:text-base text-fg-muted leading-relaxed">
          {story.paragraphs.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>

        {story.quote && (
          <div className="lg:col-span-4 rounded-2xl bg-brand-50/60 border border-brand-600/20 p-5 space-y-3">
            <Quote className="h-6 w-6 text-brand-600/40" />
            <blockquote className="text-xs sm:text-sm font-medium italic text-fg leading-relaxed">
              &ldquo;{story.quote.text}&rdquo;
            </blockquote>
            <p className="text-xs font-semibold text-brand-800 pt-1 border-t border-brand-600/20">
              — {story.quote.author}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
