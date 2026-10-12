'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, User, LogIn, LogOut, Package } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/Sheet';
import { Button } from '@/components/ui/Button';
import { SITE_CONFIG } from '@/content/site';
import { useAuth, useToast } from '@/lib/store';
import type { Category } from '@/lib/api/contracts/domain';
import { cn } from '@/lib/utils/cn';

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
}

export function MobileMenu({ isOpen, onClose, categories }: MobileMenuProps) {
  const [expandedCategories, setExpandedCategories] = React.useState<
    Record<string, boolean>
  >({});
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const { addToast } = useToast();

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="left"
        className="w-[85vw] max-w-sm overflow-y-auto rounded-r-2xl border-r sm:max-w-md sm:rounded-r-3xl"
      >
        <SheetHeader>
          <SheetTitle className="sr-only">{SITE_CONFIG.brand.name}</SheetTitle>
          <div className="flex items-center">
            <Link
              href="/"
              onClick={onClose}
              aria-label={`${SITE_CONFIG.brand.name} - Home`}
            >
              <Image
                src="/logo.png"
                alt={SITE_CONFIG.brand.name}
                width={180}
                height={96}
                priority
                className="h-14 w-auto object-contain sm:h-16"
              />
            </Link>
          </div>
        </SheetHeader>

        {/* Mobile Account / Auth Profile Section */}
        <div className="border-heritage-border bg-heritage-cream-dark/50 mt-4 rounded-lg border p-3">
          {isAuthenticated && user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="bg-heritage-maroon flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white">
                  {user.initials}
                </span>
                <div className="min-w-0">
                  <p className="text-heritage-charcoal truncate text-sm font-semibold">
                    {user.name}
                  </p>
                  <p className="text-heritage-muted truncate text-[11px]">{user.phone}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  logout();
                  addToast({ type: 'info', message: 'You have been signed out.' });
                }}
                className="text-heritage-maroon hover:bg-heritage-maroon-light rounded-md p-1.5 transition-colors"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <User className="text-heritage-muted h-5 w-5" />
                <span className="text-heritage-charcoal text-xs font-medium">
                  Welcome, Guest
                </span>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onClose();
                  openAuthModal();
                }}
                className="text-xs font-semibold"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </Button>
            </div>
          )}
        </div>

        <nav aria-label="Mobile Navigation" className="mt-6 flex flex-col space-y-4">
          <div className="text-heritage-muted text-xs font-semibold tracking-wider uppercase">
            Shop by Category
          </div>

          <ul className="divide-heritage-border/60 flex flex-col divide-y">
            {categories.map((cat) => {
              const hasChildren = (cat.children && cat.children.length > 0) ?? false;
              const isExpanded = expandedCategories[cat.id] ?? false;

              return (
                <li key={cat.id} className="py-2.5">
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/${cat.handle}`}
                      onClick={onClose}
                      className="text-heritage-charcoal hover:text-heritage-maroon text-base font-medium transition-colors"
                    >
                      {cat.name}
                    </Link>
                    {hasChildren && (
                      <button
                        type="button"
                        onClick={() => toggleCategory(cat.id)}
                        className="text-heritage-muted hover:text-heritage-maroon rounded-xs p-1.5 transition-transform"
                        aria-expanded={isExpanded}
                        aria-label={`Toggle subcategories for ${cat.name}`}
                      >
                        <ChevronDown
                          className={cn(
                            'h-4 w-4 transition-transform duration-200',
                            isExpanded && 'rotate-180',
                          )}
                        />
                      </button>
                    )}
                  </div>

                  {hasChildren && isExpanded && (
                    <ul className="border-heritage-saffron-light mt-2 space-y-2 border-l-2 pl-4">
                      {cat.children?.map((sub) => (
                        <li key={sub.id}>
                          <Link
                            href={`/${cat.handle}/${sub.handle}`}
                            onClick={onClose}
                            className="text-heritage-muted hover:text-heritage-maroon block text-sm transition-colors"
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="text-heritage-muted pt-4 text-xs font-semibold tracking-wider uppercase">
            Special Collections
          </div>
          <ul className="space-y-2">
            <li>
              <Link
                href="/collections/diwali-gifting"
                onClick={onClose}
                className="text-heritage-charcoal hover:text-heritage-maroon text-sm font-medium"
              >
                Diwali & Festive Gifting
              </Link>
            </li>
            <li>
              <Link
                href="/collections/best-sellers"
                onClick={onClose}
                className="text-heritage-charcoal hover:text-heritage-maroon text-sm font-medium"
              >
                Best Sellers
              </Link>
            </li>
            <li>
              <Link
                href="/collections/grandmas-specials"
                onClick={onClose}
                className="text-heritage-charcoal hover:text-heritage-maroon text-sm font-medium"
              >
                Grandma&apos;s Heritage Specials
              </Link>
            </li>
            {isAuthenticated && (
              <li>
                <Link
                  href="/account/orders"
                  onClick={onClose}
                  className="text-heritage-charcoal hover:text-heritage-maroon flex items-center gap-2 text-sm font-medium"
                >
                  <Package className="text-heritage-muted h-4 w-4" />
                  <span>My Orders ({user?.orderCount ?? 0})</span>
                </Link>
              </li>
            )}
          </ul>

          <div className="border-heritage-border mt-auto border-t pt-6">
            <Link
              href="/policies/contact"
              onClick={onClose}
              className="bg-heritage-cream-dark text-heritage-charcoal hover:bg-heritage-border border-heritage-border inline-flex w-full items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium transition-colors"
            >
              <span>Customer Care & Contact</span>
            </Link>
            <p className="text-heritage-muted mt-3 text-center text-xs">
              FSSAI Lic. No. {SITE_CONFIG.brand.fssaiLicenseNumber}
            </p>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
