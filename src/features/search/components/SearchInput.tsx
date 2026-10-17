import * as React from 'react';
import { Search, X } from 'lucide-react';
import { POPULAR_SEARCH_TERMS } from '../types';
import { cn } from '@/lib/utils/cn';

export interface SearchInputProps {
  query: string;
  onChange: (query: string) => void;
  onSubmit?: () => void;
  autoFocus?: boolean;
  className?: string | undefined;
}

export function SearchInput({
  query,
  onChange,
  onSubmit,
  autoFocus = false,
  className,
}: SearchInputProps): React.JSX.Element {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.();
  };

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className={cn('space-y-3.5', className)}>
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <Search className="text-fg-muted pointer-events-none absolute left-4 h-5 w-5" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by ingredient, dish, achar, sweet, or makhana..."
          className="border-line bg-surface text-fg placeholder:text-fg-muted hover:border-line-strong focus:border-brand-600 w-full rounded-2xl border py-3.5 pr-12 pl-11 text-sm transition-colors focus:outline-hidden sm:text-base"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search query"
            className="bg-surface-soft text-fg-muted hover:text-fg hover:bg-line absolute right-3.5 inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {/* Popular search suggestions pills */}
      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
        <span className="text-fg-muted mr-1 text-xs font-semibold">
          Trending Searches:
        </span>
        {POPULAR_SEARCH_TERMS.map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => onChange(term)}
            className="border-line bg-surface text-fg-muted hover:text-fg hover:border-brand-600 rounded-full border px-2.5 py-1 text-xs transition-colors"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}
