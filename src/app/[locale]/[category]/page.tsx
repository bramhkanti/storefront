import type { Metadata } from 'next';
import { atLeastOne, PLACEHOLDER_SLUG } from '@/lib/routing/static-params';
import type { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/Accordion';
import { CategoryHero } from '@/features/catalog/components/CategoryHero';
import { CategoryCraftPillars } from '@/features/catalog/components/CategoryCraftPillars';
import { CategoryBestSellers } from '@/features/catalog/components/CategoryBestSellers';
import { CategoryHeritageStory } from '@/features/catalog/components/CategoryHeritageStory';
import { ProductGrid } from '@/features/product/components/ProductGrid';
import { getAllCategoryHandles, getCategoryByHandle } from '@/features/catalog/queries';
import { listProducts } from '@/features/product/queries';
import { isReservedSlug } from '@/lib/config/reserved-slugs';
import { buildCategoryJsonLd, buildFaqJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';
import { isSupportedLocale } from '@/lib/i18n';
import { publicEnv } from '@/lib/env.public';

export const instant = false;

interface PageProps {
  params: Promise<{ locale: string; category: string }>;
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

export default async function CategoryPage({ params }: PageProps): Promise<ReactNode> {
  const { category: categorySlug } = await params;

  // Guard against collision with system/static routes
  if (isReservedSlug(categorySlug)) {
    notFound();
  }

  const [category, productsResult] = await Promise.all([
    getCategoryByHandle(categorySlug),
    listProducts({
      categoryHandle: categorySlug,
      limit: 100,
    }),
  ]);

  if (!category) {
    notFound();
  }

  const products = productsResult.items;

  // Filter category-specific bestsellers (from collection or featured flag)
  const categoryBestSellers = products.filter(
    (p) => p.collectionIds?.includes('col_best_sellers') || p.featured,
  );
  const displayBestSellers =
    categoryBestSellers.length >= 2 ? categoryBestSellers : products.slice(0, 4);

  const categoryJsonLd = buildCategoryJsonLd(category, products);
  const faqJsonLd = category.faqs ? buildFaqJsonLd(category.faqs) : null;

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: category.name, href: `/${category.handle}` },
  ];

  const siteUrl = publicEnv.NEXT_PUBLIC_SITE_URL || 'https://bramhkanti.com';
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.href}`,
    })),
  };

  return (
    <div className="bg-page text-fg space-y-10 py-8 sm:space-y-14 sm:py-12">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <Container className="space-y-10 sm:space-y-12">
        {/* Breadcrumb Trail */}
        <Breadcrumbs items={breadcrumbs} />

        {/* 1. Category Hero & Taxonomy Exploration Pills */}
        <CategoryHero category={category} />

        {/* 2. Artisanal Craft Pillars (Category-specific 4-point authenticity bar) */}
        <CategoryCraftPillars categoryHandle={category.handle} />

        {/* 3. Dedicated Best Sellers Showcase Section */}
        <CategoryBestSellers
          categoryName={category.name}
          categoryHandle={category.handle}
          products={displayBestSellers}
        />

        {/* 4. Subcategories Exploration (Strictly 4 in a row on desktop) */}
        {category.children && category.children.length > 0 && (
          <section
            aria-labelledby="subcategories-heading"
            className="border-line space-y-4 border-t pt-4"
          >
            <div className="border-line flex flex-col justify-between gap-1 border-b pb-3 sm:flex-row sm:items-end">
              <div>
                <h2
                  id="subcategories-heading"
                  className="text-fg font-sans text-xl font-bold tracking-tight sm:text-2xl"
                >
                  Explore {category.name} Varieties
                </h2>
                <p className="text-fg-muted mt-0.5 text-xs sm:text-sm">
                  Handcrafted specialty variations prepared following ancient traditional
                  recipes
                </p>
              </div>
              <span className="text-fg-muted bg-surface-soft border-line self-start rounded-full border px-3 py-1 text-xs font-semibold sm:self-auto">
                {category.children.length} Varieties
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {category.children.map((sub) => {
                const imageUrl =
                  sub.image?.url ||
                  'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80';
                const altText = sub.image?.altText || sub.name;

                return (
                  <Link
                    key={sub.id}
                    href={`/${category.handle}/${sub.handle}`}
                    className="group border-line hover:border-brand-600 bg-surface flex flex-row overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-xs"
                  >
                    {/* Left Side: Image Container */}
                    <div className="bg-surface-soft relative w-28 shrink-0 overflow-hidden sm:w-36">
                      <Image
                        src={imageUrl}
                        alt={altText}
                        fill
                        sizes="(max-width: 640px) 112px, 144px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Right Side: Content */}
                    <div className="flex min-w-0 flex-1 flex-col justify-between p-3.5 sm:p-4">
                      <div className="space-y-1">
                        <h3 className="text-fg group-hover:text-primary truncate font-sans text-sm font-bold transition-colors sm:text-base">
                          {sub.name}
                        </h3>
                        {sub.description && (
                          <p className="text-fg-muted line-clamp-2 text-xs leading-relaxed">
                            {sub.description}
                          </p>
                        )}
                      </div>

                      <div className="text-primary border-line/40 mt-2 flex items-center gap-1 border-t pt-1 text-xs font-semibold">
                        <span>Browse Collection</span>
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* 5. Complete All Products Catalog Grid */}
        <section
          aria-labelledby="category-products-heading"
          className="border-line space-y-5 border-t pt-4"
        >
          <div className="border-line flex flex-col justify-between gap-1 border-b pb-3 sm:flex-row sm:items-end">
            <div>
              <h2
                id="category-products-heading"
                className="text-fg font-sans text-xl font-bold tracking-tight sm:text-2xl"
              >
                All {category.name} Catalog
              </h2>
              <p className="text-fg-muted mt-0.5 text-xs sm:text-sm">
                Browse our complete selection of {products.length} pure, handcrafted
                specialties
              </p>
            </div>
            <span className="text-fg-muted text-xs font-medium">
              Showing all {products.length} items
            </span>
          </div>

          <ProductGrid products={products} />
        </section>

        {/* 6. Editorial Heritage Story & SEO Narrative */}
        <CategoryHeritageStory category={category} />

        {/* 7. Category SEO FAQs Accordion */}
        {category.faqs && category.faqs.length > 0 && (
          <section
            aria-label="Frequently Asked Questions"
            className="border-line border-t pt-10"
          >
            <div className="max-w-3xl space-y-4">
              <h2 className="text-fg font-sans text-2xl font-bold tracking-tight">
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
