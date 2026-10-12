import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Utensils, Heart } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { PROMO_BANNER_DATA } from '../constants';
import type { PromoBannerData } from '../types';

export interface PromoBannerProps {
  data?: PromoBannerData;
}

export function PromoBanner({
  data = PROMO_BANNER_DATA,
}: PromoBannerProps): React.JSX.Element {
  return (
    <section className="py-12 sm:py-16" aria-labelledby="promo-banner-heading">
      <Container>
        <div className="from-heritage-maroon-dark via-heritage-maroon to-heritage-maroon-dark relative overflow-hidden rounded-3xl bg-gradient-to-r text-white shadow-2xl">
          <div className="grid grid-cols-1 items-center gap-8 p-8 sm:p-12 lg:grid-cols-12 lg:gap-10">
            {/* Left Column: Promotion Copy, CTA & Badges */}
            <div className="space-y-6 lg:col-span-7">
              <span className="text-xs font-semibold tracking-widest text-amber-200 uppercase">
                {data.eyebrow}
              </span>

              <h2
                id="promo-banner-heading"
                className="font-serif text-3xl leading-tight font-extrabold sm:text-4xl lg:text-5xl"
              >
                {data.title}
              </h2>

              <p className="max-w-lg text-sm leading-relaxed text-white/90 sm:text-base">
                {data.description}
              </p>

              <div>
                <Link href={data.ctaHref}>
                  <Button
                    size="md"
                    className="text-heritage-maroon hover:bg-heritage-cream rounded-full border-none bg-white px-7 py-3 text-xs font-bold shadow-lg transition-transform hover:scale-105"
                  >
                    <span>{data.ctaText}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* 3 Mini Trust Badges */}
              <div className="flex flex-wrap items-center gap-4 border-t border-white/15 pt-5 text-xs text-white/90 sm:gap-6">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" />
                  <span>Pure Ingredients</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Utensils className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" />
                  <span>Traditional Recipes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Heart className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" />
                  <span>Made with Love</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Product Composition Image */}
            <div className="relative flex justify-center lg:col-span-5">
              <div className="relative aspect-4/3 w-full max-w-sm overflow-hidden rounded-2xl border border-white/20 shadow-xl sm:aspect-square">
                <Image
                  src={data.imageUrl}
                  alt={data.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 400px"
                  className="object-cover object-center transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
