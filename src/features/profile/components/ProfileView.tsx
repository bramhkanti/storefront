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
  ChevronDown,
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
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/Dialog';
import { useCart } from '@/lib/cart';
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

// WhatsApp when configured, otherwise email.
const SUPPORT_HREF =
  SITE_CONFIG.contact.whatsappMessageUrl || `mailto:${SITE_CONFIG.contact.supportEmail}`;

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

  const { refreshCart } = useCart();

  const handleSignOut = async () => {
    await logout();
    await refreshCart();
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

  const activeLocaleMeta = LOCALE_METADATA[currentLocale] || LOCALE_METADATA.en;

  const activeTheme = mounted ? theme : 'system';
  const ThemeIcon =
    activeTheme === 'dark' ? Moon : activeTheme === 'light' ? Sun : Laptop;
  const themeLabel =
    activeTheme === 'dark'
      ? 'Dark'
      : activeTheme === 'light'
        ? 'Default (Light)'
        : 'System';

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F8F9FA] px-4 py-6 transition-colors sm:px-6 sm:py-8 lg:px-8 lg:py-12 dark:bg-[#12100e]">
      {/* =========================================================================
          1. MOBILE VIEW (< lg)
          Clean native mobile app profile matching the user requirements:
          - Left-aligned Apple-style back button and Profile title
          - Account: Profile details, Saved Address, My Active orders, My Past orders
          - Store Preferences: Language, Theme (Dark, Default, System)
         ========================================================================= */}
      <div className="mx-auto max-w-md space-y-6 lg:hidden">
        {/* Mobile Top Header: My Account Title & Overview Description */}
        <div className="pt-1">
          <h1 className="text-[22px] font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            My Account
          </h1>
          <p className="mt-1 text-[14px] leading-relaxed font-normal text-neutral-500 dark:text-neutral-400">
            Browse your account details, track deliveries, manage saved addresses, and
            customize store preferences.
          </p>
        </div>

        {/* Top User Profile Card */}
        <div className="flex items-center justify-between gap-4 rounded-3xl border border-neutral-200/80 bg-white p-4 sm:p-5 dark:border-neutral-800 dark:bg-[#1c1917]">
          <div className="flex min-w-0 items-center gap-3.5">
            {/* Avatar (Name Text Initials) */}
            <div className="relative shrink-0">
              {isAuthenticated && user ? (
                <div className="bg-heritage-maroon flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold text-white sm:h-16 sm:w-16">
                  {user.initials}
                </div>
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 sm:h-16 sm:w-16 dark:bg-neutral-800 dark:text-neutral-500">
                  <User className="h-7 w-7" />
                </div>
              )}

              {isAuthenticated && (
                <span
                  className="absolute right-0 bottom-0 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-neutral-900"
                  title="Active account"
                  aria-hidden="true"
                />
              )}
            </div>

            {/* User Credentials */}
            <div className="min-w-0 flex-1">
              {isAuthenticated && user ? (
                <>
                  <h2 className="truncate text-base font-bold text-neutral-900 sm:text-lg dark:text-neutral-100">
                    {user.name}
                  </h2>
                  <p className="mt-0.5 truncate font-mono text-xs text-neutral-500 sm:text-sm dark:text-neutral-400">
                    {user.phone}
                  </p>
                  <div className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                    <ShieldCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                    <span>Verified Customer</span>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="truncate text-base font-bold text-neutral-900 sm:text-lg dark:text-neutral-100">
                    Welcome to Bramhkanti
                  </h2>
                  <p className="mt-0.5 truncate text-xs text-neutral-500 dark:text-neutral-400">
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
          <h2 className="px-1 text-xs font-semibold text-neutral-400 sm:text-sm dark:text-neutral-500">
            Account
          </h2>
          <div className="divide-y divide-neutral-100/80 overflow-hidden rounded-3xl border border-neutral-200/80 bg-white dark:divide-neutral-800/80 dark:border-neutral-800 dark:bg-[#1c1917]">
            {/* 1. Profile details */}
            <button
              type="button"
              onClick={() => {
                if (isAuthenticated) {
                  setIsEditProfileOpen(true);
                } else {
                  openAuthModal();
                }
              }}
              className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-neutral-50 active:bg-neutral-100/70 dark:hover:bg-[#25211d]/70"
            >
              <div className="flex min-w-0 items-center gap-3.5">
                <Phone
                  className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-300"
                  aria-hidden="true"
                />
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Profile details
                </span>
              </div>
              <div className="flex min-w-0 items-center gap-2">
                <span className="max-w-[130px] truncate font-mono text-xs text-neutral-400 dark:text-neutral-400">
                  {isAuthenticated && user?.phone ? user.phone : 'Verify via OTP'}
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-neutral-400" />
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
              className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-neutral-50 active:bg-neutral-100/70 dark:hover:bg-[#25211d]/70"
            >
              <div className="flex min-w-0 items-center gap-3.5">
                <MapPin
                  className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-300"
                  aria-hidden="true"
                />
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Saved Address
                </span>
              </div>
              <div className="flex min-w-0 items-center gap-2">
                {isAuthenticated && user?.addressSummary && (
                  <span className="max-w-[130px] truncate text-xs text-neutral-400 dark:text-neutral-400">
                    {user.addressSummary.split(',')[0]}
                  </span>
                )}
                <ChevronRight className="h-4 w-4 shrink-0 text-neutral-400" />
              </div>
            </button>

            {/* 3. My Active orders */}
            <button
              type="button"
              onClick={() => handleOpenOrders('active')}
              className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-neutral-50 active:bg-neutral-100/70 dark:hover:bg-[#25211d]/70"
            >
              <div className="flex min-w-0 items-center gap-3.5">
                <Truck
                  className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-300"
                  aria-hidden="true"
                />
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  My Active orders
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 shrink-0 text-neutral-400" />
              </div>
            </button>

            {/* 4. My Past orders */}
            <button
              type="button"
              onClick={() => handleOpenOrders('past')}
              className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-neutral-50 active:bg-neutral-100/70 dark:hover:bg-[#25211d]/70"
            >
              <div className="flex min-w-0 items-center gap-3.5">
                <Package
                  className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-300"
                  aria-hidden="true"
                />
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  My Past orders
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 shrink-0 text-neutral-400" />
              </div>
            </button>
          </div>
        </section>

        {/* SECTION 2: Store Preferences (Language & Theme only) */}
        <section aria-label="Store Preferences" className="space-y-2">
          <h2 className="px-1 text-xs font-semibold text-neutral-400 sm:text-sm dark:text-neutral-500">
            Store Preferences
          </h2>
          <div className="divide-y divide-neutral-100/80 overflow-hidden rounded-3xl border border-neutral-200/80 bg-white dark:divide-neutral-800/80 dark:border-neutral-800 dark:bg-[#1c1917]">
            {/* 1. Language */}
            <button
              type="button"
              onClick={() => setIsLanguageModalOpen(true)}
              className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-neutral-50 active:bg-neutral-100/70 dark:hover:bg-[#25211d]/70"
            >
              <div className="flex min-w-0 items-center gap-3.5">
                <Globe
                  className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-300"
                  aria-hidden="true"
                />
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Language
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-neutral-400 dark:text-neutral-400">
                  {activeLocaleMeta.name}
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-neutral-400" />
              </div>
            </button>

            {/* 2. Theme (Dark, Default, System) */}
            <button
              type="button"
              onClick={() => setIsThemeModalOpen(true)}
              suppressHydrationWarning
              className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-neutral-50 active:bg-neutral-100/70 dark:hover:bg-[#25211d]/70"
            >
              <div className="flex min-w-0 items-center gap-3.5" suppressHydrationWarning>
                <ThemeIcon
                  className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-300"
                  aria-hidden="true"
                />
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Theme
                </span>
              </div>
              <div className="flex items-center gap-2" suppressHydrationWarning>
                <span
                  className="text-xs font-medium text-neutral-400 capitalize dark:text-neutral-400"
                  suppressHydrationWarning
                >
                  {themeLabel}
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-neutral-400" />
              </div>
            </button>
          </div>
        </section>

        {/* SECTION 3: Support */}
        <section aria-label="Customer Support & Legal" className="space-y-2">
          <h2 className="px-1 text-xs font-semibold text-neutral-400 sm:text-sm dark:text-neutral-500">
            Support
          </h2>
          <div className="divide-y divide-neutral-100/80 overflow-hidden rounded-3xl border border-neutral-200/80 bg-white dark:divide-neutral-800/80 dark:border-neutral-800 dark:bg-[#1c1917]">
            {/* Help Center & WhatsApp Care */}
            <a
              href={SUPPORT_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-neutral-50 active:bg-neutral-100/70 dark:hover:bg-[#25211d]/70"
            >
              <div className="flex min-w-0 items-center gap-3.5">
                <HelpCircle
                  className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-300"
                  aria-hidden="true"
                />
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Help Center (WhatsApp Support)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-neutral-400 dark:text-neutral-400">
                  Instant Care
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-neutral-400" />
              </div>
            </a>

            {/* Shipping Policy */}
            <Link
              href="/policies/shipping"
              className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-neutral-50 active:bg-neutral-100/70 dark:hover:bg-[#25211d]/70"
            >
              <div className="flex min-w-0 items-center gap-3.5">
                <Truck
                  className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-300"
                  aria-hidden="true"
                />
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Pan-India Shipping Policy
                </span>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-neutral-400" />
            </Link>

            {/* Refund & Replacement */}
            <Link
              href="/policies/refund"
              className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-neutral-50 active:bg-neutral-100/70 dark:hover:bg-[#25211d]/70"
            >
              <div className="flex min-w-0 items-center gap-3.5">
                <RefreshCw
                  className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-300"
                  aria-hidden="true"
                />
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Refund &amp; Replacement Policy
                </span>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-neutral-400" />
            </Link>
          </div>
        </section>

        {/* SECTION 4: Session Control (Sign Out or Guest Actions) */}
        <div>
          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center justify-center gap-2.5 rounded-3xl border border-neutral-200/80 bg-white px-4 py-3.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 active:bg-red-100/70 dark:border-neutral-800 dark:bg-[#1c1917] dark:text-red-400 dark:hover:bg-red-950/30"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Sign Out</span>
            </button>
          ) : (
            <Button
              variant="primary"
              onClick={openAuthModal}
              className="w-full rounded-3xl py-3.5 text-sm font-semibold"
            >
              <LogIn className="mr-2 h-4 w-4" />
              <span>Sign In / Register</span>
            </Button>
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
        <div className="mb-8 flex flex-col gap-6 border-b border-neutral-200/80 pb-6 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl dark:text-neutral-50">
              Account Overview
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-neutral-500 sm:text-base dark:text-neutral-400">
              Manage your profile, orders, saved addresses and preferences.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            {/* Theme Trigger Capsule */}
            <button
              type="button"
              onClick={() => setIsThemeModalOpen(true)}
              suppressHydrationWarning
              aria-label={`Current theme: ${themeLabel}. Click to change theme.`}
              className="group focus-visible:ring-heritage-maroon/30 flex items-center gap-3 rounded-2xl border border-neutral-200/90 bg-white px-3.5 py-2 text-left shadow-xs transition-all duration-200 hover:border-neutral-300 hover:shadow-md focus-visible:ring-2 focus-visible:outline-none dark:border-neutral-800 dark:bg-[#1c1917] dark:hover:border-neutral-700"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber-200/60 bg-amber-50 text-amber-600 transition-transform duration-200 group-hover:scale-105 dark:border-amber-800/40 dark:bg-amber-950/40 dark:text-amber-400">
                <ThemeIcon className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
                  Theme
                </span>
                <span
                  suppressHydrationWarning
                  className="text-xs font-semibold text-neutral-800 transition-colors group-hover:text-neutral-950 dark:text-neutral-200 dark:group-hover:text-white"
                >
                  {themeLabel}
                </span>
              </div>
              <ChevronDown
                className="ml-1 h-3.5 w-3.5 text-neutral-400 transition-transform duration-200 group-hover:translate-y-0.5 group-hover:text-neutral-700 dark:text-neutral-500 dark:group-hover:text-neutral-300"
                aria-hidden="true"
              />
            </button>

            {/* Language Trigger Capsule */}
            <button
              type="button"
              onClick={() => setIsLanguageModalOpen(true)}
              aria-label={`Current language: ${activeLocaleMeta.name}. Click to change language.`}
              className="group focus-visible:ring-heritage-maroon/30 flex items-center gap-3 rounded-2xl border border-neutral-200/90 bg-white px-3.5 py-2 text-left shadow-xs transition-all duration-200 hover:border-neutral-300 hover:shadow-md focus-visible:ring-2 focus-visible:outline-none dark:border-neutral-800 dark:bg-[#1c1917] dark:hover:border-neutral-700"
            >
              <div className="bg-heritage-maroon/5 text-heritage-maroon border-heritage-maroon/15 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-transform duration-200 group-hover:scale-105 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400">
                <Globe className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
                  Language
                </span>
                <span className="text-xs font-semibold text-neutral-800 transition-colors group-hover:text-neutral-950 dark:text-neutral-200 dark:group-hover:text-white">
                  {activeLocaleMeta.name}
                </span>
              </div>
              <ChevronDown
                className="ml-1 h-3.5 w-3.5 text-neutral-400 transition-transform duration-200 group-hover:translate-y-0.5 group-hover:text-neutral-700 dark:text-neutral-500 dark:group-hover:text-neutral-300"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        {/* 12-Column Desktop Grid */}
        <div className="grid grid-cols-12 items-start gap-8">
          {/* Left Column: Profile Card, Quick Stats & WhatsApp (4 Cols) */}
          <div className="sticky top-24 col-span-4 space-y-6">
            {/* Desktop User Profile Card */}
            <div className="relative overflow-hidden rounded-3xl border border-neutral-200/80 bg-white p-6 text-center dark:border-neutral-800 dark:bg-[#1c1917]">
              <div className="from-heritage-maroon/10 absolute top-0 right-0 left-0 h-20 bg-gradient-to-r via-amber-50 to-orange-50 dark:from-red-950/30 dark:via-neutral-900 dark:to-neutral-900" />

              <div className="relative mt-2">
                {isAuthenticated && user ? (
                  <div className="bg-heritage-maroon mx-auto flex h-22 w-22 items-center justify-center rounded-full text-2xl font-bold text-white ring-4 ring-white dark:ring-neutral-900">
                    {user.initials}
                  </div>
                ) : (
                  <div className="mx-auto flex h-22 w-22 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 ring-4 ring-white dark:bg-neutral-800 dark:text-neutral-500 dark:ring-neutral-900">
                    <User className="h-10 w-10" />
                  </div>
                )}
              </div>

              <div className="mt-4">
                <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  {isAuthenticated && user ? user.name : 'Guest Customer'}
                </h2>
                <p className="mt-0.5 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                  {isAuthenticated && user ? user.phone : 'Sign in to access orders'}
                </p>

                {isAuthenticated && (
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Verified Bramhkanti Customer</span>
                  </div>
                )}
              </div>

              {/* Action Button: Sign Out / Sign In */}
              <div className="mt-6 border-t border-neutral-100 pt-4 dark:border-neutral-800">
                {isAuthenticated ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="w-full gap-1.5 rounded-2xl border-red-200 py-2.5 text-xs font-semibold text-red-600 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/40"
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
                      <LogIn className="mr-1.5 h-3.5 w-3.5" />
                      <span>Sign In / Register</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats Summary Card */}
            {isAuthenticated && (
              <div className="rounded-3xl border border-neutral-200/80 bg-white p-5 dark:border-neutral-800 dark:bg-[#1c1917]">
                <h3 className="mb-3 text-xs font-bold tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
                  Account Highlights
                </h3>
                <div className="grid grid-cols-2 gap-3 text-left">
                  <div className="rounded-2xl border border-neutral-100 bg-[#F8F9FA] p-3 dark:border-neutral-800 dark:bg-[#25211d]">
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      Saved Addresses
                    </p>
                    <p className="text-heritage-maroon mt-0.5 text-lg font-bold dark:text-red-400">
                      {user?.addresses.length ?? 0}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-neutral-100 bg-[#F8F9FA] p-3 dark:border-neutral-800 dark:bg-[#25211d]">
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      Shipping Hub
                    </p>
                    <p className="mt-1 truncate text-sm font-bold text-neutral-900 dark:text-neutral-100">
                      Varanasi
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* WhatsApp Support Direct Box */}
            <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-white p-5 dark:border-emerald-800/40 dark:from-emerald-950/30 dark:via-neutral-900 dark:to-[#1c1917]">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-600 p-2 text-white">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold tracking-wider text-emerald-950 uppercase dark:text-emerald-300">
                    WhatsApp Concierge
                  </h4>
                  <p className="text-xs text-emerald-800/80 dark:text-emerald-400/80">
                    Available 9 AM – 9 PM IST
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                Have questions regarding packing, shipping, or pure ghee sweets? We are
                right here.
              </p>
              <a
                href={SUPPORT_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3.5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
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
              <div className="mb-3 flex items-center justify-between px-1">
                <h2 className="flex items-center gap-2 text-base font-bold text-neutral-900 dark:text-neutral-100">
                  <span>Account Management</span>
                </h2>
                <span className="text-xs text-neutral-400 dark:text-neutral-500">
                  Personal &amp; Delivery
                </span>
              </div>

              <div className="divide-y divide-neutral-100 overflow-hidden rounded-3xl border border-neutral-200/80 bg-white dark:divide-neutral-800 dark:border-neutral-800 dark:bg-[#1c1917]">
                {/* 1. Profile details */}
                <button
                  type="button"
                  onClick={() => {
                    if (isAuthenticated) setIsEditProfileOpen(true);
                    else openAuthModal();
                  }}
                  className="group flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-neutral-50/80 dark:hover:bg-[#25211d]/70"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="group-hover:bg-heritage-maroon-light group-hover:text-heritage-maroon dark:group-hover:bg-heritage-maroon/20 shrink-0 rounded-2xl bg-neutral-100 p-2.5 text-neutral-700 transition-colors dark:bg-neutral-800 dark:text-neutral-300 dark:group-hover:text-red-400">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        Profile details
                      </h3>
                      <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                        Your name, email for receipts and login mobile number.
                      </p>
                    </div>
                  </div>
                  <div className="ml-4 flex shrink-0 items-center gap-3">
                    <span className="font-mono text-xs text-neutral-400 dark:text-neutral-400">
                      {isAuthenticated && user?.phone ? user.phone : 'Not signed in'}
                    </span>
                    <ChevronRight className="h-5 w-5 shrink-0 text-neutral-400 transition-all group-hover:translate-x-0.5 group-hover:text-neutral-700 dark:group-hover:text-neutral-200" />
                  </div>
                </button>

                {/* 2. Saved Address */}
                <button
                  type="button"
                  onClick={() => {
                    if (isAuthenticated) setIsAddressesOpen(true);
                    else openAuthModal();
                  }}
                  className="group flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-neutral-50/80 dark:hover:bg-[#25211d]/70"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="group-hover:bg-heritage-maroon-light group-hover:text-heritage-maroon dark:group-hover:bg-heritage-maroon/20 shrink-0 rounded-2xl bg-neutral-100 p-2.5 text-neutral-700 transition-colors dark:bg-neutral-800 dark:text-neutral-300 dark:group-hover:text-red-400">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        Saved Address
                      </h3>
                      <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                        Add, edit or choose your default delivery address.
                      </p>
                    </div>
                  </div>
                  <div className="ml-4 flex shrink-0 items-center gap-3">
                    {isAuthenticated && user?.addressSummary && (
                      <span className="text-xs font-medium text-neutral-400 dark:text-neutral-400">
                        {user.addressSummary.split(',')[0]}
                      </span>
                    )}
                    <ChevronRight className="h-5 w-5 text-neutral-400 transition-all group-hover:translate-x-0.5 group-hover:text-neutral-700 dark:group-hover:text-neutral-200" />
                  </div>
                </button>

                {/* 3. My Active orders */}
                <button
                  type="button"
                  onClick={() => handleOpenOrders('active')}
                  className="group flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-neutral-50/80 dark:hover:bg-[#25211d]/70"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="group-hover:bg-heritage-maroon-light group-hover:text-heritage-maroon dark:group-hover:bg-heritage-maroon/20 shrink-0 rounded-2xl bg-neutral-100 p-2.5 text-neutral-700 transition-colors dark:bg-neutral-800 dark:text-neutral-300 dark:group-hover:text-red-400">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        My Active orders
                      </h3>
                      <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                        Orders that are being packed or are on the way.
                      </p>
                    </div>
                  </div>
                  <div className="ml-4 flex shrink-0 items-center gap-3">
                    <ChevronRight className="h-5 w-5 text-neutral-400 transition-all group-hover:translate-x-0.5 group-hover:text-neutral-700 dark:group-hover:text-neutral-200" />
                  </div>
                </button>

                {/* 4. My Past orders */}
                <button
                  type="button"
                  onClick={() => handleOpenOrders('past')}
                  className="group flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-neutral-50/80 dark:hover:bg-[#25211d]/70"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="group-hover:bg-heritage-maroon-light group-hover:text-heritage-maroon dark:group-hover:bg-heritage-maroon/20 shrink-0 rounded-2xl bg-neutral-100 p-2.5 text-neutral-700 transition-colors dark:bg-neutral-800 dark:text-neutral-300 dark:group-hover:text-red-400">
                      <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        My Past orders
                      </h3>
                      <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                        Delivered and cancelled orders.
                      </p>
                    </div>
                  </div>
                  <div className="ml-4 flex shrink-0 items-center gap-3">
                    <ChevronRight className="h-5 w-5 text-neutral-400 transition-all group-hover:translate-x-0.5 group-hover:text-neutral-700 dark:group-hover:text-neutral-200" />
                  </div>
                </button>
              </div>
            </div>

            {/* GROUP 2: Store Preferences (Language & Theme only) */}
            <div>
              <div className="mb-3 flex items-center justify-between px-1">
                <h2 className="flex items-center gap-2 text-base font-bold text-neutral-900 dark:text-neutral-100">
                  <span>Store Preferences</span>
                </h2>
                <span className="text-xs text-neutral-400 dark:text-neutral-500">
                  Appearance &amp; Regional
                </span>
              </div>

              <div className="divide-y divide-neutral-100 overflow-hidden rounded-3xl border border-neutral-200/80 bg-white dark:divide-neutral-800 dark:border-neutral-800 dark:bg-[#1c1917]">
                {/* 1. Language Switcher */}
                <button
                  type="button"
                  onClick={() => setIsLanguageModalOpen(true)}
                  className="group flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-neutral-50/80 dark:hover:bg-[#25211d]/70"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="group-hover:bg-heritage-maroon-light group-hover:text-heritage-maroon dark:group-hover:bg-heritage-maroon/20 shrink-0 rounded-2xl bg-neutral-100 p-2.5 text-neutral-700 transition-colors dark:bg-neutral-800 dark:text-neutral-300 dark:group-hover:text-red-400">
                      <Globe className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        Language
                      </h3>
                      <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                        Browse Bramhkanti storefront in English or हिन्दी.
                      </p>
                    </div>
                  </div>
                  <div className="ml-4 flex shrink-0 items-center gap-3">
                    <span className="text-heritage-maroon bg-heritage-maroon-light dark:bg-heritage-maroon/30 rounded-full px-3 py-1 text-xs font-bold dark:text-red-300">
                      {activeLocaleMeta.name} ({activeLocaleMeta.nativeName})
                    </span>
                    <ChevronRight className="h-5 w-5 text-neutral-400 transition-all group-hover:translate-x-0.5 group-hover:text-neutral-700 dark:group-hover:text-neutral-200" />
                  </div>
                </button>

                {/* 2. Theme (Dark, Default, System) */}
                <button
                  type="button"
                  onClick={() => setIsThemeModalOpen(true)}
                  suppressHydrationWarning
                  className="group flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-neutral-50/80 dark:hover:bg-[#25211d]/70"
                >
                  <div
                    className="flex min-w-0 items-center gap-4"
                    suppressHydrationWarning
                  >
                    <div className="group-hover:bg-heritage-maroon-light group-hover:text-heritage-maroon dark:group-hover:bg-heritage-maroon/20 shrink-0 rounded-2xl bg-neutral-100 p-2.5 text-neutral-700 transition-colors dark:bg-neutral-800 dark:text-neutral-300 dark:group-hover:text-red-400">
                      <ThemeIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        Theme
                      </h3>
                      <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                        Select storefront appearance: Dark, Default (Light), or System.
                      </p>
                    </div>
                  </div>
                  <div
                    className="ml-4 flex shrink-0 items-center gap-3"
                    suppressHydrationWarning
                  >
                    <span
                      suppressHydrationWarning
                      className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700 capitalize dark:bg-neutral-800 dark:text-neutral-300"
                    >
                      {themeLabel}
                    </span>
                    <ChevronRight className="h-5 w-5 text-neutral-400 transition-all group-hover:translate-x-0.5 group-hover:text-neutral-700 dark:group-hover:text-neutral-200" />
                  </div>
                </button>
              </div>
            </div>

            {/* GROUP 3: Support & Legal Policies */}
            <div>
              <div className="mb-3 flex items-center justify-between px-1">
                <h2 className="flex items-center gap-2 text-base font-bold text-neutral-900 dark:text-neutral-100">
                  <span>Support &amp; Policies</span>
                </h2>
                <span className="text-xs text-neutral-400 dark:text-neutral-500">
                  Customer Care
                </span>
              </div>

              <div className="divide-y divide-neutral-100 overflow-hidden rounded-3xl border border-neutral-200/80 bg-white dark:divide-neutral-800 dark:border-neutral-800 dark:bg-[#1c1917]">
                {/* WhatsApp Support Desk */}
                <a
                  href={SUPPORT_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-neutral-50/80 dark:hover:bg-[#25211d]/70"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="shrink-0 rounded-2xl bg-emerald-50 p-2.5 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        Help Center (WhatsApp Support)
                      </h3>
                      <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                        Direct support for order tracking, special bulk orders, and
                        delivery assistance.
                      </p>
                    </div>
                  </div>
                  <div className="ml-4 flex shrink-0 items-center gap-3">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                      Instant WhatsApp
                    </span>
                    <ExternalLink className="h-4 w-4 text-neutral-400 transition-colors group-hover:text-neutral-700 dark:group-hover:text-neutral-200" />
                  </div>
                </a>

                {/* Shipping & Delivery Terms */}
                <Link
                  href="/policies/shipping"
                  className="group flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-neutral-50/80 dark:hover:bg-[#25211d]/70"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="group-hover:bg-heritage-maroon-light group-hover:text-heritage-maroon dark:group-hover:bg-heritage-maroon/20 shrink-0 rounded-2xl bg-neutral-100 p-2.5 text-neutral-700 transition-colors dark:bg-neutral-800 dark:text-neutral-300 dark:group-hover:text-red-400">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        Pan-India Shipping Policy
                      </h3>
                      <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                        Dispatch timelines from Varanasi, safe transit packaging, and free
                        shipping over ₹499.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="ml-4 h-5 w-5 shrink-0 text-neutral-400 transition-all group-hover:translate-x-0.5 group-hover:text-neutral-700 dark:group-hover:text-neutral-200" />
                </Link>

                {/* Refund & Replacement */}
                <Link
                  href="/policies/refund"
                  className="group flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-neutral-50/80 dark:hover:bg-[#25211d]/70"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="group-hover:bg-heritage-maroon-light group-hover:text-heritage-maroon dark:group-hover:bg-heritage-maroon/20 shrink-0 rounded-2xl bg-neutral-100 p-2.5 text-neutral-700 transition-colors dark:bg-neutral-800 dark:text-neutral-300 dark:group-hover:text-red-400">
                      <RefreshCw className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        Refund &amp; Replacement Policy
                      </h3>
                      <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                        Hassle-free replacement for any transit damage with simple photo
                        proof within 24 hours.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="ml-4 h-5 w-5 shrink-0 text-neutral-400 transition-all group-hover:translate-x-0.5 group-hover:text-neutral-700 dark:group-hover:text-neutral-200" />
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
      <ThemeModal isOpen={isThemeModalOpen} onClose={() => setIsThemeModalOpen(false)} />

      {/* Language Picker Dialog */}
      <Dialog open={isLanguageModalOpen} onOpenChange={setIsLanguageModalOpen}>
        <DialogContent className="border-heritage-border bg-heritage-cream max-w-sm p-6 dark:border-neutral-800 dark:bg-[#1c1917]">
          <DialogHeader className="text-left">
            <div className="flex items-center gap-2">
              <Globe className="text-heritage-maroon h-5 w-5 dark:text-red-400" />
              <DialogTitle className="text-heritage-maroon font-serif text-lg font-bold dark:text-red-400">
                Select Language
              </DialogTitle>
            </div>
            <DialogDescription className="text-heritage-muted text-xs dark:text-neutral-400">
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
                  className={`flex w-full items-center justify-between rounded-2xl border p-3.5 text-left transition-all ${
                    isSelected
                      ? 'border-heritage-maroon bg-heritage-maroon text-white dark:border-red-600 dark:bg-red-600'
                      : 'border-neutral-200/80 bg-white text-neutral-800 hover:border-neutral-300 dark:border-neutral-800 dark:bg-[#201d1a] dark:text-neutral-200 dark:hover:border-neutral-700'
                  }`}
                >
                  <div>
                    <span className="block text-sm font-semibold">{meta.nativeName}</span>
                    <span
                      className={`mt-0.5 block text-xs ${
                        isSelected
                          ? 'text-white/80'
                          : 'text-neutral-500 dark:text-neutral-400'
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
