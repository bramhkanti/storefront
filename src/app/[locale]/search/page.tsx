import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Search, SearchX } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ProductGrid } from '@/features/product/components/ProductGrid';
import { getCategoryTree } from '@/features/catalog/queries';
import { ListingShell } from '@/features/catalog/components/ListingShell';
import {
  applyListing,
  parseListingParams,
  rootCategoryFacets,
} from '@/features/catalog/listing';
import { getSearchSeeds, searchCatalog } from '@/features/search/queries';
import { buildMetadata } from '@/lib/seo/metadata';

export const instant = false;

interface SearchPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function readQuery(raw: Record<string, string | string[] | undefined>): string {
  const q = Array.isArray(raw.q) ? raw.q[0] : raw.q;
  return (q ?? '').trim().slice(0, 80);
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const query = readQuery(await searchParams);

  return buildMetadata({
    title: query
      ? `Search results for "${query}" | Bramhkanti Heritage Foods`
      : 'Search | Bramhkanti',
    description:
      'Search authentic Banarasi pickles, pure cow ghee sweets, and roasted makhana.',
    canonicalPath: '/search',
    noindex: true,
  });
}

export default async function SearchPage({
  searchParams,
}: SearchPageProps): Promise<ReactNode> {
  const raw = await searchParams;
  const query = readQuery(raw);
  const listingParams = parseListingParams(raw);

  const [result, seeds, tree] = await Promise.all([
    query ? searchCatalog(query) : Promise.resolve(null),
    getSearchSeeds(),
    getCategoryTree(),
  ]);

  const listing = result
    ? applyListing(result.products, listingParams, rootCategoryFacets(tree))
    : null;

  const suggestions = seeds.categories.slice(0, 8);

  return (
    <div className="pb-16 sm:pb-24">
      <Container className="space-y-8 pt-6 sm:pt-8">
        <Breadcrumbs
          items={[
            { name: 'Search', href: '/search' },
            ...(query ? [{ name: `"${query}"` }] : []),
          ]}
        />

        <header className="space-y-5">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {query ? (
              <>
                Results for{' '}
                <span className="text-heritage-maroon">&ldquo;{query}&rdquo;</span>
              </>
            ) : (
              'Search'
            )}
          </h1>

          <form
            method="GET"
            action="/search"
            role="search"
            className="relative max-w-2xl"
          >
            <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-neutral-400" />
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search pickles, makhana, sweets…"
              aria-label="Search products"
              enterKeyHint="search"
              className="focus:border-heritage-maroon focus:ring-heritage-maroon/15 h-14 w-full rounded-2xl border border-neutral-200 bg-white pr-28 pl-12 text-base shadow-xs outline-none focus:ring-4 dark:border-neutral-700 dark:bg-neutral-900"
            />
            <button
              type="submit"
              className="bg-heritage-maroon hover:bg-heritage-maroon-dark absolute top-1/2 right-2 h-10 -translate-y-1/2 rounded-xl px-5 text-sm font-semibold text-white transition-colors"
            >
              Search
            </button>
          </form>

          {result && result.categories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-heritage-muted">Matching categories:</span>
              {result.categories.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className="hover:border-heritage-maroon hover:text-heritage-maroon inline-flex h-8 items-center rounded-full border border-neutral-200 bg-white px-3 font-medium transition-colors dark:border-neutral-700 dark:bg-neutral-900"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          )}
        </header>

        {listing && listing.unfilteredTotal > 0 ? (
          <section aria-label={`Search results for ${query}`}>
            <ListingShell params={listingParams} result={listing} preserve={{ q: query }}>
              <ProductGrid products={listing.items} />
            </ListingShell>
          </section>
        ) : (
          <section className="rounded-3xl border border-dashed border-neutral-300 px-6 py-14 text-center sm:py-20 dark:border-neutral-700">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
              {query ? (
                <SearchX className="text-heritage-muted h-6 w-6" />
              ) : (
                <Search className="text-heritage-muted h-6 w-6" />
              )}
            </div>
            <h2 className="mt-4 text-xl font-semibold">
              {query ? `Nothing found for "${query}"` : 'What are you craving today?'}
            </h2>
            <p className="text-heritage-muted mx-auto mt-2 max-w-md text-sm">
              {query
                ? 'Check the spelling, try fewer words, or browse a category below.'
                : 'Search by product, ingredient or flavour, or start with a category.'}
            </p>
            {suggestions.length > 0 && (
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {suggestions.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    className="hover:border-heritage-maroon hover:text-heritage-maroon inline-flex h-9 items-center rounded-full border border-neutral-200 bg-white px-4 text-sm font-medium transition-colors dark:border-neutral-700 dark:bg-neutral-900"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}

        {(!listing || listing.unfilteredTotal === 0) && seeds.products.length > 0 && (
          <section aria-labelledby="popular-heading" className="space-y-5 pt-4">
            <h2 id="popular-heading" className="text-2xl font-semibold tracking-tight">
              Popular right now
            </h2>
            <ProductGrid products={seeds.products} />
          </section>
        )}
      </Container>
    </div>
  );
}
