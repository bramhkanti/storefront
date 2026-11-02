import type { Metadata } from 'next';
import { atLeastOne, PLACEHOLDER_SLUG } from '@/lib/routing/static-params';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { ListingLayout } from '@/features/catalog/components/ListingLayout';
import { ListingShell } from '@/features/catalog/components/ListingShell';
import { applyListing, parseListingParams } from '@/features/catalog/listing';
import { getEnrichedSubcategory } from '@/features/catalog/data/subcategoryContent';
import { getCategoryByHandle, listCategories } from '@/features/catalog/queries';
import { ProductGrid } from '@/features/product/components/ProductGrid';
import { listProducts } from '@/features/product/queries';
import { isReservedSlug } from '@/lib/config/reserved-slugs';
import { buildCategoryJsonLd, buildFaqJsonLd } from '@/lib/seo/json-ld';
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

  const title = sub.seo?.title ?? `${sub.name} — Handcrafted ${parent.name} | Bramhkanti`;
  const description =
    sub.seo?.description ??
    (sub.description ||
      `Authentic handcrafted ${sub.name.toLowerCase()} prepared in Varanasi following heritage recipes with 100% natural ingredients.`);

  return buildMetadata({
    title,
    description,
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
    listProducts({
      categoryHandle: subSlug,
      limit: 200,
    }),
  ]);

  if (!parent || !sub) {
    notFound();
  }

  const enriched = getEnrichedSubcategory(
    parent.handle,
    sub.handle,
    sub.name,
    sub.description,
  );

  const allProducts = productsResult.items;
  const { items: products, ...listing } = applyListing(allProducts, listingParams);

  const canonicalPath = `/${parent.handle}/${sub.handle}`;
  const categoryJsonLd = buildCategoryJsonLd(sub, allProducts, undefined, canonicalPath);
  const faqJsonLd = enriched.faqs.length > 0 ? buildFaqJsonLd(enriched.faqs) : null;

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
        title={sub.name}
        breadcrumbs={[
          { name: parent.name, href: `/${parent.handle}` },
          { name: sub.name },
        ]}
        about={sub.description}
        faqs={enriched.faqs}
      >
        <ListingShell params={listingParams} result={listing}>
          <ProductGrid products={products} />
        </ListingShell>
      </ListingLayout>
    </>
  );
}
