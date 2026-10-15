import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { ProductGrid } from '@/features/product/components/ProductGrid';
import { searchProducts } from '@/features/search/queries';
import { buildMetadata } from '@/lib/seo/metadata';

export const instant = false;

interface SearchPageProps {
  searchParams: Promise<{ q?: string | string[] | undefined }>;
}

const POPULAR_SEARCHES = [
  'Banarasi Lal Mirch',
  'Aam Ka Achar',
  'Kaju Katli',
  'Motichoor Ladoo',
  'Peri Peri Makhana',
  'Himalayan Salt Makhana',
];

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = typeof q === 'string' ? q.trim() : '';

  return buildMetadata({
    title: query
      ? `Search Results for "${query}" | Bramhkanti Heritage Foods`
      : 'Search Pure Heritage Foods | Bramhkanti',
    description:
      'Search authentic Banarasi pickles, pure cow ghee sweets, and roasted makhana.',
    canonicalPath: '/search',
    noindex: true,
  });
}

export default async function SearchPage({
  searchParams,
}: SearchPageProps): Promise<ReactNode> {
  const { q } = await searchParams;
  const query = typeof q === 'string' ? q.trim() : '';

  const products = query ? await searchProducts(query, 24) : [];

  const breadcrumbs = [
    { name: 'Search', href: '/search' },
    ...(query ? [{ name: `Results for "${query}"` }] : []),
  ];

  return (
    <div className="space-y-10 py-8 sm:space-y-12 sm:py-12">
      <Container className="space-y-8">
        <Breadcrumbs items={breadcrumbs} />

        {/* Search Input Bar */}
        <div className="border-heritage-border bg-heritage-cream rounded-2xl border p-6 shadow-xs sm:p-8">
          <div className="mx-auto max-w-2xl space-y-4">
            <h1 className="text-heritage-maroon font-serif text-2xl font-bold sm:text-3xl">
              Search Pure Heritage Foods
            </h1>
            <p className="text-heritage-muted text-xs sm:text-sm">
              Discover authentic Varanasi sun-cured pickles, pure cow ghee mithai, and
              slow-roasted foxnuts.
            </p>

            <form method="GET" action="/search" className="relative flex items-center">
              <Search className="text-heritage-muted absolute left-3.5 h-4 w-4" />
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Search by ingredient, dish, or category..."
                className="border-heritage-border bg-heritage-cream-dark/50 text-heritage-charcoal placeholder:text-heritage-muted focus:border-heritage-maroon focus:ring-heritage-maroon/20 w-full rounded-lg border py-2.5 pr-24 pl-10 text-sm focus:ring-2 focus:outline-hidden"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1.5 h-8 px-4 text-xs font-semibold"
              >
                Search
              </Button>
            </form>

            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
              <span className="text-heritage-muted font-medium">Popular:</span>
              {POPULAR_SEARCHES.map((term) => (
                <Link
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="bg-heritage-cream-dark hover:bg-heritage-saffron-light/30 hover:text-heritage-maroon text-heritage-charcoal rounded-md px-2 py-0.5 text-[11px] transition-colors"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Results Section */}
        {query ? (
          <section aria-label={`Search Results for ${query}`} className="space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-heritage-charcoal font-serif text-lg font-bold sm:text-xl">
                {products.length} {products.length === 1 ? 'Result' : 'Results'} for
                &ldquo;{query}&rdquo;
              </h2>
              {products.length > 0 && (
                <span className="text-heritage-muted text-xs">
                  Handcrafted in small batches
                </span>
              )}
            </div>

            <ProductGrid
              products={products}
              emptyMessage={`No heritage foods found matching "${query}". Try searching for popular items like "Aam Ka Achar", "Kaju Katli", or "Makhana".`}
            />
          </section>
        ) : (
          <div className="border-heritage-border bg-heritage-cream-dark/30 rounded-2xl border border-dashed p-12 text-center">
            <Search className="text-heritage-muted mx-auto h-10 w-10 opacity-40" />
            <h2 className="text-heritage-charcoal mt-3 font-serif text-lg font-bold">
              Looking for something delicious?
            </h2>
            <p className="text-heritage-muted mt-1 text-xs">
              Enter a search query above or explore our curated categories below.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Link href="/categories">
                <Button variant="outline" size="sm" className="text-xs">
                  Browse all categories
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
