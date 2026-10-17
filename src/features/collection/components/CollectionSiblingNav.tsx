import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { Collection } from '@/lib/api/contracts/domain';
import { cn } from '@/lib/utils/cn';

export interface CollectionSiblingNavProps {
  currentHandle: string;
  collections: Collection[];
  className?: string | undefined;
}

export function CollectionSiblingNav({
  currentHandle,
  collections,
  className,
}: CollectionSiblingNavProps): React.JSX.Element | null {
  const siblings = collections.filter((c) => c.handle !== currentHandle);

  if (siblings.length === 0) return null;

  return (
    <section
      aria-labelledby="sibling-collections-heading"
      className={cn('border-line space-y-4 border-t pt-4', className)}
    >
      <div className="border-line flex flex-col justify-between gap-1 border-b pb-3 sm:flex-row sm:items-end">
        <div>
          <h2
            id="sibling-collections-heading"
            className="text-fg font-sans text-xl font-bold tracking-tight sm:text-2xl"
          >
            Explore Other Curated Collections
          </h2>
          <p className="text-fg-muted mt-0.5 text-xs sm:text-sm">
            Discover artisanal gift hampers, customer favorites, and festive assortments
          </p>
        </div>
        <span className="text-fg-muted bg-surface-soft border-line self-start rounded-full border px-3 py-1 text-xs font-semibold sm:self-auto">
          {siblings.length} {siblings.length === 1 ? 'Collection' : 'Collections'}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {siblings.map((coll) => {
          const imageUrl =
            coll.image?.url ||
            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';
          const altText = coll.image?.altText || coll.title;

          return (
            <Link
              key={coll.id}
              href={`/collections/${coll.handle}`}
              className="group border-line hover:border-brand-600 bg-surface flex flex-row overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-xs"
            >
              {/* Left Side: Image Container */}
              <div className="bg-surface-soft relative w-28 shrink-0 overflow-hidden sm:w-36">
                <Image
                  src={imageUrl}
                  alt={altText}
                  fill
                  sizes="(max-width: 640px) 112px, 144px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Right Side: Content */}
              <div className="flex min-w-0 flex-1 flex-col justify-between p-3.5 sm:p-4">
                <div className="space-y-1">
                  <h3 className="text-fg group-hover:text-primary truncate font-sans text-sm font-bold transition-colors sm:text-base">
                    {coll.title}
                  </h3>
                  {coll.description && (
                    <p className="text-fg-muted line-clamp-2 text-xs leading-relaxed">
                      {coll.description}
                    </p>
                  )}
                </div>

                <div className="text-primary border-line/40 mt-2 flex items-center gap-1 border-t pt-1 text-xs font-semibold">
                  <span>Browse Collection</span>
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
