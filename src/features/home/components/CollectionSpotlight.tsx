import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { Collection } from '@/lib/api/contracts/domain';
import { cn } from '@/lib/utils/cn';

export interface CollectionSpotlightProps {
  collections: Collection[];
}

/** Curated collections as banner tiles: one large, the rest stacked beside it. */
export function CollectionSpotlight({
  collections,
}: CollectionSpotlightProps): React.JSX.Element | null {
  const tiles = collections.filter((c) => c.image).slice(0, 3);
  if (tiles.length === 0) return null;

  return (
    <section className="py-10 sm:py-16" aria-labelledby="collections-heading">
      <Container>
        <SectionHeading
          id="collections-heading"
          eyebrow="Curated for you"
          title="Shop our collections"
          action={{ href: '/collections', label: 'View all' }}
        />
      </Container>

      <Container className="mt-6 px-0 sm:mt-8 sm:px-6 lg:px-8">
        <div
          className={cn(
            // Swipeable on phones, a 1 large + 2 stacked grid on desktop.
            'flex snap-x snap-mandatory scroll-px-4 [scrollbar-width:none] gap-3 overflow-x-auto px-4 pb-2 sm:grid sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden',
            tiles.length > 1 && 'lg:grid-cols-2 lg:grid-rows-2',
          )}
        >
          {tiles.map((c, i) => {
            const large = i === 0 && tiles.length > 1;
            return (
              <Link
                key={c.id}
                href={`/collections/${c.handle}`}
                className={cn(
                  'group relative isolate flex w-[82vw] max-w-md shrink-0 snap-start flex-col justify-end overflow-hidden rounded-2xl bg-neutral-900 p-5 text-white sm:w-auto sm:max-w-none sm:rounded-3xl sm:p-8',
                  large
                    ? 'aspect-[4/5] sm:aspect-[16/9] lg:row-span-2 lg:aspect-auto'
                    : 'aspect-[4/5] sm:aspect-[16/9]',
                )}
              >
                <Image
                  src={c.image!.url}
                  alt={c.image!.altText ?? c.title}
                  fill
                  sizes={
                    large
                      ? '(max-width: 1024px) 100vw, 50vw'
                      : '(max-width: 1024px) 100vw, 50vw'
                  }
                  className="-z-10 object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                {c.badge && (
                  <span className="mb-3 w-fit rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold tracking-[0.15em] uppercase ring-1 ring-white/25 backdrop-blur-md">
                    {c.badge}
                  </span>
                )}
                <h3
                  className={cn(
                    'font-semibold tracking-tight',
                    large ? 'text-3xl sm:text-4xl' : 'text-2xl',
                  )}
                >
                  {c.title}
                </h3>
                {c.description && (
                  <p className="mt-1.5 line-clamp-2 max-w-md text-sm text-white/80 sm:text-base">
                    {c.description}
                  </p>
                )}
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold">
                  Shop now
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
