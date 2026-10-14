'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Gift, User, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/store';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/Sheet';
import { cn } from '@/lib/utils/cn';

export function MobileBottomNav(): React.JSX.Element {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();
  const [isCategorySheetOpen, setIsCategorySheetOpen] = React.useState(false);

  // Check active states
  const isHome = pathname === '/' || pathname === '/en' || pathname === '/hi';
  const isShop =
    pathname.includes('/achar') ||
    pathname.includes('/makhana') ||
    pathname.includes('/sweets') ||
    pathname.includes('/products') ||
    isCategorySheetOpen;
  const isGifts =
    pathname.includes('/collections/diwali-gifting') || pathname.includes('/collections');
  const isProfile = pathname.includes('/profile') || pathname.includes('/account');

  return (
    <>
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

          {/* 2. Shop (Opens Category Bottom Sheet) */}
          <button
            type="button"
            onClick={() => setIsCategorySheetOpen(true)}
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
          </button>

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

      {/* Proper Category Bottom Sheet for Mobile */}
      <Sheet open={isCategorySheetOpen} onOpenChange={setIsCategorySheetOpen}>
        <SheetContent side="bottom" className="p-6">
          <SheetHeader className="pb-3 text-left">
            <div
              className="bg-heritage-border/90 mx-auto -mt-2 mb-2 h-1.5 w-12 shrink-0 rounded-full"
              aria-hidden="true"
            />
            <SheetTitle className="text-heritage-maroon font-serif text-xl font-bold">
              Shop by Category
            </SheetTitle>
            <p className="text-heritage-muted text-xs">
              Explore our handcrafted traditional Indian delicacies
            </p>
          </SheetHeader>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {/* Pickle */}
            <Link
              href="/achar"
              onClick={() => setIsCategorySheetOpen(false)}
              className="border-heritage-border bg-heritage-cream hover:border-heritage-maroon/40 flex flex-col items-center justify-center rounded-xl border p-4 text-center transition-all hover:shadow-md"
            >
              <div className="bg-heritage-maroon/10 mb-2 flex h-10 w-10 items-center justify-center rounded-full text-lg">
                🥒
              </div>
              <span className="text-heritage-maroon font-serif text-sm font-bold">
                Pickle
              </span>
              <span className="text-heritage-muted mt-0.5 text-[11px]">
                Tangy &amp; Spicy Achar
              </span>
            </Link>

            {/* Makhana */}
            <Link
              href="/makhana"
              onClick={() => setIsCategorySheetOpen(false)}
              className="border-heritage-border bg-heritage-cream hover:border-heritage-maroon/40 flex flex-col items-center justify-center rounded-xl border p-4 text-center transition-all hover:shadow-md"
            >
              <div className="bg-heritage-maroon/10 mb-2 flex h-10 w-10 items-center justify-center rounded-full text-lg">
                🌰
              </div>
              <span className="text-heritage-maroon font-serif text-sm font-bold">
                Makhana
              </span>
              <span className="text-heritage-muted mt-0.5 text-[11px]">
                Roasted Foxnuts
              </span>
            </Link>

            {/* Sweets */}
            <Link
              href="/sweets"
              onClick={() => setIsCategorySheetOpen(false)}
              className="border-heritage-border bg-heritage-cream hover:border-heritage-maroon/40 flex flex-col items-center justify-center rounded-xl border p-4 text-center transition-all hover:shadow-md"
            >
              <div className="bg-heritage-maroon/10 mb-2 flex h-10 w-10 items-center justify-center rounded-full text-lg">
                🍬
              </div>
              <span className="text-heritage-maroon font-serif text-sm font-bold">
                Sweets
              </span>
              <span className="text-heritage-muted mt-0.5 text-[11px]">
                Pure Desi Ghee Mithai
              </span>
            </Link>

            {/* Gifting & Festive */}
            <Link
              href="/collections/diwali-gifting"
              onClick={() => setIsCategorySheetOpen(false)}
              className="border-heritage-border bg-heritage-cream hover:border-heritage-maroon/40 flex flex-col items-center justify-center rounded-xl border p-4 text-center transition-all hover:shadow-md"
            >
              <div className="bg-heritage-maroon/10 mb-2 flex h-10 w-10 items-center justify-center rounded-full text-lg">
                🎁
              </div>
              <span className="text-heritage-maroon font-serif text-sm font-bold">
                Gifting &amp; Festive
              </span>
              <span className="text-heritage-muted mt-0.5 text-[11px]">
                Curated Gift Hampers
              </span>
            </Link>
          </div>

          <div className="mt-4 pt-2">
            <Link
              href="/achar"
              onClick={() => setIsCategorySheetOpen(false)}
              className="border-heritage-border hover:bg-heritage-cream-dark text-heritage-charcoal flex w-full items-center justify-center rounded-xl border py-2.5 text-xs font-semibold transition-colors"
            >
              <span>Explore All Delicacies</span>
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
