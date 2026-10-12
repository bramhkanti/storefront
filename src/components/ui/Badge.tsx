import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'maroon' | 'saffron' | 'green' | 'outline' | 'vegetarian';
}

export function Badge({
  className,
  variant = 'default',
  children,
  ...props
}: BadgeProps) {
  if (variant === 'vegetarian') {
    return (
      <span
        className={cn(
          'border-heritage-green text-heritage-green bg-heritage-green-bg inline-flex items-center gap-1.5 rounded-sm border px-1.5 py-0.5 text-xs font-semibold',
          className,
        )}
        title="100% Pure Vegetarian"
        aria-label="100% Pure Vegetarian"
        {...props}
      >
        <span
          className="border-heritage-green inline-block h-3.5 w-3.5 border p-0.5"
          aria-hidden="true"
        >
          <span className="bg-heritage-green block h-full w-full rounded-full" />
        </span>
        {children ?? 'Pure Veg'}
      </span>
    );
  }

  const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
    default: 'bg-heritage-cream-dark text-heritage-charcoal border-heritage-border',
    maroon: 'bg-heritage-maroon text-white border-transparent',
    saffron: 'bg-heritage-saffron-light text-heritage-saffron-dark border-amber-200',
    green: 'bg-heritage-green-bg text-heritage-green border-emerald-200',
    outline: 'border-heritage-border text-heritage-charcoal bg-transparent',
    vegetarian: '',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-medium transition-colors',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
