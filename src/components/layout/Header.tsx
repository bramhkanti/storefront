'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, ShoppingCart, Heart } from 'lucide-react';
import { Container } from './Container';
import { ProfileMenu } from './ProfileMenu';
import { AuthModal } from './AuthModal';
import { MobileMenu } from './MobileMenu';
import { CategoryMegaMenu } from './CategoryMegaMenu';
import { CollectionMegaMenu } from './CollectionMegaMenu';
import { SkipLink } from '@/components/ui/SkipLink';
import { Button } from '@/components/ui/Button';
import { SITE_CONFIG } from '@/content/site';
import { useCartUi, useSearchUi, useNavigationUi, useWishlist } from '@/lib/store';
import { useCart } from '@/lib/cart';
import type { Category, Collection } from '@/lib/api/contracts/domain';
import { cn } from '@/lib/utils/cn';

/**
 * Modern 3-bar asymmetrical hamburger icon matching the brand design mockup.
 * Top & middle bars are full-width, bottom bar is a right-aligned short bar.
 */
function HamburgerMenuIcon({ className }: { className?: string }): React.JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="3.5" y1="5.5" x2="20.5" y2="5.5" />
      <line x1="3.5" y1="12" x2="20.5" y2="12" />
      <line x1="11" y1="18.5" x2="20.5" y2="18.5" />
    </svg>
  );
}

export interface HeaderProps {
  categories: Category[];
  collections?: Collection[] | undefined;
  cartCount?: number;
}

