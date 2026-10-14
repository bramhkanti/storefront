'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, MessageCircle } from 'lucide-react';
import { Container } from './Container';
import { Badge } from '@/components/ui/Badge';
import { SITE_CONFIG } from '@/content/site';
import type { Category } from '@/lib/api/contracts/domain';
import { cn } from '@/lib/utils/cn';

export interface FooterProps {
  categories?: Category[];
}

export function Footer({ categories = [] }: FooterProps) {
  const pathname = usePathname() || '';
  const isProfilePage = pathname.includes('/profile') || pathname.includes('/account');
  const currentYear = SITE_CONFIG.brand.copyrightYear;

  return (
    <footer
      className={cn(
        'border-heritage-border bg-heritage-cream-dark/50 text-heritage-charcoal mt-16 border-t sm:mt-24',
        isProfilePage && 'hidden lg:block',
      )}
    >
      {/* Main Footer Links & Info */}
      <div className="py-12 sm:py-16">
        <Container>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
            {/* Column 1: Brand & FSSAI (2 spans on desktop) */}
            <div className="space-y-4 lg:col-span-2">
              <Link href="/" className="inline-block">
                <span className="text-heritage-maroon font-serif text-2xl font-extrabold tracking-tight">
                  {SITE_CONFIG.brand.name}
                </span>
              </Link>
              <p className="text-heritage-muted max-w-sm text-sm leading-relaxed">
                {SITE_CONFIG.brand.description}
              </p>

              {/* Indian Food Safety Regulatory Mark */}
              <div className="border-heritage-border bg-heritage-cream max-w-sm rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <Badge variant="vegetarian">100% Pure Veg</Badge>
                  <span className="text-heritage-charcoal text-xs font-semibold">
                    FSSAI Registered
                  </span>
                </div>
                <p className="text-heritage-muted mt-1.5 text-xs">
                  Lic. No.{' '}
                  <span className="font-mono font-medium">
                    {SITE_CONFIG.brand.fssaiLicenseNumber}
                  </span>
                </p>
                <p className="text-heritage-muted text-[11px]">
                  Manufactured in a certified pure vegetarian Indian kitchen.
                </p>
              </div>
            </div>

            {/* Column 2: Categories (Dynamic) */}
            <div className="space-y-3">
              <h4 className="text-heritage-maroon text-xs font-semibold tracking-wider uppercase">
                {SITE_CONFIG.footer.categoriesTitle}
              </h4>
              <ul className="space-y-2 text-sm">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/${cat.handle}`}
                      className="text-heritage-muted hover:text-heritage-maroon transition-colors"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/collections/diwali-gifting"
                    className="text-heritage-muted hover:text-heritage-maroon transition-colors"
                  >
                    Festive Gifting
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collections/best-sellers"
                    className="text-heritage-muted hover:text-heritage-maroon transition-colors"
                  >
                    Best Sellers
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Customer Care & WhatsApp */}
            <div className="space-y-3">
              <h4 className="text-heritage-maroon text-xs font-semibold tracking-wider uppercase">
                {SITE_CONFIG.footer.customerCareTitle}
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a
                    href={SITE_CONFIG.contact.whatsappMessageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-heritage-green inline-flex items-center gap-2 font-medium hover:underline"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>WhatsApp Order Help</span>
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${SITE_CONFIG.contact.supportEmail}`}
                    className="text-heritage-muted hover:text-heritage-maroon inline-flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    <span>{SITE_CONFIG.contact.supportEmail}</span>
                  </a>
                </li>
                <li className="text-heritage-muted pt-1 text-xs">
                  Operating Hours:
                  <br />
                  {SITE_CONFIG.contact.operatingHours}
                </li>
              </ul>
            </div>

            {/* Column 4: Legal & Policies */}
            <div className="space-y-3">
              <h4 className="text-heritage-maroon text-xs font-semibold tracking-wider uppercase">
                {SITE_CONFIG.footer.legalTitle}
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/policies/shipping"
                    className="text-heritage-muted hover:text-heritage-maroon transition-colors"
                  >
                    Shipping Policy (Pan-India)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/policies/refund"
                    className="text-heritage-muted hover:text-heritage-maroon transition-colors"
                  >
                    Refund & Replacement Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/policies/privacy"
                    className="text-heritage-muted hover:text-heritage-maroon transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/policies/terms"
                    className="text-heritage-muted hover:text-heritage-maroon transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright & Address Strip */}
          <div className="border-heritage-border mt-12 border-t pt-8 text-center sm:flex sm:items-center sm:justify-between sm:text-left">
            <p className="text-heritage-muted text-xs">
              © {currentYear} {SITE_CONFIG.brand.legalName}.{' '}
              {SITE_CONFIG.footer.rightsReserved}
            </p>
            <p className="text-heritage-muted mt-2 text-xs sm:mt-0">
              Handcrafted in {SITE_CONFIG.contact.address.city},{' '}
              {SITE_CONFIG.contact.address.state}, {SITE_CONFIG.brand.countryOfOrigin}.
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
