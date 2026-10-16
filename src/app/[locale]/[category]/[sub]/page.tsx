import type { Metadata } from 'next';
import { atLeastOne, PLACEHOLDER_SLUG } from '@/lib/routing/static-params';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { CategoryHero } from '@/features/catalog/components/CategoryHero';
import { ListingShell } from '@/features/catalog/components/ListingShell';
import { applyListing, parseListingParams } from '@/features/catalog/listing';
import { ProductGrid } from '@/features/product/components/ProductGrid';
import { getCategoryByHandle, listCategories } from '@/features/catalog/queries';
import { listProducts } from '@/features/product/queries';
import { isReservedSlug } from '@/lib/config/reserved-slugs';
import { buildCategoryJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';

import { isSupportedLocale } from '@/lib/i18n';

export const instant = false;

interface SubcategoryPageProps {
  params: Promise<{ locale: string; category: string; sub: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateStaticParams(): Promise<
  Array<{ category: string; sub: string }>
> {
  const allCategories = await listCategories();
  const params: Array<{ category: string; sub: string }> = [];

  for (const parent of allCategories) {
    if (!parent.parentId && parent.children) {
      for (const child of parent.children) {
        params.push({
          category: parent.handle,
          sub: child.handle,
        });
      }
    }
  }

  return atLeastOne(params, { category: PLACEHOLDER_SLUG, sub: PLACEHOLDER_SLUG });
}

export async function generateMetadata({
  params,
}: SubcategoryPageProps): Promise<Metadata> {
  const { category: categorySlug, sub: subSlug, locale } = await params;
  if (isReservedSlug(categorySlug)) {
    return {};
  }

  const [parent, sub] = await Promise.all([
    getCategoryByHandle(categorySlug),
    getCategoryByHandle(subSlug),
  ]);

  if (!parent || !sub) {
    return {};
  }

  return buildMetadata({
    title: sub.seo?.title ?? `${sub.name} — Handcrafted ${parent.name} | Bramhkanti`,
    description: sub.seo?.description ?? sub.description,
    canonicalPath: `/${parent.handle}/${sub.handle}`,
    locale: isSupportedLocale(locale) ? locale : 'en',
  });
}

export default async function SubcategoryPage({
  params,
  searchParams,
}: SubcategoryPageProps): Promise<ReactNode> {
  const { category: categorySlug, sub: subSlug } = await params;

  if (isReservedSlug(categorySlug)) {
    notFound();
  }

  const listingParams = parseListingParams(await searchParams);

  const [parent, sub, productsResult] = await Promise.all([
    getCategoryByHandle(categorySlug),
    getCategoryByHandle(subSlug),
    listProducts({ categoryHandle: subSlug, limit: 200 }),
  ]);

  if (!parent || !sub) {
    notFound();
  }

  const { items: products, ...listing } = applyListing(
    productsResult.items,
    listingParams,
  );
  const categoryJsonLd = buildCategoryJsonLd(sub, products);

  return (
    <div className="space-y-10 py-8 sm:space-y-14 sm:py-12">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryJsonLd) }}
      />

      <Container className="space-y-8">
        {/* Breadcrumb Trail */}
        <Breadcrumbs
          items={[
            { name: parent.name, href: `/${parent.handle}` },
            { name: sub.name, href: `/${parent.handle}/${sub.handle}` },
          ]}
        />

        {/* Category Hero with parent and active subcategory context */}
        <CategoryHero category={parent} activeSubHandle={sub.handle} />

        {/* Sort, filter chips and product grid */}
        <section aria-labelledby="subcategory-products-heading">
          <h2 id="subcategory-products-heading" className="sr-only">
            {sub.name} Catalog
          </h2>
          <ListingShell params={listingParams} result={listing}>
            <ProductGrid products={products} />
          </ListingShell>
        </section>
      </Container>
    </div>
  );
}
