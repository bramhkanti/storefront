'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, ArrowRight, Sparkles, Gift } from 'lucide-react';
import type { Collection } from '@/lib/api/contracts/domain';
import { cn } from '@/lib/utils/cn';

export interface CollectionMegaMenuProps {
  collections?: Collection[] | undefined;
}

interface CollectionItemData {
  id: string;
  handle: string;
  title: string;
  subtitle: string;
  badge: string;
  tagline: string;
  imageUrl: string;
  altText: string;
  highlights: string[];
}

const DEFAULT_COLLECTIONS_META: CollectionItemData[] = [
  {
    id: 'col_best_sellers',
    handle: 'best-sellers',
    title: 'Best Seller Combo',
    subtitle: 'Signature Value Combos',
    badge: 'Most Loved',
    tagline:
      'Curated pairings of Banarasi Stuffed Red Chilli, Danedar Besan Ladoo & Himalayan Pink Salt Makhana.',
    imageUrl:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    altText: 'Bramhkanti Best Seller Combo Delicacies Assortment',
    highlights: ['Banarasi Mirch', 'Besan Ladoo', 'Pink Salt Makhana'],
  },
  {
    id: 'col_grandma',
    handle: 'grandmas-specials',
    title: 'Grand Maa',
    subtitle: 'Vintage 1952 Recipes',
    badge: 'Heirloom',
    tagline:
      'Generational treasures preserved from 1952: Sun-dried Heeng Mango Achar, Gond Walnut Ladoo & Gur Makhana.',
    imageUrl:
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
    altText: 'Grand Maa Vintage Heirloom Recipes and Barnie Pickles',
    highlights: ['Heeng Mango Achar', 'Gond Ladoo', 'Jaggery Makhana'],
  },
  {
    id: 'col_diwali',
    handle: 'diwali-gifting',
    title: 'Diwali and Fest',
    subtitle: 'Royal Keepsake Hampers',
    badge: 'Festive Box',
    tagline:
      'Handcrafted festive hampers featuring royal brass barnies with pure A2 cow ghee sweets & roasted dry fruits.',
    imageUrl:
      'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=600&auto=format&fit=crop&q=80',
    altText: 'Diwali and Festive Gifting Hampers with Royal Brass Keepsakes',
    highlights: ['Brass Keepsake Barnie', 'Pure Ghee Sweets', 'Gift Packaging'],
  },
];

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

  // Map dynamic collections to our curated 3 items in exact requested order
  const displayCollections: CollectionItemData[] = React.useMemo(() => {
    if (!collections || collections.length === 0) {
      return DEFAULT_COLLECTIONS_META;
    }

    // Match by handle or fallback to metadata
    const orderHandles = ['best-sellers', 'grandmas-specials', 'diwali-gifting'];
    return orderHandles.map((handle) => {
      const live = collections.find((c) => c.handle === handle);
      const meta = DEFAULT_COLLECTIONS_META.find((m) => m.handle === handle)!;

      if (!live) return meta;

      return {
        ...meta,
        title: live.title || meta.title,
        tagline: live.description || meta.tagline,
        imageUrl: live.image?.url || meta.imageUrl,
        altText: live.image?.altText || meta.altText,
      };
    });
  }, [collections]);

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
          'text-heritage-charcoal hover:text-heritage-maroon focus-visible:outline-heritage-maroon inline-flex items-center gap-1.5 rounded-md px-1 py-2 font-medium transition-colors focus-visible:outline-2',
          isOpen && 'text-heritage-maroon font-semibold',
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
          className="animate-in fade-in-0 zoom-in-95 absolute top-full left-1/2 -translate-x-1/2 z-50 w-[940px] max-w-[calc(100vw-2.5rem)] pt-2 duration-150"
        >
          <div className="border-heritage-border bg-heritage-cream dark:bg-[#1c1815] dark:border-neutral-800 rounded-2xl border p-6 shadow-2xl backdrop-blur-md">
            {/* Top Micro-Header */}
            <div className="border-heritage-border/70 mb-5 flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="text-heritage-saffron h-4 w-4" />
                <span className="text-heritage-charcoal dark:text-neutral-200 font-serif text-sm font-bold tracking-wide">
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

            {/* 3 Columns Grid: Best Seller Combo, Grand Maa, Diwali and Fest */}
            <div className="grid grid-cols-3 gap-6">
              {displayCollections.map((coll, idx) => (
                <div
                  key={coll.handle}
                  className={cn(
                    'flex flex-col justify-between space-y-4',
                    idx > 0 &&
                      'relative before:absolute before:-left-3 before:top-1 before:bottom-1 before:w-px before:bg-heritage-border/70 dark:before:bg-neutral-800',
                  )}
                >
                  <Link
                    href={`/collections/${coll.handle}`}
                    onClick={handleClose}
                    className="group/card block space-y-3"
                  >
                    {/* Featured Image with Zoom & Badge */}
                    <div className="border-heritage-border/80 bg-heritage-cream-dark relative aspect-16/10 w-full overflow-hidden rounded-xl border shadow-2xs">
                      <Image
                        src={coll.imageUrl}
                        alt={coll.altText}
                        fill
                        sizes="(max-width: 1024px) 100vw, 300px"
                        className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 transition-opacity group-hover/card:opacity-60" />

                      {/* Badge in top right corner */}
                      <span className="bg-heritage-maroon/90 text-white shadow-2xs absolute top-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-bold backdrop-blur-xs">
                        {coll.badge}
                      </span>

                      {/* Subtitle tag at bottom left */}
                      <span className="absolute bottom-2 left-2 text-[11px] font-medium text-white/90 drop-shadow-sm">
                        {coll.subtitle}
                      </span>
                    </div>

                    {/* Titles & Tagline */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-heritage-charcoal group-hover/card:text-heritage-maroon dark:text-neutral-100 font-serif text-base font-bold transition-colors">
                          {coll.title}
                        </h3>
                        <ArrowRight className="text-heritage-muted group-hover/card:text-heritage-maroon h-3.5 w-3.5 transition-transform group-hover/card:translate-x-1" />
                      </div>
                      <p className="text-heritage-muted dark:text-neutral-400 line-clamp-2 text-xs leading-relaxed">
                        {coll.tagline}
                      </p>
                    </div>

                    {/* Highlight Pills */}
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {coll.highlights.map((highlight) => (
                        <span
                          key={highlight}
                          className="bg-heritage-cream-dark/90 text-heritage-charcoal dark:bg-neutral-800 dark:text-neutral-300 border-heritage-border/50 rounded-md border px-1.5 py-0.5 text-[10px] font-medium"
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
            <div className="border-heritage-border/70 bg-heritage-cream-dark/40 dark:bg-neutral-900/60 mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3">
              <div className="flex items-center gap-2">
                <Gift className="text-heritage-saffron h-4 w-4 shrink-0" />
                <span className="text-heritage-charcoal dark:text-neutral-300 text-xs">
                  <strong className="font-semibold text-heritage-maroon">
                    Custom Gifting:
                  </strong>{' '}
                  Artisanal brass barnies, hand-carved gift boxes & personalized cards.
                </span>
              </div>
              <Link
                href="/policies/contact"
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
