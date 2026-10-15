import type { Metadata } from 'next';
import { atLeastOne, PLACEHOLDER_SLUG } from '@/lib/routing/static-params';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { ProductGrid } from '@/features/product/components/ProductGrid';
import { getCollectionByHandle, listCollections } from '@/features/collection/queries';
import { listProducts } from '@/features/product/queries';
import { buildCollectionJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';
import { isSupportedLocale } from '@/lib/i18n';

export const instant = false;

interface CollectionPageProps {
  params: Promise<{ locale: string; handle: string }>;
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
}: CollectionPageProps): Promise<ReactNode> {
  const { handle } = await params;
  const collection = await getCollectionByHandle(handle);

  if (!collection) {
    notFound();
  }

  const productsResult = await listProducts({
    collectionHandle: collection.handle,
    limit: 24,
  });

  const products = productsResult.items;
  const collectionJsonLd = buildCollectionJsonLd(collection, products);

  return (
    <div className="space-y-10 py-8 sm:space-y-14 sm:py-12">
      {/* Schema.org Collection Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      <Container className="space-y-8">
        {/* Breadcrumb Trail */}
        <Breadcrumbs
          items={[
            { name: 'Collections', href: '/collections' },
            { name: collection.title },
          ]}
        />

        {/* Collection hero: banner from collection metadata (banner_url / banner_mobile_url) */}
        {collection.image ? (
          <section className="relative overflow-hidden rounded-3xl bg-neutral-900">
            <picture>
              {collection.mobileImage && (
                <source media="(max-width: 639px)" srcSet={collection.mobileImage.url} />
              )}
              <img
                src={collection.image.url}
                alt={collection.image.altText ?? collection.title}
                className="h-64 w-full object-cover sm:h-80 lg:h-96"
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-10">
              {(collection.badge || collection.subtitle) && (
                <p className="text-xs font-semibold tracking-widest text-white/80 uppercase">
                  {[collection.badge, collection.subtitle].filter(Boolean).join(' · ')}
                </p>
              )}
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">
                {collection.title}
              </h1>
              {collection.description && (
                <p className="mt-2 max-w-xl text-sm text-white/85 sm:text-base">
                  {collection.description}
                </p>
              )}
            </div>
          </section>
        ) : (
          <div className="max-w-3xl space-y-3">
            {collection.badge && <Badge variant="saffron">{collection.badge}</Badge>}
            <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
              {collection.title}
            </h1>
            {collection.description && (
              <p className="text-heritage-muted text-base leading-relaxed">
                {collection.description}
              </p>
            )}
          </div>
        )}

        <p className="text-heritage-muted text-sm">
          {productsResult.total} {productsResult.total === 1 ? 'product' : 'products'}
        </p>

        {/* Product Grid */}
        <section aria-label={`${collection.title} Products`}>
          <ProductGrid products={products} />
        </section>
      </Container>
    </div>
  );
}
