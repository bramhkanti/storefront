'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { ArrowRight, Clock, CornerDownLeft, Loader2, Search, X } from 'lucide-react';
import {
  searchSuggestionsAction,
  type SearchSuggestions,
} from '@/features/search/actions';
import { useSearchUi } from '@/lib/store';
import { formatPrice } from '@/lib/utils/money';
import { cn } from '@/lib/utils/cn';

const RECENT_KEY = 'bramhkanti_recent_searches';
const MAX_RECENT = 6;
const DEBOUNCE_MS = 200;

function readRecent(): string[] {
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((v): v is string => typeof v === 'string').slice(0, MAX_RECENT)
      : [];
  } catch {
    return [];
  }
}

function writeRecent(list: string[]): void {
  try {
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, MAX_RECENT)));
  } catch {
    // Storage blocked (private mode): recent searches just aren't remembered.
  }
}

/** Bolds the part of `text` that matches the query. */
function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  const index = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1;
  if (index < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, index)}
      <mark className="bg-transparent font-semibold text-neutral-950 dark:text-white">
        {text.slice(index, index + q.length)}
      </mark>
      {text.slice(index + q.length)}
    </>
  );
}

export function SearchModal(): React.JSX.Element {
  const router = useRouter();
  const { isSearchOpen, searchQuery, openSearch, closeSearch, setSearchQuery } =
    useSearchUi();
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const requestId = React.useRef(0);

  const [data, setData] = React.useState<SearchSuggestions | null>(null);
  const [seeds, setSeeds] = React.useState<SearchSuggestions | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [recent, setRecent] = React.useState<string[]>([]);
  const [active, setActive] = React.useState(-1);

  const query = searchQuery.trim();
  const showResults = query.length >= 2;

  // ⌘K / Ctrl+K and "/" open search from anywhere.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target?.isContentEditable ||
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName ?? '');
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault();
        openSearch();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openSearch]);

  // Popular picks and categories, loaded once when search first opens.
  React.useEffect(() => {
    if (!isSearchOpen || seeds) return;
    void searchSuggestionsAction('').then(setSeeds);
  }, [isSearchOpen, seeds]);

  // Debounced live results; responses to older keystrokes are dropped.
  React.useEffect(() => {
    if (!isSearchOpen || !showResults) return;
    const id = ++requestId.current;
    const timer = setTimeout(() => {
      setLoading(true);
      void searchSuggestionsAction(query).then((result) => {
        if (id !== requestId.current) return;
        setData(result);
        setActive(-1);
        setLoading(false);
      });
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query, showResults, isSearchOpen]);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setRecent(readRecent());
      return;
    }
    closeSearch();
    setActive(-1);
  };

  const remember = (term: string) => {
    const next = [
      term,
      ...readRecent().filter((r) => r.toLowerCase() !== term.toLowerCase()),
    ];
    writeRecent(next);
    setRecent(next.slice(0, MAX_RECENT));
  };

  const goTo = (href: string) => {
    if (query) remember(query);
    closeSearch();
    router.push(href);
  };

  const submitSearch = (term: string) => {
    const value = term.trim();
    if (!value) return;
    remember(value);
    setSearchQuery(value);
    closeSearch();
    router.push(`/search?q=${encodeURIComponent(value)}`);
  };

  const results = showResults && data?.query === query ? data : null;
  // Keyboard targets: each product row, then "See all results".
  const optionHrefs = results
    ? [
        ...results.products.map((p) => `/products/${p.handle}`),
        `/search?q=${encodeURIComponent(query)}`,
      ]
    : [];

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' && optionHrefs.length > 0) {
      e.preventDefault();
      setActive((i) => (i + 1) % optionHrefs.length);
    } else if (e.key === 'ArrowUp' && optionHrefs.length > 0) {
      e.preventDefault();
      setActive((i) => (i <= 0 ? optionHrefs.length - 1 : i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const href = active >= 0 ? optionHrefs[active] : undefined;
      if (href) goTo(href);
      else submitSearch(searchQuery);
    }
  };

  const optionId = (i: number) => `search-option-${i}`;

  return (
    <DialogPrimitive.Root
      open={isSearchOpen}
      onOpenChange={(open) => {
        handleOpenChange(open);
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="data-[state=open]:animate-in data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-neutral-950/40 backdrop-blur-sm" />
        <DialogPrimitive.Content
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            setRecent(readRecent());
            inputRef.current?.focus();
          }}
          className="data-[state=open]:animate-in data-[state=open]:fade-in-0 sm:data-[state=open]:zoom-in-95 fixed inset-0 z-50 flex flex-col bg-white focus:outline-none sm:inset-x-0 sm:top-[8vh] sm:bottom-auto sm:mx-auto sm:max-h-[80vh] sm:w-[calc(100%-2rem)] sm:max-w-2xl sm:rounded-2xl sm:shadow-2xl sm:ring-1 sm:ring-black/5 dark:bg-[#1c1917]"
        >
          <DialogPrimitive.Title className="sr-only">
            Search products
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Type to see matching products. Use the arrow keys to move and Enter to open.
          </DialogPrimitive.Description>

          {/* Search input */}
          <div className="flex items-center gap-3 border-b border-neutral-100 px-4 sm:px-5 dark:border-neutral-800">
            {loading ? (
              <Loader2 className="h-5 w-5 shrink-0 animate-spin text-neutral-400" />
            ) : (
              <Search className="h-5 w-5 shrink-0 text-neutral-400" />
            )}
            <input
              ref={inputRef}
              type="search"
              role="combobox"
              aria-expanded={Boolean(results)}
              aria-controls="search-results"
              aria-activedescendant={active >= 0 ? optionId(active) : undefined}
              aria-autocomplete="list"
              enterKeyHint="search"
              autoComplete="off"
              spellCheck={false}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder="Search pickles, makhana, sweets…"
              className="h-16 min-w-0 flex-1 bg-transparent text-base text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-neutral-100 [&::-webkit-search-cancel-button]:hidden"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  inputRef.current?.focus();
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <DialogPrimitive.Close className="rounded-md px-2 py-1 text-sm font-medium text-neutral-500 hover:bg-neutral-100 sm:border sm:border-neutral-200 sm:text-xs dark:hover:bg-neutral-800 sm:dark:border-neutral-700">
              <span className="sm:hidden">Cancel</span>
              <span className="hidden sm:inline">Esc</span>
            </DialogPrimitive.Close>
          </div>

          <div id="search-results" className="flex-1 overflow-y-auto overscroll-contain">
            {results ? (
              results.products.length === 0 && results.categories.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <p className="text-base font-semibold">
                    No results for &ldquo;{query}&rdquo;
                  </p>
                  <p className="text-heritage-muted mt-1 text-sm">
                    Check the spelling or try a broader word like &ldquo;achar&rdquo; or
                    &ldquo;makhana&rdquo;.
                  </p>
                  {seeds && seeds.categories.length > 0 && (
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                      {seeds.categories.slice(0, 6).map((c) => (
                        <CategoryChip
                          key={c.href}
                          href={c.href}
                          name={c.name}
                          onPick={goTo}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-2 sm:p-3">
                  {results.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 px-2 pt-2 pb-3">
                      {results.categories.map((c) => (
                        <CategoryChip
                          key={c.href}
                          href={c.href}
                          name={c.name}
                          onPick={goTo}
                        />
                      ))}
                    </div>
                  )}
                  {results.products.length > 0 && (
                    <>
                      <SectionLabel>Products</SectionLabel>
                      <ul role="listbox" aria-label="Products">
                        {results.products.map((p, i) => (
                          <li
                            key={p.handle}
                            id={optionId(i)}
                            role="option"
                            aria-selected={active === i}
                          >
                            <Link
                              href={`/products/${p.handle}`}
                              onClick={(e) => {
                                e.preventDefault();
                                goTo(`/products/${p.handle}`);
                              }}
                              onMouseEnter={() => setActive(i)}
                              className={cn(
                                'flex items-center gap-3.5 rounded-xl p-2 transition-colors',
                                active === i && 'bg-neutral-100 dark:bg-neutral-800',
                              )}
                            >
                              <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
                                {p.imageUrl && (
                                  <Image
                                    src={p.imageUrl}
                                    alt=""
                                    fill
                                    sizes="56px"
                                    className="object-cover"
                                  />
                                )}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm text-neutral-700 dark:text-neutral-200">
                                  <Highlight text={p.title} query={query} />
                                </span>
                                {p.subtitle && (
                                  <span className="text-heritage-muted block truncate text-xs">
                                    {p.subtitle}
                                  </span>
                                )}
                              </span>
                              <span className="shrink-0 text-right text-sm">
                                {p.fromPrice !== undefined ? (
                                  <span className="font-semibold tabular-nums">
                                    {formatPrice(p.fromPrice, p.currencyCode)}
                                  </span>
                                ) : (
                                  <span className="text-heritage-muted text-xs">
                                    Coming soon
                                  </span>
                                )}
                                {p.fromPrice !== undefined && !p.inStock && (
                                  <span className="block text-xs text-neutral-400">
                                    Sold out
                                  </span>
                                )}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  <Link
                    id={optionId(results.products.length)}
                    href={`/search?q=${encodeURIComponent(query)}`}
                    onClick={(e) => {
                      e.preventDefault();
                      submitSearch(query);
                    }}
                    onMouseEnter={() => setActive(results.products.length)}
                    className={cn(
                      'text-heritage-maroon mt-1 flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold transition-colors',
                      active === results.products.length &&
                        'bg-neutral-100 dark:bg-neutral-800',
                    )}
                  >
                    <span>
                      See all {results.total > 0 ? `${results.total} ` : ''}results for
                      &ldquo;{query}&rdquo;
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )
            ) : showResults ? (
              <div className="space-y-2 p-4" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-3.5">
                    <div className="h-14 w-14 animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-800" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-2/3 animate-pulse rounded bg-neutral-100 dark:bg-neutral-800" />
                      <div className="h-3 w-1/3 animate-pulse rounded bg-neutral-100 dark:bg-neutral-800" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6 p-4 sm:p-5">
                {recent.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between">
                      <SectionLabel className="px-0">Recent searches</SectionLabel>
                      <button
                        type="button"
                        onClick={() => {
                          writeRecent([]);
                          setRecent([]);
                        }}
                        className="text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                      >
                        Clear
                      </button>
                    </div>
                    <ul className="mt-1">
                      {recent.map((term) => (
                        <li key={term}>
                          <button
                            type="button"
                            onClick={() => submitSearch(term)}
                            className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                          >
                            <Clock className="h-4 w-4 text-neutral-400" />
                            {term}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {seeds && seeds.categories.length > 0 && (
                  <div>
                    <SectionLabel className="px-0">Shop by category</SectionLabel>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {seeds.categories.map((c) => (
                        <CategoryChip
                          key={c.href}
                          href={c.href}
                          name={c.name}
                          onPick={goTo}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {seeds && seeds.products.length > 0 && (
                  <div>
                    <SectionLabel className="px-0">Popular right now</SectionLabel>
                    <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {seeds.products.map((p) => (
                        <Link
                          key={p.handle}
                          href={`/products/${p.handle}`}
                          onClick={(e) => {
                            e.preventDefault();
                            goTo(`/products/${p.handle}`);
                          }}
                          className="group block"
                        >
                          <span className="relative block aspect-square overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
                            {p.imageUrl && (
                              <Image
                                src={p.imageUrl}
                                alt=""
                                fill
                                sizes="(max-width: 640px) 45vw, 150px"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            )}
                          </span>
                          <span className="mt-2 line-clamp-2 block text-xs font-medium text-neutral-800 dark:text-neutral-200">
                            {p.title}
                          </span>
                          {p.fromPrice !== undefined && (
                            <span className="text-heritage-muted text-xs tabular-nums">
                              {formatPrice(p.fromPrice, p.currencyCode)}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="hidden items-center gap-4 border-t border-neutral-100 px-5 py-2.5 text-xs text-neutral-400 sm:flex dark:border-neutral-800">
            <span className="flex items-center gap-1.5">
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd> to move
            </span>
            <span className="flex items-center gap-1.5">
              <Kbd>
                <CornerDownLeft className="h-3 w-3" />
              </Kbd>{' '}
              to open
            </span>
            <span className="ml-auto flex items-center gap-1.5">
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd> to search anywhere
            </span>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        'px-2 pb-1 text-xs font-semibold tracking-wide text-neutral-500 uppercase',
        className,
      )}
    >
      {children}
    </p>
  );
}

function CategoryChip({
  href,
  name,
  onPick,
}: {
  href: string;
  name: string;
  onPick: (href: string) => void;
}) {
  return (
    <Link
      href={href}
      onClick={(e) => {
        e.preventDefault();
        onPick(href);
      }}
      className="inline-flex h-8 items-center rounded-full border border-neutral-200 px-3 text-sm text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-neutral-300"
    >
      {name}
    </Link>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-neutral-200 bg-neutral-50 px-1 font-sans text-[11px] text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800">
      {children}
    </kbd>
  );
}
