import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { cn } from '@/lib/utils/cn';
import { SIGNATURE_RANGE_ITEMS } from '../constants';
import type { SignatureRangeItem } from '../types';

export interface SignatureRangeProps {
  items?: SignatureRangeItem[];
}

/** Shop-by-category tiles with the name on the photo. */
export function SignatureRange({
  items = SIGNATURE_RANGE_ITEMS,
}: SignatureRangeProps): React.JSX.Element | null {
  if (items.length === 0) return null;
  return (
    <section className="py-14 sm:py-20" aria-labelledby="signature-range-heading">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className="text-heritage-maroon text-xs font-semibold tracking-[0.18em] uppercase">
              Shop by category
            </p>
            <h2
              id="signature-range-heading"
              className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              Pure. Traditional. Delicious.
            </h2>
          </div>
          <Link
            href="/categories"
            className="text-heritage-maroon inline-flex items-center gap-1 text-sm font-semibold hover:underline"
          >
            All categories <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div
          className={cn(
            'mt-8 grid grid-cols-2 gap-3 sm:gap-5',
            items.length >= 4 && 'lg:grid-cols-4',
            items.length === 3 && 'lg:grid-cols-3',
          )}
        >
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group relative isolate flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-3xl bg-neutral-900 p-4 text-white sm:p-6"
            >
              <Image
                src={item.imageUrl}
                alt={item.imageAlt}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="-z-10 object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <span className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30 backdrop-blur-md transition-all group-hover:bg-white group-hover:text-neutral-900 sm:top-5 sm:right-5">
                <ArrowUpRight className="h-5 w-5" />
              </span>
              <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
                {item.name}
              </h3>
              <p className="mt-1 text-xs text-white/80 sm:text-sm">{item.tagline}</p>
              <span className="mt-3 hidden text-sm font-semibold underline-offset-4 group-hover:underline sm:block">
                {item.linkText}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
