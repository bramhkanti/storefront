import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import {
  HomeHero,
  SignatureRange,
  TrustBar,
  HeritageStory,
  Testimonials,
  PromoBanner,
  SIGNATURE_RANGE_ITEMS,
  resolveSignatureRange,
} from '@/features/home';
import { getCategoryTree } from '@/features/catalog/queries';
import { listCollections } from '@/features/collection/queries';
import { ProductShowcase } from '@/features/product/components/ProductShowcase';
import { getFeaturedProducts } from '@/features/product/queries';
import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  buildItemListJsonLd,
} from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';
import {
  DEFAULT_LOCALE,
  isSupportedLocale,
  getNamespaceDictionary,
  type Locale,
} from '@/lib/i18n';
import { SITE_CONFIG } from '@/content/site';

export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = (isSupportedLocale(locale) ? locale : DEFAULT_LOCALE) as Locale;
  const commonDict = await getNamespaceDictionary(safeLocale, 'common');

  return buildMetadata({
    title: commonDict.brand.tagline,
    description: commonDict.brand.description,
    canonicalPath: '/',
    ogType: 'website',
    locale: safeLocale,
  });
}

export default async function HomePage(): Promise<ReactNode> {
  const [categories, collections, featured] = await Promise.all([
    getCategoryTree(),
    listCollections(),
    getFeaturedProducts(8),
  ]);
  const signatureItems = resolveSignatureRange(
    SIGNATURE_RANGE_ITEMS,
    categories,
    collections,
  );
  const primaryCategory = categories[0];

  const organizationJsonLd = buildOrganizationJsonLd();
  const webSiteJsonLd = buildWebSiteJsonLd();

  // ItemList structured data dynamically mapped from single source of truth
  const categoryItemListJsonLd = buildItemListJsonLd(
    signatureItems.map((item) => ({
      name: `${item.name} (${item.tagline})`,
      href: item.href,
    })),
    {
      name: `${SITE_CONFIG.brand.name} Signature Collections`,
    },
  );

  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Schema.org WebSite, Organization & ItemList Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryItemListJsonLd) }}
      />

      {/* 1. Hero Banner with Focal Barnie Jar & Calligraphy Badge */}
      <HomeHero
        {...(primaryCategory
          ? {
              primaryHref: `/${primaryCategory.handle}`,
              primaryLabel: `Shop ${primaryCategory.name}`,
            }
          : {})}
      />

      {/* 2. Signature Range: 4 Category Cards (Achar, Makhana, Sweets, Gifting) */}
      <SignatureRange items={signatureItems} />

      {/* Live products from the store */}
      <ProductShowcase
        eyebrow="Fresh from our kitchen"
        title="Bestsellers"
        products={featured}
        viewAllHref={primaryCategory ? `/${primaryCategory.handle}` : '/categories'}
      />

      {/* 3. Value Proposition Strip: 5 Guarantees and Trust Pillars */}
      <TrustBar />

      {/* 4. Heritage Story: Atmospheric Spices Imagery & Legacy Storytelling */}
      <HeritageStory />

      {/* 5. Social Proof: 5-Star Reviews with Schema.org Aggregate Rating */}
      <Testimonials />

      {/* 6. Promotional Banner: Deep Crimson Gradient CTA & Trust Tags */}
      <PromoBanner />
    </div>
  );
}
