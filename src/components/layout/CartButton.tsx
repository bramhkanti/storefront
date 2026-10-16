'use client';

import * as React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCartUi } from '@/lib/store';
import { useCart } from '@/lib/cart';
import { SITE_CONFIG } from '@/content/site';
import { cn } from '@/lib/utils/cn';

export interface CartButtonProps {
  cartCount?: number | undefined;
  className?: string | undefined;
  iconClassName?: string | undefined;
  badgeClassName?: string | undefined;
}

export function CartButton({
  cartCount: propCartCount,
  className,
  iconClassName,
  badgeClassName,
}: CartButtonProps): React.JSX.Element {
  const { openCart } = useCartUi();
  const { optimisticCart } = useCart();

  const count = propCartCount ?? optimisticCart?.itemCount ?? 0;

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`${SITE_CONFIG.ui.cartTitle} with ${count} items`}
      className={cn(
        'text-heritage-charcoal hover:bg-heritage-cream-dark hover:text-heritage-maroon focus-visible:outline-heritage-maroon relative inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors focus-visible:outline-2 dark:text-[#f5f0e8] dark:hover:bg-neutral-800',
        className,
      )}
    >
      <ShoppingCart className={cn('h-5 w-5', iconClassName)} aria-hidden="true" />
      <span className="sr-only">{SITE_CONFIG.ui.cartTitle}</span>
      {count > 0 && (
        <span
          className={cn(
            'absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white shadow-xs',
            badgeClassName,
          )}
          aria-hidden="true"
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
}
