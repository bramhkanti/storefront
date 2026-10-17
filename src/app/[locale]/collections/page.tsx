import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Gift,
  Heart,
  PackageCheck,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';

import { listCollections } from '@/features/collection/queries';

import { buildItemListJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Curated Heritage Collections & Gift Hampers | Bramhkanti',
  description:
    'Discover festive gifting hampers, customer favorites, and authentic 1952 family recipes curated across handcrafted pickles, pure ghee sweets, and roasted makhana.',
  canonicalPath: '/collections',
});

const GIFTING_PILLARS = [
  {
    icon: Gift,
    title: 'Royal Keepsake Presentation',
    description:
      'Artisanal presentation boxes with brass accents and food-safe glazed ceramic barnies.',
  },
  {
    icon: Sparkles,
    title: 'Pure Desi Ghee & Sun-Cured',
    description:
      '100% pure native cow milk ghee and authentic sunlight-aged Banarasi pickles.',
  },
  {
    icon: Heart,
    title: 'Personalized Greeting Card',
    description:
      'Complimentary handwritten gift message card placed inside every hamper.',
  },
  {
    icon: PackageCheck,
    title: 'Pan-India Express Transit',
    description:
      'Leak-proof 5-layer transit cushioning with guaranteed intact doorstep delivery.',
  },
];

export default async function CollectionsIndexPage(): Promise<ReactNode> {
  const collections = await listCollections();

  const itemListJsonLd = buildItemListJsonLd(
    collections.map((collection) => ({
      name: collection.title,
      href: `/collections/${collection.handle}`,
      description: collection.description,
    })),
    {
      name: 'Bramhkanti Curated Heritage Collections & Gift Hampers',
      description:
        'Explore curated gift hampers, festive boxes, and heirloom 1952 recipe collections combining authentic pickles, sweets, and roasted makhana.',
    },
  );

  return (
    <div className="bg-page text-fg space-y-10 py-8 sm:space-y-14 sm:py-12">
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListJsonLd),
        }}
      />

      <Container className="space-y-10 sm:space-y-12">
        {/* Breadcrumb trail */}
        <Breadcrumbs items={[{ name: 'Collections' }]} />

        {/* Collections hub hero */}
        <section aria-labelledby="collections-page-heading" className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="vegetarian">100% Pure Veg</Badge>

            <span className="border-brand-600/30 bg-brand-50 text-brand-700 inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold">
              Artisanal Presentations
            </span>

            <span className="text-fg-muted text-xs font-medium">
              Handcrafted in Varanasi
            </span>
          </div>

          <h1
            id="collections-page-heading"
            className="text-fg font-sans text-3xl font-extrabold tracking-tight sm:text-5xl"
          >
            Curated Heritage Collections & Gift Hampers
          </h1>

          <p className="text-fg-muted max-w-4xl text-sm leading-relaxed sm:text-base">
            Thoughtfully assembled gift hampers and heirloom sets combining our authentic
            sun-cured pickles, pure cow ghee sweets, and slow-roasted makhana. Ideal for
            auspicious family festivals, celebratory thalis, and executive corporate
            gifting.
          </p>
        </section>

        {/* Gifting standards */}
        <section
          aria-label="Hamper Gifting Standards"
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4"
        >
          {GIFTING_PILLARS.map((pillar) => {
            const Icon = pillar.icon;

            return (
              <div
                key={pillar.title}
                className="border-line bg-surface hover:border-line-strong flex items-start gap-3.5 rounded-2xl border p-4 transition-colors"
              >
                <div className="bg-brand-50 text-brand-700 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
                  <Icon className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <h2 className="text-fg text-sm leading-tight font-bold">
                    {pillar.title}
                  </h2>

                  <p className="text-fg-muted mt-1 text-xs leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </section>

        {/* Collections catalog */}
        <section
          aria-labelledby="all-collections-heading"
          className="border-line space-y-4 border-t pt-4"
        >
          <div className="border-line flex flex-col justify-between gap-1 border-b pb-3 sm:flex-row sm:items-end">
            <div>
              <h2
                id="all-collections-heading"
                className="text-fg font-sans text-xl font-bold tracking-tight sm:text-2xl"
              >
                Signature Curated Presentations
              </h2>

              <p className="text-fg-muted mt-0.5 text-xs sm:text-sm">
                Handpicked gift hampers prepared in small batches following time-honored
                recipes
              </p>
            </div>

            <span className="border-line bg-surface-soft text-fg-muted self-start rounded-full border px-3 py-1 text-xs font-semibold sm:self-auto">
              {collections.length} {collections.length === 1 ? 'Hamper' : 'Hampers'}
            </span>
          </div>

          {collections.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {collections.map((collection) => {
                const imageUrl =
                  collection.image?.url ??
                  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';

                const altText = collection.image?.altText || collection.title;

                return (
                  <Link
                    key={collection.id}
                    href={`/collections/${collection.handle}`}
                    className="group border-line bg-surface hover:border-brand-600 flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-xs"
                  >
                    {/* Collection image */}
                    <div className="bg-surface-soft relative aspect-[16/10] w-full overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={altText}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      <div className="text-fg absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold shadow-xs backdrop-blur-xs">
                        <Sparkles className="text-brand-600 h-3 w-3" />
                        <span>Curated Hamper</span>
                      </div>

                      {collection.badge && (
                        <span className="bg-heritage-maroon absolute top-3 right-3 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white">
                          {collection.badge}
                        </span>
                      )}
                    </div>

                    {/* Collection details */}
                    <div className="flex flex-1 flex-col justify-between space-y-4 p-5">
                      <div className="space-y-1.5">
                        <h3 className="text-fg group-hover:text-primary font-sans text-lg font-bold transition-colors sm:text-xl">
                          {collection.title}
                        </h3>

                        {collection.description && (
                          <p className="text-fg-muted line-clamp-3 text-xs leading-relaxed sm:text-sm">
                            {collection.description}
                          </p>
                        )}
                      </div>

                      <div className="border-line/60 text-primary flex items-center justify-between gap-1 border-t pt-3 text-xs font-semibold">
                        <span>Explore Hamper Selection</span>

                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="border-line bg-surface rounded-2xl border p-8 text-center">
              <p className="text-fg-muted text-sm">
                Our curated collections are being prepared. Please check back soon.
              </p>
            </div>
          )}
        </section>

        {/* Corporate and bulk gifting */}
        <section
          aria-labelledby="bulk-gifting-heading"
          className="border-line bg-surface flex flex-col items-start justify-between gap-6 rounded-3xl border p-6 sm:p-8 md:flex-row md:items-center"
        >
          <div className="max-w-2xl space-y-2">
            <div className="text-brand-700 flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
              <ShieldCheck className="h-4 w-4" />
              <span>Corporate & Festive Gifting Concierge</span>
            </div>

            <h2
              id="bulk-gifting-heading"
              className="text-fg font-sans text-xl font-bold tracking-tight sm:text-2xl"
            >
              Need Custom Corporate Hampers or Multi-Address Dispatch?
            </h2>

            <p className="text-fg-muted text-xs leading-relaxed sm:text-sm">
              We curate custom branded corporate gift boxes for Diwali, New Year, and
              milestone celebrations with personalized handwritten notes and door-to-door
              pan-India logistics.
            </p>
          </div>

          <Link
            href="/contact"
            className="bg-primary hover:bg-primary-hover self-stretch rounded-xl px-5 py-3 text-center text-xs font-bold whitespace-nowrap text-white shadow-xs transition-colors sm:text-sm md:self-auto"
          >
            Contact Gifting Concierge
          </Link>
        </section>
      </Container>
    </div>
  );
}
