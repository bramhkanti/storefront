import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { HERITAGE_STORY_DATA } from '../constants';
import type { StorySectionData } from '../types';

export interface HeritageStoryProps {
  data?: StorySectionData;
}

export function HeritageStory({
  data = HERITAGE_STORY_DATA,
}: HeritageStoryProps): React.JSX.Element {
  return (
    <section className="py-16 sm:py-24" aria-labelledby="heritage-story-heading">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Atmospheric Image with Overlay Text */}
          <div className="relative overflow-hidden rounded-3xl lg:col-span-6">
            <div className="relative aspect-4/3 w-full sm:aspect-16/10">
              <Image
                src={data.imageUrl}
                alt={data.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-700 hover:scale-105"
              />
              {/* Subtle dark gradient overlay for text readability */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
                aria-hidden="true"
              />
              {/* Stylized Overlay Typography matching mockup top-right cursive placement */}
              <div className="absolute top-6 right-6 z-10 max-w-[210px] text-right sm:top-8 sm:right-8 sm:max-w-xs">
                <p className="font-serif text-lg leading-snug font-bold text-amber-100 italic drop-shadow-md sm:text-2xl">
                  {data.overlayText}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Story Copy & CTA */}
          <div className="space-y-6 lg:col-span-6">
            <div className="flex items-center gap-2">
              <span
                className="text-heritage-border h-px w-8 bg-current"
                aria-hidden="true"
              />
              <span className="text-heritage-saffron-dark text-xs font-semibold tracking-widest uppercase">
                {data.eyebrow}
              </span>
              <span
                className="text-heritage-border h-px w-8 bg-current"
                aria-hidden="true"
              />
            </div>

            <h2
              id="heritage-story-heading"
              className="text-heritage-maroon font-serif text-3xl leading-tight font-extrabold sm:text-4xl"
            >
              {data.title}
            </h2>

            <div className="space-y-4">
              {data.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-heritage-muted text-base leading-relaxed sm:text-lg"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="pt-2">
              <Link href={data.ctaHref}>
                <Button
                  variant="secondary"
                  className="border-heritage-border hover:bg-heritage-cream-dark text-heritage-charcoal rounded-full border bg-white px-6 py-2.5 text-xs font-semibold transition-colors"
                >
                  <span>{data.ctaText}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
