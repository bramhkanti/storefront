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
      className={cn('space-y-4 pt-4 border-t border-line', className)}
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1 border-b border-line pb-3">
        <div>
          <h2
            id="sibling-collections-heading"
            className="text-fg font-sans text-xl sm:text-2xl font-bold tracking-tight"
          >
            Explore Other Curated Collections
          </h2>
          <p className="text-fg-muted text-xs sm:text-sm mt-0.5">
            Discover artisanal gift hampers, customer favorites, and festive assortments
          </p>
        </div>
        <span className="text-fg-muted bg-surface-soft border border-line rounded-full px-3 py-1 text-xs font-semibold self-start sm:self-auto">
          {siblings.length} {siblings.length === 1 ? 'Collection' : 'Collections'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {siblings.map((coll) => {
          const imageUrl =
            coll.image?.url ||
            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';
          const altText = coll.image?.altText || coll.title;

          return (
            <Link
              key={coll.id}
              href={`/collections/${coll.handle}`}
              className="group border border-line hover:border-brand-600 bg-surface flex flex-row overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xs"
            >
              {/* Left Side: Image Container */}
              <div className="relative w-28 sm:w-36 shrink-0 overflow-hidden bg-surface-soft">
                <Image
                  src={imageUrl}
                  alt={altText}
                  fill
                  sizes="(max-width: 640px) 112px, 144px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Right Side: Content */}
              <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4 min-w-0">
                <div className="space-y-1">
                  <h3 className="text-fg group-hover:text-primary font-sans text-sm sm:text-base font-bold transition-colors truncate">
                    {coll.title}
                  </h3>
                  {coll.description && (
                    <p className="text-fg-muted line-clamp-2 text-xs leading-relaxed">
                      {coll.description}
                    </p>
                  )}
                </div>

                <div className="text-primary mt-2 flex items-center gap-1 text-xs font-semibold pt-1 border-t border-line/40">
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
