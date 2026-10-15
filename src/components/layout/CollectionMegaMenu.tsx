'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, ArrowRight, Gift } from 'lucide-react';
import type { Collection } from '@/lib/api/contracts/domain';
import { cn } from '@/lib/utils/cn';

export interface CollectionMegaMenuProps {
  collections?: Collection[] | undefined;
}

/** The menu shows at most this many collections; the rest are on /collections. */
const MAX_COLLECTIONS = 3;

export function CollectionMegaMenu({
  collections,
}: CollectionMegaMenuProps): React.JSX.Element {
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

  // Close when clicking outside or pressing Escape
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

  // Collections come from the backend (admin > Products > Collections).
  // Banner, subtitle, badge and highlights are optional collection metadata.
  const displayCollections = (collections ?? []).slice(0, MAX_COLLECTIONS);

  return (
    <div
      ref={containerRef}
      className="static"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button for Desktop Navigation */}
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Browse curated collections and gift hampers"
        className={cn(
          'text-heritage-charcoal hover:text-heritage-maroon focus-visible:outline-heritage-maroon inline-flex items-center gap-1.5 rounded-md px-1 py-2 font-semibold transition-colors focus-visible:outline-2',
          isOpen && 'text-heritage-maroon',
        )}
      >
        <span>Collections</span>
        <ChevronDown
          className={cn(
            'text-heritage-muted h-3.5 w-3.5 transition-transform duration-200',
            isOpen && 'text-heritage-maroon rotate-180',
          )}
          aria-hidden="true"
        />
      </button>

      {/* 3-Column Collections Popover */}
      {isOpen && (
        <div
          role="region"
          aria-label="Collections Mega Menu"
          className="animate-in fade-in-0 zoom-in-95 absolute top-full left-1/2 z-50 w-[940px] max-w-[calc(100vw-2.5rem)] -translate-x-1/2 pt-2 duration-150"
        >
          <div className="border-heritage-border bg-heritage-cream rounded-2xl border p-6 shadow-2xl backdrop-blur-md dark:border-neutral-800 dark:bg-[#1c1815]">
            {/* Top Micro-Header */}
            <div className="border-heritage-border/70 mb-5 flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="text-heritage-charcoal font-serif text-sm font-bold tracking-wide dark:text-neutral-200">
                  Curated Heritage Collections & Hampers
                </span>
                <span className="bg-heritage-saffron-light/60 text-heritage-saffron-dark rounded-full px-2 py-0.5 text-[10px] font-semibold">
                  Handpicked
                </span>
              </div>
              <Link
                href="/collections"
                onClick={handleClose}
                className="text-heritage-maroon hover:text-heritage-maroon-hover inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
              >
                <span>View All Collections</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {displayCollections.length === 0 && (
              <p className="text-heritage-muted py-6 text-center text-sm">
                New collections are coming soon.
              </p>
            )}
            <div
              className={cn(
                'grid gap-6',
                displayCollections.length >= 3 && 'grid-cols-3',
                displayCollections.length === 2 && 'grid-cols-2',
                displayCollections.length === 1 && 'mx-auto max-w-sm grid-cols-1',
              )}
            >
              {displayCollections.map((coll, idx) => (
                <div
                  key={coll.handle}
                  className={cn(
                    'flex flex-col justify-between space-y-4',
                    idx > 0 &&
                      'before:bg-heritage-border/70 relative before:absolute before:top-1 before:bottom-1 before:-left-3 before:w-px dark:before:bg-neutral-800',
                  )}
                >
                  <Link
                    href={`/collections/${coll.handle}`}
                    onClick={handleClose}
                    className="group/card block space-y-3"
                  >
                    {/* Featured Image with Zoom & Badge */}
                    <div className="border-heritage-border/80 bg-heritage-cream-dark relative aspect-16/10 w-full overflow-hidden rounded-xl border shadow-2xs">
                      {coll.image && (
                        <Image
                          src={coll.image.url}
                          alt={coll.image.altText ?? coll.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 300px"
                          className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 transition-opacity group-hover/card:opacity-60" />

                      {/* Badge in top right corner */}
                      {coll.badge && (
                        <span className="bg-heritage-maroon/90 absolute top-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow-2xs backdrop-blur-xs">
                          {coll.badge}
                        </span>
                      )}

                      {/* Subtitle tag at bottom left */}
                      {coll.subtitle && (
                        <span className="absolute bottom-2 left-2 text-[11px] font-medium text-white/90 drop-shadow-sm">
                          {coll.subtitle}
                        </span>
                      )}
                    </div>

                    {/* Titles & Tagline */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-heritage-charcoal group-hover/card:text-heritage-maroon font-serif text-base font-bold transition-colors dark:text-neutral-100">
                          {coll.title}
                        </h3>
                        <ArrowRight className="text-heritage-muted group-hover/card:text-heritage-maroon h-3.5 w-3.5 transition-transform group-hover/card:translate-x-1" />
                      </div>
                      {coll.description && (
                        <p className="text-heritage-muted line-clamp-2 text-xs leading-relaxed dark:text-neutral-400">
                          {coll.description}
                        </p>
                      )}
                    </div>

                    {/* Highlight Pills */}
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {(coll.highlights ?? []).map((highlight) => (
                        <span
                          key={highlight}
                          className="bg-heritage-cream-dark/90 text-heritage-charcoal border-heritage-border/50 rounded-md border px-1.5 py-0.5 text-[10px] font-medium dark:bg-neutral-800 dark:text-neutral-300"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </Link>

                  {/* Column Footer Action */}
                  <div className="border-heritage-border/50 border-t pt-2.5">
                    <Link
                      href={`/collections/${coll.handle}`}
                      onClick={handleClose}
                      className="text-heritage-maroon hover:text-heritage-maroon-hover inline-flex items-center gap-1 text-[11px] font-semibold transition-colors"
                    >
                      <span>Explore Collection</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Guarantee / Gifting Inquiry Bar */}
            <div className="border-heritage-border/70 bg-heritage-cream-dark/40 mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3 dark:bg-neutral-900/60">
              <div className="flex items-center gap-2">
                <Gift className="text-heritage-saffron h-4 w-4 shrink-0" />
                <span className="text-heritage-charcoal text-xs dark:text-neutral-300">
                  <strong className="text-heritage-maroon font-semibold">
                    Custom Gifting:
                  </strong>{' '}
                  Artisanal brass barnies, hand-carved gift boxes & personalized cards.
                </span>
              </div>
              <Link
                href="/contact"
                onClick={handleClose}
                className="text-heritage-maroon hover:text-heritage-maroon-hover inline-flex items-center gap-1 text-xs font-semibold underline underline-offset-2 transition-colors"
              >
                <span>Bulk & Wedding Inquiry</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
