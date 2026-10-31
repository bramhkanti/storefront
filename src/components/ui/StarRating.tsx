import * as React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface StarRatingProps {
  /** 0 to 5, fractions allowed (4.6 fills 4 stars and 60% of the fifth). */
  value: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = {
  xs: 'h-3 w-3',
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

/** Read-only star display. Screen readers get "4.6 out of 5 stars". */
export function StarRating({ value, size = 'sm', className }: StarRatingProps) {
  const clamped = Math.max(0, Math.min(5, value));
  return (
    <span
      role="img"
      aria-label={`${clamped.toFixed(1)} out of 5 stars`}
      className={cn('inline-flex items-center gap-0.5', className)}
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, clamped - i));
        return (
          <span key={i} className={cn('relative inline-block shrink-0', SIZES[size])}>
            <Star
              aria-hidden="true"
              className={cn(
                'fill-star-empty text-star-empty absolute inset-0',
                SIZES[size],
              )}
            />
            {fill > 0 && (
              <span
                className="absolute inset-y-0 left-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star
                  aria-hidden="true"
                  className={cn('fill-star text-star', SIZES[size])}
                />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}
