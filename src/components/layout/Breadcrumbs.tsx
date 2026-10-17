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
  singleLine?: boolean | undefined;
}

/**
 * Accessible Breadcrumb navigation with embedded Schema.org BreadcrumbList JSON-LD.
 */
export function Breadcrumbs({
  items,
  className,
  baseUrl = 'https://bramhkanti.com',
  singleLine = false,
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
      className={cn('text-fg-muted py-1 text-xs sm:text-sm', className)}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol
        className={cn(
          'flex items-center gap-1.5 sm:gap-2',
          singleLine
            ? 'no-scrollbar flex-nowrap overflow-x-auto whitespace-nowrap'
            : 'flex-wrap',
        )}
      >
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;

          return (
            <li
              key={`${item.name}-${index}`}
              className="inline-flex shrink-0 items-center gap-1.5 sm:gap-2"
            >
              {index > 0 && (
                <ChevronRight
                  className="text-fg-muted/50 h-3 w-3 shrink-0 stroke-[2.2] sm:h-3.5 sm:w-3.5"
                  aria-hidden="true"
                />
              )}
              {isLast ? (
                <span
                  className="text-fg max-w-[190px] truncate font-semibold sm:max-w-none"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href ?? '/'}
                  className="hover:text-primary text-fg-muted inline-flex items-center gap-1 transition-colors"
                >
                  {index === 0 && (
                    <Home
                      className="text-fg-muted h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5"
                      aria-hidden="true"
                    />
                  )}
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
