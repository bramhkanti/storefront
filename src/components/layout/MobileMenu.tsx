'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Compass,
  Heart,
  MessageCircle,
  Truck,
  RotateCcw,
  ShieldCheck,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/Sheet';
import { SITE_CONFIG } from '@/content/site';
import type { Category } from '@/lib/api/contracts/domain';
import { cn } from '@/lib/utils/cn';

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  categories?: Category[] | undefined;
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

const STATIC_DRAWER_LINKS = [
  {
    href: '/about',
    title: 'About Us',
    subtitle: 'Varanasi culinary heritage & mission',
    icon: Compass,
    accentClass: 'text-heritage-maroon bg-heritage-maroon/10',
  },
  {
    href: '/about',
    title: 'Our Story & Kitchen',
    subtitle: 'Ancestral grandmother recipes & sun-curing',
    icon: Heart,
    accentClass: 'text-heritage-saffron-dark bg-heritage-saffron/15',
  },
  {
    href: '/contact',
    title: 'Customer Care & Helpdesk',
    subtitle: 'WhatsApp, phone support & custom gifting',
    icon: MessageCircle,
    accentClass: 'text-emerald-700 bg-emerald-500/10',
  },
  {
    href: '/policies/shipping',
    title: 'Pan-India Shipping Policy',
    subtitle: 'Dispatch timelines, express courier & free delivery',
    icon: Truck,
    accentClass: 'text-heritage-charcoal bg-heritage-cream-dark',
  },
  {
    href: '/policies/refund',
    title: 'Return & Refund Policy',
    subtitle: 'FSSAI food safety & 100% replacement guarantee',
    icon: RotateCcw,
    accentClass: 'text-heritage-charcoal bg-heritage-cream-dark',
  },
  {
    href: '/policies/privacy',
    title: 'Privacy & Data Protection',
    subtitle: 'Zero data trading, 256-bit payment encryption',
    icon: ShieldCheck,
    accentClass: 'text-heritage-charcoal bg-heritage-cream-dark',
  },
  {
    href: '/policies/terms',
    title: 'Terms of Service',
    subtitle: 'Regulatory standards, consumer rules & FSSAI',
    icon: FileText,
    accentClass: 'text-heritage-charcoal bg-heritage-cream-dark',
  },
];

export function MobileMenu({ isOpen, onClose, side: sideProp }: MobileMenuProps) {
  const isDesktop = useIsDesktop();
  const side = sideProp ?? (isDesktop ? 'right' : 'left');

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side={side}
        className={cn(
          'bg-heritage-cream flex h-full w-[88vw] max-w-sm flex-col rounded-none p-0 shadow-2xl sm:max-w-md',
          side === 'right'
            ? 'border-heritage-border border-l'
            : 'border-heritage-border border-r',
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
        <div className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-5 py-5">
          <div className="flex items-center justify-between">
            <span className="text-heritage-muted text-[11px] font-bold tracking-widest uppercase">
              Company & Information
            </span>
            <span className="text-heritage-muted text-[11px]">
              {STATIC_DRAWER_LINKS.length} Links
            </span>
          </div>

          <div className="space-y-2">
            {STATIC_DRAWER_LINKS.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                onClick={onClose}
                className="border-heritage-border/70 bg-heritage-cream-dark/20 hover:bg-heritage-cream-dark/50 hover:border-heritage-maroon/30 flex items-center justify-between rounded-xl border p-3 transition-all"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                      item.accentClass,
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-heritage-charcoal truncate text-xs font-semibold">
                      {item.title}
                    </p>
                    <p className="text-heritage-muted truncate text-[11px]">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
                <ChevronRight className="text-heritage-muted h-3.5 w-3.5 shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="border-heritage-border bg-heritage-cream-dark/30 flex shrink-0 flex-col space-y-2 border-t px-5 py-4">
          <Link
            href="/contact"
            onClick={onClose}
            className="border-heritage-border bg-heritage-cream-dark/60 text-heritage-charcoal hover:bg-heritage-cream-dark hover:border-heritage-maroon/40 inline-flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold shadow-2xs transition-colors"
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
