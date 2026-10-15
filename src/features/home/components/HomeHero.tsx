import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SITE_CONFIG } from '@/content/site';

export interface HomeHeroProps {
  /** Main call to action, e.g. the pickles category. */
  primaryHref?: string;
  primaryLabel?: string;
}

export function HomeHero({
  primaryHref = '/categories',
  primaryLabel = 'Explore Handcrafted Achar',
}: HomeHeroProps): React.JSX.Element {
  return (
    <section className="from-heritage-cream via-heritage-cream to-heritage-cream-dark/40 relative overflow-hidden bg-gradient-to-b pt-10 pb-16 sm:pt-16 sm:pb-24">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Headline, Copy & CTAs */}
          <div className="space-y-6 lg:col-span-7">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="vegetarian" className="gap-1.5 px-3 py-1 text-xs">
                {SITE_CONFIG.ui.vegetarianBadge}
              </Badge>
              <span className="text-heritage-saffron-dark text-xs font-semibold tracking-widest uppercase">
                Ancestral Family Recipes
              </span>
            </div>

            <h1 className="text-heritage-maroon font-serif text-4xl leading-[1.12] font-extrabold tracking-tight sm:text-5xl lg:text-[3.5rem]">
              Authentic Indian Flavours, Crafted with Purity &amp; Heritage
            </h1>

            <p className="text-heritage-muted max-w-xl text-base leading-relaxed sm:text-lg">
              Handcrafted traditional Indian pickles (achar), pure desi ghee sweets
              (mithai), and slow-roasted foxnuts (makhana) — prepared using time-honoured
              ancestral recipes, cold-pressed oils, and zero artificial preservatives.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href={primaryHref}>
                <Button
                  size="lg"
                  className="bg-heritage-maroon hover:bg-heritage-maroon-dark rounded-full px-7 py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg"
                >
                  <span>{primaryLabel}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/categories">
                <Button
                  variant="secondary"
                  size="lg"
                  className="border-heritage-border hover:bg-heritage-cream-dark text-heritage-charcoal rounded-full border bg-white px-7 py-3 text-sm font-medium transition-colors"
                >
                  <span>Shop all</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Product Composition with Floating Calligraphy Badge */}
          <div className="relative flex justify-center lg:col-span-5">
            {/* Ambient Background Warm Glow */}
            <div
              className="bg-heritage-gold/20 absolute -inset-4 rounded-full blur-3xl"
              aria-hidden="true"
            />

            {/* Main Focal Composition Card */}
            <div className="border-heritage-border/80 bg-heritage-cream relative w-full max-w-md overflow-hidden rounded-3xl border shadow-xl transition-transform hover:scale-[1.01]">
              <div className="relative aspect-4/3 w-full sm:aspect-square">
                <Image
                  src="/images/home/hero-barnie.jpg"
                  alt="Traditional handcrafted Indian mango achar in authentic ceramic barnie jar with fresh green mangoes and spices"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 480px"
                  className="object-cover object-center"
                />
              </div>

              {/* Floating Calligraphic Badge: "Desi Achar. Real Taste." */}
              <div className="absolute top-4 right-4 z-10 rounded-2xl bg-black/60 px-4 py-2.5 backdrop-blur-md">
                <p className="font-serif text-sm font-bold tracking-wide text-amber-200 italic sm:text-base">
                  Desi Achar.
                </p>
                <p className="font-serif text-xs font-semibold tracking-wider text-white">
                  Real Taste.
                </p>
              </div>

              {/* Subtle Bottom Caption Bar */}
              <div className="border-heritage-border/60 bg-heritage-cream/90 flex items-center justify-between border-t px-4 py-2.5 text-xs">
                <span className="text-heritage-charcoal font-medium">
                  Sun-Cured In Earthen Martabans
                </span>
                <span className="text-heritage-maroon font-bold">Zero Chemicals</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
