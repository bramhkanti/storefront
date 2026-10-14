'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronDown,
  ArrowRight,
  Sparkles,
  Heart,
  Gift,
  Compass,
  MessageCircle,
  Truck,
  RotateCcw,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/Sheet';
import { SITE_CONFIG } from '@/content/site';
import type { Category } from '@/lib/api/contracts/domain';
import { cn } from '@/lib/utils/cn';

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  side?: 'left' | 'right';
}

function subscribeMediaQuery(callback: () => void) {
  const mediaQuery = window.matchMedia('(min-width: 1024px)');
  mediaQuery.addEventListener('change', callback);
  return () => mediaQuery.removeEventListener('change', callback);
}

function getDesktopSnapshot() {
  return window.matchMedia('(min-width: 1024px)').matches;
}

function getServerSnapshot() {
  return false;
}

function useIsDesktop(): boolean {
  return React.useSyncExternalStore(
    subscribeMediaQuery,
    getDesktopSnapshot,
    getServerSnapshot,
  );
}

export function MobileMenu({
  isOpen,
  onClose,
  categories,
  side: sideProp,
}: MobileMenuProps) {
  const isDesktop = useIsDesktop();
  const side = sideProp ?? (isDesktop ? 'right' : 'left');
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
        side={side}
        className={cn(
          'bg-heritage-cream flex h-full w-[88vw] max-w-sm flex-col p-0 shadow-2xl sm:max-w-md',
          side === 'right'
            ? 'border-heritage-border rounded-l-2xl border-l sm:rounded-l-3xl'
            : 'border-heritage-border rounded-r-2xl border-r sm:rounded-r-3xl',
        )}
      >
        {/* Fixed Header */}
        <SheetHeader className="border-heritage-border bg-heritage-cream-dark/30 flex shrink-0 flex-row items-center justify-between space-y-0 border-b px-5 py-4 text-left">
          <SheetTitle className="sr-only">{SITE_CONFIG.brand.name}</SheetTitle>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              onClick={onClose}
              aria-label={`${SITE_CONFIG.brand.name} - Home`}
              className="transition-opacity hover:opacity-90"
            >
              <Image
                src="/logo.png"
                alt={SITE_CONFIG.brand.name}
                width={140}
                height={75}
                priority
                className="h-11 w-auto object-contain sm:h-12"
              />
            </Link>
          </div>
        </SheetHeader>

        {/* Scrollable Content Body */}
        <div className="flex-1 space-y-6 overflow-y-auto overscroll-contain px-5 py-5">
          {/* Section 1: Shop by Category */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-heritage-muted text-[11px] font-bold tracking-widest uppercase">
                Shop by Category
              </span>
              <span className="text-heritage-muted text-[11px] font-medium">
                {categories.length} Collections
              </span>
            </div>

            <div className="border-heritage-border/70 bg-heritage-cream-dark/20 divide-heritage-border/60 divide-y overflow-hidden rounded-2xl border">
              {categories.map((cat) => {
                const hasChildren = (cat.children && cat.children.length > 0) ?? false;
                const isExpanded = expandedCategories[cat.id] ?? false;

                return (
                  <div key={cat.id} className="transition-colors">
                    <div className="hover:bg-heritage-cream-dark/50 flex items-center justify-between px-4 py-3 transition-colors">
                      <Link
                        href={`/${cat.handle}`}
                        onClick={onClose}
                        className="text-heritage-charcoal hover:text-heritage-maroon font-serif text-[15px] font-medium transition-colors"
                      >
                        {cat.name}
                      </Link>
                      {hasChildren && (
                        <button
                          type="button"
                          onClick={() => toggleCategory(cat.id)}
                          className="text-heritage-muted hover:text-heritage-maroon hover:bg-heritage-cream-dark/60 rounded-md p-1 transition-all"
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
                      <div className="border-heritage-border/50 bg-heritage-cream-dark/40 border-t px-4 py-2.5">
                        <ul className="border-heritage-saffron-light space-y-2 border-l-2 pl-3">
                          {cat.children?.map((sub) => (
                            <li key={sub.id}>
                              <Link
                                href={`/${cat.handle}/${sub.handle}`}
                                onClick={onClose}
                                className="text-heritage-muted hover:text-heritage-maroon block text-xs font-medium transition-colors"
                              >
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section 2: Curated Collections */}
          <section className="space-y-3">
            <div className="text-heritage-muted text-[11px] font-bold tracking-widest uppercase">
              Curated Collections
            </div>

            <div className="space-y-2">
              <Link
                href="/collections/best-sellers"
                onClick={onClose}
                className="border-heritage-border/70 bg-heritage-cream-dark/20 hover:bg-heritage-cream-dark/50 hover:border-heritage-maroon/30 flex items-center justify-between rounded-xl border p-3 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-heritage-maroon/10 text-heritage-maroon flex h-8 w-8 items-center justify-center rounded-lg">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-heritage-charcoal text-xs font-semibold">
                      Best Seller Combo
                    </p>
                    <p className="text-heritage-muted text-[11px]">
                      Most popular kitchen pairings
                    </p>
                  </div>
                </div>
                <ArrowRight className="text-heritage-muted h-3.5 w-3.5" />
              </Link>

              <Link
                href="/collections/grandmas-specials"
                onClick={onClose}
                className="border-heritage-border/70 bg-heritage-cream-dark/20 hover:bg-heritage-cream-dark/50 hover:border-heritage-maroon/30 flex items-center justify-between rounded-xl border p-3 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-heritage-saffron/15 text-heritage-saffron-dark flex h-8 w-8 items-center justify-center rounded-lg">
                    <Heart className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-heritage-charcoal text-xs font-semibold">
                      Grand Maa&apos;s Specials
                    </p>
                    <p className="text-heritage-muted text-[11px]">
                      Sun-ripened ancestral recipes
                    </p>
                  </div>
                </div>
                <ArrowRight className="text-heritage-muted h-3.5 w-3.5" />
              </Link>

              <Link
                href="/collections/diwali-gifting"
                onClick={onClose}
                className="border-heritage-border/70 bg-heritage-cream-dark/20 hover:bg-heritage-cream-dark/50 hover:border-heritage-maroon/30 flex items-center justify-between rounded-xl border p-3 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-700">
                    <Gift className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-heritage-charcoal text-xs font-semibold">
                      Diwali & Festive Gifting
                    </p>
                    <p className="text-heritage-muted text-[11px]">
                      Artisanal handcrafted gift boxes
                    </p>
                  </div>
                </div>
                <ArrowRight className="text-heritage-muted h-3.5 w-3.5" />
              </Link>

              <Link
                href="/collections"
                onClick={onClose}
                className="border-heritage-maroon/20 bg-heritage-maroon/5 text-heritage-maroon hover:bg-heritage-maroon flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-xs font-semibold transition-all hover:text-white"
              >
                <span>View All Collections</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </section>

          {/* Section 3: Company & Policies */}
          <section className="space-y-3">
            <div className="text-heritage-muted text-[11px] font-bold tracking-widest uppercase">
              Company & Policies
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/about"
                onClick={onClose}
                className="hover:bg-heritage-cream-dark/60 text-heritage-charcoal hover:text-heritage-maroon flex items-center gap-2 rounded-lg p-2 text-xs font-medium transition-colors"
              >
                <Compass className="text-heritage-muted h-3.5 w-3.5 shrink-0" />
                <span className="truncate">About Us</span>
              </Link>
              <Link
                href="/contact"
                onClick={onClose}
                className="hover:bg-heritage-cream-dark/60 text-heritage-charcoal hover:text-heritage-maroon flex items-center gap-2 rounded-lg p-2 text-xs font-medium transition-colors"
              >
                <MessageCircle className="h-3.5 w-3.5 shrink-0 text-emerald-700" />
                <span className="truncate">Contact Care</span>
              </Link>
              <Link
                href="/policies/shipping"
                onClick={onClose}
                className="hover:bg-heritage-cream-dark/60 text-heritage-charcoal hover:text-heritage-maroon flex items-center gap-2 rounded-lg p-2 text-xs font-medium transition-colors"
              >
                <Truck className="text-heritage-muted h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Shipping Terms</span>
              </Link>
              <Link
                href="/policies/refund"
                onClick={onClose}
                className="hover:bg-heritage-cream-dark/60 text-heritage-charcoal hover:text-heritage-maroon flex items-center gap-2 rounded-lg p-2 text-xs font-medium transition-colors"
              >
                <RotateCcw className="text-heritage-muted h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Refund Policy</span>
              </Link>
              <Link
                href="/policies/privacy"
                onClick={onClose}
                className="hover:bg-heritage-cream-dark/60 text-heritage-charcoal hover:text-heritage-maroon flex items-center gap-2 rounded-lg p-2 text-xs font-medium transition-colors"
              >
                <ShieldCheck className="text-heritage-muted h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Privacy Terms</span>
              </Link>
              <Link
                href="/policies/terms"
                onClick={onClose}
                className="hover:bg-heritage-cream-dark/60 text-heritage-charcoal hover:text-heritage-maroon flex items-center gap-2 rounded-lg p-2 text-xs font-medium transition-colors"
              >
                <FileText className="text-heritage-muted h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Terms of Service</span>
              </Link>
            </div>
          </section>
        </div>

        {/* Fixed Footer */}
        <div className="border-heritage-border bg-heritage-cream-dark/30 flex shrink-0 flex-col space-y-2 border-t px-5 py-4">
          <Link
            href="/contact"
            onClick={onClose}
            className="border-heritage-border text-heritage-charcoal hover:bg-heritage-cream-dark inline-flex w-full items-center justify-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-xs font-semibold shadow-2xs transition-colors"
          >
            <MessageCircle className="h-4 w-4 text-emerald-700" />
            <span>Customer Care & Contact</span>
          </Link>
          <div className="text-heritage-muted flex items-center justify-center gap-2 pt-0.5 text-[11px]">
            <span className="flex items-center gap-1 font-medium text-emerald-800">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-600" />
              <span>100% Pure Veg</span>
            </span>
            <span>•</span>
            <span>FSSAI Lic. {SITE_CONFIG.brand.fssaiLicenseNumber}</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
