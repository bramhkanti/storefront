import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowRight, HelpCircle, Check } from 'lucide-react';

import { atLeastOne, PLACEHOLDER_SLUG } from '@/lib/routing/static-params';
import { cn } from '@/lib/utils/cn';
import { isSupportedLocale } from '@/lib/i18n';
import { buildCollectionJsonLd, buildFaqJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';

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
import { getCollectionByHandle, listCollections } from '@/features/collection/queries';

import { ProductGrid } from '@/features/product/components/ProductGrid';
import { listProducts } from '@/features/product/queries';

import { getCategoryTree } from '@/features/catalog/queries';
import { ListingShell } from '@/features/catalog/components/ListingShell';
import {
  applyListing,
  parseListingParams,
  rootCategoryFacets,
} from '@/features/catalog/listing';

export const instant = false;

interface CollectionPageProps {
  params: Promise<{ locale: string; handle: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateStaticParams(): Promise<Array<{ handle: string }>> {
  const collections = await listCollections();

  return atLeastOne(
    collections.map((collection) => ({
      handle: collection.handle,
    })),
    { handle: PLACEHOLDER_SLUG },
  );
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

  const title = collection.seo?.title ?? `${enriched.h1Title} | Bramhkanti Collections`;

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
  searchParams,
}: CollectionPageProps): Promise<ReactNode> {
  const { handle } = await params;
  const listingParams = parseListingParams(await searchParams);

  const [collection, allCollections, productsResult, categoryTree] = await Promise.all([
    getCollectionByHandle(handle),
    listCollections(),
    listProducts({
      collectionHandle: handle,
      limit: 200,
    }),
    getCategoryTree(),
  ]);

  if (!collection) {
    notFound();
  }

  const allProducts = productsResult.items;

  const { items: products, ...listing } = applyListing(
    allProducts,
    listingParams,
    rootCategoryFacets(categoryTree),
  );

  const enriched = getEnrichedCollection(
    collection.handle,
    collection.title,
    collection.description,
  );

  const otherCollections = allCollections.filter((item) => item.id !== collection.id);

  const collectionJsonLd = buildCollectionJsonLd(collection, allProducts);

  const faqJsonLd = enriched.faqs.length > 0 ? buildFaqJsonLd(enriched.faqs) : null;

  const eyebrow = [collection.badge, collection.subtitle].filter(Boolean).join(' · ');

  return (
    <div className="bg-page text-fg space-y-10 py-8 sm:space-y-14 sm:py-12">
      {/* Collection and FAQ structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionJsonLd),
        }}
      />

      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd),
          }}
        />
      )}

      <Container className="space-y-10 sm:space-y-12">
        <Breadcrumbs
          items={[
            { name: 'Collections', href: '/collections' },
            { name: collection.title },
          ]}
        />

        {/* Collection hero with API-provided collection data */}
        <CollectionHero
          collection={collection}
          h1Title={enriched.h1Title}
          badgeLabel={enriched.badgeLabel}
        />

        {/* Collection craft standards */}
        <CollectionCraftPillars pillars={enriched.craftPillars} />

        {/* Product listing with current-branch filtering logic */}
        <section aria-labelledby="collection-products-heading" className="space-y-5 pt-2">
          <div className="border-line flex flex-col justify-between gap-1 border-b pb-3 sm:flex-row sm:items-end">
            <div>
              <h2
                id="collection-products-heading"
                className="text-fg font-sans text-xl font-bold sm:text-2xl"
              >
                {collection.title} Selection
              </h2>

              <p className="text-fg-muted mt-0.5 text-xs sm:text-sm">
                {collection.description ||
                  `Handcrafted authentic delicacies included in our ${collection.title} presentation`}
              </p>
            </div>

            <span className="border-line bg-surface-soft text-fg-muted self-start rounded-full border px-3 py-1 text-xs font-semibold sm:self-auto">
              {listing.total ?? products.length}{' '}
              {(listing.total ?? products.length) === 1 ? 'item' : 'items'}
            </span>
          </div>

          <ListingShell params={listingParams} result={listing}>
            {products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <div className="border-line bg-surface space-y-4 rounded-2xl border p-8 text-center">
                <p className="text-fg-muted mx-auto max-w-md text-sm">
                  Items for the {collection.title} hamper are currently being freshly
                  prepared in our Varanasi kitchen. Explore our full range or other
                  curated collections.
                </p>

                <Link
                  href="/collections"
                  className="bg-primary hover:bg-primary-hover inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-colors"
                >
                  <span>Browse All Collections</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </ListingShell>
        </section>

        {/* Heritage story */}
        <CollectionHeritageStory story={enriched.editorialStory} />

        {/* Gifting occasions */}
        <CollectionGiftingNotes
          collectionTitle={collection.title}
          notes={enriched.giftingNotes}
        />

        {/* Related collections */}
        <CollectionSiblingNav
          currentHandle={collection.handle}
          collections={allCollections}
        />

        {/* Additional collections from the current branch */}
        {otherCollections.length > 0 && (
          <section aria-labelledby="more-collections" className="space-y-5 pt-6">
            <div className="flex items-end justify-between gap-4">
              <h2
                id="more-collections"
                className="text-2xl font-semibold tracking-tight sm:text-3xl"
              >
                Explore more collections
              </h2>

              <Link
                href="/collections"
                className="text-heritage-maroon inline-flex items-center gap-1 text-sm font-semibold hover:underline"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {otherCollections.slice(0, 3).map((item) => (
                <Link
                  key={item.id}
                  href={`/collections/${item.handle}`}
                  className="group relative isolate flex aspect-[16/9] flex-col justify-end overflow-hidden rounded-2xl bg-neutral-900 p-5 text-white"
                >
                  {item.image && (
                    <Image
                      src={item.image.url}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="-z-10 object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}

                  <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {item.badge && (
                    <span className="mb-2 w-fit rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase backdrop-blur">
                      {item.badge}
                    </span>
                  )}

                  <span className="flex items-center justify-between text-lg font-semibold">
                    {item.title}
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>

                  {item.description && (
                    <span className="mt-0.5 line-clamp-1 text-sm text-white/75">
                      {item.description}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Collection SEO FAQs */}
        {enriched.faqs.length > 0 && (
          <section
            aria-labelledby="collection-faq-heading"
            className="border-line space-y-4 border-t pt-4"
          >
            <div className="flex items-center gap-2 pb-1">
              <HelpCircle className="text-brand-600 h-5 w-5" />

              <h2
                id="collection-faq-heading"
                className="text-fg font-sans text-xl font-bold tracking-tight sm:text-2xl"
              >
                Frequently Asked Questions About {collection.title}
              </h2>
            </div>

            <p className="text-fg-muted -mt-2 text-xs sm:text-sm">
              Hamper details, customization options, and pan-India delivery for{' '}
              {collection.title.toLowerCase()}
            </p>

            <div className="border-line bg-surface mt-4 rounded-2xl border p-4 sm:p-6">
              <Accordion type="single" collapsible className="w-full">
                {enriched.faqs.map((faq, index) => (
                  <AccordionItem
                    key={faq.question}
                    value={`faq-${index}`}
                    className="border-line"
                  >
                    <AccordionTrigger className="text-fg hover:text-brand-700 py-3 text-left text-sm font-semibold sm:text-base">
                      {faq.question}
                    </AccordionTrigger>

                    <AccordionContent className="text-fg-muted pb-3 text-xs leading-relaxed sm:text-sm">
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
