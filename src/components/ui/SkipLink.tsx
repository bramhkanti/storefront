import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface SkipLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  targetId?: string;
}

export function SkipLink({
  targetId = 'main-content',
  className,
  children = 'Skip to main content',
  ...props
}: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className={cn(
        'focus:bg-heritage-maroon focus:outline-heritage-saffron sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg focus:outline-2 focus:outline-offset-2',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
