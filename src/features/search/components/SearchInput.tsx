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
        <Search className="absolute left-4 h-5 w-5 text-fg-muted pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by ingredient, dish, achar, sweet, or makhana..."
          className="w-full rounded-2xl border border-line bg-surface py-3.5 pl-11 pr-12 text-sm sm:text-base text-fg placeholder:text-fg-muted transition-colors hover:border-line-strong focus:border-brand-600 focus:outline-hidden"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search query"
            className="absolute right-3.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-surface-soft text-fg-muted hover:text-fg hover:bg-line transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {/* Popular search suggestions pills */}
      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
        <span className="text-xs font-semibold text-fg-muted mr-1">
          Trending Searches:
        </span>
        {POPULAR_SEARCH_TERMS.map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => onChange(term)}
            className="rounded-full border border-line bg-surface px-2.5 py-1 text-xs text-fg-muted hover:text-fg hover:border-brand-600 transition-colors"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}
