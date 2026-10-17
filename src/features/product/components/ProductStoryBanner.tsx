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
          'border-line bg-surface-soft grid w-full grid-cols-1 items-center overflow-hidden rounded-2xl border lg:grid-cols-12',
          className,
        )}
      >
        {/* Left Column: Story Copy & Video Trigger */}
        <div className="space-y-4 p-6 sm:p-8 lg:col-span-5 lg:p-10">
          <h2 className="text-fg font-serif text-2xl leading-tight font-bold sm:text-3xl">
            {title}
          </h2>
          <p className="text-fg-muted max-w-md text-sm leading-relaxed">{description}</p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIsPlayingVideo(true)}
              className="bg-primary hover:bg-primary-hover text-on-primary inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 text-xs font-semibold shadow-sm transition-colors sm:text-sm"
            >
              <div className="bg-on-primary/20 flex h-5 w-5 items-center justify-center rounded-full">
                <Play className="fill-on-primary text-on-primary ml-0.5 h-3 w-3" />
              </div>
              <span>Watch Our Story</span>
            </button>
          </div>
        </div>

        {/* Right Column: High Quality Artisanal Imagery */}
        <div className="relative h-64 w-full sm:h-80 lg:col-span-7 lg:h-96">
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
          className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm duration-200"
          onClick={() => setIsPlayingVideo(false)}
        >
          <div
            className="relative aspect-video w-full max-w-3xl overflow-hidden rounded-2xl bg-black shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsPlayingVideo(false)}
              className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
              aria-label="Close video"
            >
              <X className="h-5 w-5" />
            </button>
            <iframe
              src={`${videoUrl}?autoplay=1`}
              title="Bramhkanti Heritage Story"
              className="h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}
