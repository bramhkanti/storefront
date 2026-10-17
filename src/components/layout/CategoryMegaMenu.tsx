'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, ArrowRight, ShieldCheck } from 'lucide-react';
import type { Category } from '@/lib/api/contracts/domain';
import { cn } from '@/lib/utils/cn';

export interface CategoryMegaMenuProps {
  categories: Category[];
}

interface SubcategoryData {
  name: string;
  handle: string;
  parentHandle: string;
  tagline: string;
  imageUrl: string;
  altText: string;
  badge?: string | undefined;
}

export function CategoryMegaMenu({
  categories,
}: CategoryMegaMenuProps): React.JSX.Element {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const closeTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const handleMouseEnter = () => {
    clearCloseTimer();
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 220);
  };

  const handleToggle = () => {
    clearCloseTimer();
    setIsOpen((prev) => !prev);
  };

  const handleClose = () => {
    clearCloseTimer();
    setIsOpen(false);
  };

  // Close when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      clearCloseTimer();
    };
  }, [isOpen]);

  // Extract top 3 main categories (Pickle, Makhana, Sweets)
  const mainCategories = categories.slice(0, 3);

  return (
    <div
      ref={containerRef}
      className="static"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Single Group Category Trigger for Desktop Header */}
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Browse all product categories"
        className={cn(
          'text-heritage-charcoal hover:text-heritage-maroon focus-visible:outline-heritage-maroon inline-flex items-center gap-1.5 rounded-md px-1 py-2 font-semibold transition-colors focus-visible:outline-2',
          isOpen && 'text-heritage-maroon',
        )}
      >
        <span>Categories</span>
        <ChevronDown
          className={cn(
            'text-heritage-muted h-3.5 w-3.5 transition-transform duration-200',
            isOpen && 'text-heritage-maroon rotate-180',
          )}
          aria-hidden="true"
        />
      </button>

      {/* 3-Column Category Popover */}
      {isOpen && (
        <div
          role="region"
          aria-label="Categories Mega Menu"
          className="animate-in fade-in-0 zoom-in-95 absolute top-full left-1/2 z-50 w-[940px] max-w-[calc(100vw-2.5rem)] -translate-x-1/2 pt-2 duration-150"
        >
          <div className="border-heritage-border bg-heritage-cream rounded-2xl border p-6 shadow-2xl backdrop-blur-md dark:border-neutral-800 dark:bg-[#1c1815]">
            {/* Top Micro-Header */}
            <div className="border-heritage-border/70 mb-5 flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="text-heritage-charcoal font-serif text-sm font-bold tracking-wide dark:text-neutral-200">
                  Explore Traditional Delicacies
                </span>
                <span className="bg-heritage-saffron-light/60 text-heritage-saffron-dark rounded-full px-2 py-0.5 text-[10px] font-semibold">
                  Handcrafted
                </span>
              </div>
              <Link
                href="/categories"
                onClick={handleClose}
                className="text-heritage-maroon hover:text-heritage-maroon-hover inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
              >
                <span>View All Categories</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {mainCategories.length === 0 && (
              <p className="text-heritage-muted py-6 text-center text-sm">
                Categories are coming soon.
              </p>
            )}
            <div
              className={cn(
                'grid gap-6',
                mainCategories.length >= 3 && 'grid-cols-3',
                mainCategories.length === 2 && 'grid-cols-2',
                mainCategories.length === 1 && 'mx-auto max-w-sm grid-cols-1',
              )}
            >
              {mainCategories.map((cat, idx) => {
                const totalCount = cat.children?.length ?? 0;
                // Subcategories (admin > Products > Categories, nested). Image and
                // badge are optional category metadata: `image_url`, `badge`.
                const subcategories: SubcategoryData[] = (cat.children ?? [])
                  .slice(0, 3)
                  .map((sub) => ({
                    name: sub.name,
                    handle: sub.handle,
                    parentHandle: cat.handle,
                    tagline: sub.description,
                    imageUrl: sub.image?.url ?? cat.image?.url ?? '',
                    altText: sub.image?.altText ?? sub.name,
                    badge: sub.badge,
                  }));

                return (
                  <div
                    key={cat.id}
                    className={cn(
                      'flex flex-col justify-between space-y-3',
                      idx > 0 &&
                        'before:bg-heritage-border/70 relative before:absolute before:top-1 before:bottom-1 before:-left-3 before:w-px dark:before:bg-neutral-800',
                    )}
                  >
                    <div>
                      {/* Column Header - Clean title link with no subtitle */}
                      <div className="mb-3">
                        <Link
                          href={`/${cat.handle}`}
                          onClick={handleClose}
                          className="group/title inline-flex items-center gap-1.5"
                        >
                          <h3 className="text-heritage-maroon hover:text-heritage-maroon-dark font-serif text-base font-bold transition-colors">
                            {cat.name}
                          </h3>
                          <ArrowRight className="text-heritage-muted group-hover/title:text-heritage-maroon h-3.5 w-3.5 transition-transform group-hover/title:translate-x-0.5" />
                        </Link>
                      </div>

                      {subcategories.length === 0 && (
                        <Link
                          href={`/${cat.handle}`}
                          onClick={handleClose}
                          className="border-heritage-border/50 bg-heritage-cream-dark relative block aspect-16/10 overflow-hidden rounded-xl border"
                        >
                          {cat.image && (
                            <Image
                              src={cat.image.url}
                              alt={cat.image.altText ?? cat.name}
                              fill
                              sizes="300px"
                              className="object-cover"
                            />
                          )}
                        </Link>
                      )}

                      {/* Subcategories (up to 3) */}
                      <ul className="space-y-2">
                        {subcategories.map((sub) => {
                          const href =
                            sub.parentHandle === 'collections'
                              ? `/collections/${sub.handle}`
                              : `/${sub.parentHandle}/${sub.handle}`;

                          return (
                            <li key={sub.handle}>
                              <Link
                                href={href}
                                onClick={handleClose}
                                className="group/item hover:bg-heritage-cream-dark/70 border-heritage-border/50 hover:border-heritage-maroon/30 relative flex items-center gap-3 rounded-xl border p-2.5 transition-all hover:shadow-2xs dark:hover:bg-neutral-800/70"
                              >
                                {/* Thumbnail Image */}
                                <div className="border-heritage-border/80 bg-heritage-cream-dark relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border shadow-2xs">
                                  {sub.imageUrl && (
                                    <Image
                                      src={sub.imageUrl}
                                      alt={sub.altText}
                                      fill
                                      sizes="44px"
                                      className="object-cover transition-transform duration-300 group-hover/item:scale-110"
                                    />
                                  )}
                                </div>

                                {/* Text & Meta with reserved right padding for top-right corner tag */}
                                <div className="min-w-0 flex-1 pr-14">
                                  <span className="text-heritage-charcoal group-hover/item:text-heritage-maroon block truncate text-xs font-semibold transition-colors dark:text-neutral-200">
                                    {sub.name}
                                  </span>
                                  {sub.tagline && (
                                    <p className="text-heritage-muted mt-0.5 truncate text-[11px] leading-normal">
                                      {sub.tagline}
                                    </p>
                                  )}
                                </div>

                                {/* Tag situated at the top right corner of the box card */}
                                {sub.badge && (
                                  <span className="bg-heritage-maroon-light text-heritage-maroon absolute top-2 right-2.5 rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wide">
                                    {sub.badge}
                                  </span>
                                )}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    {/* Column Footer */}
                    <div className="pt-2">
                      <Link
                        href={`/${cat.handle}`}
                        onClick={handleClose}
                        className="text-heritage-maroon hover:text-heritage-maroon-hover inline-flex items-center gap-1 text-[11px] font-semibold transition-colors"
                      >
                        <span>
                          View all {cat.name}
                          {totalCount > 0 ? ` (${totalCount} types)` : ''}
                        </span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Guarantee Banner */}
            <div className="border-heritage-border/70 bg-heritage-cream-dark/40 mt-5 flex items-center justify-between rounded-xl border px-4 py-2.5 text-xs dark:bg-neutral-900/40">
              <div className="text-heritage-muted flex items-center gap-2 text-[11px]">
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-700" />
                <span>
                  100% Vegetarian Purity • Zero Artificial Preservatives • Handcrafted in
                  Varanasi
                </span>
              </div>
              <Link
                href="/collections"
                onClick={handleClose}
                className="text-heritage-maroon text-[11px] font-semibold hover:underline"
              >
                All collections ➔
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
