'use client';

import * as React from 'react';
import { useStore } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { createRootStore, type RootStore, type RootStoreState } from './root-store';

/**
 * Per-request Zustand Store Context.
 *
 * Prevents cross-request state bleeding across SSR requests.
 * Each browser session/rendered tree gets an isolated store instance.
 */
const StoreContext = React.createContext<RootStore | null>(null);

export interface StoreProviderProps {
  children: React.ReactNode;
  initialState?: Partial<RootStoreState> | undefined;
}

export function StoreProvider({
  children,
  initialState,
}: StoreProviderProps): React.JSX.Element {
  const [store] = React.useState(() => createRootStore(initialState));

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

/**
 * Base selector hook with automatic store context validation.
 */
export function useAppStore<T>(selector: (state: RootStoreState) => T): T {
  const store = React.useContext(StoreContext);
  if (!store) {
    throw new Error('useAppStore must be used within a StoreProvider');
  }
  return useStore(store, selector);
}

/**
 * Ephemeral Cart UI hook (drawer toggle, open/close).
 */
export function useCartUi() {
  return useAppStore(
    useShallow((state) => ({
      isCartOpen: state.isCartOpen,
      openCart: state.openCart,
      closeCart: state.closeCart,
      toggleCart: state.toggleCart,
    })),
  );
}

/**
 * Toast notifications hook.
 */
export function useToast() {
  return useAppStore(
    useShallow((state) => ({
      toasts: state.toasts,
      addToast: state.addToast,
      removeToast: state.removeToast,
      clearToasts: state.clearToasts,
    })),
  );
}

/**
 * Ephemeral Search Modal hook.
 */
export function useSearchUi() {
  return useAppStore(
    useShallow((state) => ({
      isSearchOpen: state.isSearchOpen,
      searchQuery: state.searchQuery,
      openSearch: state.openSearch,
      closeSearch: state.closeSearch,
      setSearchQuery: state.setSearchQuery,
    })),
  );
}

/**
 * Ephemeral Mobile Filters Drawer hook.
 */
export function useFiltersUi() {
  return useAppStore(
    useShallow((state) => ({
      isFiltersOpen: state.isFiltersOpen,
      openFilters: state.openFilters,
      closeFilters: state.closeFilters,
      toggleFilters: state.toggleFilters,
    })),
  );
}

/**
 * Authentication and User Profile hook.
 */
export function useAuth() {
  return useAppStore(
    useShallow((state) => ({
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      isAuthModalOpen: state.isAuthModalOpen,
      openAuthModal: state.openAuthModal,
      closeAuthModal: state.closeAuthModal,
      login: state.login,
      logout: state.logout,
      updateProfile: state.updateProfile,
      addAddress: state.addAddress,
      updateAddress: state.updateAddress,
      deleteAddress: state.deleteAddress,
      setDefaultAddress: state.setDefaultAddress,
    })),
  );
}

/**
 * Mobile Navigation Drawer hook.
 */
export function useNavigationUi() {
  return useAppStore(
    useShallow((state) => ({
      isMobileMenuOpen: state.isMobileMenuOpen,
      openMobileMenu: state.openMobileMenu,
      closeMobileMenu: state.closeMobileMenu,
      toggleMobileMenu: state.toggleMobileMenu,
    })),
  );
}
