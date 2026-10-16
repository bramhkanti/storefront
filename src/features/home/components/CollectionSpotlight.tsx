import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';
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
    <section className="py-14 sm:py-20" aria-labelledby="collections-heading">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-heritage-maroon text-xs font-semibold tracking-[0.18em] uppercase">
              Curated for you
            </p>
            <h2
              id="collections-heading"
              className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              Shop our collections
            </h2>
          </div>
          <Link
            href="/collections"
            className="text-heritage-maroon inline-flex items-center gap-1 text-sm font-semibold hover:underline"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div
          className={cn(
            'mt-8 grid gap-4 sm:gap-5',
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
                  'group relative isolate flex flex-col justify-end overflow-hidden rounded-3xl bg-neutral-900 p-6 text-white sm:p-8',
                  large ? 'aspect-[4/3] lg:row-span-2 lg:aspect-auto' : 'aspect-[16/9]',
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
