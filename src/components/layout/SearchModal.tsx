'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { useSearchUi } from '@/lib/store';

const POPULAR_SEARCHES = [
  'Banarasi Lal Mirch',
  'Aam Ka Achar',
  'Kaju Katli',
  'Motichoor Ladoo',
  'Peri Peri Makhana',
  'Himalayan Salt Makhana',
];

export function SearchModal(): React.JSX.Element {
  const router = useRouter();
  const { isSearchOpen, searchQuery, closeSearch, setSearchQuery } = useSearchUi();
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    closeSearch();
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleSelectPopular = (term: string) => {
    setSearchQuery(term);
    closeSearch();
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <Dialog open={isSearchOpen} onOpenChange={(open) => !open && closeSearch()}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="text-heritage-maroon font-serif text-lg font-bold">
            Search Pure Heritage Foods
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 space-y-4">
          <div className="relative">
            <Search className="text-heritage-muted absolute top-3.5 left-3.5 h-4 w-4" />
            <input
              ref={inputRef}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pickles, sweets, roasted foxnuts..."
              className="border-heritage-border bg-heritage-cream text-heritage-charcoal placeholder:text-heritage-muted focus:border-heritage-maroon w-full rounded-lg border py-2.5 pr-4 pl-10 text-sm focus:ring-0 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <div className="text-heritage-muted text-xs font-semibold tracking-wider uppercase">
              Popular Heritage Searches:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => handleSelectPopular(term)}
                  className="bg-heritage-cream-dark hover:bg-heritage-saffron-light/30 hover:text-heritage-maroon text-heritage-charcoal rounded-md px-2.5 py-1 text-xs transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
