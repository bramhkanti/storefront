import * as React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface BreadcrumbItem {
  name: string;
  href?: string | undefined;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string | undefined;
  baseUrl?: string | undefined;
}

/**
 * Accessible Breadcrumb navigation with embedded Schema.org BreadcrumbList JSON-LD.
 */
export function Breadcrumbs({
  items,
  className,
  baseUrl = 'https://bramhkanti.com',
}: BreadcrumbsProps) {
  const allItems: BreadcrumbItem[] = [{ name: 'Home', href: '/' }, ...items];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.href ? { item: `${baseUrl}${item.href}` } : {}),
    })),
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('text-heritage-muted py-3 text-sm', className)}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;

          return (
            <li
              key={`${item.name}-${index}`}
              className="inline-flex items-center gap-1.5"
            >
              {index > 0 && (
                <ChevronRight
                  className="text-heritage-border h-3.5 w-3.5"
                  aria-hidden="true"
                />
              )}
              {isLast ? (
                <span className="text-heritage-charcoal font-medium" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href ?? '/'}
                  className="hover:text-heritage-maroon inline-flex items-center gap-1 transition-colors"
                >
                  {index === 0 && <Home className="h-3.5 w-3.5" aria-hidden="true" />}
                  <span>{item.name}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
