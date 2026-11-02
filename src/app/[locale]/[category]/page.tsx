import type { Metadata } from 'next';
import { atLeastOne, PLACEHOLDER_SLUG } from '@/lib/routing/static-params';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { ListingLayout } from '@/features/catalog/components/ListingLayout';
import { ListingShell } from '@/features/catalog/components/ListingShell';
import {
  applyListing,
  childCategoryFacets,
  parseListingParams,
} from '@/features/catalog/listing';
import { ProductGrid } from '@/features/product/components/ProductGrid';
import { getAllCategoryHandles, getCategoryByHandle } from '@/features/catalog/queries';
import { listProducts } from '@/features/product/queries';
import { isReservedSlug } from '@/lib/config/reserved-slugs';
import { buildCategoryJsonLd, buildFaqJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';
import { isSupportedLocale } from '@/lib/i18n';

export const instant = false;

interface PageProps {
  params: Promise<{ locale: string; category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateStaticParams(): Promise<Array<{ category: string }>> {
  const handles = await getAllCategoryHandles();
  return atLeastOne(
    handles.filter((h) => !isReservedSlug(h)).map((category) => ({ category })),
    { category: PLACEHOLDER_SLUG },
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: categorySlug, locale } = await params;
  if (isReservedSlug(categorySlug)) {
    return {};
  }

  const category = await getCategoryByHandle(categorySlug);
  if (!category) {
    return {};
  }

  return buildMetadata({
    title: category.seo?.title ?? `${category.name} — Handcrafted Heritage | Bramhkanti`,
    description: category.seo?.description ?? category.description,
    canonicalPath: `/${category.handle}`,
    locale: isSupportedLocale(locale) ? locale : 'en',
  });
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps): Promise<ReactNode> {
  const { category: categorySlug } = await params;

  // Guard against collision with system/static routes
  if (isReservedSlug(categorySlug)) {
    notFound();
  }

  const listingParams = parseListingParams(await searchParams);

  const [category, productsResult] = await Promise.all([
    getCategoryByHandle(categorySlug),
    listProducts({
      categoryHandle: categorySlug,
      limit: 200,
    }),
  ]);

  if (!category) {
    notFound();
  }

  const allProducts = productsResult.items;
  const { items: products, ...listing } = applyListing(
    allProducts,
    listingParams,
    childCategoryFacets(category),
  );

  const categoryJsonLd = buildCategoryJsonLd(category, allProducts);
  const faqJsonLd = category.faqs?.length ? buildFaqJsonLd(category.faqs) : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <ListingLayout
        title={category.name}
        breadcrumbs={[{ name: category.name }]}
        about={category.description}
        faqs={category.faqs}
      >
        <ListingShell params={listingParams} result={listing} typeLabel="Type">
          <ProductGrid products={products} />
        </ListingShell>
      </ListingLayout>
    </>
  );
}
