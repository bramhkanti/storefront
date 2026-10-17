'use client';

import * as React from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Share2 } from 'lucide-react';

import type { Product, ProductImage } from '@/lib/api/contracts/domain';
import { WishlistButton } from './WishlistButton';
import { useToast } from '@/lib/store';
import { cn } from '@/lib/utils/cn';

export interface ProductGalleryProps {
  images: ProductImage[];
  title: string;
  product?: Product | undefined;
  className?: string | undefined;
}

/**
 * Responsive product gallery.
 * Desktop: main image, thumbnails, and arrow navigation.
 * Mobile: swipeable images, pagination dots, and navigation controls.
 */
export function ProductGallery({
  images,
  title,
  product,
  className,
}: ProductGalleryProps): React.JSX.Element {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const { addToast } = useToast();

  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const touchStartX = React.useRef<number | null>(null);

  const count = images.length;
  const selectedImage = images[selectedIndex] ?? images[0];

  const goTo = React.useCallback(
    (nextIndex: number) => {
      if (count === 0) return;

      const normalizedIndex = (nextIndex + count) % count;

      setSelectedIndex(normalizedIndex);

      const track = trackRef.current;
      if (track) {
        track.scrollTo({
          left: normalizedIndex * track.clientWidth,
          behavior: 'smooth',
        });
      }
    },
    [count],
  );

  // Keep the active image and thumbnails synchronized when the user swipes.
  const handleScroll = React.useCallback(() => {
    const track = trackRef.current;

    if (!track || track.clientWidth === 0 || count === 0) {
      return;
    }

    const nextIndex = Math.round(track.scrollLeft / track.clientWidth);

    setSelectedIndex((currentIndex) =>
      currentIndex === nextIndex ? currentIndex : nextIndex,
    );
  }, [count]);

  const handleShare = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const url = window.location.href;

    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({
          title,
          text: `Check out ${title} from Bramhkanti Heritage Foods`,
          url,
        });
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);

        addToast({
          type: 'success',
          message: 'Product link copied to your clipboard!',
        });
        return;
      }

      addToast({
        type: 'info',
        message: 'Sharing is not available in this browser.',
      });
    } catch {
      // A dismissed native share dialog is not an error.
    }
  };

  const handlePrevious = (event?: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    event?.stopPropagation();
    goTo(selectedIndex - 1);
  };

  const handleNext = (event?: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    event?.stopPropagation();
    goTo(selectedIndex + 1);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (count < 2) return;

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goTo(selectedIndex + 1);
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(selectedIndex - 1);
    }
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const startX = touchStartX.current;
    const endX = event.changedTouches[0]?.clientX;

    touchStartX.current = null;

    if (startX === null || endX === undefined || count < 2) {
      return;
    }

    const distance = endX - startX;

    if (Math.abs(distance) < 40) return;

    if (distance < 0) {
      goTo(selectedIndex + 1);
    } else {
      goTo(selectedIndex - 1);
    }
  };

  return (
    <div className={cn('flex w-full flex-col gap-3.5', className)}>
      {/* Main image gallery */}
      <div
        className="border-line bg-surface relative w-full overflow-hidden rounded-2xl border shadow-xs sm:rounded-3xl"
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        tabIndex={count > 1 ? 0 : undefined}
        role="region"
        aria-roledescription="carousel"
        aria-label={`${title} images`}
      >
        <div
          ref={trackRef}
          onScroll={handleScroll}
          className={cn(
            'flex aspect-square w-full snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto overscroll-x-contain [&::-webkit-scrollbar]:hidden',
            count <= 1 && 'overflow-hidden',
          )}
        >
          {count > 0 ? (
            images.map((image, index) => (
              <div
                key={image.id || `${image.url}-${index}`}
                className="bg-surface-soft relative aspect-square w-full shrink-0 snap-center"
                aria-hidden={selectedIndex !== index}
              >
                <Image
                  src={image.url}
                  alt={image.altText || `${title} - image ${index + 1}`}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center transition-transform duration-300"
                />
              </div>
            ))
          ) : (
            <div className="bg-surface-soft text-fg-muted flex aspect-square w-full items-center justify-center px-6 text-center text-sm">
              {title}
            </div>
          )}
        </div>

        {/* Share and wishlist controls */}
        <div className="pointer-events-auto absolute top-3 right-3 z-20 flex items-center gap-2 sm:top-4 sm:right-4">
          <button
            type="button"
            onClick={handleShare}
            aria-label={`Share ${title}`}
            title="Share product"
            className="border-line bg-surface text-fg hover:bg-surface-soft focus-visible:outline-primary flex h-9 w-9 items-center justify-center rounded-full border shadow-xs transition-colors focus-visible:outline-2 active:scale-95"
          >
            <Share2 className="h-4 w-4" />
          </button>

          {product && (
            <WishlistButton
              product={product}
              size="md"
              className="border-line bg-surface text-fg h-9 w-9 border shadow-xs"
            />
          )}
        </div>

        {/* Previous and next arrows */}
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevious}
              aria-label="Previous image"
              className="border-line bg-surface/90 text-fg hover:bg-surface focus-visible:outline-primary absolute top-1/2 left-3 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border shadow-xs backdrop-blur transition-colors focus-visible:outline-2 sm:flex"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next image"
              className="border-line bg-surface/90 text-fg hover:bg-surface focus-visible:outline-primary absolute top-1/2 right-3 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border shadow-xs backdrop-blur transition-colors focus-visible:outline-2 sm:flex"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Mobile pagination dots */}
        {count > 1 && (
          <div className="pointer-events-none absolute bottom-3 left-3 z-10 flex items-center gap-1.5 sm:hidden">
            {images.map((image, index) => (
              <span
                key={image.id || `${image.url}-dot-${index}`}
                className={cn(
                  'h-1.5 rounded-full shadow-xs transition-all duration-200',
                  selectedIndex === index
                    ? 'w-5 bg-white ring-1 ring-black/20'
                    : 'w-1.5 bg-white/70',
                )}
              />
            ))}
          </div>
        )}

        {/* Mobile arrow controls */}
        {count > 1 && (
          <div className="pointer-events-auto absolute right-3 bottom-2.5 z-20 flex items-center gap-2 sm:hidden">
            <button
              type="button"
              onClick={handlePrevious}
              aria-label="Previous image"
              className="border-line bg-surface/90 text-fg hover:bg-surface focus-visible:outline-primary flex h-9 w-9 items-center justify-center rounded-full border shadow-xs backdrop-blur transition-colors focus-visible:outline-2 active:scale-95"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next image"
              className="border-line bg-surface/90 text-fg hover:bg-surface focus-visible:outline-primary flex h-9 w-9 items-center justify-center rounded-full border shadow-xs backdrop-blur transition-colors focus-visible:outline-2 active:scale-95"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Current image counter */}
        {count > 1 && (
          <span className="absolute top-14 right-3 z-10 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white tabular-nums backdrop-blur sm:hidden">
            {selectedIndex + 1} / {count}
          </span>
        )}
      </div>

      {/* Desktop and tablet thumbnail strip */}
      {count > 1 && (
        <div
          className="hidden w-full items-center justify-center gap-3 overflow-x-auto py-1 sm:flex"
          role="tablist"
          aria-label="Choose product image"
        >
          {images.map((image, index) => (
            <button
              key={image.id || `${image.url}-thumbnail-${index}`}
              type="button"
              role="tab"
              aria-selected={selectedIndex === index}
              aria-label={`Show image ${index + 1} of ${count}`}
              onClick={() => goTo(index)}
              className={cn(
                'bg-surface relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 p-0.5 shadow-xs transition-all lg:h-[72px] lg:w-[72px]',
                selectedIndex === index
                  ? 'border-primary ring-primary/20 scale-105 ring-2'
                  : 'border-line hover:border-line-strong opacity-75 hover:opacity-100',
              )}
            >
              <Image
                src={image.url}
                alt={image.altText || `${title} thumbnail ${index + 1}`}
                fill
                sizes="72px"
                className="rounded-lg object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
