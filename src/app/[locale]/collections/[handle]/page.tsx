import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, HelpCircle } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/Accordion';
import { CollectionCraftPillars } from '@/features/collection/components/CollectionCraftPillars';
import { CollectionGiftingNotes } from '@/features/collection/components/CollectionGiftingNotes';
import { CollectionHeritageStory } from '@/features/collection/components/CollectionHeritageStory';
import { CollectionHero } from '@/features/collection/components/CollectionHero';
import { CollectionSiblingNav } from '@/features/collection/components/CollectionSiblingNav';
import { getEnrichedCollection } from '@/features/collection/data/collectionContent';
import {
  getCollectionByHandle,
  listCollections,
} from '@/features/collection/queries';
import { ProductGrid } from '@/features/product/components/ProductGrid';
import { listProducts } from '@/features/product/queries';
import { buildCollectionJsonLd, buildFaqJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';
import { isSupportedLocale } from '@/lib/i18n';

export const instant = false;

interface CollectionPageProps {
  params: Promise<{ locale: string; handle: string }>;
}

export async function generateStaticParams(): Promise<
  Array<{ handle: string }>
> {
  const collections = await listCollections();
  return collections.map((c) => ({ handle: c.handle }));
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { handle, locale } = await params;
  const collection = await getCollectionByHandle(handle);

  if (!collection) {
    return {};
  }

  const enriched = getEnrichedCollection(
    collection.handle,
    collection.title,
    collection.description,
  );

  const title =
    collection.seo?.title ?? `${enriched.h1Title} | Bramhkanti Collections`;
  const description =
    collection.seo?.description ??
    (collection.description ||
      `Explore our handcrafted ${collection.title} gift hampers and heirloom sets prepared in Varanasi with 100% pure ingredients.`);

  return buildMetadata({
    title,
    description,
    canonicalPath: `/collections/${collection.handle}`,
    locale: isSupportedLocale(locale) ? locale : 'en',
  });
}

export default async function CollectionPage({
  params,
}: CollectionPageProps): Promise<ReactNode> {
  const { handle } = await params;

  const [collection, allCollections, productsResult] = await Promise.all([
    getCollectionByHandle(handle),
    listCollections(),
    listProducts({
      collectionHandle: handle,
      limit: 100,
    }),
  ]);

  if (!collection) {
    notFound();
  }

  const products = productsResult.items;
  const enriched = getEnrichedCollection(
    collection.handle,
    collection.title,
    collection.description,
  );

  const collectionJsonLd = buildCollectionJsonLd(collection, products);
  const faqJsonLd =
    enriched.faqs.length > 0 ? buildFaqJsonLd(enriched.faqs) : null;

  return (
    <div className="space-y-10 py-8 sm:space-y-14 sm:py-12 bg-page text-fg">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <Container className="space-y-10 sm:space-y-12">
        {/* 1. Breadcrumb Trail (Emits BreadcrumbList JSON-LD) */}
        <Breadcrumbs
          items={[
            { name: 'Collections', href: '/collections' },
            { name: collection.title },
          ]}
        />

        {/* 2. Collection Hero (Modern typography, vegetarian badge, enriched H1) */}
        <CollectionHero
          collection={collection}
          h1Title={enriched.h1Title}
          badgeLabel={enriched.badgeLabel}
        />

        {/* 3. Hamper Craft Standards (Authenticity, Vedic sunshine, pure ghee) */}
        <CollectionCraftPillars pillars={enriched.craftPillars} />

        {/* 4. Products Selection Grid */}
        <section
          aria-labelledby="collection-products-heading"
          className="space-y-5 pt-2"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1 border-b border-line pb-3">
            <div>
              <h2
                id="collection-products-heading"
                className="text-xl sm:text-2xl font-bold font-sans text-fg"
              >
                {collection.title} Selection
              </h2>
              <p className="text-xs sm:text-sm text-fg-muted mt-0.5">
                {collection.description ||
                  `Handcrafted authentic delicacies included in our ${collection.title} presentation`}
              </p>
            </div>
            <span className="text-fg-muted bg-surface-soft border border-line rounded-full px-3 py-1 text-xs font-semibold self-start sm:self-auto">
              {products.length} {products.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="rounded-2xl border border-line bg-surface p-8 text-center space-y-4">
              <p className="text-fg-muted text-sm max-w-md mx-auto">
                Items for the {collection.title} hamper are currently being
                freshly prepared in our Varanasi kitchen. Explore our full range
                or other curated collections.
              </p>
              <Link
                href="/collections"
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-primary-hover transition-colors"
              >
                <span>Browse All Collections</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </section>

        {/* 5. Heritage Story & Artisanal Lineage */}
        <CollectionHeritageStory story={enriched.editorialStory} />

        {/* 6. Gifting Occasions & Hamper Presentation Advice */}
        <CollectionGiftingNotes
          collectionTitle={collection.title}
          notes={enriched.giftingNotes}
        />

        {/* 7. Sibling Collections Navigation (Eliminates dead-ends, horizontal cards) */}
        <CollectionSiblingNav
          currentHandle={collection.handle}
          collections={allCollections}
        />

        {/* 8. Collection SEO FAQs Accordion */}
        {enriched.faqs.length > 0 && (
          <section
            aria-labelledby="collection-faq-heading"
            className="space-y-4 pt-4 border-t border-line"
          >
            <div className="flex items-center gap-2 pb-1">
              <HelpCircle className="h-5 w-5 text-brand-600" />
              <h2
                id="collection-faq-heading"
                className="text-fg font-sans text-xl sm:text-2xl font-bold tracking-tight"
              >
                Frequently Asked Questions About {collection.title}
              </h2>
            </div>
            <p className="text-fg-muted text-xs sm:text-sm -mt-2">
              Hamper details, customization options, and pan-India delivery for{' '}
              {collection.title.toLowerCase()}
            </p>

            <div className="rounded-2xl border border-line bg-surface p-4 sm:p-6 mt-4">
              <Accordion type="single" collapsible className="w-full">
                {enriched.faqs.map((faq, index) => (
                  <AccordionItem
                    key={faq.question}
                    value={`faq-${index}`}
                    className="border-line"
                  >
                    <AccordionTrigger className="text-left font-semibold text-fg hover:text-brand-700 text-sm sm:text-base py-3">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-fg-muted text-xs sm:text-sm leading-relaxed pb-3">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        )}
      </Container>
    </div>
  );
}