export function Header({ categories, collections, cartCount = 0 }: HeaderProps) {
  const pathname = usePathname() || '';
  const isHome =
    pathname === '/' ||
    pathname === '/en' ||
    pathname === '/hi' ||
    pathname === '/en-IN' ||
    pathname === '/hi-IN';

  const { openCart } = useCartUi();
  const { openSearch } = useSearchUi();
  const { isMobileMenuOpen, openMobileMenu, closeMobileMenu } = useNavigationUi();
  const { optimisticCart } = useCart();
  const { wishlistCount } = useWishlist();

  const liveCartCount = optimisticCart?.itemCount ?? cartCount;

  return (
    <header className="border-heritage-border bg-heritage-cream/95 sticky top-0 z-40 w-full border-b backdrop-blur-md transition-shadow">
      <SkipLink />

      {/* Main Header Container */}
      <Container>
        {/* DESKTOP HEADER (lg:flex) */}
        <div className="relative hidden h-20 items-center justify-between gap-4 lg:flex">
          {/* Left: Brand Logo */}
          <div className="flex shrink-0 items-center">
            <Link
              href="/"
              className="focus-visible:outline-heritage-maroon flex items-center rounded-xs focus-visible:outline-2"
              aria-label={`${SITE_CONFIG.brand.name} - Home`}
            >
              <Image
                src="/logo.png"
                alt={SITE_CONFIG.brand.name}
                width={154}
                height={90}
                priority
                className="h-14 w-auto object-contain transition-transform hover:scale-105 md:h-16"
              />
            </Link>
          </div>

          {/* Right: Navigation Links, Search Box, Divider & Action Icons */}
          <div className="flex items-center gap-6 xl:gap-8">
            {/* Desktop Navigation */}
            <nav
              aria-label="Main Navigation"
              className="flex items-center gap-5 text-sm font-semibold lg:gap-6 xl:gap-7"
            >
              {/* Home */}
              <Link
                href="/"
                className={cn(
                  'focus-visible:outline-heritage-maroon relative rounded-xs py-2 font-semibold transition-colors focus-visible:outline-2',
                  isHome
                    ? 'text-red-600 after:absolute after:right-0 after:bottom-0 after:left-0 after:h-[2.5px] after:rounded-full after:bg-red-600 dark:text-red-500 dark:after:bg-red-500'
                    : 'text-heritage-charcoal hover:text-heritage-maroon',
                )}
              >
                Home
              </Link>

              {/* Single Group Category with 3-Column Popover */}
              <CategoryMegaMenu categories={categories} />

              {/* Curated Collections with 3-Column Popover */}
              <CollectionMegaMenu collections={collections} />

              {/* Brand Story */}
              <Link
                href="/policies/contact"
                className="text-heritage-charcoal hover:text-heritage-maroon focus-visible:outline-heritage-maroon rounded-xs py-2 font-semibold transition-colors focus-visible:outline-2"
              >
                Our Story
              </Link>
            </nav>

            {/* Right Action Items: Pill Search Bar, Vertical Divider, and 4 Action Icons */}
            <div className="flex items-center gap-3 lg:gap-4 xl:gap-5">
              {/* Pill Search Button */}
              <button
                type="button"
                onClick={openSearch}
                aria-label="Search for your favourite achar..."
                className="flex w-52 items-center gap-2.5 rounded-full border border-neutral-200/60 bg-neutral-100/90 px-4 py-2 text-left transition-all hover:bg-neutral-200/70 xl:w-72 dark:border-neutral-700/60 dark:bg-neutral-800/80 dark:hover:bg-neutral-700/70"
              >
                <Search
                  className="h-4 w-4 shrink-0 text-neutral-500 dark:text-neutral-400"
                  aria-hidden="true"
                />
                <span className="truncate text-xs font-normal text-neutral-400 dark:text-neutral-400">
                  Search for your favourite achar...
                </span>
              </button>

              {/* Vertical Divider */}
              <div
                className="mx-1 h-6 w-px bg-neutral-200 dark:bg-neutral-700"
                aria-hidden="true"
              />

              {/* 4 Action Icons Cluster: Wishlist, Cart, Profile Avatar, Hamburger Menu */}
              <div className="flex items-center gap-4 sm:gap-5 lg:gap-6 xl:gap-7">
                {/* 1. Wishlist */}
                <Link
                  href="/wishlist"
                  aria-label={
                    wishlistCount > 0
                      ? `Wishlist with ${wishlistCount} items`
                      : 'Wishlist'
                  }
                  className="text-heritage-charcoal hover:bg-heritage-cream-dark hover:text-heritage-maroon focus-visible:outline-heritage-maroon relative inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors focus-visible:outline-2"
                >
                  <Heart
                    fill={wishlistCount > 0 ? '#dc2626' : 'none'}
                    color={wishlistCount > 0 ? '#dc2626' : 'currentColor'}
                    className={cn(
                      'h-5 w-5 transition-transform duration-200',
                      wishlistCount > 0 && 'scale-105 text-red-600',
                    )}
                    aria-hidden="true"
                  />
                  <span className="sr-only">Wishlist</span>
                  {wishlistCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white shadow-xs"
                      aria-hidden="true"
                    >
                      {wishlistCount > 99 ? '99+' : wishlistCount}
                    </span>
                  )}
                </Link>

                {/* 2. Cart with count badge */}
                <button
                  type="button"
                  onClick={openCart}
                  aria-label={`${SITE_CONFIG.ui.cartTitle} with ${liveCartCount} items`}
                  className="text-heritage-charcoal hover:bg-heritage-cream-dark hover:text-heritage-maroon focus-visible:outline-heritage-maroon relative inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors focus-visible:outline-2"
                >
                  <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                  <span className="sr-only">{SITE_CONFIG.ui.cartTitle}</span>
                  {liveCartCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white shadow-xs"
                      aria-hidden="true"
                    >
                      {liveCartCount > 99 ? '99+' : liveCartCount}
                    </span>
                  )}
                </button>

                {/* 3. Profile menu */}
                <ProfileMenu />

                {/* 4. Hamburger menu drawer toggle */}
                <button
                  type="button"
                  onClick={openMobileMenu}
                  aria-label="Open navigation menu"
                  className="text-heritage-charcoal hover:bg-heritage-cream-dark hover:text-heritage-maroon focus-visible:outline-heritage-maroon inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors focus-visible:outline-2"
                >
                  <HamburgerMenuIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE HEADER (lg:hidden) */}
        <div className="flex h-16 items-center justify-between lg:hidden">
          {/* Left: Hamburger menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="text-heritage-charcoal hover:bg-heritage-cream-dark rounded-full"
            onClick={openMobileMenu}
            aria-label="Open navigation menu"
          >
            <HamburgerMenuIcon className="h-6 w-6" />
          </Button>

          {/* Center: Brand Logo centered */}
          <Link
            href="/"
            className="focus-visible:outline-heritage-maroon flex items-center justify-center rounded-xs focus-visible:outline-2"
            aria-label={`${SITE_CONFIG.brand.name} - Home`}
          >
            <Image
              src="/logo.png"
              alt={SITE_CONFIG.brand.name}
              width={130}
              height={70}
              priority
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Right: Wishlist & Cart Bag with badge */}
          <div className="flex items-center gap-0.5">
            <Link
              href="/wishlist"
              aria-label={
                wishlistCount > 0 ? `Wishlist with ${wishlistCount} items` : 'Wishlist'
              }
              className="text-heritage-charcoal hover:bg-heritage-cream-dark hover:text-heritage-maroon relative inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors"
            >
              <Heart
                fill={wishlistCount > 0 ? '#dc2626' : 'none'}
                color={wishlistCount > 0 ? '#dc2626' : 'currentColor'}
                className={cn(
                  'h-5 w-5 transition-transform duration-200',
                  wishlistCount > 0 && 'text-red-600',
                )}
                aria-hidden="true"
              />
              <span className="sr-only">Wishlist</span>
              {wishlistCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white shadow-xs"
                  aria-hidden="true"
                >
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={openCart}
              aria-label={`${SITE_CONFIG.ui.cartTitle} with ${liveCartCount} items`}
              className="text-heritage-charcoal hover:bg-heritage-cream-dark hover:text-heritage-maroon relative inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors"
            >
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">{SITE_CONFIG.ui.cartTitle}</span>
              {liveCartCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white shadow-xs"
                  aria-hidden="true"
                >
                  {liveCartCount > 99 ? '99+' : liveCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </Container>

      {/* Dedicated Mobile Search Bar (Below Header on mobile) */}
      <div className="border-heritage-border/60 bg-heritage-cream/95 px-4 pt-0.5 pb-2.5 lg:hidden">
        <button
          type="button"
          onClick={openSearch}
          className="border-heritage-border bg-heritage-cream-dark/60 text-heritage-muted hover:border-heritage-maroon flex w-full items-center gap-2.5 rounded-lg border px-3.5 py-2 text-left text-sm transition-colors"
          aria-label="Search for your favourite achar..."
        >
          <Search className="text-heritage-muted h-4 w-4 shrink-0" />
          <span className="text-heritage-muted text-xs font-normal">
            Search for your favourite achar...
          </span>
        </button>
      </div>

      {/* Slide-out Mobile Menu Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        categories={categories}
      />

      {/* Auth Modal */}
      <AuthModal />
    </header>
  );
}
