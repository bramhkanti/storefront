'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/Sheet';
import { cn } from '@/lib/utils/cn';
import {
  LISTING_SORTS,
  PRICE_BUCKETS,
  type ListingParams,
  type ListingResult,
} from '../listing';

export interface ListingShellProps {
  params: ListingParams;
  result: Omit<ListingResult, 'items'>;
  /** Query params to keep in every link (e.g. the search `q`). */
  preserve?: Record<string, string> | undefined;
  /** Heading for the category filter group, e.g. "Category" or "Variety". */
  typeLabel?: string | undefined;
  children: React.ReactNode;
}

type Patch = Partial<
  Record<'sort' | 'type' | 'price' | 'inStock' | 'page', string | null>
>;

function buildHref(
  pathname: string,
  params: ListingParams,
  preserve: Record<string, string> | undefined,
  patch: Patch,
): string {
  const current: Record<string, string | undefined> = {
    ...preserve,
    sort: params.sort === 'featured' ? undefined : params.sort,
    type: params.type,
    price: params.price,
    inStock: params.inStock ? '1' : undefined,
    page: params.page > 1 ? String(params.page) : undefined,
  };
  // Any filter or sort change starts again from page 1.
  if (!('page' in patch)) current.page = undefined;
  for (const [key, value] of Object.entries(patch)) {
    current[key] = value ?? undefined;
  }
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(current)) {
    if (value) qs.set(key, value);
  }
  const query = qs.toString();
  return query ? `${pathname}?${query}` : pathname;
}

interface FilterGroup {
  label: string;
  options: Array<{
    key: string;
    label: string;
    count: number;
    active: boolean;
    onToggle: () => void;
  }>;
}

/**
 * Filter sidebar (desktop) or sheet (mobile), sort and paging around a
 * server-rendered product grid. State lives in the URL, so results are
 * shareable and work with back/forward.
 */
