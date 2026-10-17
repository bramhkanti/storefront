import type { StateCreator } from 'zustand';
import {
  addAddressAction,
  deleteAddressAction,
  getSessionAction,
  logoutAction,
  updateAddressAction,
  updateProfileAction,
  type ActionResult,
} from '@/lib/auth/actions';
import type { SavedAddress, UserProfile } from '@/lib/auth/profile';

export type { SavedAddress, UserProfile };

export type AuthIntent = 'checkout';

/**
 * Client view of the login session. The source of truth is the httpOnly
 * customer-token cookie on the server; this slice only mirrors the profile.
 */
export interface AuthSlice {
  user: UserProfile | null;
  isAuthenticated: boolean;
  /** False until the first session check finishes (avoid login flashes). */
  isSessionLoaded: boolean;
  isAuthModalOpen: boolean;
  /** What to resume after a successful login ('checkout' reopens the bag). */
  authIntent: AuthIntent | null;
  openAuthModal: () => void;
  /** Opens the login modal and remembers what the shopper was doing. */
  openAuthModalFor: (intent: AuthIntent) => void;
  clearAuthIntent: () => void;
  closeAuthModal: () => void;
  hydrateSession: () => Promise<UserProfile | null>;
  login: (user: UserProfile) => void;
  logout: () => Promise<void>;
  updateProfile: (input: {
    name: string;
    email?: string | undefined;
  }) => Promise<ActionResult<UserProfile>>;
  addAddress: (address: Omit<SavedAddress, 'id'>) => Promise<ActionResult<UserProfile>>;
  updateAddress: (
    id: string,
    address: Omit<SavedAddress, 'id'>,
  ) => Promise<ActionResult<UserProfile>>;
  deleteAddress: (id: string) => Promise<ActionResult<UserProfile>>;
  setDefaultAddress: (id: string) => Promise<ActionResult<UserProfile>>;
}

export const createAuthSlice: StateCreator<AuthSlice, [], [], AuthSlice> = (set, get) => {
  /** Applies a profile-returning action and handles an expired session. */
  const apply = async (
    run: () => Promise<ActionResult<UserProfile>>,
  ): Promise<ActionResult<UserProfile>> => {
    const result = await run();
    if (result.ok) {
      set({ user: result.data, isAuthenticated: true });
    } else if (result.unauthenticated) {
      set({ user: null, isAuthenticated: false });
    }
    return result;
  };

  return {
    user: null,
    isAuthenticated: false,
    isSessionLoaded: false,
    isAuthModalOpen: false,
    authIntent: null,
    // Used directly as an onClick handler, so it takes no arguments.
    openAuthModal: () => set({ isAuthModalOpen: true }),
    openAuthModalFor: (authIntent) => set({ isAuthModalOpen: true, authIntent }),
    clearAuthIntent: () => set({ authIntent: null }),
    closeAuthModal: () => set({ isAuthModalOpen: false }),
    hydrateSession: async () => {
      try {
        const user = await getSessionAction();
        set({ user, isAuthenticated: Boolean(user), isSessionLoaded: true });
        return user;
      } catch {
        set({ isSessionLoaded: true });
        return null;
      }
    },
    login: (user) => set({ user, isAuthenticated: true, isAuthModalOpen: false }),
    logout: async () => {
      await logoutAction();
      set({ user: null, isAuthenticated: false });
    },
    updateProfile: (input) => apply(() => updateProfileAction(input)),
    addAddress: (address) => apply(() => addAddressAction(address)),
    updateAddress: (id, address) => apply(() => updateAddressAction(id, address)),
    deleteAddress: (id) => apply(() => deleteAddressAction(id)),
    setDefaultAddress: (id) => {
      const existing = get().user?.addresses.find((a) => a.id === id);
      if (!existing) {
        return Promise.resolve({ ok: false as const, error: 'Address not found' });
      }
      const { id: _id, ...rest } = existing;
      void _id;
      return apply(() => updateAddressAction(id, { ...rest, isDefault: true }));
    },
  };
};
