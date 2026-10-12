import type { StateCreator } from 'zustand';

export interface SearchUiSlice {
  isSearchOpen: boolean;
  searchQuery: string;
  openSearch: () => void;
  closeSearch: () => void;
  setSearchQuery: (query: string) => void;
}

export const createSearchUiSlice: StateCreator<SearchUiSlice, [], [], SearchUiSlice> = (
  set,
) => ({
  isSearchOpen: false,
  searchQuery: '',
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
});
