import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/Accordion';
import { CategoryHero } from '@/features/catalog/components/CategoryHero';
import { CatalogFilters } from '@/features/catalog/components/CatalogFilters';
import { parseCatalogFilters } from '@/features/catalog/filters';
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
  return handles.filter((h) => !isReservedSlug(h)).map((category) => ({ category }));
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

  const rawFilters = await searchParams;
  const filters = parseCatalogFilters(rawFilters);

  const [category, productsResult] = await Promise.all([
    getCategoryByHandle(categorySlug),
    listProducts({
      categoryHandle: categorySlug,
      page: filters.page,
      limit: filters.limit,
      sort: filters.sort,
      ...(filters.spiceLevel ? { tags: [filters.spiceLevel] } : {}),
      ...(filters.minPrice !== undefined ? { minPrice: filters.minPrice } : {}),
      ...(filters.maxPrice !== undefined ? { maxPrice: filters.maxPrice } : {}),
      ...(filters.inStockOnly !== undefined ? { inStockOnly: filters.inStockOnly } : {}),
    }),
  ]);

  if (!category) {
    notFound();
  }

  const products = productsResult.items;
  const categoryJsonLd = buildCategoryJsonLd(category, products);
  const faqJsonLd = category.faqs ? buildFaqJsonLd(category.faqs) : null;

  return (
    <div className="space-y-10 py-8 sm:space-y-14 sm:py-12">
      {/* Schema.org Structured Data */}
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

      <Container className="space-y-8">
        {/* Breadcrumb Trail */}
        <Breadcrumbs items={[{ name: category.name, href: `/${category.handle}` }]} />

        {/* Category Hero & Taxonomy Pills */}
        <CategoryHero category={category} />

        {/* Filter & Sort Controls (Zero-JS Form) */}
        <CatalogFilters currentFilters={filters} categorySlug={category.handle} />

        {/* Product Grid */}
        <section aria-labelledby="category-products-heading">
          <h2 id="category-products-heading" className="sr-only">
            {category.name} Catalog
          </h2>
          <ProductGrid products={products} />
        </section>

        {/* Category SEO FAQs Accordion */}
        {category.faqs && category.faqs.length > 0 && (
          <section
            aria-label="Frequently Asked Questions"
            className="border-heritage-border border-t pt-10"
          >
            <div className="max-w-3xl space-y-4">
              <h2 className="text-heritage-charcoal font-serif text-2xl font-bold">
                Frequently Asked Questions about {category.name}
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {category.faqs.map((faq, index) => (
                  <AccordionItem key={faq.question} value={`faq-${index}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
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
