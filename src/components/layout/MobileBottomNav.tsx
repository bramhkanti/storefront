'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Gift, User } from 'lucide-react';
import { useAuth } from '@/lib/store';
import { cn } from '@/lib/utils/cn';

export function MobileBottomNav(): React.JSX.Element {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();

  // Check active states
  const isHome = pathname === '/' || pathname === '/en' || pathname === '/hi';
  const isShop =
    pathname.includes('/categories') ||
    pathname.includes('/achar') ||
    pathname.includes('/makhana') ||
    pathname.includes('/sweets') ||
    pathname.includes('/products');
  const isGifts =
    pathname.includes('/collections/diwali-gifting') || pathname.includes('/collections');
  const isProfile = pathname.includes('/profile') || pathname.includes('/account');

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="border-heritage-border bg-heritage-cream/95 fixed right-0 bottom-0 left-0 z-40 border-t backdrop-blur-md lg:hidden"
    >
      <div className="flex h-15 items-center justify-around px-2">
        {/* 1. Home */}
        <Link
          href="/"
          className={cn(
            'flex flex-1 flex-col items-center justify-center py-1 transition-colors',
            isHome
              ? 'text-heritage-maroon font-semibold'
              : 'text-heritage-muted hover:text-heritage-charcoal',
          )}
          aria-label="Home"
        >
          <Home className="h-5 w-5" aria-hidden="true" />
          <span className="mt-0.5 text-[10px]">Home</span>
        </Link>

        {/* 2. Shop (Links directly to /categories page) */}
        <Link
          href="/categories"
          className={cn(
            'flex flex-1 flex-col items-center justify-center py-1 transition-colors',
            isShop
              ? 'text-heritage-maroon font-semibold'
              : 'text-heritage-muted hover:text-heritage-charcoal',
          )}
          aria-label="Shop Categories"
        >
          <LayoutGrid className="h-5 w-5" aria-hidden="true" />
          <span className="mt-0.5 text-[10px]">Shop</span>
        </Link>

        {/* 3. Gifts */}
        <Link
          href="/collections/diwali-gifting"
          className={cn(
            'flex flex-1 flex-col items-center justify-center py-1 transition-colors',
            isGifts
              ? 'text-heritage-maroon font-semibold'
              : 'text-heritage-muted hover:text-heritage-charcoal',
          )}
          aria-label="Gifts & Festive"
        >
          <Gift className="h-5 w-5" aria-hidden="true" />
          <span className="mt-0.5 text-[10px]">Gifts</span>
        </Link>

        {/* 4. Profile */}
        <Link
          href="/profile"
          className={cn(
            'flex flex-1 flex-col items-center justify-center py-1 transition-colors',
            isProfile
              ? 'text-heritage-maroon font-semibold'
              : 'text-heritage-muted hover:text-heritage-charcoal',
          )}
          aria-label={
            isAuthenticated && user ? `Profile: ${user.name}` : 'Profile & Account'
          }
        >
          {isAuthenticated && user ? (
            <span className="bg-heritage-maroon flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white">
              {user.initials}
            </span>
          ) : (
            <User className="h-5 w-5" aria-hidden="true" />
          )}
          <span className="mt-0.5 text-[10px]">Profile</span>
        </Link>
      </div>
    </nav>
  );
}
