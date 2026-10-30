import * as React from 'react';
import { cn } from '@/lib/utils/cn';

/** FSSAI-style vegetarian symbol: green square with a green dot. */
export function VegMark({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="Vegetarian"
      title="Vegetarian"
      className={cn(
        'inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] border-[1.5px] border-[#1e8e3e] bg-white',
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[#1e8e3e]" />
    </span>
  );
}
