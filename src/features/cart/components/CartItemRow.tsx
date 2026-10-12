'use client';

import * as React from 'react';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem } from '@/lib/api/contracts/domain';
import { formatPrice } from '@/lib/utils/money';
import { Badge } from '@/components/ui/Badge';

export interface CartItemRowProps {
  item: CartItem;
  disabled?: boolean | undefined;
  onUpdateQuantity: (lineItemId: string, quantity: number) => void;
  onRemove: (lineItemId: string) => void;
  onItemClick?: (() => void) | undefined;
}

export function CartItemRow({
  item,
  disabled = false,
  onUpdateQuantity,
  onRemove,
  onItemClick,
}: CartItemRowProps): React.JSX.Element {
  return (
    <div className="border-heritage-border/60 flex items-start gap-3 border-b py-4 last:border-b-0">
      {/* Thumbnail placeholder with pure veg indicator */}
      <div className="border-heritage-border bg-heritage-cream-dark/50 relative flex h-18 w-18 shrink-0 items-center justify-center rounded-lg border text-center">
        <Badge variant="vegetarian" className="scale-75 text-[9px]">
          Veg
        </Badge>
      </div>

      {/* Item info */}
      <div className="flex-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/products/${item.handle}`}
            onClick={() => onItemClick?.()}
            className="text-heritage-charcoal hover:text-heritage-maroon line-clamp-1 text-sm font-semibold transition-colors"
          >
            {item.title}
          </Link>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            disabled={disabled}
            className="text-heritage-muted p-1 transition-colors hover:text-rose-700 disabled:opacity-40"
            aria-label={`Remove ${item.title} from bag`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Variant Pack Size */}
        {item.variantTitle && (
          <div className="text-heritage-muted text-xs">Pack: {item.variantTitle}</div>
        )}

        {/* Price and Quantity Controls */}
        <div className="flex items-center justify-between pt-2">
          {/* Quantity Controls */}
          <div className="border-heritage-border bg-heritage-cream inline-flex h-8 items-center rounded-md border">
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={disabled || item.quantity <= 1}
              className="text-heritage-charcoal hover:bg-heritage-cream-dark inline-flex h-8 w-8 items-center justify-center rounded-l-md transition-colors disabled:opacity-30"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="text-heritage-charcoal w-7 text-center text-xs font-semibold">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              disabled={disabled}
              className="text-heritage-charcoal hover:bg-heritage-cream-dark inline-flex h-8 w-8 items-center justify-center rounded-r-md transition-colors disabled:opacity-30"
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {/* Total Line Price */}
          <div className="text-right">
            <div className="text-heritage-maroon font-serif text-sm font-bold">
              {formatPrice(item.totalPrice.amount, item.totalPrice.currencyCode)}
            </div>
            {item.quantity > 1 && (
              <div className="text-heritage-muted text-[10px]">
                {formatPrice(item.unitPrice.amount, item.unitPrice.currencyCode)} each
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
