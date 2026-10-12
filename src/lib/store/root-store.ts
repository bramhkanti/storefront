import { createStore } from 'zustand/vanilla';
import { createCartUiSlice, type CartUiSlice } from './slices/cart-ui.slice';
import { createToastSlice, type ToastSlice } from './slices/toast.slice';
import { createSearchUiSlice, type SearchUiSlice } from './slices/search-ui.slice';
import { createFiltersUiSlice, type FiltersUiSlice } from './slices/filters-ui.slice';
import { createAuthSlice, type AuthSlice } from './slices/auth.slice';
import {
  createNavigationUiSlice,
  type NavigationUiSlice,
} from './slices/navigation-ui.slice';

export interface RootStoreState
  extends
    CartUiSlice,
    ToastSlice,
    SearchUiSlice,
    FiltersUiSlice,
    AuthSlice,
    NavigationUiSlice {
  resetStore: () => void;
}

export type RootStore = ReturnType<typeof createRootStore>;

export function createRootStore(initProps: Partial<RootStoreState> = {}) {
  return createStore<RootStoreState>()((set, get, api) => ({
    ...createCartUiSlice(set, get, api),
    ...createToastSlice(set, get, api),
    ...createSearchUiSlice(set, get, api),
    ...createFiltersUiSlice(set, get, api),
    ...createAuthSlice(set, get, api),
    ...createNavigationUiSlice(set, get, api),
    ...initProps,
    resetStore: () =>
      set({
        ...createCartUiSlice(set, get, api),
        ...createToastSlice(set, get, api),
        ...createSearchUiSlice(set, get, api),
        ...createFiltersUiSlice(set, get, api),
        ...createAuthSlice(set, get, api),
        ...createNavigationUiSlice(set, get, api),
      }),
  }));
}
