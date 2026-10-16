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

export function ProductGallery({
  images,
  title,
  product,
  className,
}: ProductGalleryProps): React.JSX.Element {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const { addToast } = useToast();

  const selectedImage = images[selectedIndex] ?? images[0];
  const currentImageUrl = selectedImage?.url ?? '/images/product-placeholder.jpg';

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Check out ${title} from Bramhkanti Heritage Foods`,
          url,
        });
      } catch {
        // User cancelled share
      }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        addToast({
          type: 'success',
          message: 'Product link copied to your clipboard!',
        });
      } catch {
        addToast({
          type: 'info',
          message: 'Could not copy link.',
        });
      }
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className={cn('w-full flex flex-col gap-3.5', className)}>
      {/* Hero Product Image Box */}
      <div className="relative w-full h-[360px] sm:h-[420px] lg:h-[480px] overflow-hidden rounded-2xl sm:rounded-3xl border border-line bg-surface shadow-xs">
        <Image
          src={currentImageUrl}
          alt={selectedImage?.altText || `${title} - view ${selectedIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          className="object-cover object-center transition-all duration-300"
        />

        {/* Top-Right Action Cluster inside Image Container: Share & Wishlist */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-2 pointer-events-auto">
          {/* Share Button */}
          <button
            type="button"
            onClick={handleShare}
            aria-label={`Share ${title}`}
            title="Share Product"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-fg shadow-xs transition-all hover:bg-surface-soft active:scale-90 focus-visible:outline-2 focus-visible:outline-primary"
          >
            <Share2 className="h-4 w-4" />
          </button>

          {/* Wishlist Button */}
          {product && (
            <WishlistButton
              product={product}
              size="md"
              className="h-9 w-9 bg-surface text-fg shadow-xs border border-line"
            />
          )}
        </div>

        {/* Circular Pagination Dots at bottom left (Mobile only) */}
        {images.length > 1 && (
          <div className="absolute bottom-3.5 left-3 z-10 flex items-center gap-1.5 pointer-events-none sm:hidden">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-200 shadow-xs',
                  selectedIndex === idx ? 'w-5 bg-white ring-1 ring-black/20' : 'w-1.5 bg-white/70',
                )}
              />
            ))}
          </div>
        )}

        {/* Mobile Navigation Controls: < and > at bottom right corner */}
        {images.length > 1 && (
          <div className="absolute bottom-2.5 right-3 z-20 flex items-center gap-2 sm:hidden pointer-events-auto">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous image"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface/90 backdrop-blur-xs text-fg shadow-xs transition-all hover:bg-surface active:scale-90 focus-visible:outline-2 focus-visible:outline-primary"
            >
              <ChevronLeft className="h-5 w-5 stroke-[2.5] -ml-0.5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next image"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface/90 backdrop-blur-xs text-fg shadow-xs transition-all hover:bg-surface active:scale-90 focus-visible:outline-2 focus-visible:outline-primary"
            >
              <ChevronRight className="h-5 w-5 stroke-[2.5] ml-0.5" />
            </button>
          </div>
        )}
      </div>

      {/* Thumbnails strip - OUT OF THE BOX (placed directly below the main image box) */}
      {images.length > 1 && (
        <div className="hidden sm:flex items-center justify-center gap-3 w-full">
          {images.map((img, idx) => (
            <button
              key={img.id ?? `${img.url}-${idx}`}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={cn(
                'relative h-16 w-16 lg:h-18 lg:w-18 shrink-0 overflow-hidden rounded-2xl border-2 transition-all p-0.5 bg-surface shadow-xs',
                selectedIndex === idx
                  ? 'border-primary ring-2 ring-primary/20 scale-105'
                  : 'border-line hover:border-line-strong opacity-75 hover:opacity-100',
              )}
              aria-label={`View image ${idx + 1} of ${title}`}
            >
              <Image
                src={img.url}
                alt={img.altText || ''}
                fill
                sizes="72px"
                className="rounded-xl object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
