'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Pause,
  Play,
  ShieldCheck,
} from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { cn } from '@/lib/utils/cn';
import type { HeroSlide } from '../types';

const AUTOPLAY_MS = 6500;
const SWIPE_PX = 50;

export interface HomeHeroProps {
  slides: HeroSlide[];
}

/**
 * Full-width banner slider with the copy on the image. Slides come from the
 * brand slide plus every collection that has a banner in the admin.
 * Autoplay pauses on hover, focus, hidden tabs and reduced-motion.
 */
export function HomeHero({ slides }: HomeHeroProps): React.JSX.Element | null {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [hovering, setHovering] = React.useState(false);
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const touchStart = React.useRef<number | null>(null);
  const count = slides.length;

  React.useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  const running = count > 1 && !paused && !hovering && !reducedMotion;

  React.useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => {
      if (document.visibilityState === 'visible') setIndex((i) => (i + 1) % count);
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [running, index, count]);

  if (count === 0) return null;
  const go = (next: number) => setIndex((next + count) % count);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured"
      className="pt-4 sm:pt-6"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocusCapture={() => setHovering(true)}
      onBlurCapture={() => setHovering(false)}
    >
      <Container>
        <div
          className="relative isolate h-[min(78svh,620px)] min-h-[480px] overflow-hidden rounded-[28px] bg-neutral-900 text-white sm:min-h-[520px]"
          onTouchStart={(e) => {
            touchStart.current = e.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            const start = touchStart.current;
            const end = e.changedTouches[0]?.clientX;
            touchStart.current = null;
            if (start === null || end === undefined || count < 2) return;
            if (end - start > SWIPE_PX) go(index - 1);
            if (start - end > SWIPE_PX) go(index + 1);
          }}
        >
          {slides.map((slide, i) => {
            const active = i === index;
            const Heading = i === 0 ? 'h1' : 'h2';
            return (
              <div
                key={slide.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}: ${slide.title}`}
                aria-hidden={!active}
                inert={!active}
                className={cn(
                  'absolute inset-0 transition-opacity duration-700 ease-out',
                  active ? 'z-10 opacity-100' : 'z-0 opacity-0',
                )}
              >
                <picture>
                  {slide.mobileImageUrl && (
                    <source media="(max-width: 639px)" srcSet={slide.mobileImageUrl} />
                  )}
                  <Image
                    src={slide.imageUrl}
                    alt={slide.imageAlt}
                    fill
                    priority={i === 0}
                    sizes="(max-width: 1280px) 100vw, 1280px"
                    className={cn(
                      'object-cover transition-transform ease-out',
                      slide.imagePosition ?? 'object-center',
                      active && !reducedMotion
                        ? 'scale-105 duration-[7000ms]'
                        : 'scale-100 duration-700',
                    )}
                  />
                </picture>

                {/* Keeps the copy readable on any photo: bottom fade on phones, left fade on desktop. */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10 sm:bg-gradient-to-r sm:from-black/80 sm:via-black/45 sm:to-transparent" />

                <div className="relative flex h-full flex-col justify-end px-6 pt-10 pb-24 sm:justify-center sm:px-12 sm:pb-16 lg:px-16">
                  <div
                    className={cn(
                      'max-w-xl space-y-5 transition-all delay-150 duration-700',
                      active ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
                    )}
                  >
                    {slide.eyebrow && (
                      <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold tracking-[0.18em] uppercase ring-1 ring-white/25 backdrop-blur-md">
                        <span className="bg-heritage-gold h-1.5 w-1.5 rounded-full" />
                        {slide.eyebrow}
                      </p>
                    )}
                    <Heading className="text-4xl leading-[1.05] font-semibold tracking-tight text-balance drop-shadow-sm sm:text-5xl lg:text-6xl">
                      {slide.title}
                    </Heading>
                    {slide.description && (
                      <p className="max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">
                        {slide.description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <Link
                        href={slide.ctaHref}
                        className="group bg-heritage-maroon hover:bg-heritage-maroon-hover inline-flex h-12 items-center gap-2 rounded-full px-7 text-sm font-semibold text-white shadow-lg shadow-black/20 transition-colors"
                      >
                        {slide.ctaLabel}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                      {slide.secondaryHref && slide.secondaryLabel && (
                        <Link
                          href={slide.secondaryHref}
                          className="inline-flex h-12 items-center rounded-full bg-white/10 px-6 text-sm font-semibold text-white ring-1 ring-white/40 backdrop-blur-md transition-colors hover:bg-white hover:text-neutral-900"
                        >
                          {slide.secondaryLabel}
                        </Link>
                      )}
                    </div>
                    {slide.badges && slide.badges.length > 0 && (
                      <ul className="flex flex-wrap gap-x-5 gap-y-2 pt-2 text-sm text-white/80">
                        {slide.badges.map((badge, b) => {
                          const Icon = b === 0 ? Leaf : ShieldCheck;
                          return (
                            <li key={badge} className="flex items-center gap-1.5">
                              <Icon className="text-heritage-gold h-4 w-4" />
                              {badge}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {count > 1 && (
            <div className="absolute inset-x-6 bottom-6 z-20 flex items-center gap-4 sm:inset-x-12 lg:inset-x-16">
              {/* Progress segments double as slide pickers. */}
              <div className="flex flex-1 gap-2" role="tablist" aria-label="Choose slide">
                {slides.map((slide, i) => (
                  <button
                    key={slide.id}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Show slide ${i + 1}: ${slide.title}`}
                    onClick={() => go(i)}
                    className="group relative h-6 max-w-24 flex-1 py-2.5"
                  >
                    <span className="block h-1 overflow-hidden rounded-full bg-white/30">
                      <span
                        key={i === index ? `active-${index}-${running}` : 'idle'}
                        className={cn(
                          'block h-full rounded-full bg-white',
                          i < index && 'w-full',
                          i > index && 'w-0',
                          i === index && (running ? 'animate-hero-progress' : 'w-full'),
                        )}
                        style={
                          i === index && running
                            ? { animationDuration: `${AUTOPLAY_MS}ms` }
                            : undefined
                        }
                      />
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPaused((p) => !p)}
                  aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}
                  className="hidden h-10 w-10 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30 backdrop-blur-md transition-colors hover:bg-white/25 sm:flex"
                >
                  {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => go(index - 1)}
                  aria-label="Previous slide"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30 backdrop-blur-md transition-colors hover:bg-white hover:text-neutral-900"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => go(index + 1)}
                  aria-label="Next slide"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30 backdrop-blur-md transition-colors hover:bg-white hover:text-neutral-900"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
