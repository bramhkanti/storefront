import type { Metadata } from 'next';
import { publicEnv } from '@/lib/env.public';
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  LOCALE_METADATA,
  type Locale,
} from '@/lib/i18n';

export interface BuildMetadataParams {
  title: string;
  description: string;
  canonicalPath?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  noindex?: boolean;
  locale?: Locale;
  robots?: Metadata['robots'];
}

/**
 * Standardized SEO Metadata builder enforcing consistent canonical URLs,
 * multi-language hreflang alternates (en-IN, hi-IN, x-default),
 * OpenGraph attributes, Twitter Cards, and robot index directives.
 */
export function buildMetadata({
  title,
  description,
  canonicalPath = '',
  ogType = 'website',
  ogImage,
  noindex = false,
  locale = DEFAULT_LOCALE,
  robots,
}: BuildMetadataParams): Metadata {
  const siteUrl = publicEnv.NEXT_PUBLIC_SITE_URL;
  const normalizedPath = canonicalPath.startsWith('/')
    ? canonicalPath
    : `/${canonicalPath}`;
  const pathWithoutSlash = normalizedPath === '/' ? '' : normalizedPath;

  // Self-referencing canonical URL based on active locale
  const selfCanonicalUrl =
    locale === 'en'
      ? `${siteUrl}${pathWithoutSlash || '/'}`
      : `${siteUrl}/${locale}${pathWithoutSlash}`;

  const defaultImage = `${siteUrl}/images/og-default.jpg`;
  const image = ogImage ?? defaultImage;

  const ogLocale = locale === 'hi' ? 'hi_IN' : 'en_IN';

  const languageAlternates: Record<string, string> = {
    'x-default': `${siteUrl}${pathWithoutSlash || '/'}`,
  };

  for (const loc of SUPPORTED_LOCALES) {
    const meta = LOCALE_METADATA[loc];
    languageAlternates[meta.bcp47] =
      loc === DEFAULT_LOCALE
        ? `${siteUrl}${pathWithoutSlash || '/'}`
        : `${siteUrl}/${loc}${pathWithoutSlash}`;
  }

  return {
    title,
    description,
    alternates: {
      canonical: selfCanonicalUrl,
      languages: languageAlternates,
    },
    openGraph: {
      title,
      description,
      url: selfCanonicalUrl,
      siteName: publicEnv.NEXT_PUBLIC_BRAND_NAME,
      locale: ogLocale,
      type: ogType,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    robots:
      robots ??
      (noindex
        ? {
            index: false,
            follow: false,
            nocache: true,
            googleBot: {
              index: false,
              follow: false,
              noimageindex: true,
              'max-video-preview': -1,
              'max-image-preview': 'none',
              'max-snippet': -1,
            },
          }
        : {
            index: true,
            follow: true,
            googleBot: {
              index: true,
              follow: true,
              'max-video-preview': -1,
              'max-image-preview': 'large',
              'max-snippet': -1,
            },
          }),
  };
}
