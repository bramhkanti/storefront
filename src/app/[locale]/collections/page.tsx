import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    collections.map((c) => ({
      name: c.title,
      href: `/collections/${c.handle}`,
      description: c.description,
    })),
    {
      name: 'Bramhkanti Curated Heritage Collections & Gift Hampers',
      description:
        'Explore curated gift hampers, festive boxes, and heirloom 1952 recipe collections combining authentic pickles, sweets, and roasted makhana.',
    },
  );

  return (
    <div className="space-y-10 py-8 sm:space-y-14 sm:py-12 bg-page text-fg">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <Container className="space-y-10 sm:space-y-12">
        {/* Breadcrumb Trail */}
        <Breadcrumbs items={[{ name: 'Collections' }]} />

        {/* Collections Hub Hero */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="vegetarian">100% Pure Veg</Badge>
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 border border-brand-600/30 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
              Artisanal Presentations
            </span>
            <span className="text-fg-muted text-xs font-medium">
              Handcrafted in Varanasi
            </span>
          </div>

          <h1 className="text-fg font-sans text-3xl font-extrabold tracking-tight sm:text-5xl">
            Curated Heritage Collections & Gift Hampers
          </h1>

          <p className="text-fg-muted max-w-4xl space-y-3 text-sm leading-relaxed sm:text-base">
            Thoughtfully assembled gift hampers and heirloom sets combining our
            authentic sun-cured pickles, pure cow ghee sweets, and slow-roasted
            makhana. Ideal for auspicious family festivals, celebratory thalis,
            and executive corporate gifting.
          </p>
        </div>

        {/* Gifting Standards Bar */}
        <div
          aria-label="Hamper Gifting Standards"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          {GIFTING_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-line bg-surface p-4 flex items-start gap-3.5 transition-colors hover:border-line-strong"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-fg leading-tight">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-fg-muted mt-1 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Collections Catalog Grid */}
        <section
          aria-labelledby="all-collections-heading"
          className="space-y-4 pt-4 border-t border-line"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1 border-b border-line pb-3">
            <div>
              <h2
                id="all-collections-heading"
                className="text-fg font-sans text-xl sm:text-2xl font-bold tracking-tight"
              >
                Signature Curated Presentations
              </h2>
              <p className="text-fg-muted text-xs sm:text-sm mt-0.5">
                Handpicked gift hampers prepared in small batches following
                time-honored recipes
              </p>
            </div>
            <span className="text-fg-muted bg-surface-soft border border-line rounded-full px-3 py-1 text-xs font-semibold self-start sm:self-auto">
              {collections.length}{' '}
              {collections.length === 1 ? 'Hamper' : 'Hampers'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {collections.map((coll) => {
              const imageUrl =
                coll.image?.url ||
                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';
              const altText = coll.image?.altText || coll.title;

              return (
                <Link
                  key={coll.id}
                  href={`/collections/${coll.handle}`}
                  className="group border border-line hover:border-brand-600 bg-surface flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xs"
                >
                  {/* Top Image Banner */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-soft">
                    <Image
                      src={imageUrl}
                      alt={altText}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-fg shadow-xs backdrop-blur-xs">
                      <Sparkles className="h-3 w-3 text-brand-600" />
                      <span>Curated Hamper</span>
                    </div>
                  </div>

                  {/* Bottom Content Area */}
                  <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                    <div className="space-y-1.5">
                      <h3 className="text-fg group-hover:text-primary font-sans text-lg sm:text-xl font-bold transition-colors">
                        {coll.title}
                      </h3>
                      <p className="text-fg-muted line-clamp-3 text-xs sm:text-sm leading-relaxed">
                        {coll.description}
                      </p>
                    </div>

                    <div className="text-primary flex items-center justify-between gap-1 text-xs font-semibold pt-3 border-t border-line/60">
                      <span>Explore Hamper Selection</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Corporate & Bulk Gifting Assistance Card */}
        <section
          aria-labelledby="bulk-gifting-heading"
          className="rounded-3xl border border-line bg-surface p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-700 tracking-wider uppercase">
              <ShieldCheck className="h-4 w-4" />
              <span>Corporate & Festive Gifting Concierge</span>
            </div>
            <h2
              id="bulk-gifting-heading"
              className="text-xl sm:text-2xl font-bold font-sans text-fg tracking-tight"
            >
              Need Custom Corporate Hampers or Multi-Address Dispatch?
            </h2>
            <p className="text-xs sm:text-sm text-fg-muted leading-relaxed">
              We curate custom branded corporate gift boxes for Diwali, New
              Year, and milestone celebrations with personalized handwritten
              notes and door-to-door pan-India logistics.
            </p>
          </div>
          <Link
            href="/contact"
            className="rounded-xl bg-primary px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-primary-hover transition-colors whitespace-nowrap self-stretch md:self-auto text-center"
          >
            Contact Gifting Concierge
          </Link>
        </section>
      </Container>
    </div>
  );
}
