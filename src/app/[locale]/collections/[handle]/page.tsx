import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';

import { atLeastOne, PLACEHOLDER_SLUG } from '@/lib/routing/static-params';
import { isSupportedLocale } from '@/lib/i18n';
import { buildCollectionJsonLd, buildFaqJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';

import { getEnrichedCollection } from '@/features/collection/data/collectionContent';
import { getCollectionByHandle, listCollections } from '@/features/collection/queries';

import { ProductGrid } from '@/features/product/components/ProductGrid';
import { listProducts } from '@/features/product/queries';

import { getCategoryTree } from '@/features/catalog/queries';
import { ListingLayout } from '@/features/catalog/components/ListingLayout';
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

  const [collection, productsResult, categoryTree] = await Promise.all([
    getCollectionByHandle(handle),
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

  const collectionJsonLd = buildCollectionJsonLd(collection, allProducts);
  const faqJsonLd = enriched.faqs.length > 0 ? buildFaqJsonLd(enriched.faqs) : null;

  return (
    <>
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

      <ListingLayout
        title={collection.title}
        breadcrumbs={[
          { name: 'Collections', href: '/collections' },
          { name: collection.title },
        ]}
        about={collection.description}
        faqs={enriched.faqs}
      >
        <ListingShell params={listingParams} result={listing}>
          <ProductGrid
            products={products}
            emptyMessage="New items for this collection are coming soon."
          />
        </ListingShell>
      </ListingLayout>
    </>
  );
}
