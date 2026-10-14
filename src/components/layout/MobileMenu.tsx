'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/Sheet';
import { SITE_CONFIG } from '@/content/site';
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

        <nav aria-label="Mobile Navigation" className="mt-6 flex flex-col space-y-5">
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
                href="/collections/best-sellers"
                onClick={onClose}
                className="text-heritage-charcoal hover:text-heritage-maroon text-sm font-medium"
              >
                Best Seller Combo
              </Link>
            </li>
            <li>
              <Link
                href="/collections/grandmas-specials"
                onClick={onClose}
                className="text-heritage-charcoal hover:text-heritage-maroon text-sm font-medium"
              >
                Grand Maa
              </Link>
            </li>
            <li>
              <Link
                href="/collections/diwali-gifting"
                onClick={onClose}
                className="text-heritage-charcoal hover:text-heritage-maroon text-sm font-medium"
              >
                Diwali and Fest
              </Link>
            </li>
            <li>
              <Link
                href="/collections"
                onClick={onClose}
                className="text-heritage-maroon hover:text-heritage-maroon-hover inline-flex items-center gap-1 pt-1 text-xs font-semibold transition-colors"
              >
                <span>View All Collections</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </li>
          </ul>

          {/* Company & Policies */}
          <div className="text-heritage-muted pt-2 text-xs font-semibold tracking-wider uppercase">
            Company & Policies
          </div>
          <ul className="space-y-2.5">
            <li>
              <Link
                href="/about"
                onClick={onClose}
                className="text-heritage-charcoal hover:text-heritage-maroon text-sm font-medium transition-colors"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                onClick={onClose}
                className="text-heritage-charcoal hover:text-heritage-maroon text-sm font-medium transition-colors"
              >
                Our Story & Heritage
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                onClick={onClose}
                className="text-heritage-charcoal hover:text-heritage-maroon text-sm font-medium transition-colors"
              >
                Contact & Support
              </Link>
            </li>
            <li>
              <Link
                href="/policies/shipping"
                onClick={onClose}
                className="text-heritage-charcoal hover:text-heritage-maroon text-sm font-medium transition-colors"
              >
                Pan-India Shipping Policy
              </Link>
            </li>
            <li>
              <Link
                href="/policies/refund"
                onClick={onClose}
                className="text-heritage-charcoal hover:text-heritage-maroon text-sm font-medium transition-colors"
              >
                Return & Refund Policy
              </Link>
            </li>
            <li>
              <Link
                href="/policies/privacy"
                onClick={onClose}
                className="text-heritage-charcoal hover:text-heritage-maroon text-sm font-medium transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/policies/terms"
                onClick={onClose}
                className="text-heritage-charcoal hover:text-heritage-maroon text-sm font-medium transition-colors"
              >
                Terms of Service
              </Link>
            </li>
          </ul>

          <div className="border-heritage-border mt-auto border-t pt-6">
            <Link
              href="/contact"
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
