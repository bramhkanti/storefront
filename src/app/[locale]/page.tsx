import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import {
  HomeHero,
  SignatureRange,
  TrustBar,
  HeritageStory,
  CustomerReviews,
  PromoBanner,
  CollectionSpotlight,
  BRAND_HERO_SLIDE,
  SIGNATURE_RANGE_ITEMS,
  resolveSignatureRange,
  type HeroSlide,
} from '@/features/home';
import { getCategoryTree } from '@/features/catalog/queries';
import { listCollections } from '@/features/collection/queries';
import { ProductShowcase } from '@/features/product/components/ProductShowcase';
import { getFeaturedProducts } from '@/features/product/queries';
import { getLatestReviews } from '@/features/product/reviews.queries';
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
  const [categories, collections, featured, latestReviews] = await Promise.all([
    getCategoryTree(),
    listCollections(),
    getFeaturedProducts(8),
    getLatestReviews(6),
  ]);
  const signatureItems = resolveSignatureRange(
    SIGNATURE_RANGE_ITEMS,
    categories,
    collections,
  );
  const primaryCategory = categories[0];

  // Brand slide first, then one slide per collection with a banner (set in the admin).
  const heroSlides: HeroSlide[] = [
    {
      ...BRAND_HERO_SLIDE,
      ...(primaryCategory
        ? {
            ctaHref: `/${primaryCategory.handle}`,
            ctaLabel: `Shop ${primaryCategory.name}`,
          }
        : {}),
    },
    ...collections.flatMap((c): HeroSlide[] =>
      c.image
        ? [
            {
              id: `hero_${c.handle}`,
              eyebrow: c.badge ?? c.subtitle,
              title: c.title,
              description: c.description || undefined,
              imageUrl: c.image.url,
              mobileImageUrl: c.mobileImage?.url,
              imageAlt: c.image.altText ?? c.title,
              ctaLabel: `Shop ${c.title}`,
              ctaHref: `/collections/${c.handle}`,
              secondaryLabel: 'All collections',
              secondaryHref: '/collections',
            },
          ]
        : [],
    ),
  ];

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
    <div className="pb-8">
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

      {/* 1. Banner slider: brand story + collection banners */}
      <HomeHero slides={heroSlides} />

      {/* 2. Promises strip */}
      <TrustBar />

      {/* 3. Shop by category */}
      <SignatureRange items={signatureItems} />

      {/* 4. Live products from the store */}
      <ProductShowcase
        eyebrow="Fresh from our kitchen"
        title="Bestsellers"
        products={featured}
        viewAllHref={
          collections.some((c) => c.handle === 'best-sellers')
            ? '/collections/best-sellers'
            : '/categories'
        }
      />

      {/* 5. Collection banners */}
      <CollectionSpotlight collections={collections} />

      {/* 6. Brand story */}
      <HeritageStory />

      {/* 7. Real customer reviews (hidden until there are approved ones) */}
      <CustomerReviews reviews={latestReviews} />

      {/* 8. Closing call to action */}
      <PromoBanner />
    </div>
  );
}
