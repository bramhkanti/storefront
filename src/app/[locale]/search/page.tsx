import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Container } from '@/components/layout/Container';
import { listCategories } from '@/features/catalog/queries';
import { listProducts } from '@/features/product/queries';
import { buildMetadata } from '@/lib/seo/metadata';
import { SearchClient } from './SearchClient';

export const instant = false;

interface SearchPageProps {
  searchParams: Promise<{ q?: string | string[] | undefined }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = typeof q === 'string' ? q.trim() : '';

  return buildMetadata({
    title: query
      ? `Search Results for "${query}" | Bramhkanti`
      : 'Search Authentic Indian Foods | Bramhkanti',
    description:
      'Search our collection of handcrafted Banarasi pickles, pure cow ghee sweets, and roasted makhana.',
    canonicalPath: '/search',
    noindex: true,
  });
}

export default async function SearchPage({
  searchParams,
}: SearchPageProps): Promise<ReactNode> {
  const { q } = await searchParams;
  const initialQuery = typeof q === 'string' ? q.trim() : '';

  // Parallel fetching of catalog and categories
  const [categories, productsResult] = await Promise.all([
    listCategories(),
    listProducts({ limit: 100 }),
  ]);

  return (
    <div className="space-y-8 py-8 sm:space-y-10 sm:py-12 bg-page text-fg min-h-[70vh]">
      <Container className="space-y-6 sm:space-y-8">
        {/* Client Search and Filter Engine */}
        <SearchClient
          initialProducts={productsResult.items}
          categories={categories}
          initialQuery={initialQuery}
        />
      </Container>
    </div>
  );
}
