'use client';

import * as React from 'react';
import { ChefHat, Quote, Sparkles, UtensilsCrossed } from 'lucide-react';
import type { EnrichedProductContent } from '../data/productContent';
import { cn } from '@/lib/utils/cn';

export interface ProductStorySectionProps {
  content: EnrichedProductContent;
  className?: string | undefined;
}

export function ProductStorySection({
  content,
  className,
}: ProductStorySectionProps): React.JSX.Element {
  const profileLabels = ['Aromatic Warmth', 'Palate Balance', 'Artisanal Texture'];

  return (
    <section aria-labelledby="story-heading" className={cn('space-y-6', className)}>
      <div>
        <h2 id="story-heading" className="text-[20px] font-semibold text-neutral-900 leading-snug">
          Heritage Story & Artisanal Craft
        </h2>
      </div>

      {/* Story Narrative & Editorial Quote */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-neutral-900">
          {content.heritageStory.title}
        </h3>

        <div className="space-y-3 text-sm leading-relaxed text-neutral-600">
          {content.heritageStory.narrative.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {content.heritageStory.artisanQuote && (
          <div className="relative rounded-2xl border border-neutral-200 bg-neutral-50/50 p-4 sm:p-5 mt-2">
            <Quote className="h-6 w-6 text-neutral-300 absolute top-3.5 right-3.5" aria-hidden="true" />
            <p className="font-serif italic text-neutral-800 text-sm sm:text-base leading-relaxed pr-6">
              “{content.heritageStory.artisanQuote.replace(/^["']|["']$/g, '')}”
            </p>
            <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              — Master Artisan, Bramhkanti Kitchens
            </div>
          </div>
        )}
      </div>

      {/* Flavor Profile & Tasting Notes */}
      <div className="space-y-3 pt-2">
        <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-neutral-700" />
          <span>Flavor Profile & Tasting Notes</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {content.tastingAndPairings.flavorProfile.map((note, idx) => {
            const label = profileLabels[idx] ?? `Note 0${idx + 1}`;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-neutral-200 bg-white p-3.5 transition-colors hover:border-neutral-300 space-y-1"
              >
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  {label}
                </span>
                <p className="text-sm font-medium text-neutral-800 leading-snug">
                  {note}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Best Relished With (Culinary Pairing Grid) */}
      <div className="space-y-3 pt-1">
        <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-1.5">
          <UtensilsCrossed className="h-4 w-4 text-neutral-700" />
          <span>Best Relished With</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {content.tastingAndPairings.bestEnjoyedWith.map((dish, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-3 transition-colors hover:border-neutral-300"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700">
                <UtensilsCrossed className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm font-medium text-neutral-800 leading-snug">
                {dish}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Artisan Kitchen Secret Tip */}
      {content.tastingAndPairings.chefTip && (
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-4 transition-colors">
          <div className="flex items-center gap-2 mb-1.5">
            <ChefHat className="h-4 w-4 text-neutral-900" />
            <span className="text-sm font-bold text-neutral-900">Artisan Kitchen Tip</span>
          </div>
          <p className="text-sm text-neutral-700 leading-relaxed">
            {content.tastingAndPairings.chefTip}
          </p>
        </div>
      )}
    </section>
  );
}
