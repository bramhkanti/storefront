import type { StateCreator } from 'zustand';

export interface NavigationUiSlice {
  isMobileMenuOpen: boolean;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;
}

export const createNavigationUiSlice: StateCreator<
  NavigationUiSlice,
  [],
  [],
  NavigationUiSlice
> = (set) => ({
  isMobileMenuOpen: false,
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
});
