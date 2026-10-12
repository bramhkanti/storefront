import type { Metadata } from 'next';
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

        {/* Collection Hero */}
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="saffron">Handpicked Hamper</Badge>
            <span className="text-heritage-saffron-dark text-xs font-semibold tracking-wider uppercase">
              Special Presentation
            </span>
          </div>

          <h1 className="text-heritage-maroon font-serif text-3xl font-extrabold tracking-tight sm:text-5xl">
            {collection.title}
          </h1>

          <p className="text-heritage-muted text-base leading-relaxed">
            {collection.description}
          </p>
        </div>

        {/* Product Grid */}
        <section aria-label={`${collection.title} Products`}>
          <ProductGrid products={products} />
        </section>
      </Container>
    </div>
  );
}
