import type { StateCreator } from 'zustand';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  initials: string;
  addressSummary?: string;
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
}

export const DEMO_USER: UserProfile = {
  id: 'usr_bk_987654',
  name: 'Aditya Sharma',
  email: 'aditya.sharma@example.com',
  phone: '+91 98765 43210',
  initials: 'AS',
  addressSummary: 'Ghat Road, Varanasi, UP 221001',
  orderCount: 2,
};

export const createAuthSlice: StateCreator<AuthSlice, [], [], AuthSlice> = (set) => ({
  user: null,
  isAuthenticated: false,
  isAuthModalOpen: false,
  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  login: (user) => set({ user, isAuthenticated: true, isAuthModalOpen: false }),
  logout: () => set({ user: null, isAuthenticated: false }),
});
