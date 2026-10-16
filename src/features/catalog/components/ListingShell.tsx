'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowUpDown, Check, ChevronLeft, ChevronRight, X } from 'lucide-react';
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
  /** Heading for the category chips, e.g. "Category" or "Variety". */
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

function Chip({
  active,
  onClick,
  children,
  count,
  disabled,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count?: number | undefined;
  disabled?: boolean | undefined;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={cn(
        'inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium whitespace-nowrap transition-all',
        active
          ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900'
          : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200',
        disabled && 'cursor-not-allowed opacity-40 hover:border-neutral-200',
      )}
    >
      {active && <Check className="h-3.5 w-3.5" />}
      {children}
      {count !== undefined && (
        <span
          className={cn(
            'text-xs tabular-nums',
            active ? 'text-white/70 dark:text-neutral-900/60' : 'text-neutral-400',
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

/**
 * Sort, filter chips and paging around a server-rendered product grid.
 * State lives in the URL, so results are shareable and work with back/forward.
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

  const href = (patch: Patch) => buildHref(pathname, params, preserve, patch);
  const go = (patch: Patch) =>
    startTransition(() => router.push(href(patch), { scroll: false }));

  const { facets, total, unfilteredTotal, page, totalPages } = result;
  const activeType = facets.types.find((t) => t.handle === params.type);
  const activePrice = PRICE_BUCKETS.find((b) => b.value === params.price);
  const filtered = Boolean(params.type || params.price || params.inStock);
  const showTypes = facets.types.length > 1 || Boolean(activeType);

  return (
    <div className="space-y-6">
      <div className="space-y-4 border-b border-neutral-200 pb-5 dark:border-neutral-800">
        <div className="flex items-center justify-between gap-4">
          <p
            className="text-sm text-neutral-600 dark:text-neutral-400"
            aria-live="polite"
          >
            <span className="font-semibold text-neutral-900 tabular-nums dark:text-neutral-100">
              {total}
            </span>{' '}
            {total === 1 ? 'product' : 'products'}
            {filtered && unfilteredTotal !== total && (
              <span className="text-neutral-400"> of {unfilteredTotal}</span>
            )}
          </p>

          <label className="relative inline-flex items-center">
            <span className="sr-only">Sort products</span>
            <ArrowUpDown className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-neutral-500" />
            <select
              value={params.sort}
              onChange={(e) =>
                go({ sort: e.target.value === 'featured' ? null : e.target.value })
              }
              className="h-9 cursor-pointer appearance-none rounded-full border border-neutral-200 bg-white pr-8 pl-8 text-sm font-medium text-neutral-800 transition-colors hover:border-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            >
              {LISTING_SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronRight className="pointer-events-none absolute right-3 h-3.5 w-3.5 rotate-90 text-neutral-500" />
          </label>
        </div>

        <div
          className="-mx-4 flex [scrollbar-width:none] items-center gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
          role="group"
          aria-label="Filters"
        >
          {showTypes && (
            <>
              <span className="sr-only">{typeLabel}</span>
              <Chip active={!params.type} onClick={() => go({ type: null })}>
                All
              </Chip>
              {facets.types.map((t) => (
                <Chip
                  key={t.handle}
                  active={params.type === t.handle}
                  count={t.count}
                  onClick={() => go({ type: params.type === t.handle ? null : t.handle })}
                >
                  {t.name}
                </Chip>
              ))}
              <span
                className="mx-1 h-5 w-px shrink-0 bg-neutral-200 dark:bg-neutral-700"
                aria-hidden="true"
              />
            </>
          )}
          {facets.prices.map((b) => (
            <Chip
              key={b.value}
              active={params.price === b.value}
              count={b.count}
              disabled={b.count === 0 && params.price !== b.value}
              onClick={() => go({ price: params.price === b.value ? null : b.value })}
            >
              {b.label}
            </Chip>
          ))}
          <span
            className="mx-1 h-5 w-px shrink-0 bg-neutral-200 dark:bg-neutral-700"
            aria-hidden="true"
          />
          <Chip
            active={params.inStock}
            count={facets.inStock}
            onClick={() => go({ inStock: params.inStock ? null : '1' })}
          >
            In stock
          </Chip>
        </div>

        {filtered && (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-neutral-500">Filtered by:</span>
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
            <button
              type="button"
              onClick={() => go({ type: null, price: null, inStock: null })}
              className="text-heritage-maroon font-medium underline-offset-4 hover:underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      <div
        aria-busy={isPending}
        className={cn(
          'transition-opacity duration-200',
          isPending && 'pointer-events-none opacity-50',
        )}
      >
        {total === 0 && filtered ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 px-6 py-14 text-center dark:border-neutral-700">
            <p className="text-base font-semibold">No products match these filters</p>
            <p className="text-heritage-muted mt-1 text-sm">
              Try removing a filter to see more.
            </p>
            <button
              type="button"
              onClick={() => go({ type: null, price: null, inStock: null })}
              className="mt-5 inline-flex h-10 items-center rounded-full bg-neutral-900 px-5 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
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
          className="flex items-center justify-center gap-1.5 pt-4"
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
  );
}

function ActivePill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex h-7 items-center gap-1 rounded-full bg-neutral-100 pr-1 pl-3 text-xs font-medium dark:bg-neutral-800">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove filter ${label}`}
        className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700"
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
    active
      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
      : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800',
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
