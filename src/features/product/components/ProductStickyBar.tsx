'use client';

import * as React from 'react';
import { Leaf, ShoppingBag } from 'lucide-react';
import type { Product } from '@/lib/api/contracts/domain';
import { formatPrice } from '@/lib/utils/money';
import { useCart } from '@/lib/cart';
import { useCartUi, useToast } from '@/lib/store';
import { cn } from '@/lib/utils/cn';

export interface ProductStickyBarProps {
  product: Product;
  className?: string | undefined;
}

export function ProductStickyBar({
  product,
  className,
}: ProductStickyBarProps): React.JSX.Element {
  const { addItem, isPending } = useCart();
  const { openCart } = useCartUi();
  const { addToast } = useToast();
  const [isAdded, setIsAdded] = React.useState(false);

  const primaryVariant = product.variants[0];
  const priceAmount = primaryVariant?.price?.amount ?? 249;
  const currencyCode = primaryVariant?.price?.currencyCode ?? 'INR';

  const handleAddToCart = async () => {
    if (!primaryVariant || isPending) return;
    const ok = await addItem(primaryVariant.id, 1);
    if (ok) {
      setIsAdded(true);
      addToast({
        type: 'success',
        message: `Added ${product.title} to your bag`,
      });
      openCart();
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  return (
    <>
      {/* Desktop Persistent Bottom Strip (Matching Mockup) */}
      <div
        className={cn(
          'hidden lg:flex items-center justify-between rounded-2xl border border-line bg-surface p-4 my-8',
          className,
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-tint/40 text-accent-text">
            <Leaf className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-fg leading-snug">
              Pure. Natural. Traditional.
            </h4>
            <p className="text-xs text-fg-muted">
              Good food brings people together.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isPending}
          className="flex items-center gap-2 rounded-full bg-primary hover:bg-primary-hover text-on-primary px-8 py-3 text-xs font-bold tracking-wider uppercase transition-colors shadow-none"
        >
          <ShoppingBag className="h-4 w-4" />
          <span>{isAdded ? 'Added to Bag' : 'ADD TO CART'}</span>
        </button>
      </div>

      {/* Mobile Fixed Sticky Bottom Bar (Matching Mockup) */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-line bg-surface/95 backdrop-blur-md px-4 py-3 lg:hidden flex items-center justify-between shadow-sm text-fg"
      >
        <div>
          <span className="text-sm font-bold text-fg">
            1 item
          </span>
          <span className="text-sm font-bold text-fg mx-1.5">•</span>
          <span className="text-sm font-bold text-primary">
            {formatPrice(priceAmount, currencyCode)}
          </span>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isPending}
          className="flex items-center gap-2 rounded-full bg-primary hover:bg-primary-hover text-on-primary px-5 py-2.5 text-xs font-bold tracking-wider uppercase transition-colors shadow-none"
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          <span>{isAdded ? 'Added' : 'ADD TO CART'}</span>
        </button>
      </div>
    </>
  );
}
