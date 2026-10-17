import type { Metadata } from 'next';
import { atLeastOne, PLACEHOLDER_SLUG } from '@/lib/routing/static-params';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, HelpCircle } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/Accordion';
import { SubcategoryHero } from '@/features/catalog/components/SubcategoryHero';
import { SubcategoryCraftPillars } from '@/features/catalog/components/SubcategoryCraftPillars';
import { SubcategoryPairings } from '@/features/catalog/components/SubcategoryPairings';
import { SubcategorySiblingNav } from '@/features/catalog/components/SubcategorySiblingNav';
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
}: SubcategoryPageProps): Promise<ReactNode> {
  const { category: categorySlug, sub: subSlug } = await params;

  if (isReservedSlug(categorySlug)) {
    notFound();
  }

  const [parent, sub, productsResult] = await Promise.all([
    getCategoryByHandle(categorySlug),
    getCategoryByHandle(subSlug),
    listProducts({
      categoryHandle: subSlug,
      limit: 100,
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

  const products = productsResult.items;
  const canonicalPath = `/${parent.handle}/${sub.handle}`;
  const categoryJsonLd = buildCategoryJsonLd(sub, products, undefined, canonicalPath);
  const faqJsonLd = enriched.faqs.length > 0 ? buildFaqJsonLd(enriched.faqs) : null;

  return (
    <div className="bg-page text-fg space-y-10 py-8 sm:space-y-14 sm:py-12">
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

      <Container className="space-y-10 sm:space-y-12">
        {/* 1. Breadcrumb Trail (Emits BreadcrumbList JSON-LD) */}
        <Breadcrumbs
          items={[
            { name: parent.name, href: `/${parent.handle}` },
            { name: sub.name, href: canonicalPath },
          ]}
        />

        {/* 2. Subcategory Hero (Eliminates cannibalization: unique H1, parent collection backlink) */}
        <SubcategoryHero
          parentCategory={parent}
          subCategory={sub}
          h1Title={enriched.h1Title}
          badgeLabel={enriched.badgeLabel}
        />

        {/* 3. Subcategory Craft Standards (Specific ingredients, zero chemicals, sun curing) */}
        <SubcategoryCraftPillars pillars={enriched.craftPillars} />

        {/* 4. Subcategory Products Catalog Grid */}
        <section
          aria-labelledby="subcategory-products-heading"
          className="space-y-5 pt-2"
        >
          <div className="border-line flex flex-col justify-between gap-1 border-b pb-3 sm:flex-row sm:items-end">
            <div>
              <h2
                id="subcategory-products-heading"
                className="text-fg font-sans text-xl font-bold sm:text-2xl"
              >
                {sub.name} Selection
              </h2>
              <p className="text-fg-muted mt-0.5 text-xs sm:text-sm">
                {sub.description ||
                  `Explore authentic handcrafted ${sub.name.toLowerCase()} prepared with pure ingredients`}
              </p>
            </div>
            <span className="text-fg-muted bg-surface-soft border-line self-start rounded-full border px-3 py-1 text-xs font-semibold sm:self-auto">
              {products.length} {products.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="border-line bg-surface space-y-4 rounded-2xl border p-8 text-center">
              <p className="text-fg-muted mx-auto max-w-md text-sm">
                Our artisanal batch of {sub.name} is currently curing or preparing fresh
                in Varanasi. Check back shortly or browse other varieties from this
                collection.
              </p>
              <Link
                href={`/${parent.handle}`}
                className="bg-primary hover:bg-primary-hover inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-colors"
              >
                <span>Explore All {parent.name}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </section>

        {/* 5. Traditional Culinary Pairings & Serving Suggestions */}
        <SubcategoryPairings subName={sub.name} pairingNotes={enriched.pairingNotes} />

        {/* 6. Sibling Varieties Navigation (Eliminates dead-ends, horizontal cards) */}
        <SubcategorySiblingNav parentCategory={parent} currentSubHandle={sub.handle} />

        {/* 7. Subcategory SEO FAQs Accordion */}
        {enriched.faqs.length > 0 && (
          <section
            aria-labelledby="subcategory-faq-heading"
            className="border-line space-y-4 border-t pt-4"
          >
            <div className="flex items-center gap-2 pb-1">
              <HelpCircle className="text-brand-600 h-5 w-5" />
              <h2
                id="subcategory-faq-heading"
                className="text-fg font-sans text-xl font-bold tracking-tight sm:text-2xl"
              >
                Frequently Asked Questions About {sub.name}
              </h2>
            </div>
            <p className="text-fg-muted -mt-2 text-xs sm:text-sm">
              Authenticity, preparation methods, and storage advice for our{' '}
              {sub.name.toLowerCase()}
            </p>

            <div className="border-line bg-surface mt-4 rounded-2xl border p-4 sm:p-6">
              <Accordion type="single" collapsible className="w-full">
                {enriched.faqs.map((faq, index) => (
                  <AccordionItem
                    key={faq.question}
                    value={`faq-${index}`}
                    className="border-line"
                  >
                    <AccordionTrigger className="text-fg hover:text-brand-700 py-3 text-left text-sm font-semibold sm:text-base">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-fg-muted pb-3 text-xs leading-relaxed sm:text-sm">
                      {faq.answer}
                    </AccordionContent>
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
