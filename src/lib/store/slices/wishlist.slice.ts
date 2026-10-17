import type { StateCreator } from 'zustand';
import type { Product } from '@/lib/api/contracts/domain';

export const WISHLIST_STORAGE_KEY_PREFIX = 'bramhkanti_wishlist';

function getStorageKey(userId?: string): string {
  return userId
    ? `${WISHLIST_STORAGE_KEY_PREFIX}_${userId}`
    : WISHLIST_STORAGE_KEY_PREFIX;
}

export function readStoredWishlist(userId?: string): Product[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // localStorage unavailable or invalid JSON
  }
  return [];
}

export function writeStoredWishlist(items: Product[], userId?: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(items));
  } catch {
    // Storage quota exceeded or disabled
  }
}

export interface WishlistSlice {
  wishlistItems: Product[];
  pendingWishlistProduct: Product | null;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: Product) => boolean;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  setPendingWishlistProduct: (product: Product | null) => void;
  loadWishlistForUser: (userId?: string) => void;
}

export const createWishlistSlice: StateCreator<
  WishlistSlice & { user?: { id: string } | null },
  [],
  [],
  WishlistSlice
> = (set, get) => ({
  wishlistItems: [],
  pendingWishlistProduct: null,
  addToWishlist: (product: Product) =>
    set((state) => {
      if (
        state.wishlistItems.some(
          (item) => item.id === product.id || item.handle === product.handle,
        )
      ) {
        return state;
      }
      const updated = [product, ...state.wishlistItems];
      writeStoredWishlist(updated, state.user?.id);
      return { wishlistItems: updated };
    }),
  removeFromWishlist: (productIdOrHandle: string) =>
    set((state) => {
      const updated = state.wishlistItems.filter(
        (item) => item.id !== productIdOrHandle && item.handle !== productIdOrHandle,
      );
      writeStoredWishlist(updated, state.user?.id);
      return { wishlistItems: updated };
    }),
  toggleWishlist: (product: Product) => {
    const isPresent = get().wishlistItems.some(
      (item) => item.id === product.id || item.handle === product.handle,
    );
    if (isPresent) {
      get().removeFromWishlist(product.id);
      return false;
    } else {
      get().addToWishlist(product);
      return true;
    }
  },
  isInWishlist: (productIdOrHandle: string) => {
    return get().wishlistItems.some(
      (item) => item.id === productIdOrHandle || item.handle === productIdOrHandle,
    );
  },
  clearWishlist: () =>
    set((state) => {
      writeStoredWishlist([], state.user?.id);
      return { wishlistItems: [] };
    }),
  setPendingWishlistProduct: (product: Product | null) =>
    set({ pendingWishlistProduct: product }),
  loadWishlistForUser: (userId?: string) => {
    const items = readStoredWishlist(userId);
    set({ wishlistItems: items });
  },
});
