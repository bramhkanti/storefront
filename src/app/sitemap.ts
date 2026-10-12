import type { MetadataRoute } from 'next';
import {
  getCategoryReader,
  getCollectionReader,
  getProductReader,
} from '@/lib/api/container';
import { publicEnv } from '@/lib/env.public';
import { SUPPORTED_LOCALES } from '@/lib/i18n';

/**
 * Generate discrete sitemap chunks to stay well beneath Google's 50,000 URL limit
 * per sitemap file and optimize search engine crawl prioritization across all
 * supported regional Indian languages.
 */
export async function generateSitemaps(): Promise<
  Array<{ id: 'products' | 'categories' | 'collections' | 'pages' }>
> {
  return [
    { id: 'pages' },
    { id: 'categories' },
    { id: 'collections' },
    { id: 'products' },
  ];
}

export default async function sitemap({
  id,
}: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const sitemapId = await id;
  const baseUrl = publicEnv.NEXT_PUBLIC_SITE_URL;
  const staticDate = new Date('2026-10-11T00:00:00.000Z');

  // Helper to expand a relative route across all supported locales
  const expandLocalizedEntries = (
    path: string,
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'],
    priority: number,
    lastModified = staticDate,
  ): MetadataRoute.Sitemap => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const normalized = cleanPath === '/' ? '' : cleanPath;

    return SUPPORTED_LOCALES.map((locale) => {
      const localeUrl =
        locale === 'en'
          ? `${baseUrl}${normalized || '/'}`
          : `${baseUrl}/${locale}${normalized}`;

      return {
        url: localeUrl,
        lastModified,
        changeFrequency,
        priority: locale === 'en' ? priority : Math.max(0.1, priority - 0.1),
      };
    });
  };

  if (sitemapId === 'pages') {
    return [
      ...expandLocalizedEntries('/', 'daily', 1.0),
      ...expandLocalizedEntries('/collections', 'weekly', 0.8),
      ...expandLocalizedEntries('/policies/shipping', 'monthly', 0.5),
      ...expandLocalizedEntries('/policies/refund', 'monthly', 0.5),
      ...expandLocalizedEntries('/policies/privacy', 'monthly', 0.5),
      ...expandLocalizedEntries('/policies/terms', 'monthly', 0.5),
    ];
  }

  if (sitemapId === 'categories') {
    const categoryReader = getCategoryReader();
    const categories = await categoryReader.listCategories();
    const entries: MetadataRoute.Sitemap = [];

    for (const cat of categories) {
      entries.push(...expandLocalizedEntries(`/${cat.handle}`, 'daily', 0.9));

      if (cat.children && cat.children.length > 0) {
        for (const sub of cat.children) {
          entries.push(
            ...expandLocalizedEntries(`/${cat.handle}/${sub.handle}`, 'weekly', 0.8),
          );
        }
      }
    }

    return entries;
  }

  if (sitemapId === 'collections') {
    const collectionReader = getCollectionReader();
    const collections = await collectionReader.listCollections();
    const entries: MetadataRoute.Sitemap = [];

    for (const col of collections) {
      entries.push(
        ...expandLocalizedEntries(`/collections/${col.handle}`, 'weekly', 0.8),
      );
    }

    return entries;
  }

  if (sitemapId === 'products') {
    const productReader = getProductReader();
    const result = await productReader.listProducts({ limit: 50000 });
    const entries: MetadataRoute.Sitemap = [];

    for (const prod of result.items) {
      entries.push(
        ...expandLocalizedEntries(
          `/products/${prod.handle}`,
          'weekly',
          0.8,
          new Date(prod.updatedAt),
        ),
      );
    }

    return entries;
  }

  return [];
}
