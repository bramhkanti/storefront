import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { CategoryHero } from '@/features/catalog/components/CategoryHero';
import { CatalogFilters } from '@/features/catalog/components/CatalogFilters';
import { parseCatalogFilters } from '@/features/catalog/filters';
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

  return params;
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

  const rawFilters = await searchParams;
  const filters = parseCatalogFilters(rawFilters);

  const [parent, sub, productsResult] = await Promise.all([
    getCategoryByHandle(categorySlug),
    getCategoryByHandle(subSlug),
    listProducts({
      categoryHandle: subSlug,
      page: filters.page,
      limit: filters.limit,
      sort: filters.sort,
      ...(filters.spiceLevel ? { tags: [filters.spiceLevel] } : {}),
      ...(filters.minPrice !== undefined ? { minPrice: filters.minPrice } : {}),
      ...(filters.maxPrice !== undefined ? { maxPrice: filters.maxPrice } : {}),
      ...(filters.inStockOnly !== undefined ? { inStockOnly: filters.inStockOnly } : {}),
    }),
  ]);

  if (!parent || !sub) {
    notFound();
  }

  const products = productsResult.items;
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

        {/* Filter & Sort Controls */}
        <CatalogFilters
          currentFilters={filters}
          categorySlug={`${parent.handle}/${sub.handle}`}
        />

        {/* Product Grid */}
        <section aria-labelledby="subcategory-products-heading">
          <h2 id="subcategory-products-heading" className="sr-only">
            {sub.name} Catalog
          </h2>
          <ProductGrid products={products} />
        </section>
      </Container>
    </div>
  );
}
