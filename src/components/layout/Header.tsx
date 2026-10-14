'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, Search, ShoppingBag, Heart } from 'lucide-react';
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

export interface HeaderProps {
  categories: Category[];
  collections?: Collection[] | undefined;
  cartCount?: number;
}

export function Header({ categories, collections, cartCount = 0 }: HeaderProps) {
  const pathname = usePathname() || '';
  const isProfilePage = pathname.includes('/profile') || pathname.includes('/account');

  const { openCart } = useCartUi();
  const { openSearch } = useSearchUi();
  const { isMobileMenuOpen, openMobileMenu, closeMobileMenu } = useNavigationUi();
  const { optimisticCart } = useCart();
  const { wishlistCount } = useWishlist();

  const liveCartCount = optimisticCart?.itemCount ?? cartCount;

  return (
    <header
      className={cn(
        'border-heritage-border bg-heritage-cream/95 sticky top-0 z-40 w-full border-b backdrop-blur-md transition-shadow',
        isProfilePage && 'hidden lg:block',
      )}
    >
      <SkipLink />

      {/* Main Header Container */}
      <Container>
        {/* DESKTOP HEADER (lg:flex) */}
        <div className="relative hidden h-20 items-center justify-between gap-4 lg:flex">
          {/* Brand Logo (Left) */}
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

          {/* Desktop Navigation (Center) - Categories & Collections Mega Menus */}
          <nav
            aria-label="Main Navigation"
            className="flex items-center gap-7 text-sm font-medium"
          >
            {/* Single Group Category with 3-Column Popover */}
            <CategoryMegaMenu categories={categories} />

            {/* Curated Collections with 3-Column Popover */}
            <CollectionMegaMenu collections={collections} />

            {/* Brand Story */}
            <Link
              href="/policies/contact"
              className="text-heritage-charcoal hover:text-heritage-maroon focus-visible:outline-heritage-maroon rounded-xs py-2 font-medium transition-colors focus-visible:outline-2"
            >
              Our Story
            </Link>
          </nav>

          {/* Right Action Icons: Search, Wishlist, Profile, Cart */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search */}
            <button
              type="button"
              onClick={openSearch}
              aria-label={SITE_CONFIG.ui.searchPlaceholder}
              className="text-heritage-charcoal hover:bg-heritage-cream-dark hover:text-heritage-maroon focus-visible:outline-heritage-maroon inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors focus-visible:outline-2"
            >
              <Search className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Search</span>
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              aria-label={
                wishlistCount > 0 ? `Wishlist with ${wishlistCount} items` : 'Wishlist'
              }
              className="text-heritage-charcoal hover:bg-heritage-cream-dark hover:text-heritage-maroon focus-visible:outline-heritage-maroon relative inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors focus-visible:outline-2"
            >
              <Heart
                fill={wishlistCount > 0 ? '#dc2626' : 'none'}
                color={wishlistCount > 0 ? '#dc2626' : 'currentColor'}
                className={cn(
                  'h-5 w-5 transition-transform duration-200',
                  wishlistCount > 0 && 'text-red-600 scale-105',
                )}
                aria-hidden="true"
              />
              <span className="sr-only">Wishlist</span>
              {wishlistCount > 0 && (
                <span
                  className="bg-red-600 absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white shadow-xs"
                  aria-hidden="true"
                >
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Profile menu */}
            <ProfileMenu />

            {/* Cart with count badge */}
            <button
              type="button"
              onClick={openCart}
              aria-label={`${SITE_CONFIG.ui.cartTitle} with ${liveCartCount} items`}
              className="text-heritage-charcoal hover:bg-heritage-cream-dark hover:text-heritage-maroon focus-visible:outline-heritage-maroon relative inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors focus-visible:outline-2"
            >
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">{SITE_CONFIG.ui.cartTitle}</span>
              {liveCartCount > 0 && (
                <span
                  className="bg-heritage-maroon absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white shadow-xs"
                  aria-hidden="true"
                >
                  {liveCartCount > 99 ? '99+' : liveCartCount}
                </span>
              )}
            </button>
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
            <Menu className="h-6 w-6" aria-hidden="true" />
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
                  className="bg-red-600 absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white shadow-xs"
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
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">{SITE_CONFIG.ui.cartTitle}</span>
              {liveCartCount > 0 && (
                <span
                  className="bg-heritage-maroon absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white shadow-xs"
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
          aria-label="Search mango achar, makhana..."
        >
          <Search className="text-heritage-muted h-4 w-4 shrink-0" />
          <span className="text-heritage-muted text-xs font-normal">
            Search mango achar, makhana...
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
