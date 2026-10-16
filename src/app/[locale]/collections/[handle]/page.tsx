import type { Metadata } from 'next';
import { atLeastOne, PLACEHOLDER_SLUG } from '@/lib/routing/static-params';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { ProductGrid } from '@/features/product/components/ProductGrid';
import { getCollectionByHandle, listCollections } from '@/features/collection/queries';
import { listProducts } from '@/features/product/queries';
import { getCategoryTree } from '@/features/catalog/queries';
import { ListingShell } from '@/features/catalog/components/ListingShell';
import {
  applyListing,
  parseListingParams,
  rootCategoryFacets,
} from '@/features/catalog/listing';
import { cn } from '@/lib/utils/cn';
import { buildCollectionJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';
import { isSupportedLocale } from '@/lib/i18n';

export const instant = false;

interface CollectionPageProps {
  params: Promise<{ locale: string; handle: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateStaticParams(): Promise<Array<{ handle: string }>> {
  const collections = await listCollections();
  return atLeastOne(
    collections.map((c) => ({ handle: c.handle })),
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

  return buildMetadata({
    title: collection.seo?.title ?? `${collection.title} | Bramhkanti Collections`,
    description: collection.seo?.description ?? collection.description,
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
  const [collection, allCollections, categoryTree] = await Promise.all([
    getCollectionByHandle(handle),
    listCollections(),
    getCategoryTree(),
  ]);

  if (!collection) {
    notFound();
  }

  const { items: allProducts } = await listProducts({
    collectionHandle: collection.handle,
    limit: 200,
  });
  const { items: products, ...listing } = applyListing(
    allProducts,
    listingParams,
    rootCategoryFacets(categoryTree),
  );
  const otherCollections = allCollections.filter((c) => c.id !== collection.id);
  const collectionJsonLd = buildCollectionJsonLd(collection, allProducts);
  const eyebrow = [collection.badge, collection.subtitle].filter(Boolean).join(' · ');

  return (
    <div className="pb-16 sm:pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      <Container className="space-y-8 pt-6 sm:space-y-10 sm:pt-8">
        <Breadcrumbs
          items={[
            { name: 'Collections', href: '/collections' },
            { name: collection.title },
          ]}
        />

        {/* Hero: banner from collection metadata (banner_url / banner_mobile_url) */}
        <section
          className={cn(
            'relative isolate overflow-hidden rounded-3xl',
            collection.image
              ? 'bg-neutral-900 text-white'
              : 'bg-heritage-cream-dark text-neutral-900 dark:bg-neutral-900 dark:text-neutral-50',
          )}
        >
          {collection.image && (
            <>
              <picture>
                {collection.mobileImage && (
                  <source
                    media="(max-width: 639px)"
                    srcSet={collection.mobileImage.url}
                  />
                )}
                <img
                  src={collection.image.url}
                  alt={collection.image.altText ?? collection.title}
                  className="absolute inset-0 -z-10 h-full w-full object-cover"
                />
              </picture>
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/75 via-black/40 to-black/5" />
            </>
          )}
          <div className="flex min-h-72 flex-col justify-end gap-4 p-6 sm:min-h-96 sm:p-10 lg:p-14">
            {eyebrow && (
              <p
                className={cn(
                  'text-xs font-semibold tracking-[0.2em] uppercase',
                  collection.image ? 'text-white/75' : 'text-heritage-maroon',
                )}
              >
                {eyebrow}
              </p>
            )}
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-6xl">
              {collection.title}
            </h1>
            {collection.description && (
              <p
                className={cn(
                  'max-w-xl text-base leading-relaxed sm:text-lg',
                  collection.image ? 'text-white/85' : 'text-heritage-muted',
                )}
              >
                {collection.description}
              </p>
            )}
            {collection.highlights && collection.highlights.length > 0 && (
              <ul className="flex flex-wrap gap-2 pt-1">
                {collection.highlights.map((h) => (
                  <li
                    key={h}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur',
                      collection.image
                        ? 'bg-white/15 text-white ring-1 ring-white/25'
                        : 'bg-white text-neutral-800 ring-1 ring-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:ring-neutral-700',
                    )}
                  >
                    <Check className="h-3.5 w-3.5" />
                    {h}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section aria-label={`${collection.title} products`}>
          <ListingShell params={listingParams} result={listing}>
            <ProductGrid
              products={products}
              emptyMessage="Products for this collection are coming soon."
            />
          </ListingShell>
        </section>

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
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {otherCollections.slice(0, 3).map((c) => (
                <Link
                  key={c.id}
                  href={`/collections/${c.handle}`}
                  className="group relative isolate flex aspect-[16/9] flex-col justify-end overflow-hidden rounded-2xl bg-neutral-900 p-5 text-white"
                >
                  {c.image && (
                    <Image
                      src={c.image.url}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="-z-10 object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  {c.badge && (
                    <span className="mb-2 w-fit rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase backdrop-blur">
                      {c.badge}
                    </span>
                  )}
                  <span className="flex items-center justify-between text-lg font-semibold">
                    {c.title}
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                  {c.description && (
                    <span className="mt-0.5 line-clamp-1 text-sm text-white/75">
                      {c.description}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}
      </Container>
    </div>
  );
}
