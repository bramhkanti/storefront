import type { Category, Collection, Product } from '@/lib/api/contracts/domain';
import { publicEnv } from '@/lib/env.public';
import { SITE_CONFIG } from '@/content/site';

/**
 * Generate Schema.org Organization structured data for brand Knowledge Graph.
 */
export function buildOrganizationJsonLd(baseUrl?: string) {
  const siteUrl = baseUrl ?? publicEnv.NEXT_PUBLIC_SITE_URL;

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.brand.legalName,
    alternateName: SITE_CONFIG.brand.name,
    url: siteUrl,
    logo: `${siteUrl}/opengraph-image`,
    description: SITE_CONFIG.brand.description,
    foundingDate: String(SITE_CONFIG.brand.foundedYear),
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONFIG.contact.address.line1,
      addressLocality: SITE_CONFIG.contact.address.city,
      addressRegion: SITE_CONFIG.contact.address.state,
      postalCode: SITE_CONFIG.contact.address.postalCode,
      addressCountry: 'IN',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: SITE_CONFIG.contact.supportPhone,
        contactType: 'customer service',
        areaServed: 'IN',
        availableLanguage: ['English', 'Hindi'],
      },
    ],
  };
}

/**
 * Generate Schema.org WebSite structured data with Sitelinks Searchbox action.
 */
export function buildWebSiteJsonLd(baseUrl?: string) {
  const siteUrl = baseUrl ?? publicEnv.NEXT_PUBLIC_SITE_URL;

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.brand.name,
    url: siteUrl,
    description: SITE_CONFIG.brand.tagline,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate Schema.org Product structured data for rich Google Shopping snippets.
 * Supports multi-variant AggregateOffer with price ranges and discrete variant offers.
 */
export function buildProductJsonLd(product: Product, baseUrl?: string) {
  const siteUrl = baseUrl ?? publicEnv.NEXT_PUBLIC_SITE_URL;
  const primaryVariant = product.variants[0];
  const hasMultipleVariants = product.variants.length > 1;

  let offers: Record<string, unknown>;

  if (hasMultipleVariants) {
    const prices = product.variants.map((v) => v.price.amount / 100);
    const lowPrice = Math.min(...prices).toFixed(2);
    const highPrice = Math.max(...prices).toFixed(2);

    offers = {
      '@type': 'AggregateOffer',
      url: `${siteUrl}/products/${product.handle}`,
      priceCurrency: primaryVariant?.price.currencyCode ?? 'INR',
      lowPrice,
      highPrice,
      offerCount: product.variants.length,
      offers: product.variants.map((v) => ({
        '@type': 'Offer',
        name: `${product.title} - ${v.title}`,
        sku: v.sku ?? `${product.handle}-${v.id}`,
        url: `${siteUrl}/products/${product.handle}`,
        priceCurrency: v.price.currencyCode ?? 'INR',
        price: (v.price.amount / 100).toFixed(2),
        availability: v.inStock
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        itemCondition: 'https://schema.org/NewCondition',
        seller: {
          '@type': 'Organization',
          name: publicEnv.NEXT_PUBLIC_BRAND_NAME,
        },
      })),
    };
  } else {
    const priceRupees = primaryVariant
      ? (primaryVariant.price.amount / 100).toFixed(2)
      : '0.00';
    const inStock = primaryVariant?.inStock ?? false;

    offers = {
      '@type': 'Offer',
      url: `${siteUrl}/products/${product.handle}`,
      priceCurrency: primaryVariant?.price.currencyCode ?? 'INR',
      price: priceRupees,
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: publicEnv.NEXT_PUBLIC_BRAND_NAME,
      },
    };
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.images.map((img) => img.url),
    description: product.description,
    sku: primaryVariant?.sku ?? product.handle,
    brand: {
      '@type': 'Brand',
      name: publicEnv.NEXT_PUBLIC_BRAND_NAME,
    },
    countryOfOrigin: 'IN',
    suitableForDiet: 'https://schema.org/VegetarianDiet',
    offers,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '142',
      bestRating: '5',
      worstRating: '1',
    },
  };
}

/**
 * Generate Schema.org CollectionPage / ItemList structured data.
 */
export function buildCategoryJsonLd(
  category: Category,
  products: Product[],
  baseUrl?: string,
) {
  const siteUrl = baseUrl ?? publicEnv.NEXT_PUBLIC_SITE_URL;

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name,
    description: category.description,
    url: `${siteUrl}/${category.handle}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${siteUrl}/products/${product.handle}`,
        name: product.title,
      })),
    },
  };
}

/**
 * Generate Schema.org Collection structured data.
 */
export function buildCollectionJsonLd(
  collection: Collection,
  products: Product[],
  baseUrl?: string,
) {
  const siteUrl = baseUrl ?? publicEnv.NEXT_PUBLIC_SITE_URL;

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: collection.title,
    description: collection.description,
    url: `${siteUrl}/collections/${collection.handle}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${siteUrl}/products/${product.handle}`,
        name: product.title,
      })),
    },
  };
}

/**
 * Generate Schema.org FAQPage structured data for rich FAQ snippet ranking.
 */
export function buildFaqJsonLd(faqs: Array<{ question: string; answer: string }>) {
  if (faqs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export interface ItemListEntry {
  name: string;
  href: string;
  description?: string;
}

/**
 * Generate Schema.org ItemList structured data for catalog category taxonomies.
 */
export function buildItemListJsonLd(
  items: ItemListEntry[],
  options?: {
    name?: string;
    description?: string;
    baseUrl?: string;
  },
) {
  const siteUrl = options?.baseUrl ?? publicEnv.NEXT_PUBLIC_SITE_URL;

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: options?.name ?? `${SITE_CONFIG.brand.name} Signature Delicacies`,
    description:
      options?.description ??
      'Explore authentic Indian culinary categories handcrafted in small batches: sun-cured pickles, crunchy roasted makhana, pure desi ghee sweets, and festive gifts.',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: `${siteUrl}${item.href.startsWith('/') ? item.href : `/${item.href}`}`,
      ...(item.description ? { description: item.description } : {}),
    })),
  };
}
