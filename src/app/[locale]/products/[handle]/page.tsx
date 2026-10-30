import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

import { atLeastOne, PLACEHOLDER_SLUG } from '@/lib/routing/static-params';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ProductHeader } from '@/features/product/components/ProductHeader';
import { ProductGallery } from '@/features/product/components/ProductGallery';
import { ProductDetails } from '@/features/product/components/ProductDetails';
import { ProductAttributeBar } from '@/features/product/components/ProductAttributeBar';
import { ProductContentGrid } from '@/features/product/components/ProductContentGrid';
import { ProductReviewsSection } from '@/features/product/components/ProductReviewsSection';
import { ProductFaq } from '@/features/product/components/ProductFaq';
import { ProductGrid } from '@/features/product/components/ProductGrid';

import { getEnrichedProductContent } from '@/features/product/data/productContent';
import {
  getFeaturedProducts,
  getProductByHandle,
  getProductsByCategory,
  getTopProductHandles,
} from '@/features/product/queries';
import { getProductReviews } from '@/features/product/reviews.queries';
import { getCategoryByHandle } from '@/features/catalog/queries';

import { buildProductJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';
import { isSupportedLocale } from '@/lib/i18n';
import { publicEnv } from '@/lib/env.public';

export const instant = false;

interface ProductPageProps {
  params: Promise<{ locale: string; handle: string }>;
}

export async function generateStaticParams(): Promise<Array<{ handle: string }>> {
  const products = await getTopProductHandles(50);

  return atLeastOne(
    products.map(({ handle }) => ({ handle })),
    { handle: PLACEHOLDER_SLUG },
  );
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { handle, locale } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    return {};
  }

  const primaryImage = product.images[0]?.url;

  return buildMetadata({
    title: product.seo?.title ?? `${product.title} | Bramhkanti Heritage Foods`,
    description: product.seo?.description ?? product.description,
    canonicalPath: `/products/${product.handle}`,
    ogType: 'article',
    ...(primaryImage ? { ogImage: primaryImage } : {}),
    locale: isSupportedLocale(locale) ? locale : 'en',
  });
}

export default async function ProductPage({
  params,
}: ProductPageProps): Promise<ReactNode> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  // Medusa products carry the category handle; mock fixtures use the ID as handle.
  const categoryHandle = product.primaryCategoryHandle ?? product.primaryCategoryId;

  const [category, relatedProducts, featured, reviewPage] = await Promise.all([
    categoryHandle ? getCategoryByHandle(categoryHandle) : Promise.resolve(null),
    categoryHandle ? getProductsByCategory(categoryHandle, 8) : Promise.resolve([]),
    getFeaturedProducts(8),
    getProductReviews(product.id),
  ]);

  // Show same-category products first, then popular products to fill the row.
  const seen = new Set([product.id]);

  const filteredRelated = [...relatedProducts, ...featured]
    .filter((item) => {
      if (seen.has(item.id)) {
        return false;
      }

      seen.add(item.id);
      return true;
    })
    .slice(0, 4);

  // Enriched product storytelling, attributes, tasting notes, reviews and FAQs.
  const enrichedContent = getEnrichedProductContent(product, category?.name);

  // Product structured data for search engines.
  const productJsonLd = buildProductJsonLd(product, undefined, reviewPage);

  // FAQPage structured data.
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: enrichedContent.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const breadcrumbs = [
    ...(category
      ? [{ name: category.name, href: `/${category.handle}` }]
      : [{ name: 'Catalog', href: '/' }]),
    { name: product.title },
  ];

  // BreadcrumbList structured data.
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.href ? { item: `${publicEnv.NEXT_PUBLIC_SITE_URL}${item.href}` } : {}),
    })),
  };

  return (
    <article className="bg-page text-fg w-full pb-16">
      {/* Product, FAQ and breadcrumb structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* 1. Sticky product header */}
      <ProductHeader product={product} categoryName={category?.name} />

      {/* 2. Product hero and gallery */}
      <div className="w-full">
        <div className="mx-auto max-w-7xl lg:px-8">
          {/* Desktop breadcrumbs */}
          <div className="hidden pt-1 pb-4 lg:block">
            <Breadcrumbs items={breadcrumbs} singleLine />
          </div>

          {/* Mobile breadcrumbs */}
          <div className="block px-4 pt-3 pb-2 sm:px-6 lg:hidden">
            <Breadcrumbs items={breadcrumbs} singleLine />
          </div>

          <div className="grid grid-cols-1 items-start lg:grid-cols-2 lg:gap-12">
            <div className="px-4 sm:px-6 lg:px-0">
              <ProductGallery
                images={product.images}
                title={product.title}
                product={product}
              />
            </div>

            <ProductDetails
              product={product}
              categoryName={category?.name}
              highlights={enrichedContent.highlights}
            />
          </div>
        </div>
      </div>

      {/* 3. Brand and craft attributes */}
      <Container className="pt-6 sm:pt-8">
        <ProductAttributeBar
          desktopItems={enrichedContent.desktopAttributeBar}
          mobileItems={enrichedContent.mobileTrustBadges}
        />
      </Container>

      {/* 5. Product details, ingredients and storage information */}
      <Container className="pt-8 sm:pt-10">
        <ProductContentGrid
          keyHighlights={enrichedContent.keyHighlights}
          storyNarrative={enrichedContent.heritageStory.narrative.join(' ')}
          ingredients={enrichedContent.ingredientsGrid}
          storageInstructions={enrichedContent.storageInstructions}
          shippingHighlights={enrichedContent.shippingHighlights}
        />
      </Container>

      {/* 6. Customer reviews and ratings */}
      <Container className="pt-12 sm:pt-16">
        <div id="section-reviews" className="scroll-mt-36">
          <ProductReviewsSection
            productId={product.id}
            productTitle={product.title}
            initial={reviewPage}
          />
        </div>
      </Container>

      {/* 7. Frequently asked questions */}
      <Container className="pt-8 sm:pt-10">
        <div id="section-faqs" className="scroll-mt-36">
          <ProductFaq faqs={enrichedContent.faqs} />
        </div>
      </Container>

      {/* 8. Related products */}
      {filteredRelated.length > 0 && (
        <Container className="pt-10 pb-8 sm:pt-14 sm:pb-12">
          <section
            id="section-related"
            aria-labelledby="related-heading"
            className="scroll-mt-36 space-y-6"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-fg-muted text-xs font-bold tracking-wider uppercase">
                  Handcrafted from the same Kitchen
                </span>

                <h2
                  id="related-heading"
                  className="text-fg mt-1 font-serif text-[20px] leading-snug font-semibold"
                >
                  You May Also Relish
                </h2>
              </div>

              {category && (
                <Link
                  href={`/${category.handle}`}
                  className="text-heritage-maroon hidden items-center gap-1 text-sm font-semibold hover:underline sm:inline-flex"
                >
                  Shop all {category.name}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>

            <ProductGrid products={filteredRelated} />
          </section>
        </Container>
      )}
    </article>
  );
}
