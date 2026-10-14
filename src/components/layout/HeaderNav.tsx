'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, Search, ShoppingBag, Heart } from 'lucide-react';
import { MobileMenu } from './MobileMenu';
import { ProfileMenu } from './ProfileMenu';
import { AuthModal } from './AuthModal';
import { Button } from '@/components/ui/Button';
import { SITE_CONFIG } from '@/content/site';
import { useCartUi, useSearchUi, useWishlist } from '@/lib/store';
import { useCart } from '@/lib/cart';
import type { Category } from '@/lib/api/contracts/domain';
import { cn } from '@/lib/utils/cn';

export interface HeaderNavProps {
  categories: Category[];
  cartCount?: number;
}

export function HeaderNav({ categories, cartCount = 0 }: HeaderNavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { openCart } = useCartUi();
  const { openSearch } = useSearchUi();
  const { optimisticCart } = useCart();
  const { wishlistCount } = useWishlist();

  const liveCartCount = optimisticCart?.itemCount ?? cartCount;

  return (
    <>
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Search button (triggers search modal) */}
        <button
          type="button"
          onClick={openSearch}
          aria-label={SITE_CONFIG.ui.searchPlaceholder}
          className="text-heritage-charcoal hover:bg-heritage-cream-dark hover:text-heritage-maroon focus-visible:outline-heritage-maroon inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors focus-visible:outline-2"
        >
          <Search className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">Search</span>
        </button>

        {/* Wishlist button */}
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

        {/* Profile menu dropdown (Sign In / Register / Account / Sign Out) */}
        <ProfileMenu />

        {/* Shopping bag button (triggers cart drawer) */}
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

        {/* Mobile menu hamburger toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="text-heritage-charcoal hover:bg-heritage-cream-dark rounded-full lg:hidden"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </Button>
      </div>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        categories={categories}
      />

      <AuthModal />
    </>
  );
}
