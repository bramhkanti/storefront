import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { Category } from '@/lib/api/contracts/domain';
import { cn } from '@/lib/utils/cn';

export interface SubcategorySiblingNavProps {
  parentCategory: Category;
  currentSubHandle: string;
  className?: string | undefined;
}

export function SubcategorySiblingNav({
  parentCategory,
  currentSubHandle,
  className,
}: SubcategorySiblingNavProps): React.JSX.Element | null {
  const siblings =
    parentCategory.children?.filter((c) => c.handle !== currentSubHandle) ?? [];

  if (siblings.length === 0) return null;

  return (
    <section
      aria-labelledby="sibling-varieties-heading"
      className={cn('space-y-4 pt-4 border-t border-line', className)}
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1 border-b border-line pb-3">
        <div>
          <h2
            id="sibling-varieties-heading"
            className="text-fg font-sans text-xl sm:text-2xl font-bold tracking-tight"
          >
            Explore Other {parentCategory.name} Varieties
          </h2>
          <p className="text-fg-muted text-xs sm:text-sm mt-0.5">
            Discover other handcrafted specialty variations from our {parentCategory.name.toLowerCase()} range
          </p>
        </div>
        <span className="text-fg-muted bg-surface-soft border border-line rounded-full px-3 py-1 text-xs font-semibold self-start sm:self-auto">
          {siblings.length} {siblings.length === 1 ? 'Variety' : 'Varieties'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {siblings.map((sub) => {
          const imageUrl =
            sub.image?.url ||
            'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80';
          const altText = sub.image?.altText || sub.name;

          return (
            <Link
              key={sub.id}
              href={`/${parentCategory.handle}/${sub.handle}`}
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
                    {sub.name}
                  </h3>
                  {sub.description && (
                    <p className="text-fg-muted line-clamp-2 text-xs leading-relaxed">
                      {sub.description}
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
