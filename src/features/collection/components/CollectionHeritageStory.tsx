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
        'border-line bg-surface space-y-6 rounded-3xl border p-6 sm:p-8 lg:p-10',
        className,
      )}
    >
      <div className="border-line space-y-1.5 border-b pb-4">
        <div className="text-brand-700 flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase">
          <Sparkles className="text-brand-600 h-3.5 w-3.5" />
          <span>Artisanal Heritage Lineage</span>
        </div>
        <h2
          id="collection-heritage-story-heading"
          className="text-fg font-sans text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl"
        >
          {story.title}
        </h2>
        {story.subtitle && (
          <p className="text-fg-muted text-xs sm:text-sm">{story.subtitle}</p>
        )}
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <div className="text-fg-muted space-y-4 text-sm leading-relaxed sm:text-base lg:col-span-8">
          {story.paragraphs.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>

        {story.quote && (
          <div className="bg-brand-50/60 border-brand-600/20 space-y-3 rounded-2xl border p-5 lg:col-span-4">
            <Quote className="text-brand-600/40 h-6 w-6" />
            <blockquote className="text-fg text-xs leading-relaxed font-medium italic sm:text-sm">
              &ldquo;{story.quote.text}&rdquo;
            </blockquote>
            <p className="text-brand-800 border-brand-600/20 border-t pt-1 text-xs font-semibold">
              — {story.quote.author}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
