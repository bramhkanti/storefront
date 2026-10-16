'use client';

import * as React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  SlidersHorizontal,
  ArrowUpDown,
  SearchX,
  RotateCcw,
} from 'lucide-react';
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
  const [query, setQuery] = React.useState<string>(
    searchParams.get('q') ?? initialQuery,
  );
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
        // Featured products and primary bestsellers first
        sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
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
      <SearchInput
        query={query}
        onChange={handleQueryChange}
        autoFocus={!initialQuery}
      />

      {/* 2. Mobile Interactive Control Bar (Filters Drawer & Sort Drawer triggers) */}
      <div className="flex items-center gap-2.5 lg:hidden">
        {/* Mobile Filter Trigger Button */}
        <button
          type="button"
          onClick={() => setIsMobileFilterOpen(true)}
          className="flex-1 rounded-2xl border border-line bg-surface py-3 px-4 flex items-center justify-center gap-2 text-xs font-bold text-fg hover:border-brand-600 transition-colors shadow-xs"
        >
          <SlidersHorizontal className="h-4 w-4 text-brand-600" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-50 text-[10px] font-bold text-brand-700 border border-brand-600/30">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Mobile Sort Trigger Button */}
        <button
          type="button"
          onClick={() => setIsMobileSortOpen(true)}
          className="flex-1 rounded-2xl border border-line bg-surface py-3 px-4 flex items-center justify-center gap-2 text-xs font-bold text-fg hover:border-brand-600 transition-colors shadow-xs truncate"
        >
          <ArrowUpDown className="h-4 w-4 text-brand-600 shrink-0" />
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
        <main className="flex-1 min-w-0 space-y-5">
          {/* Top Control & Results Summary Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-3.5">
            <div>
              <h2 className="text-base sm:text-lg font-bold font-sans text-fg">
                {query ? (
                  <>
                    Showing {filteredAndSortedProducts.length}{' '}
                    {filteredAndSortedProducts.length === 1 ? 'result' : 'results'} for &ldquo;{query}&rdquo;
                  </>
                ) : (
                  <>
                    Catalog Items ({filteredAndSortedProducts.length})
                  </>
                )}
              </h2>
              <p className="text-xs text-fg-muted mt-0.5">
                Authentic handcrafted Indian delicacies dispatched fresh from Varanasi
              </p>
            </div>

            {/* Desktop Sort Dropdown */}
            <div className="hidden sm:flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs font-semibold text-fg-muted whitespace-nowrap">
                Sort By:
              </span>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => handleSortChange(e.target.value as SortOption)}
                  aria-label="Sort products by"
                  className="rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-fg transition-colors hover:border-brand-600 focus:border-brand-600 focus:outline-hidden cursor-pointer"
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
            <div className="rounded-3xl border border-line bg-surface p-8 sm:p-12 text-center space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-soft text-fg-muted mx-auto">
                <SearchX className="h-7 w-7 opacity-60" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-fg">
                  No delicacies match your search criteria
                </h3>
                <p className="text-xs sm:text-sm text-fg-muted max-w-md mx-auto leading-relaxed">
                  We couldn&apos;t find any products matching your specific combination of keywords and filters.
                  Try clearing some filters or searching for our most loved staples.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetAll}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-primary-hover transition-colors"
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
