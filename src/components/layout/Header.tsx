'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Menu, Search, ShoppingBag } from 'lucide-react';
import { Container } from './Container';
import { ProfileMenu } from './ProfileMenu';
import { AuthModal } from './AuthModal';
import { MobileMenu } from './MobileMenu';
import { LanguageSwitcher } from './LanguageSwitcher';
import { SkipLink } from '@/components/ui/SkipLink';
import { Button } from '@/components/ui/Button';
import { SITE_CONFIG } from '@/content/site';
import { useCartUi, useSearchUi, useNavigationUi } from '@/lib/store';
import { useCart } from '@/lib/cart';
import type { Category } from '@/lib/api/contracts/domain';

export interface HeaderProps {
  categories: Category[];
  cartCount?: number;
}

export function Header({ categories, cartCount = 0 }: HeaderProps) {
  const { openCart } = useCartUi();
  const { openSearch } = useSearchUi();
  const { isMobileMenuOpen, openMobileMenu, closeMobileMenu } = useNavigationUi();
  const { optimisticCart } = useCart();

  const liveCartCount = optimisticCart?.itemCount ?? cartCount;

  return (
    <header className="border-heritage-border bg-heritage-cream/95 sticky top-0 z-40 w-full border-b backdrop-blur-md transition-shadow">
      <SkipLink />

      {/* Top Announcement Bar */}
      <div className="bg-heritage-maroon text-heritage-saffron-light px-4 py-1.5 text-xs font-medium">
        <Container>
          <div className="flex items-center justify-between">
            {/* Desktop announcement copy */}
            <div className="hidden items-center gap-2 md:flex">
              <span>Free Express Shipping across India on orders above ₹499</span>
              <span aria-hidden="true">•</span>
              <span>100% Traditional Vegetarian Purity</span>
            </div>

            {/* Mobile compact announcement copy */}
            <div className="w-full text-center md:hidden">
              <span>Free shipping across India above ₹499</span>
            </div>

            {/* Desktop utility links: Track Order, Contact, and Language Switcher */}
            <div className="hidden items-center gap-4 text-xs text-white/90 md:flex">
              <Link href="/account/orders" className="transition-colors hover:text-white">
                Track Order
              </Link>
              <Link
                href="/policies/contact"
                className="transition-colors hover:text-white"
              >
                Contact
              </Link>
              <span className="text-white/30" aria-hidden="true">
                |
              </span>
              <LanguageSwitcher variant="banner" />
            </div>
          </div>
        </Container>
      </div>

      {/* Main Header Container */}
      <Container>
        {/* DESKTOP HEADER (lg:flex) */}
        <div className="hidden h-20 items-center justify-between gap-4 lg:flex">
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

          {/* Desktop Navigation (Center) - Category dropdown preserved with no changes */}
          <nav
            aria-label="Main Navigation"
            className="flex items-center gap-7 text-sm font-medium"
          >
            {categories.map((cat) => {
              const hasChildren = (cat.children && cat.children.length > 0) ?? false;

              return (
                <div key={cat.id} className="group relative">
                  <Link
                    href={`/${cat.handle}`}
                    className="text-heritage-charcoal hover:text-heritage-maroon group-hover:text-heritage-maroon focus-visible:outline-heritage-maroon inline-flex items-center gap-1 rounded-xs py-2 transition-colors focus-visible:outline-2"
                  >
                    <span>{cat.name}</span>
                    {hasChildren && (
                      <ChevronDown
                        className="text-heritage-muted h-3.5 w-3.5 transition-transform group-hover:rotate-180"
                        aria-hidden="true"
                      />
                    )}
                  </Link>

                  {/* Mega dropdown menu for subcategories */}
                  {hasChildren && (
                    <div className="invisible absolute top-full left-0 z-50 w-64 pt-2 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                      <div className="border-heritage-border bg-heritage-cream rounded-lg border p-4 shadow-xl">
                        <div className="text-heritage-muted border-heritage-border/60 mb-2 border-b pb-1.5 text-xs font-semibold tracking-wider uppercase">
                          {cat.name} Varieties
                        </div>
                        <ul className="space-y-1.5">
                          {cat.children?.map((sub) => (
                            <li key={sub.id}>
                              <Link
                                href={`/${cat.handle}/${sub.handle}`}
                                className="text-heritage-charcoal hover:bg-heritage-cream-dark hover:text-heritage-maroon block rounded-sm px-2 py-1.5 text-sm transition-colors"
                              >
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Special Collections & Brand Story */}
            <Link
              href="/collections/diwali-gifting"
              className="text-heritage-charcoal hover:text-heritage-maroon focus-visible:outline-heritage-maroon rounded-xs py-2 font-medium transition-colors focus-visible:outline-2"
            >
              Gifting & Festive
            </Link>
            <Link
              href="/collections/best-sellers"
              className="text-heritage-charcoal hover:text-heritage-maroon focus-visible:outline-heritage-maroon rounded-xs py-2 font-medium transition-colors focus-visible:outline-2"
            >
              Bestsellers
            </Link>
            <Link
              href="/policies/contact"
              className="text-heritage-charcoal hover:text-heritage-maroon focus-visible:outline-heritage-maroon rounded-xs py-2 font-medium transition-colors focus-visible:outline-2"
            >
              Our Story
            </Link>
          </nav>

          {/* Right Action Icons: Search, Profile, Cart */}
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

          {/* Right: Cart Bag with badge to maintain balance */}
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
