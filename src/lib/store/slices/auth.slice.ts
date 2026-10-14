import type { StateCreator } from 'zustand';

export interface SavedAddress {
  id: string;
  tag: 'home' | 'work' | 'other';
  label: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  initials: string;
  email?: string;
  addressSummary?: string;
  addresses?: SavedAddress[];
  orderCount?: number;
}

export interface AuthSlice {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (user: UserProfile) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addAddress: (address: Omit<SavedAddress, 'id'>) => void;
  updateAddress: (id: string, updates: Partial<SavedAddress>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

export const createAuthSlice: StateCreator<AuthSlice, [], [], AuthSlice> = (set) => ({
  user: null,
  isAuthenticated: false,
  isAuthModalOpen: false,
  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  login: (user) => set({ user, isAuthenticated: true, isAuthModalOpen: false }),
  logout: () => set({ user: null, isAuthenticated: false }),
  updateProfile: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),
  addAddress: (newAddr) =>
    set((state) => {
      if (!state.user) return state;
      const currentUser = state.user;
      const id = `addr_${Date.now()}`;
      const existing = currentUser.addresses ?? [];
      const isFirst = existing.length === 0;
      const isDefault = newAddr.isDefault || isFirst;

      const formatted: SavedAddress = { ...newAddr, id, isDefault };
      const updatedAddresses = isDefault
        ? existing.map((a) => ({ ...a, isDefault: false })).concat(formatted)
        : existing.concat(formatted);

      const defaultAddr = updatedAddresses.find((a) => a.isDefault) || formatted;
      const addressSummary = `${defaultAddr.street}, ${defaultAddr.city}, ${defaultAddr.state} ${defaultAddr.pincode}`;

      return {
        user: {
          ...currentUser,
          addresses: updatedAddresses,
          addressSummary,
        },
        isAuthenticated: true,
      };
    }),
  updateAddress: (id, updates) =>
    set((state) => {
      if (!state.user) return state;
      const currentUser = state.user;
      const existing = currentUser.addresses ?? [];
      const updatedAddresses = existing.map((a) => {
        if (a.id === id) {
          return { ...a, ...updates };
        }
        if (updates.isDefault) {
          return { ...a, isDefault: false };
        }
        return a;
      });

      const defaultAddr = updatedAddresses.find((a) => a.isDefault) || updatedAddresses[0];
      const addressSummary = defaultAddr
        ? `${defaultAddr.street}, ${defaultAddr.city}, ${defaultAddr.state} ${defaultAddr.pincode}`
        : (currentUser.addressSummary ?? '');

      return {
        user: {
          ...currentUser,
          addresses: updatedAddresses,
          addressSummary,
        },
      };
    }),
  deleteAddress: (id) =>
    set((state) => {
      if (!state.user) return state;
      const currentUser = state.user;
      const existing = currentUser.addresses ?? [];
      const updatedAddresses = existing.filter((a) => a.id !== id);

      if (updatedAddresses.length > 0 && !updatedAddresses.some((a) => a.isDefault)) {
        const first = updatedAddresses[0];
        if (first) {
          first.isDefault = true;
        }
      }

      const defaultAddr = updatedAddresses.find((a) => a.isDefault);
      const addressSummary = defaultAddr
        ? `${defaultAddr.street}, ${defaultAddr.city}, ${defaultAddr.state} ${defaultAddr.pincode}`
        : '';

      return {
        user: {
          ...currentUser,
          addresses: updatedAddresses,
          addressSummary,
        },
      };
    }),
  setDefaultAddress: (id) =>
    set((state) => {
      if (!state.user) return state;
      const currentUser = state.user;
      const existing = currentUser.addresses ?? [];
      const updatedAddresses = existing.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }));

      const defaultAddr = updatedAddresses.find((a) => a.id === id);
      const addressSummary = defaultAddr
        ? `${defaultAddr.street}, ${defaultAddr.city}, ${defaultAddr.state} ${defaultAddr.pincode}`
        : (currentUser.addressSummary ?? '');

      return {
        user: {
          ...currentUser,
          addresses: updatedAddresses,
          addressSummary,
        },
      };
    }),
});
