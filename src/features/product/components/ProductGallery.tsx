'use client';

import * as React from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ProductImage } from '@/lib/api/contracts/domain';
import { cn } from '@/lib/utils/cn';

export interface ProductGalleryProps {
  images: ProductImage[];
  title: string;
  className?: string;
}

/**
 * Desktop: vertical thumbnails beside the main image, arrow buttons and keys.
 * Mobile: swipeable carousel (CSS scroll-snap) with dots.
 */
export function ProductGallery({ images, title, className }: ProductGalleryProps) {
  const slides = images.length > 0 ? images : null;
  const [index, setIndex] = React.useState(0);
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const count = slides?.length ?? 0;

  const goTo = (next: number) => {
    const clamped = (next + count) % count;
    setIndex(clamped);
    const track = trackRef.current;
    if (track) track.scrollTo({ left: clamped * track.clientWidth, behavior: 'smooth' });
  };

  // Keep the active dot in sync while the shopper swipes.
  const onScroll = () => {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    const next = Math.round(track.scrollLeft / track.clientWidth);
    if (next !== index) setIndex(next);
  };

  if (!slides) {
    return (
      <div
        className={cn(
          'text-heritage-muted flex aspect-square w-full items-center justify-center rounded-3xl bg-neutral-100 text-sm dark:bg-neutral-800',
          className,
        )}
      >
        {title}
      </div>
    );
  }

  return (
    <div className={cn('flex gap-4', className)}>
      {count > 1 && (
        <div
          className="hidden w-20 shrink-0 flex-col gap-3 lg:flex"
          role="tablist"
          aria-label="Product images"
        >
          {slides.map((img, i) => (
            <button
              key={img.id || `${img.url}-${i}`}
              type="button"
              role="tab"
              aria-selected={index === i}
              aria-label={`Show image ${i + 1} of ${count}`}
              onClick={() => goTo(i)}
              className={cn(
                'relative aspect-square w-full overflow-hidden rounded-xl bg-neutral-100 ring-offset-2 transition-all dark:bg-neutral-800 dark:ring-offset-[#12100e]',
                index === i
                  ? 'ring-2 ring-neutral-900 dark:ring-white'
                  : 'opacity-70 hover:opacity-100',
              )}
            >
              <Image src={img.url} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <div
        className="group relative min-w-0 flex-1"
        role="region"
        aria-roledescription="carousel"
        aria-label={`${title} images`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (count < 2) return;
          if (e.key === 'ArrowRight') goTo(index + 1);
          if (e.key === 'ArrowLeft') goTo(index - 1);
        }}
      >
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="flex aspect-square snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto overscroll-x-contain rounded-3xl bg-neutral-100 dark:bg-neutral-800 [&::-webkit-scrollbar]:hidden"
        >
          {slides.map((img, i) => (
            <div
              key={img.id || `${img.url}-${i}`}
              className="relative h-full w-full shrink-0 snap-center"
              aria-hidden={index !== i}
            >
              <Image
                src={img.url}
                alt={img.altText || `${title}, image ${i + 1}`}
                fill
                priority={i === 0}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Previous image"
              className="absolute top-1/2 left-3 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-900 opacity-0 shadow-md backdrop-blur transition-opacity group-hover:opacity-100 focus-visible:opacity-100 sm:flex"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Next image"
              className="absolute top-1/2 right-3 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-900 opacity-0 shadow-md backdrop-blur transition-opacity group-hover:opacity-100 focus-visible:opacity-100 sm:flex"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute inset-x-0 bottom-4 flex justify-center gap-1.5 lg:hidden">
              {slides.map((img, i) => (
                <button
                  key={img.id || `${img.url}-${i}`}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Show image ${i + 1} of ${count}`}
                  className={cn(
                    'h-1.5 rounded-full bg-white shadow transition-all',
                    index === i ? 'w-5' : 'w-1.5 opacity-60',
                  )}
                />
              ))}
            </div>
            <span className="absolute top-4 right-4 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white tabular-nums backdrop-blur lg:hidden">
              {index + 1} / {count}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
