'use client';

import * as React from 'react';
import { Play, X } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils/cn';

export interface ProductStoryBannerProps {
  title?: string | undefined;
  description?: string | undefined;
  videoUrl?: string | undefined;
  imageUrl?: string | undefined;
  className?: string | undefined;
}

export function ProductStoryBanner({
  title = 'The Perfect Blend of Tradition & Taste',
  description = 'Experience the authentic taste of hand-crafted pickles, made with love and the finest ingredients.',
  videoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  imageUrl = '/images/home/category-pickle.jpg',
  className,
}: ProductStoryBannerProps): React.JSX.Element {
  const [isPlayingVideo, setIsPlayingVideo] = React.useState(false);

  return (
    <>
      <div
        className={cn(
          'w-full overflow-hidden rounded-2xl border border-line bg-surface-soft grid grid-cols-1 lg:grid-cols-12 items-center',
          className,
        )}
      >
        {/* Left Column: Story Copy & Video Trigger */}
        <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 space-y-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-fg leading-tight">
            {title}
          </h2>
          <p className="text-sm text-fg-muted leading-relaxed max-w-md">
            {description}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIsPlayingVideo(true)}
              className="inline-flex items-center gap-2.5 rounded-full bg-primary hover:bg-primary-hover text-on-primary px-5 py-2.5 text-xs sm:text-sm font-semibold transition-colors shadow-sm"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-on-primary/20">
                <Play className="h-3 w-3 fill-on-primary text-on-primary ml-0.5" />
              </div>
              <span>Watch Our Story</span>
            </button>
          </div>
        </div>

        {/* Right Column: High Quality Artisanal Imagery */}
        <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-96 w-full">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
            priority={false}
          />
        </div>
      </div>

      {/* Video Modal */}
      {isPlayingVideo && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setIsPlayingVideo(false)}
        >
          <div
            className="relative max-w-3xl w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsPlayingVideo(false)}
              className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              aria-label="Close video"
            >
              <X className="h-5 w-5" />
            </button>
            <iframe
              src={`${videoUrl}?autoplay=1`}
              title="Bramhkanti Heritage Story"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}
