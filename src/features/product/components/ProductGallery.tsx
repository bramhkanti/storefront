'use client';

import * as React from 'react';
import Image from 'next/image';
import type { ProductImage } from '@/lib/api/contracts/domain';
import { cn } from '@/lib/utils/cn';

export interface ProductGalleryProps {
  images: ProductImage[];
  title: string;
  className?: string;
}

export function ProductGallery({ images, title, className }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const selectedImage = images[selectedIndex] ?? images[0];
  const currentImageUrl = selectedImage?.url ?? '/images/product-placeholder.jpg';

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Primary Main Image Frame */}
      <div className="border-heritage-border bg-heritage-cream-dark/40 relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border p-8 shadow-xs">
        <Image
          src={currentImageUrl}
          alt={`${title} - view ${selectedIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          className="object-cover object-center transition-all duration-300"
        />
      </div>

      {/* Thumbnail Selector Strip */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={img.id ?? `${img.url}-${idx}`}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={cn(
                'bg-heritage-cream relative h-18 w-18 shrink-0 overflow-hidden rounded-lg border-2 p-1 transition-all',
                selectedIndex === idx
                  ? 'border-heritage-maroon ring-heritage-maroon/20 ring-2'
                  : 'border-heritage-border hover:border-heritage-muted opacity-80 hover:opacity-100',
              )}
              aria-label={`View image ${idx + 1} of ${title}`}
            >
              <Image
                src={img.url}
                alt={img.altText || ''}
                fill
                sizes="72px"
                className="rounded-xs object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
