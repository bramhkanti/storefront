import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ProductHeader } from '@/features/product/components/ProductHeader';
import { ProductGallery } from '@/features/product/components/ProductGallery';
import { ProductDetails } from '@/features/product/components/ProductDetails';
import { ProductAttributeBar } from '@/features/product/components/ProductAttributeBar';
import { ProductStoryBanner } from '@/features/product/components/ProductStoryBanner';
import { ProductContentGrid } from '@/features/product/components/ProductContentGrid';
import { ProductReviewsSection } from '@/features/product/components/ProductReviewsSection';
import { ProductFaq } from '@/features/product/components/ProductFaq';
import { ProductGrid } from '@/features/product/components/ProductGrid';
import { getEnrichedProductContent } from '@/features/product/data/productContent';
import {
  getProductByHandle,
  getProductsByCategory,
  getTopProductHandles,
} from '@/features/product/queries';
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
  return products.map(({ handle }) => ({ handle }));
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

  const [category, relatedProducts] = await Promise.all([
    getCategoryByHandle(product.primaryCategoryId),
    getProductsByCategory(product.primaryCategoryId, 4),
  ]);

  const filteredRelated = relatedProducts.filter((p) => p.id !== product.id).slice(0, 3);

  // Generate enriched storytelling, snapshot points, tasting notes, and comprehensive FAQs
  const enrichedContent = getEnrichedProductContent(product, category?.name);

  // Product JSON-LD structured data for Google Search rich results
  const productJsonLd = buildProductJsonLd(product);

  // FAQPage JSON-LD structured data for Google Search rich snippets
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

  // BreadcrumbList JSON-LD structured data
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
    <article className="w-full bg-page text-fg pb-16">
      {/* Schema.org Structured Data (Product, FAQ, BreadcrumbList) */}
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

      {/* Dedicated Sticky Product Header (pure white background, separated and sticky) */}
      <ProductHeader product={product} categoryName={category?.name} />

      {/* Top Product Hero Section: seamless flush under sticky header */}
      <div className="w-full">
        <div className="mx-auto max-w-7xl lg:px-8">
          {/* Desktop Breadcrumb Trail */}
          <div className="hidden lg:block pt-1 pb-4">
            <Breadcrumbs items={breadcrumbs} singleLine />
          </div>

          {/* Mobile Single-Line Breadcrumb (At Top of Product Image) */}
          <div className="block lg:hidden px-3 sm:px-4 pt-2.5 pb-2">
            <Breadcrumbs items={breadcrumbs} singleLine />
          </div>

          <div className="grid grid-cols-1 items-start lg:grid-cols-2 lg:gap-12">
            <div className="px-3 sm:px-4 lg:px-0">
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

      {/* 2. Brand & Craft Attributes Bar */}
      <Container className="pt-6 sm:pt-8">
        <ProductAttributeBar
          desktopItems={enrichedContent.desktopAttributeBar}
          mobileItems={enrichedContent.mobileTrustBadges}
        />
      </Container>

      {/* 3. Story Banner & Artisanal Video / Highlights */}
      <Container className="pt-6 sm:pt-8">
        <ProductStoryBanner
          title="The Perfect Blend of Tradition & Taste"
          description={enrichedContent.subtitle}
          imageUrl="/images/home/category-pickle.jpg"
        />
      </Container>

      {/* 4. Tabbed Content (Desktop) & Chevron Accordions (Mobile) */}
      <Container className="pt-8 sm:pt-10">
        <ProductContentGrid
          keyHighlights={enrichedContent.keyHighlights}
          storyNarrative={enrichedContent.heritageStory.narrative.join(' ')}
          ingredients={enrichedContent.ingredientsGrid}
          storageInstructions={enrichedContent.storageInstructions}
          shippingHighlights={enrichedContent.shippingHighlights}
        />
      </Container>

      {/* 5. Customer Reviews & Ratings */}
      <Container className="pt-8 sm:pt-10">
        <div id="section-reviews" className="scroll-mt-36">
          <ProductReviewsSection
            reviews={enrichedContent.reviews}
            rating={enrichedContent.rating}
            productTitle={product.title}
          />
        </div>
      </Container>

      {/* 6. Frequently Asked Questions (FAQ) */}
      <Container className="pt-8 sm:pt-10">
        <div id="section-faqs" className="scroll-mt-36">
          <ProductFaq faqs={enrichedContent.faqs} />
        </div>
      </Container>

      {/* 7. Related Products from the same Kitchen */}
      {filteredRelated.length > 0 && (
        <Container className="pt-10 sm:pt-14 pb-8 sm:pb-12">
          <section
            id="section-related"
            aria-labelledby="related-heading"
            className="space-y-6 scroll-mt-36"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-fg-muted text-xs font-bold tracking-wider uppercase">
                  Handcrafted from the same Kitchen
                </span>
                <h2 id="related-heading" className="text-[20px] font-semibold text-fg leading-snug mt-1 font-serif">
                  You May Also Relish
                </h2>
              </div>
            </div>

            <ProductGrid products={filteredRelated} />
          </section>
        </Container>
      )}
    </article>
  );
}
