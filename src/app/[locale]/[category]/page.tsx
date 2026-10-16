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
    listProducts({ categoryHandle: categorySlug, limit: 200 }),
  ]);

  if (!category) {
    notFound();
  }

  const { items: products, ...listing } = applyListing(
    productsResult.items,
    listingParams,
    childCategoryFacets(category),
  );
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

        {/* Subcategories Exploration (Strictly 4 in a row on desktop) */}
        {category.children && category.children.length > 0 && (
          <section aria-labelledby="subcategories-heading" className="space-y-4 pt-2">
            <div className="border-heritage-border/70 flex items-center justify-between border-b pb-3">
              <div>
                <h2
                  id="subcategories-heading"
                  className="text-heritage-charcoal font-serif text-xl font-bold sm:text-2xl dark:text-neutral-100"
                >
                  Explore {category.name} Varieties
                </h2>
                <p className="text-heritage-muted text-xs sm:text-sm dark:text-neutral-400">
                  Handcrafted specialty variations prepared following ancient traditional
                  recipes
                </p>
              </div>
              <span className="text-heritage-muted bg-heritage-cream-dark/60 rounded-full px-3 py-1 text-xs font-semibold dark:bg-neutral-800">
                {category.children.length} Varieties
              </span>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {category.children.map((sub) => {
                const imageUrl =
                  sub.image?.url ||
                  'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80';
                const altText = sub.image?.altText || sub.name;

                return (
                  <Link
                    key={sub.id}
                    href={`/${category.handle}/${sub.handle}`}
                    className="group border-heritage-border/70 hover:border-heritage-maroon/40 bg-heritage-cream flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-neutral-900"
                  >
                    {/* Image Banner */}
                    <div className="bg-heritage-cream-dark relative aspect-4/3 w-full overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={altText}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col justify-between space-y-3 p-4">
                      <div className="space-y-1">
                        <h3 className="text-heritage-charcoal group-hover:text-heritage-maroon font-serif text-base font-bold transition-colors dark:text-neutral-100">
                          {sub.name}
                        </h3>
                        {sub.description && (
                          <p className="text-heritage-muted line-clamp-2 text-xs leading-relaxed dark:text-neutral-400">
                            {sub.description}
                          </p>
                        )}
                      </div>

                      <div className="border-heritage-border/60 text-heritage-maroon mt-1 flex items-center justify-between border-t pt-2.5 text-xs font-semibold">
                        <span>Browse Collection</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Sort, filter chips and product grid */}
        <section aria-labelledby="category-products-heading" className="space-y-5">
          <h2
            id="category-products-heading"
            className="text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            Shop all {category.name}
          </h2>
          <ListingShell params={listingParams} result={listing} typeLabel="Variety">
            <ProductGrid products={products} />
          </ListingShell>
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
