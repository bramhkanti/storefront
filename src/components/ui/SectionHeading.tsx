import * as React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface SectionHeadingProps {
  id?: string;
  eyebrow?: string | undefined;
  title: string;
  description?: string | undefined;
  action?: { href: string; label: string } | undefined;
  align?: 'left' | 'center';
  className?: string;
}

/** Shared section title: small eyebrow, heading, optional link on the right. */
export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  action,
  align = 'left',
  className,
}: SectionHeadingProps) {
  const centered = align === 'center';
  return (
    <div
      className={cn(
        'flex gap-4',
        centered ? 'flex-col items-center text-center' : 'items-end justify-between',
        className,
      )}
    >
      <div className={cn('min-w-0', centered && 'max-w-2xl')}>
        {eyebrow && (
          <p className="text-primary text-xs font-semibold tracking-[0.14em] uppercase">
            {eyebrow}
          </p>
        )}
        <h2
          id={id}
          className="text-fg mt-1.5 text-2xl font-bold tracking-tight text-balance sm:text-3xl"
        >
          {title}
        </h2>
        {description && (
          <p className="text-fg-muted mt-2 text-sm leading-relaxed sm:text-base">
            {description}
          </p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className="text-fg hover:text-primary group inline-flex shrink-0 items-center gap-1 text-sm font-semibold transition-colors"
        >
          {action.label}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
