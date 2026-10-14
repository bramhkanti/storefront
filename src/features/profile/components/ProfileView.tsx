'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Phone,
  Package,
  MapPin,
  ShieldCheck,
  Globe,
  Truck,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  LogOut,
  LogIn,
  Check,
  MessageCircle,
  ExternalLink,
  User,
  HelpCircle,
  Sun,
  Moon,
  Laptop,
  Palette,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/Dialog';
import { useAuth, useToast } from '@/lib/store';
import { useTheme } from '@/lib/theme';
import { SITE_CONFIG } from '@/content/site';
import {
  SUPPORTED_LOCALES,
  LOCALE_METADATA,
  LOCALE_COOKIE_NAME,
  getLocalizedPath,
  useTranslation,
  type Locale,
} from '@/lib/i18n';
import { EditProfileModal } from './EditProfileModal';
import { OrdersModal } from './OrdersModal';
import { AddressesModal } from './AddressesModal';
import { ThemeModal } from './ThemeModal';

function persistLocaleCookie(locale: Locale): void {
  if (typeof document !== 'undefined') {
    document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; path=/; max-age=31536000; SameSite=Lax`;
  }
}

export function ProfileView(): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname() || '/';
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const { theme, mounted } = useTheme();
  const { addToast } = useToast();
  const { locale: currentLocale } = useTranslation('common');

  // Modals state
  const [isEditProfileOpen, setIsEditProfileOpen] = React.useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = React.useState(false);
  const [ordersTab, setOrdersTab] = React.useState<'active' | 'past'>('active');
  const [isAddressesOpen, setIsAddressesOpen] = React.useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = React.useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = React.useState(false);

  const handleSignOut = () => {
    logout();
    addToast({
      type: 'info',
      message: 'You have been signed out successfully.',
    });
  };

  const handleSelectLanguage = (loc: Locale) => {
    persistLocaleCookie(loc);
    setIsLanguageModalOpen(false);
    const targetHref = getLocalizedPath(pathname, loc);
    router.push(targetHref);
  };

  const handleOpenOrders = (tab: 'active' | 'past') => {
    setOrdersTab(tab);
    if (isAuthenticated) {
      setIsOrdersOpen(true);
    } else {
      openAuthModal();
    }
  };

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const activeLocaleMeta = LOCALE_METADATA[currentLocale] || LOCALE_METADATA.en;

  const activeTheme = mounted ? theme : 'system';
  const ThemeIcon = activeTheme === 'dark' ? Moon : activeTheme === 'light' ? Sun : Laptop;
  const themeLabel =
    activeTheme === 'dark'
      ? 'Dark'
      : activeTheme === 'light'
        ? 'Default (Light)'
        : 'System';

  return (
    <div className="bg-[#F8F9FA] dark:bg-[#12100e] min-h-[calc(100vh-4rem)] py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      {/* =========================================================================
          1. MOBILE VIEW (< lg)
          Clean native mobile app profile matching the user requirements:
          - Left-aligned Apple-style back button and Profile title
          - Reordered Account: Change mobile number, Saved Address, My Active orders, My Past orders
          - Store Preferences: Language, Theme (Dark, Default, System)
         ========================================================================= */}
      <div className="mx-auto max-w-md space-y-6 lg:hidden">
        {/* Mobile Top Header: Apple-style Back Icon & Left-aligned Profile Title */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleBack}
            className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-800 dark:text-neutral-100 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 active:bg-neutral-300/60 dark:active:bg-neutral-700/60 transition-colors -ml-2"
            aria-label="Go back"
          >
            <ChevronLeft className="h-6 w-6 stroke-[2.5]" />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Profile
          </h1>
        </div>

        {/* Top User Profile Card */}
        <div className="bg-white dark:bg-[#1c1917] rounded-3xl p-4 sm:p-5 border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Avatar (Name Text Initials) */}
            <div className="relative shrink-0">
              {isAuthenticated && user ? (
                <div className="bg-heritage-maroon h-14 w-14 sm:h-16 sm:w-16 rounded-full flex items-center justify-center font-bold text-lg text-white">
                  {user.initials}
                </div>
              ) : (
                <div className="bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 h-14 w-14 sm:h-16 sm:w-16 rounded-full flex items-center justify-center">
                  <User className="h-7 w-7" />
                </div>
              )}

              {isAuthenticated && (
                <span
                  className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-neutral-900"
                  title="Active account"
                  aria-hidden="true"
                />
              )}
            </div>

            {/* User Credentials */}
            <div className="min-w-0 flex-1">
              {isAuthenticated && user ? (
                <>
                  <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100 truncate">
                    {user.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 truncate mt-0.5 font-mono">
                    {user.phone}
                  </p>
                  <div className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:text-emerald-300">
                    <ShieldCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                    <span>Verified Customer</span>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100 truncate">
                    Welcome to Bramhkanti
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                    Sign in to track orders &amp; addresses
                  </p>
                </>
              )}
            </div>
          </div>

          {!isAuthenticated && (
            <div className="shrink-0">
              <Button
                variant="primary"
                size="sm"
                onClick={openAuthModal}
                className="rounded-full px-4 text-xs font-semibold"
              >
                Sign In
              </Button>
            </div>
          )}
        </div>

        {/* SECTION 1: Account (Reordered as Requested) */}
        <section aria-label="Account Settings" className="space-y-2">
          <h2 className="text-xs sm:text-sm font-semibold text-neutral-400 dark:text-neutral-500 px-1">
            Account
          </h2>
          <div className="bg-white dark:bg-[#1c1917] rounded-3xl border border-neutral-200/80 dark:border-neutral-800 overflow-hidden divide-y divide-neutral-100/80 dark:divide-neutral-800/80">
            {/* 1. Change mobile number */}
            <button
              type="button"
              onClick={() => {
                if (isAuthenticated) {
                  setIsEditProfileOpen(true);
                } else {
                  openAuthModal();
                }
              }}
              className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-[#25211d]/70 active:bg-neutral-100/70 transition-colors text-left"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <Phone className="h-5 w-5 text-neutral-700 dark:text-neutral-300 shrink-0" aria-hidden="true" />
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Change mobile number
                </span>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs text-neutral-400 dark:text-neutral-400 font-mono truncate max-w-[130px]">
                  {isAuthenticated && user?.phone ? user.phone : 'Verify via OTP'}
                </span>
                <ChevronRight className="h-4 w-4 text-neutral-400 shrink-0" />
              </div>
            </button>

            {/* 2. Saved Address */}
            <button
              type="button"
              onClick={() => {
                if (isAuthenticated) {
                  setIsAddressesOpen(true);
                } else {
                  openAuthModal();
                }
              }}
              className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-[#25211d]/70 active:bg-neutral-100/70 transition-colors text-left"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <MapPin className="h-5 w-5 text-neutral-700 dark:text-neutral-300 shrink-0" aria-hidden="true" />
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Saved Address
                </span>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                {isAuthenticated && user?.addressSummary && (
                  <span className="text-xs text-neutral-400 dark:text-neutral-400 truncate max-w-[130px]">
                    {user.addressSummary.split(',')[0]}
                  </span>
                )}
                <ChevronRight className="h-4 w-4 text-neutral-400 shrink-0" />
              </div>
            </button>

            {/* 3. My Active orders */}
            <button
              type="button"
              onClick={() => handleOpenOrders('active')}
              className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-[#25211d]/70 active:bg-neutral-100/70 transition-colors text-left"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <Truck className="h-5 w-5 text-neutral-700 dark:text-neutral-300 shrink-0" aria-hidden="true" />
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  My Active orders
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 rounded-full px-2 py-0.5 text-[11px] font-semibold">
                  1 In Transit
                </span>
                <ChevronRight className="h-4 w-4 text-neutral-400 shrink-0" />
              </div>
            </button>

            {/* 4. My Past orders */}
            <button
              type="button"
              onClick={() => handleOpenOrders('past')}
              className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-[#25211d]/70 active:bg-neutral-100/70 transition-colors text-left"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <Package className="h-5 w-5 text-neutral-700 dark:text-neutral-300 shrink-0" aria-hidden="true" />
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  My Past orders
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-full px-2 py-0.5 text-[11px] font-semibold">
                  1 Delivered
                </span>
                <ChevronRight className="h-4 w-4 text-neutral-400 shrink-0" />
              </div>
            </button>
          </div>
        </section>

        {/* SECTION 2: Store Preferences (Language & Theme only) */}
        <section aria-label="Store Preferences" className="space-y-2">
          <h2 className="text-xs sm:text-sm font-semibold text-neutral-400 dark:text-neutral-500 px-1">
            Store Preferences
          </h2>
          <div className="bg-white dark:bg-[#1c1917] rounded-3xl border border-neutral-200/80 dark:border-neutral-800 overflow-hidden divide-y divide-neutral-100/80 dark:divide-neutral-800/80">
            {/* 1. Language */}
            <button
              type="button"
              onClick={() => setIsLanguageModalOpen(true)}
              className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-[#25211d]/70 active:bg-neutral-100/70 transition-colors text-left"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <Globe className="h-5 w-5 text-neutral-700 dark:text-neutral-300 shrink-0" aria-hidden="true" />
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Language
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400 dark:text-neutral-400 font-medium">
                  {activeLocaleMeta.name}
                </span>
                <ChevronRight className="h-4 w-4 text-neutral-400 shrink-0" />
              </div>
            </button>

            {/* 2. Theme (Dark, Default, System) */}
            <button
              type="button"
              onClick={() => setIsThemeModalOpen(true)}
              suppressHydrationWarning
              className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-[#25211d]/70 active:bg-neutral-100/70 transition-colors text-left"
            >
              <div className="flex items-center gap-3.5 min-w-0" suppressHydrationWarning>
                <ThemeIcon className="h-5 w-5 text-neutral-700 dark:text-neutral-300 shrink-0" aria-hidden="true" />
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Theme
                </span>
              </div>
              <div className="flex items-center gap-2" suppressHydrationWarning>
                <span className="text-xs text-neutral-400 dark:text-neutral-400 font-medium capitalize" suppressHydrationWarning>
                  {themeLabel}
                </span>
                <ChevronRight className="h-4 w-4 text-neutral-400 shrink-0" />
              </div>
            </button>
          </div>
        </section>

        {/* SECTION 3: Support */}
        <section aria-label="Customer Support & Legal" className="space-y-2">
          <h2 className="text-xs sm:text-sm font-semibold text-neutral-400 dark:text-neutral-500 px-1">
            Support
          </h2>
          <div className="bg-white dark:bg-[#1c1917] rounded-3xl border border-neutral-200/80 dark:border-neutral-800 overflow-hidden divide-y divide-neutral-100/80 dark:divide-neutral-800/80">
            {/* Help Center & WhatsApp Care */}
            <a
              href={SITE_CONFIG.contact.whatsappMessageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-[#25211d]/70 active:bg-neutral-100/70 transition-colors text-left"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <HelpCircle className="h-5 w-5 text-neutral-700 dark:text-neutral-300 shrink-0" aria-hidden="true" />
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Help Center (WhatsApp Support)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400 dark:text-neutral-400 font-medium">
                  Instant Care
                </span>
                <ChevronRight className="h-4 w-4 text-neutral-400 shrink-0" />
              </div>
            </a>

            {/* Shipping Policy */}
            <Link
              href="/policies/shipping"
              className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-[#25211d]/70 active:bg-neutral-100/70 transition-colors text-left"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <Truck className="h-5 w-5 text-neutral-700 dark:text-neutral-300 shrink-0" aria-hidden="true" />
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Pan-India Shipping Policy
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-neutral-400 shrink-0" />
            </Link>

            {/* Refund & Replacement */}
            <Link
              href="/policies/refund"
              className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-[#25211d]/70 active:bg-neutral-100/70 transition-colors text-left"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <RefreshCw className="h-5 w-5 text-neutral-700 dark:text-neutral-300 shrink-0" aria-hidden="true" />
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Refund &amp; Replacement Policy
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-neutral-400 shrink-0" />
            </Link>
          </div>
        </section>

        {/* SECTION 4: Session Control (Sign Out or Guest Actions) */}
        <div className="pt-2">
          {isAuthenticated ? (
            <div className="bg-white dark:bg-[#1c1917] rounded-3xl border border-neutral-200/80 dark:border-neutral-800 p-2">
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2.5 py-3 px-4 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 active:bg-red-100/70 rounded-2xl transition-colors"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#1c1917] rounded-3xl border border-neutral-200/80 dark:border-neutral-800 p-3">
              <Button
                variant="primary"
                onClick={openAuthModal}
                className="w-full py-3 rounded-2xl text-sm font-semibold"
              >
                <LogIn className="h-4 w-4 mr-2" />
                <span>Sign In / Register</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          2. DESKTOP VIEW (>= lg)
          Spacious, luxurious 12-column dashboard layout with proper spacing,
          full-width cards, descriptive helper copy, user stats, and WhatsApp care.
         ========================================================================= */}
      <div className="mx-auto hidden max-w-6xl lg:block">
        {/* Desktop Header */}
        <div className="mb-8 flex items-end justify-between border-b border-neutral-200/80 dark:border-neutral-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-3xl">
              Account Overview
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Manage your phone number verification, package tracking, saved delivery addresses, and store theme.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Trigger Button in Header */}
            <button
              type="button"
              onClick={() => setIsThemeModalOpen(true)}
              suppressHydrationWarning
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-white dark:bg-[#1c1917] border border-neutral-200 dark:border-neutral-800 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              <ThemeIcon className="h-4 w-4 text-heritage-maroon dark:text-red-400" />
              <span suppressHydrationWarning>Theme: {themeLabel}</span>
            </button>

            {/* Language Trigger Button in Header */}
            <button
              type="button"
              onClick={() => setIsLanguageModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-white dark:bg-[#1c1917] border border-neutral-200 dark:border-neutral-800 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              <Globe className="h-4 w-4 text-heritage-maroon dark:text-red-400" />
              <span>Language: {activeLocaleMeta.name}</span>
            </button>
          </div>
        </div>

        {/* 12-Column Desktop Grid */}
        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Left Column: Profile Card, Quick Stats & WhatsApp (4 Cols) */}
          <div className="col-span-4 space-y-6 sticky top-24">
            {/* Desktop User Profile Card */}
            <div className="bg-white dark:bg-[#1c1917] rounded-3xl p-6 border border-neutral-200/80 dark:border-neutral-800 text-center relative overflow-hidden">
              <div className="h-20 bg-gradient-to-r from-heritage-maroon/10 via-amber-50 to-orange-50 dark:from-red-950/30 dark:via-neutral-900 dark:to-neutral-900 absolute top-0 left-0 right-0" />

              <div className="relative mt-2">
                {isAuthenticated && user ? (
                  <div className="bg-heritage-maroon h-22 w-22 rounded-full flex items-center justify-center font-bold text-2xl text-white ring-4 ring-white dark:ring-neutral-900 mx-auto">
                    {user.initials}
                  </div>
                ) : (
                  <div className="bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 h-22 w-22 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-neutral-900 mx-auto">
                    <User className="h-10 w-10" />
                  </div>
                )}
              </div>

              <div className="mt-4">
                <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  {isAuthenticated && user ? user.name : 'Guest Customer'}
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-mono">
                  {isAuthenticated && user ? user.phone : 'Sign in to access orders'}
                </p>

                {isAuthenticated && (
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Verified Bramhkanti Customer</span>
                  </div>
                )}
              </div>

              {/* Action Button: Sign Out / Sign In */}
              <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                {isAuthenticated ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="w-full rounded-2xl py-2.5 text-xs font-semibold text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/60 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-700 hover:border-red-300 transition-colors gap-1.5"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </Button>
                ) : (
                  <div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={openAuthModal}
                      className="w-full rounded-2xl py-2.5 text-xs font-semibold"
                    >
                      <LogIn className="h-3.5 w-3.5 mr-1.5" />
                      <span>Sign In / Register</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats Summary Card */}
            {isAuthenticated && (
              <div className="bg-white dark:bg-[#1c1917] rounded-3xl p-5 border border-neutral-200/80 dark:border-neutral-800">
                <h3 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-3">
                  Account Highlights
                </h3>
                <div className="grid grid-cols-2 gap-3 text-left">
                  <div className="bg-[#F8F9FA] dark:bg-[#25211d] p-3 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">Active Orders</p>
                    <p className="text-lg font-bold text-heritage-maroon dark:text-red-400 mt-0.5">
                      {user?.orderCount ?? 0}
                    </p>
                  </div>
                  <div className="bg-[#F8F9FA] dark:bg-[#25211d] p-3 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">Shipping Hub</p>
                    <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mt-1 truncate">
                      Varanasi
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* WhatsApp Support Direct Box */}
            <div className="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-white dark:from-emerald-950/30 dark:via-neutral-900 dark:to-[#1c1917] rounded-3xl p-5 border border-emerald-500/20 dark:border-emerald-800/40">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-600 text-white p-2 rounded-2xl">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-950 dark:text-emerald-300 uppercase tracking-wider">
                    WhatsApp Concierge
                  </h4>
                  <p className="text-xs text-emerald-800/80 dark:text-emerald-400/80">Available 9 AM – 9 PM IST</p>
                </div>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-3 leading-relaxed">
                Have questions regarding packing, shipping, or pure ghee sweets? We are right here.
              </p>
              <a
                href={SITE_CONFIG.contact.whatsappMessageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3.5 inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
              >
                <span>Chat on WhatsApp</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Right Column: Reordered Menu Groups (8 Cols) */}
          <div className="col-span-8 space-y-8">
            {/* GROUP 1: Account Management (Reordered as Requested) */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <Phone className="h-5 w-5 text-heritage-maroon" />
                  <span>Account Management</span>
                </h2>
                <span className="text-xs text-neutral-400 dark:text-neutral-500">Personal &amp; Delivery</span>
              </div>

              <div className="bg-white dark:bg-[#1c1917] rounded-3xl border border-neutral-200/80 dark:border-neutral-800 divide-y divide-neutral-100 dark:divide-neutral-800 overflow-hidden">
                {/* 1. Change mobile number */}
                <button
                  type="button"
                  onClick={() => {
                    if (isAuthenticated) setIsEditProfileOpen(true);
                    else openAuthModal();
                  }}
                  className="w-full flex items-center justify-between p-5 hover:bg-neutral-50/80 dark:hover:bg-[#25211d]/70 transition-colors text-left group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 p-2.5 rounded-2xl group-hover:bg-heritage-maroon-light group-hover:text-heritage-maroon dark:group-hover:bg-heritage-maroon/20 dark:group-hover:text-red-400 transition-colors shrink-0">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Change mobile number</h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                        Update your verified Indian mobile number with 6-digit OTP confirmation.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span className="text-xs font-mono text-neutral-400 dark:text-neutral-400">
                      {isAuthenticated && user?.phone ? user.phone : 'Not signed in'}
                    </span>
                    <ChevronRight className="h-5 w-5 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                </button>

                {/* 2. Saved Address */}
                <button
                  type="button"
                  onClick={() => {
                    if (isAuthenticated) setIsAddressesOpen(true);
                    else openAuthModal();
                  }}
                  className="w-full flex items-center justify-between p-5 hover:bg-neutral-50/80 dark:hover:bg-[#25211d]/70 transition-colors text-left group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 p-2.5 rounded-2xl group-hover:bg-heritage-maroon-light group-hover:text-heritage-maroon dark:group-hover:bg-heritage-maroon/20 dark:group-hover:text-red-400 transition-colors shrink-0">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Saved Address</h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                        Add new addresses, fetch current GPS location, or set default delivery destination.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    {isAuthenticated && user?.addressSummary && (
                      <span className="text-xs text-neutral-400 dark:text-neutral-400 font-medium">
                        {user.addressSummary.split(',')[0]}
                      </span>
                    )}
                    <ChevronRight className="h-5 w-5 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>

                {/* 3. My Active orders */}
                <button
                  type="button"
                  onClick={() => handleOpenOrders('active')}
                  className="w-full flex items-center justify-between p-5 hover:bg-neutral-50/80 dark:hover:bg-[#25211d]/70 transition-colors text-left group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 p-2.5 rounded-2xl group-hover:bg-heritage-maroon-light group-hover:text-heritage-maroon dark:group-hover:bg-heritage-maroon/20 dark:group-hover:text-red-400 transition-colors shrink-0">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">My Active orders</h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                        Track ongoing consignments, live shipment dispatch from Varanasi, and ETA.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 rounded-full px-2.5 py-1 text-xs font-semibold">
                      1 In Transit
                    </span>
                    <ChevronRight className="h-5 w-5 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>

                {/* 4. My Past orders */}
                <button
                  type="button"
                  onClick={() => handleOpenOrders('past')}
                  className="w-full flex items-center justify-between p-5 hover:bg-neutral-50/80 dark:hover:bg-[#25211d]/70 transition-colors text-left group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 p-2.5 rounded-2xl group-hover:bg-heritage-maroon-light group-hover:text-heritage-maroon dark:group-hover:bg-heritage-maroon/20 dark:group-hover:text-red-400 transition-colors shrink-0">
                      <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">My Past orders</h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                        Review delivered delicacy orders, itemized receipts, and order archives.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-full px-2.5 py-1 text-xs font-semibold">
                      1 Delivered
                    </span>
                    <ChevronRight className="h-5 w-5 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              </div>
            </div>

            {/* GROUP 2: Store Preferences (Language & Theme only) */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <Palette className="h-5 w-5 text-heritage-maroon" />
                  <span>Store Preferences</span>
                </h2>
                <span className="text-xs text-neutral-400 dark:text-neutral-500">Appearance &amp; Regional</span>
              </div>

              <div className="bg-white dark:bg-[#1c1917] rounded-3xl border border-neutral-200/80 dark:border-neutral-800 divide-y divide-neutral-100 dark:divide-neutral-800 overflow-hidden">
                {/* 1. Language Switcher */}
                <button
                  type="button"
                  onClick={() => setIsLanguageModalOpen(true)}
                  className="w-full flex items-center justify-between p-5 hover:bg-neutral-50/80 dark:hover:bg-[#25211d]/70 transition-colors text-left group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 p-2.5 rounded-2xl group-hover:bg-heritage-maroon-light group-hover:text-heritage-maroon dark:group-hover:bg-heritage-maroon/20 dark:group-hover:text-red-400 transition-colors shrink-0">
                      <Globe className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Language</h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                        Browse Bramhkanti storefront in English or हिन्दी.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span className="text-xs font-bold text-heritage-maroon bg-heritage-maroon-light dark:bg-heritage-maroon/30 dark:text-red-300 px-3 py-1 rounded-full">
                      {activeLocaleMeta.name} ({activeLocaleMeta.nativeName})
                    </span>
                    <ChevronRight className="h-5 w-5 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>

                {/* 2. Theme (Dark, Default, System) */}
                <button
                  type="button"
                  onClick={() => setIsThemeModalOpen(true)}
                  suppressHydrationWarning
                  className="w-full flex items-center justify-between p-5 hover:bg-neutral-50/80 dark:hover:bg-[#25211d]/70 transition-colors text-left group"
                >
                  <div className="flex items-center gap-4 min-w-0" suppressHydrationWarning>
                    <div className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 p-2.5 rounded-2xl group-hover:bg-heritage-maroon-light group-hover:text-heritage-maroon dark:group-hover:bg-heritage-maroon/20 dark:group-hover:text-red-400 transition-colors shrink-0">
                      <ThemeIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Theme</h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                        Select storefront appearance: Dark, Default (Light), or System.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4" suppressHydrationWarning>
                    <span
                      suppressHydrationWarning
                      className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full capitalize"
                    >
                      {themeLabel}
                    </span>
                    <ChevronRight className="h-5 w-5 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              </div>
            </div>

            {/* GROUP 3: Support & Legal Policies */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-heritage-maroon" />
                  <span>Support &amp; Policies</span>
                </h2>
                <span className="text-xs text-neutral-400 dark:text-neutral-500">Customer Care</span>
              </div>

              <div className="bg-white dark:bg-[#1c1917] rounded-3xl border border-neutral-200/80 dark:border-neutral-800 divide-y divide-neutral-100 dark:divide-neutral-800 overflow-hidden">
                {/* WhatsApp Support Desk */}
                <a
                  href={SITE_CONFIG.contact.whatsappMessageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-5 hover:bg-neutral-50/80 dark:hover:bg-[#25211d]/70 transition-colors text-left group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 p-2.5 rounded-2xl shrink-0">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        Help Center (WhatsApp Support)
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                        Direct support for order tracking, special bulk orders, and delivery assistance.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 px-2.5 py-0.5 rounded-full">
                      Instant WhatsApp
                    </span>
                    <ExternalLink className="h-4 w-4 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors" />
                  </div>
                </a>

                {/* Shipping & Delivery Terms */}
                <Link
                  href="/policies/shipping"
                  className="w-full flex items-center justify-between p-5 hover:bg-neutral-50/80 dark:hover:bg-[#25211d]/70 transition-colors text-left group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 p-2.5 rounded-2xl group-hover:bg-heritage-maroon-light group-hover:text-heritage-maroon dark:group-hover:bg-heritage-maroon/20 dark:group-hover:text-red-400 transition-colors shrink-0">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Pan-India Shipping Policy</h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                        Dispatch timelines from Varanasi, safe transit packaging, and free shipping over ₹499.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 group-hover:translate-x-0.5 transition-all shrink-0 ml-4" />
                </Link>

                {/* Refund & Replacement */}
                <Link
                  href="/policies/refund"
                  className="w-full flex items-center justify-between p-5 hover:bg-neutral-50/80 dark:hover:bg-[#25211d]/70 transition-colors text-left group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 p-2.5 rounded-2xl group-hover:bg-heritage-maroon-light group-hover:text-heritage-maroon dark:group-hover:bg-heritage-maroon/20 dark:group-hover:text-red-400 transition-colors shrink-0">
                      <RefreshCw className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        Refund &amp; Replacement Policy
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                        Hassle-free replacement for any transit damage with simple photo proof within 24 hours.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 group-hover:translate-x-0.5 transition-all shrink-0 ml-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Modals (Shared across Mobile & Desktop) */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        defaultTab={ordersTab}
      />
      <AddressesModal
        isOpen={isAddressesOpen}
        onClose={() => setIsAddressesOpen(false)}
      />
      <ThemeModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
      />

      {/* Language Picker Dialog */}
      <Dialog open={isLanguageModalOpen} onOpenChange={setIsLanguageModalOpen}>
        <DialogContent className="border-heritage-border bg-heritage-cream dark:bg-[#1c1917] dark:border-neutral-800 max-w-sm p-6">
          <DialogHeader className="text-left">
            <div className="flex items-center gap-2">
              <Globe className="text-heritage-maroon dark:text-red-400 h-5 w-5" />
              <DialogTitle className="text-heritage-maroon dark:text-red-400 font-serif text-lg font-bold">
                Select Language
              </DialogTitle>
            </div>
            <DialogDescription className="text-heritage-muted dark:text-neutral-400 text-xs">
              Choose your preferred language for Bramhkanti.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-2">
            {SUPPORTED_LOCALES.map((loc) => {
              const meta = LOCALE_METADATA[loc];
              const isSelected = currentLocale === loc;
              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => handleSelectLanguage(loc)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left ${
                    isSelected
                      ? 'border-heritage-maroon bg-heritage-maroon text-white dark:bg-red-600 dark:border-red-600'
                      : 'border-neutral-200/80 bg-white dark:bg-[#201d1a] dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 text-neutral-800 dark:text-neutral-200'
                  }`}
                >
                  <div>
                    <span className="text-sm font-semibold block">{meta.nativeName}</span>
                    <span
                      className={`text-xs block mt-0.5 ${
                        isSelected ? 'text-white/80' : 'text-neutral-500 dark:text-neutral-400'
                      }`}
                    >
                      {meta.name}
                    </span>
                  </div>
                  {isSelected && <Check className="h-4 w-4 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
