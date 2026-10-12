import type { StateCreator } from 'zustand';

export interface FiltersUiSlice {
  isFiltersOpen: boolean;
  openFilters: () => void;
  closeFilters: () => void;
  toggleFilters: () => void;
}

export const createFiltersUiSlice: StateCreator<
  FiltersUiSlice,
  [],
  [],
  FiltersUiSlice
> = (set) => ({
  isFiltersOpen: false,
  openFilters: () => set({ isFiltersOpen: true }),
  closeFilters: () => set({ isFiltersOpen: false }),
  toggleFilters: () => set((state) => ({ isFiltersOpen: !state.isFiltersOpen })),
});
