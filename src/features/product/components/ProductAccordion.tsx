'use client';

import * as React from 'react';
import {
  BookOpen,
  ChevronDown,
  FileText,
  HelpCircle,
  ShieldCheck,
  Truck,
  UtensilsCrossed,
} from 'lucide-react';
import type { EnrichedProductContent } from '../data/productContent';
import type { FoodAttributes } from '@/lib/api/contracts/domain';
import { AttributeRenderer } from './AttributeRenderer';
import { ProductFaq } from './ProductFaq';
import { cn } from '@/lib/utils/cn';

export interface ProductAccordionProps {
  content: EnrichedProductContent;
  primaryCategory: string;
  foodAttributes: FoodAttributes;
  categoryAttributes?: Record<string, unknown> | undefined;
  className?: string | undefined;
}

export function ProductAccordion({
  content,
  primaryCategory,
  foodAttributes,
  categoryAttributes,
  className,
}: ProductAccordionProps): React.JSX.Element {
  // Allow multiple or single open tabs. Default: Story & FAQs open
  const [openSections, setOpenSections] = React.useState<string[]>([
    'story',
    'specs',
    'faqs',
  ]);

  const toggleSection = (id: string) => {
    setOpenSections((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const sections = [
    {
      id: 'story',
      title: 'Heritage Story & Traditional Craft',
      icon: BookOpen,
      content: (
        <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-heritage-muted">
          <h4 className="text-heritage-charcoal font-serif text-base sm:text-lg font-bold">
            {content.heritageStory.title}
          </h4>
          {content.heritageStory.narrative.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
          {content.heritageStory.artisanQuote && (
            <blockquote className="border-heritage-saffron bg-heritage-cream border-l-2 p-3 sm:p-4 rounded-r-lg italic text-heritage-charcoal font-serif">
              {content.heritageStory.artisanQuote}
            </blockquote>
          )}
        </div>
      ),
    },
    {
      id: 'pairings',
      title: 'Tasting Notes & Culinary Pairings',
      icon: UtensilsCrossed,
      content: (
        <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
          <div>
            <h5 className="text-heritage-charcoal font-semibold mb-2">Flavor Profile:</h5>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {content.tastingAndPairings.flavorProfile.map((note, idx) => (
                <li
                  key={idx}
                  className="border-heritage-border bg-white rounded-lg border p-2.5 text-heritage-muted text-xs"
                >
                  • {note}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-heritage-charcoal font-semibold mb-2">Best Relished With:</h5>
            <div className="flex flex-wrap gap-2">
              {content.tastingAndPairings.bestEnjoyedWith.map((dish, idx) => (
                <span
                  key={idx}
                  className="border-heritage-border bg-heritage-cream text-heritage-charcoal rounded-md border px-2.5 py-1 text-xs font-medium"
                >
                  {dish}
                </span>
              ))}
            </div>
          </div>

          <div className="border-heritage-border bg-heritage-cream-dark/40 rounded-xl border p-3.5 text-xs text-heritage-charcoal">
            <span className="font-semibold text-heritage-maroon">Artisan Kitchen Tip: </span>
            <span className="text-heritage-muted">{content.tastingAndPairings.chefTip}</span>
          </div>
        </div>
      ),
    },
    {
      id: 'specs',
      title: 'Ingredients & Regulatory Specifications',
      icon: FileText,
      content: (
        <AttributeRenderer
          primaryCategory={primaryCategory}
          foodAttributes={foodAttributes}
          categoryAttributes={categoryAttributes}
        />
      ),
    },
    {
      id: 'faqs',
      title: 'Frequently Asked Questions',
      icon: HelpCircle,
      content: <ProductFaq faqs={content.faqs} title="" />,
    },
    {
      id: 'shipping',
      title: 'Pan-India Delivery & Transit Guarantee',
      icon: Truck,
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-heritage-muted leading-relaxed">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="border-heritage-border bg-white rounded-xl border p-3.5">
              <div className="text-heritage-charcoal font-semibold mb-1 flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-heritage-maroon" />
                <span>24-Hour Dispatch</span>
              </div>
              <p className="text-[11px] text-heritage-muted leading-snug">
                {content.shippingHighlights.dispatchTime}
              </p>
            </div>

            <div className="border-heritage-border bg-white rounded-xl border p-3.5">
              <div className="text-heritage-charcoal font-semibold mb-1 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-heritage-green" />
                <span>Zero-Breakage Guarantee</span>
              </div>
              <p className="text-[11px] text-heritage-muted leading-snug">
                {content.shippingHighlights.packagingStandard}
              </p>
            </div>

            <div className="border-heritage-border bg-white rounded-xl border p-3.5">
              <div className="text-heritage-charcoal font-semibold mb-1 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-heritage-saffron" />
                <span>Transit Insurance</span>
              </div>
              <p className="text-[11px] text-heritage-muted leading-snug">
                {content.shippingHighlights.transitAssurance}
              </p>
            </div>
          </div>
          <p className="text-[11px] text-heritage-muted">
            All orders are carefully tracked with SMS and WhatsApp live updates. If your parcel arrives damaged or delayed, our Varanasi support desk resolves it with an instant free replacement.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between border-b border-heritage-border pb-3">
        <div>
          <span className="text-heritage-saffron-dark text-xs font-bold tracking-wider uppercase">
            Deep Dive
          </span>
          <h2 className="text-heritage-charcoal font-serif text-xl sm:text-2xl font-bold">
            Product Knowledge & Transparency
          </h2>
        </div>
      </div>

      <div className="border-heritage-border divide-heritage-border divide-y rounded-2xl border bg-white/70 overflow-hidden shadow-none">
        {sections.map((section) => {
          const isOpen = openSections.includes(section.id);
          const SectionIcon = section.icon;
          const buttonId = `section-btn-${section.id}`;
          const contentId = `section-content-${section.id}`;

          return (
            <div key={section.id} className="transition-colors">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={contentId}
                onClick={() => toggleSection(section.id)}
                className="flex w-full items-center justify-between gap-4 p-4 text-left transition-colors sm:p-5 hover:bg-neutral-50/70 focus-visible:outline-2 focus-visible:outline-heritage-maroon"
              >
                <span className="flex items-center gap-3">
                  <span className="border-heritage-border bg-heritage-cream text-heritage-maroon flex h-8 w-8 items-center justify-center rounded-lg border">
                    <SectionIcon className="h-4 w-4" />
                  </span>
                  <span className="text-heritage-charcoal text-sm sm:text-base font-bold">
                    {section.title}
                  </span>
                </span>
                <span
                  className={cn(
                    'border-heritage-border bg-heritage-cream text-heritage-charcoal flex h-6 w-6 items-center justify-center rounded-full border transition-transform duration-200',
                    isOpen && 'rotate-180 bg-heritage-cream-dark text-heritage-maroon',
                  )}
                  aria-hidden="true"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </span>
              </button>

              {isOpen && (
                <div
                  id={contentId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="border-heritage-border/50 bg-heritage-cream/15 border-t px-4 py-5 sm:px-6 sm:py-6"
                >
                  {section.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
