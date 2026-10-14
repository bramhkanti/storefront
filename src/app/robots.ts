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
          '/profile',
          '/account',
          '/en/profile',
          '/hi/profile',
          '/en/account',
          '/hi/account',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
