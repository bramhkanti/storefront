import type { MetadataRoute } from 'next';
import { publicEnv } from '@/lib/env.public';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = publicEnv.NEXT_PUBLIC_SITE_URL;

  return {
    rules: [
      {
        userAgent: '*',
        disallow: [
          '/cart',
          '/checkout',
          '/order-confirmed',
          '/api/',
          '/search',
          '/en/search',
          '/hi/search',
          '/profile',
          '/account',
          '/en/profile',
          '/hi/profile',
          '/en/account',
          '/hi/account',
        ],
      },
    ],
    // sitemap.ts splits into one file per section (generateSitemaps), so there is no /sitemap.xml.
    sitemap: ['pages', 'categories', 'collections', 'products'].map(
      (id) => `${baseUrl}/sitemap/${id}.xml`,
    ),
    host: baseUrl,
  };
}
