import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Leaf, Sparkles, Utensils, Gift } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { cn } from '@/lib/utils/cn';
import { SIGNATURE_RANGE_ITEMS } from '../constants';
import type { SignatureRangeItem } from '../types';

const ICON_MAP = {
  leaf: Leaf,
  sparkle: Sparkles,
  sweet: Utensils,
  gift: Gift,
};

export interface SignatureRangeProps {
  items?: SignatureRangeItem[];
}

export function SignatureRange({
  items = SIGNATURE_RANGE_ITEMS,
}: SignatureRangeProps): React.JSX.Element | null {
  if (items.length === 0) return null;
  return (
    <section className="py-16 sm:py-24" aria-labelledby="signature-range-heading">
      <Container>
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex items-center justify-center gap-2">
            <span
              className="text-heritage-border h-px w-8 bg-current"
              aria-hidden="true"
            />
            <span className="text-heritage-saffron-dark text-xs font-semibold tracking-widest uppercase">
              Our Signature Range
            </span>
            <span
              className="text-heritage-border h-px w-8 bg-current"
              aria-hidden="true"
            />
          </div>

          <h2
            id="signature-range-heading"
            className="text-heritage-maroon mt-3 font-serif text-3xl font-extrabold tracking-tight sm:text-4xl"
          >
            Pure. Traditional. Delicious.
          </h2>

          <p className="text-heritage-muted mt-3 text-sm leading-relaxed sm:text-base">
            From tangy pickles to crunchy makhana and rich sweets, every bite tells a
            story of tradition, purity and unmatched taste.
          </p>
        </div>

        {/* 4 Category Cards Grid */}
        <div
          className={cn(
            'mx-auto mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2',
            items.length >= 4 && 'lg:grid-cols-4',
            items.length === 3 && 'lg:grid-cols-3',
            items.length <= 2 && 'max-w-3xl',
          )}
        >
          {items.map((item) => {
            const Icon = ICON_MAP[item.iconName] ?? Leaf;

            return (
              <div
                key={item.id}
                className="group border-heritage-border bg-heritage-cream hover:border-heritage-maroon/40 flex flex-col overflow-hidden rounded-2xl border shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                {/* Product Image Header */}
                <div className="bg-heritage-cream-dark/50 relative aspect-4/3 w-full overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Card Content & Action Link */}
                <div className="flex flex-1 flex-col justify-between p-5 pt-5 text-center">
                  <div>
                    <div className="flex justify-center pb-2">
                      <Icon className="text-heritage-green h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="text-heritage-maroon font-serif text-xl font-bold tracking-tight">
                      {item.name}
                    </h3>
                    <p className="text-heritage-muted mt-1 text-xs">{item.tagline}</p>
                  </div>

                  <div className="mt-5 pt-3">
                    <Link
                      href={item.href}
                      className="text-heritage-maroon hover:text-heritage-maroon-dark inline-flex items-center gap-1.5 text-xs font-bold transition-colors group-hover:underline"
                    >
                      <span>{item.linkText}</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
