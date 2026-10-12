import type { StateCreator } from 'zustand';

/**
 * Ephemeral client-side cart UI state.
 *
 * NOTE: Contains ZERO catalog data. Catalog entities strictly remain
 * in Next.js Server Components and server-side cache.
 */
export interface CartUiSlice {
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

export const createCartUiSlice: StateCreator<CartUiSlice, [], [], CartUiSlice> = (
  set,
) => ({
  isCartOpen: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
});