export function ListingShell({
  params,
  result,
  preserve,
  typeLabel = 'Category',
  children,
}: ListingShellProps) {
  const router = useRouter();
  const pathname = usePathname() || '/';
  const [isPending, startTransition] = React.useTransition();
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const href = (patch: Patch) => buildHref(pathname, params, preserve, patch);
  const go = (patch: Patch) =>
    startTransition(() => router.push(href(patch), { scroll: false }));
  const clearAll = () => go({ type: null, price: null, inStock: null });

  const { facets, total, unfilteredTotal, page, totalPages } = result;
  const activeType = facets.types.find((t) => t.handle === params.type);
  const activePrice = PRICE_BUCKETS.find((b) => b.value === params.price);
  const activeCount = [params.type, params.price, params.inStock].filter(Boolean).length;
  const filtered = activeCount > 0;

  const groups: FilterGroup[] = [
    ...(facets.types.length > 1 || activeType
      ? [
          {
            label: typeLabel,
            options: facets.types.map((t) => ({
              key: t.handle,
              label: t.name,
              count: t.count,
              active: params.type === t.handle,
              onToggle: () => go({ type: params.type === t.handle ? null : t.handle }),
            })),
          },
        ]
      : []),
    {
      label: 'Price',
      options: facets.prices
        .filter((b) => b.count > 0 || params.price === b.value)
        .map((b) => ({
          key: b.value,
          label: b.label,
          count: b.count,
          active: params.price === b.value,
          onToggle: () => go({ price: params.price === b.value ? null : b.value }),
        })),
    },
    {
      label: 'Availability',
      options: [
        {
          key: 'in-stock',
          label: 'In stock',
          count: facets.inStock,
          active: params.inStock,
          onToggle: () => go({ inStock: params.inStock ? null : '1' }),
        },
      ],
    },
  ].filter((g) => g.options.length > 0);

  const sortSelect = (
    <label className="relative inline-flex items-center">
      <span className="text-fg-muted mr-2 hidden text-sm sm:inline">Sort by</span>
      <select
        value={params.sort}
        onChange={(e) =>
          go({ sort: e.target.value === 'featured' ? null : e.target.value })
        }
        aria-label="Sort products"
        className="text-fg h-9 cursor-pointer appearance-none bg-transparent pr-6 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {LISTING_SORTS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      <ChevronDown className="text-fg pointer-events-none absolute right-0 h-4 w-4" />
    </label>
  );

  return (
    <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-10">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block" aria-label="Filters">
        <div className="sticky top-24 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-fg text-lg font-bold">Filter</h2>
            {filtered && (
              <button
                type="button"
                onClick={clearAll}
                className="text-primary text-sm font-medium hover:underline"
              >
                Clear all
              </button>
            )}
          </div>
          <FilterGroups groups={groups} />
        </div>
      </aside>

      <div className="min-w-0">
        {/* Toolbar: count + sort (desktop), filter + sort buttons (mobile) */}
        <div className="border-line mb-5 flex items-center justify-between gap-3 border-b pb-3">
          <p className="text-fg-muted text-sm" aria-live="polite">
            <span className="text-fg font-semibold tabular-nums">{total}</span>{' '}
            {total === 1 ? 'product' : 'products'}
            {filtered && unfilteredTotal !== total && <span> of {unfilteredTotal}</span>}
          </p>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="text-fg inline-flex h-9 items-center gap-1.5 text-sm font-semibold lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filter
              {activeCount > 0 && (
                <span className="bg-primary text-on-primary flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] tabular-nums">
                  {activeCount}
                </span>
              )}
            </button>
            {sortSelect}
          </div>
        </div>

        {filtered && (
          <div className="mb-5 flex flex-wrap items-center gap-2">
            {activeType && (
              <ActivePill label={activeType.name} onRemove={() => go({ type: null })} />
            )}
            {activePrice && (
              <ActivePill
                label={activePrice.label}
                onRemove={() => go({ price: null })}
              />
            )}
            {params.inStock && (
              <ActivePill label="In stock" onRemove={() => go({ inStock: null })} />
            )}
          </div>
        )}

        <div
          aria-busy={isPending}
          className={cn(
            'transition-opacity duration-200',
            isPending && 'pointer-events-none opacity-50',
          )}
        >
          {total === 0 && filtered ? (
            <div className="border-line rounded-2xl border border-dashed px-6 py-14 text-center">
              <p className="text-fg text-base font-semibold">
                No products match these filters
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="bg-fg text-page mt-5 inline-flex h-10 items-center rounded-full px-5 text-sm font-medium"
              >
                Clear filters
              </button>
            </div>
          ) : (
            children
          )}
        </div>

        {totalPages > 1 && (
          <nav
            aria-label="Pagination"
            className="flex items-center justify-center gap-1.5 pt-10"
          >
            <PageLink
              href={href({ page: page > 2 ? String(page - 1) : null })}
              disabled={page <= 1}
              label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </PageLink>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <PageLink
                key={n}
                href={href({ page: n > 1 ? String(n) : null })}
                active={n === page}
                label={`Page ${n}`}
              >
                {n}
              </PageLink>
            ))}
            <PageLink
              href={href({ page: String(page + 1) })}
              disabled={page >= totalPages}
              label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </PageLink>
          </nav>
        )}
      </div>

      {/* Mobile filter sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="bg-surface border-line p-0">
          <div className="border-line flex items-center justify-between border-b px-5 py-4 pr-14">
            <SheetTitle className="text-fg text-lg font-bold">Filter</SheetTitle>
            {filtered && (
              <button
                type="button"
                onClick={clearAll}
                className="text-primary text-sm font-medium"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="px-5 py-5">
            <FilterGroups groups={groups} />
          </div>
          <div className="border-line bg-surface sticky bottom-0 border-t p-4">
            <button
              type="button"
              onClick={() => setSheetOpen(false)}
              className="bg-primary text-on-primary hover:bg-primary-hover h-12 w-full rounded-full text-sm font-semibold transition-colors"
            >
              Show {total} {total === 1 ? 'product' : 'products'}
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function FilterGroups({ groups }: { groups: FilterGroup[] }) {
  return (
    <div className="divide-line divide-y">
      {groups.map((group) => (
        <div
          key={group.label}
          role="group"
          aria-label={group.label}
          className="space-y-3 py-5 first:pt-0"
        >
          <h3 className="text-fg text-sm font-bold">{group.label}</h3>
          {group.options.map((option) => (
            <button
              key={option.key}
              type="button"
              role="checkbox"
              aria-checked={option.active}
              onClick={option.onToggle}
              disabled={option.count === 0 && !option.active}
              className="group flex w-full items-center gap-3 text-left text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span
                className={cn(
                  'flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded border transition-colors',
                  option.active
                    ? 'border-primary bg-primary text-on-primary'
                    : 'border-line-strong group-hover:border-fg',
                )}
              >
                {option.active && <Check className="h-3 w-3 stroke-[3]" />}
              </span>
              <span
                className={cn(
                  'flex-1',
                  option.active ? 'text-fg font-semibold' : 'text-fg',
                )}
              >
                {option.label}
              </span>
              <span className="text-fg-muted text-xs tabular-nums">{option.count}</span>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

function ActivePill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="bg-surface-soft text-fg inline-flex h-8 items-center gap-1 rounded-full pr-1 pl-3 text-xs font-medium">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove filter ${label}`}
        className="hover:bg-line flex h-6 w-6 items-center justify-center rounded-full"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

function PageLink({
  href,
  active,
  disabled,
  label,
  children,
}: {
  href: string;
  active?: boolean | undefined;
  disabled?: boolean | undefined;
  label: string;
  children: React.ReactNode;
}) {
  const className = cn(
    'inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-medium tabular-nums transition-colors',
    active ? 'bg-fg text-page' : 'text-fg hover:bg-surface-soft',
  );
  if (disabled) {
    return (
      <span aria-hidden="true" className={cn(className, 'opacity-30')}>
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      className={className}
    >
      {children}
    </Link>
  );
}
