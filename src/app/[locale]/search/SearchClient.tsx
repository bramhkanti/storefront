'use client';

import * as React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { SlidersHorizontal, ArrowUpDown, SearchX, RotateCcw } from 'lucide-react';
import type { Category, Product } from '@/lib/api/contracts/domain';
import { ProductGrid } from '@/features/product/components/ProductGrid';
import { ActiveFilterChips } from '@/features/search/components/ActiveFilterChips';
import { DesktopFilterSidebar } from '@/features/search/components/DesktopFilterSidebar';
import { MobileFilterDrawer } from '@/features/search/components/MobileFilterDrawer';
import { MobileSortDrawer } from '@/features/search/components/MobileSortDrawer';
import { SearchInput } from '@/features/search/components/SearchInput';
import {
  DEFAULT_FILTERS,
  PRICE_RANGES,
  SORT_OPTIONS,
  type FilterState,
  type SortOption,
} from '@/features/search/types';

export interface SearchClientProps {
  initialProducts: Product[];
  categories: Category[];
  initialQuery?: string;
}

export function SearchClient({
  initialProducts,
  categories,
  initialQuery = '',
}: SearchClientProps): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Initialize State from URL query params
  const [query, setQuery] = React.useState<string>(searchParams.get('q') ?? initialQuery);
  const [filters, setFilters] = React.useState<FilterState>({
    category: searchParams.get('category') ?? DEFAULT_FILTERS.category,
    priceRange: searchParams.get('price') ?? DEFAULT_FILTERS.priceRange,
    spiceLevel: searchParams.get('spice') ?? DEFAULT_FILTERS.spiceLevel,
    oilBase: searchParams.get('oil') ?? DEFAULT_FILTERS.oilBase,
    inStockOnly: searchParams.get('instock') === 'true',
  });
  const [sort, setSort] = React.useState<SortOption>(
    (searchParams.get('sort') as SortOption) ?? 'featured',
  );

  // Mobile Drawer toggles
  const [isMobileFilterOpen, setIsMobileFilterOpen] = React.useState(false);
  const [isMobileSortOpen, setIsMobileSortOpen] = React.useState(false);

  // 2. Sync State changes to URL query parameters
  const syncToUrl = React.useCallback(
    (newQuery: string, newFilters: FilterState, newSort: SortOption) => {
      const params = new URLSearchParams();
      if (newQuery.trim()) params.set('q', newQuery.trim());
      if (newFilters.category !== 'all') params.set('category', newFilters.category);
      if (newFilters.priceRange !== 'all') params.set('price', newFilters.priceRange);
      if (newFilters.spiceLevel !== 'all') params.set('spice', newFilters.spiceLevel);
      if (newFilters.oilBase !== 'all') params.set('oil', newFilters.oilBase);
      if (newFilters.inStockOnly) params.set('instock', 'true');
      if (newSort !== 'featured') params.set('sort', newSort);

      const qs = params.toString();
      const targetUrl = qs ? `${pathname}?${qs}` : pathname;
      router.replace(targetUrl, { scroll: false });
    },
    [pathname, router],
  );

  const handleQueryChange = (newQ: string) => {
    setQuery(newQ);
    syncToUrl(newQ, filters, sort);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    syncToUrl(query, newFilters, sort);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSort(newSort);
    syncToUrl(query, filters, newSort);
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    syncToUrl(query, DEFAULT_FILTERS, sort);
  };

  const handleResetAll = () => {
    setQuery('');
    setFilters(DEFAULT_FILTERS);
    setSort('featured');
    router.replace(pathname, { scroll: false });
  };

  // 3. Category ID mapping helper (supports parent and children)
  const categoryIdSet = React.useMemo(() => {
    if (filters.category === 'all') return null;
    const cat = categories.find((c) => c.handle === filters.category);
    if (!cat) return new Set([filters.category]);

    const ids = new Set<string>([cat.id, cat.handle]);
    if (cat.children) {
      for (const child of cat.children) {
        ids.add(child.id);
        ids.add(child.handle);
      }
    }
    return ids;
  }, [categories, filters.category]);

  // 4. Client-side Filtering & Sorting Pipeline
  const filteredAndSortedProducts = React.useMemo(() => {
    let result = initialProducts;

    // Filter A: Search Query
    const q = query.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.handle.toLowerCase().includes(q),
      );
    }

    // Filter B: Category
    if (categoryIdSet) {
      result = result.filter(
        (p) =>
          categoryIdSet.has(p.primaryCategoryId) ||
          p.categoryIds.some((cid) => categoryIdSet.has(cid)),
      );
    }

    // Filter C: Price Range
    if (filters.priceRange !== 'all') {
      const rangeOpt = PRICE_RANGES.find((r) => r.value === filters.priceRange);
      if (rangeOpt) {
        result = result.filter((p) => {
          const prices = p.variants.map((v) => v.price.amount / 100);
          const minPrice = Math.min(...prices);
          if (rangeOpt.min !== undefined && minPrice < rangeOpt.min) return false;
          if (rangeOpt.max !== undefined && minPrice > rangeOpt.max) return false;
          return true;
        });
      }
    }

    // Filter D: Spice Level
    if (filters.spiceLevel !== 'all') {
      result = result.filter(
        (p) =>
          p.attributes?.spiceLevel === filters.spiceLevel ||
          (p.foodAttributes as unknown as { spiceLevel?: string })?.spiceLevel ===
            filters.spiceLevel,
      );
    }

    // Filter E: Cooking Medium / Base Fat
    if (filters.oilBase !== 'all') {
      if (filters.oilBase === 'mustard') {
        result = result.filter(
          (p) =>
            typeof p.attributes?.oilType === 'string' &&
            p.attributes.oilType.toLowerCase().includes('mustard'),
        );
      } else if (filters.oilBase === 'ghee') {
        result = result.filter(
          (p) =>
            (typeof p.attributes?.gheeType === 'string' &&
              p.attributes.gheeType.toLowerCase().includes('ghee')) ||
            (typeof p.attributes?.roastType === 'string' &&
              p.attributes.roastType.toLowerCase().includes('ghee')),
        );
      } else if (filters.oilBase === 'oil-free') {
        result = result.filter(
          (p) =>
            p.tags.includes('oil-free') ||
            (typeof p.attributes?.oilType === 'string' &&
              (p.attributes.oilType.toLowerCase().includes('sun dried') ||
                p.attributes.oilType.toLowerCase().includes('oil free'))),
        );
      }
    }

    // Filter F: In Stock Only
    if (filters.inStockOnly) {
      result = result.filter((p) => p.variants.some((v) => v.inStock));
    }

    // Sorting
    const sorted = [...result];
    switch (sort) {
      case 'price-asc':
        sorted.sort((a, b) => {
          const pA = Math.min(...a.variants.map((v) => v.price.amount));
          const pB = Math.min(...b.variants.map((v) => v.price.amount));
          return pA - pB;
        });
        break;
      case 'price-desc':
        sorted.sort((a, b) => {
          const pA = Math.min(...a.variants.map((v) => v.price.amount));
          const pB = Math.min(...b.variants.map((v) => v.price.amount));
          return pB - pA;
        });
        break;
      case 'rating':
        // Highest average from approved reviews; ties by review count.
        sorted.sort(
          (a, b) =>
            (b.rating?.average ?? 0) - (a.rating?.average ?? 0) ||
            (b.rating?.count ?? 0) - (a.rating?.count ?? 0),
        );
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'featured':
      default:
        // Default catalog order
        break;
    }

    return sorted;
  }, [initialProducts, query, categoryIdSet, filters, sort]);

  // Active filter count
  const activeFilterCount =
    (filters.category !== 'all' ? 1 : 0) +
    (filters.priceRange !== 'all' ? 1 : 0) +
    (filters.spiceLevel !== 'all' ? 1 : 0) +
    (filters.oilBase !== 'all' ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0);

  const currentSortLabel =
    SORT_OPTIONS.find((s) => s.value === sort)?.label ?? 'Featured';

  return (
    <div className="space-y-8">
      {/* 1. Sleek Search Input Banner */}
      <SearchInput query={query} onChange={handleQueryChange} autoFocus={!initialQuery} />

      {/* 2. Mobile Interactive Control Bar (Filters Drawer & Sort Drawer triggers) */}
      <div className="flex items-center gap-2.5 lg:hidden">
        {/* Mobile Filter Trigger Button */}
        <button
          type="button"
          onClick={() => setIsMobileFilterOpen(true)}
          className="border-line bg-surface text-fg hover:border-brand-600 flex flex-1 items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-xs font-bold shadow-xs transition-colors"
        >
          <SlidersHorizontal className="text-brand-600 h-4 w-4" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-brand-50 text-brand-700 border-brand-600/30 flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Mobile Sort Trigger Button */}
        <button
          type="button"
          onClick={() => setIsMobileSortOpen(true)}
          className="border-line bg-surface text-fg hover:border-brand-600 flex flex-1 items-center justify-center gap-2 truncate rounded-2xl border px-4 py-3 text-xs font-bold shadow-xs transition-colors"
        >
          <ArrowUpDown className="text-brand-600 h-4 w-4 shrink-0" />
          <span className="truncate">Sort: {currentSortLabel.split(':')[0]}</span>
        </button>
      </div>

      {/* 3. Main Catalog Layout (Desktop Left Filter Sidebar + Right Products Grid) */}
      <div className="flex items-start gap-8">
        {/* Desktop Left-Side Sticky Filter Sidebar */}
        <DesktopFilterSidebar
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
          categories={categories}
          activeFilterCount={activeFilterCount}
          className="hidden lg:block"
        />

        {/* Right-Side Products Showcase */}
        <main className="min-w-0 flex-1 space-y-5">
          {/* Top Control & Results Summary Bar */}
          <div className="border-line flex flex-col justify-between gap-3 border-b pb-3.5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-fg font-sans text-base font-bold sm:text-lg">
                {query ? (
                  <>
                    Showing {filteredAndSortedProducts.length}{' '}
                    {filteredAndSortedProducts.length === 1 ? 'result' : 'results'} for
                    &ldquo;{query}&rdquo;
                  </>
                ) : (
                  <>Catalog Items ({filteredAndSortedProducts.length})</>
                )}
              </h2>
              <p className="text-fg-muted mt-0.5 text-xs">
                Authentic handcrafted Indian delicacies dispatched fresh from Varanasi
              </p>
            </div>

            {/* Desktop Sort Dropdown */}
            <div className="hidden items-center gap-2 self-start sm:flex sm:self-auto">
              <span className="text-fg-muted text-xs font-semibold whitespace-nowrap">
                Sort By:
              </span>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => handleSortChange(e.target.value as SortOption)}
                  aria-label="Sort products by"
                  className="border-line bg-surface text-fg hover:border-brand-600 focus:border-brand-600 cursor-pointer rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors focus:outline-hidden"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          <ActiveFilterChips
            filters={filters}
            categories={categories}
            onRemoveCategory={() => handleFilterChange({ ...filters, category: 'all' })}
            onRemovePrice={() => handleFilterChange({ ...filters, priceRange: 'all' })}
            onRemoveSpice={() => handleFilterChange({ ...filters, spiceLevel: 'all' })}
            onRemoveOil={() => handleFilterChange({ ...filters, oilBase: 'all' })}
            onRemoveInStock={() => handleFilterChange({ ...filters, inStockOnly: false })}
            onResetAll={handleResetFilters}
          />

          {/* Products Grid or Rich Empty State */}
          {filteredAndSortedProducts.length > 0 ? (
            <ProductGrid products={filteredAndSortedProducts} />
          ) : (
            <div className="border-line bg-surface space-y-4 rounded-3xl border p-8 text-center sm:p-12">
              <div className="bg-surface-soft text-fg-muted mx-auto flex h-14 w-14 items-center justify-center rounded-2xl">
                <SearchX className="h-7 w-7 opacity-60" />
              </div>
              <div className="space-y-1">
                <h3 className="text-fg text-base font-bold sm:text-lg">
                  No delicacies match your search criteria
                </h3>
                <p className="text-fg-muted mx-auto max-w-md text-xs leading-relaxed sm:text-sm">
                  We couldn&apos;t find any products matching your specific combination of
                  keywords and filters. Try clearing some filters or searching for our
                  most loved staples.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetAll}
                  className="bg-primary hover:bg-primary-hover inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset All Filters & Search</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 4. Mobile Drawers */}
      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
        categories={categories}
        activeFilterCount={activeFilterCount}
        resultsCount={filteredAndSortedProducts.length}
      />

      <MobileSortDrawer
        isOpen={isMobileSortOpen}
        onClose={() => setIsMobileSortOpen(false)}
        currentSort={sort}
        onSelectSort={handleSortChange}
      />
    </div>
  );
}
