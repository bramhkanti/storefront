'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem } from '@/lib/api/contracts/domain';
import { formatPrice } from '@/lib/utils/money';
import { cn } from '@/lib/utils/cn';

export interface CartItemRowProps {
  item: CartItem;
  disabled?: boolean | undefined;
  onUpdateQuantity: (lineItemId: string, quantity: number) => void;
  onRemove: (lineItemId: string) => void;
  onItemClick?: (() => void) | undefined;
  size?: 'compact' | 'large';
}

export function CartItemRow({
  item,
  disabled = false,
  onUpdateQuantity,
  onRemove,
  onItemClick,
  size = 'compact',
}: CartItemRowProps): React.JSX.Element {
  const large = size === 'large';

  return (
    <div className="flex gap-4 py-4">
      <Link
        href={`/products/${item.handle}`}
        onClick={() => onItemClick?.()}
        className={cn(
          'relative shrink-0 overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800',
          large ? 'h-24 w-24 sm:h-28 sm:w-28' : 'h-20 w-20',
        )}
      >
        {item.thumbnailUrl && (
          <Image
            src={item.thumbnailUrl}
            alt={item.title}
            fill
            sizes={large ? '112px' : '80px'}
            className="object-cover"
          />
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={`/products/${item.handle}`}
              onClick={() => onItemClick?.()}
              className={cn(
                'line-clamp-2 font-medium hover:underline',
                large ? 'text-base' : 'text-sm',
              )}
            >
              {item.title}
            </Link>
            {item.variantTitle && (
              <p className="text-heritage-muted mt-0.5 text-xs">{item.variantTitle}</p>
            )}
          </div>
          <span
            className={cn('font-semibold tabular-nums', large ? 'text-base' : 'text-sm')}
          >
            {formatPrice(item.totalPrice.amount, item.totalPrice.currencyCode)}
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="inline-flex h-9 items-center rounded-full border border-neutral-200 dark:border-neutral-700">
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={disabled || item.quantity <= 1}
              className="flex h-9 w-9 items-center justify-center rounded-l-full transition-colors hover:bg-neutral-100 disabled:opacity-30 dark:hover:bg-neutral-800"
              aria-label={`Decrease quantity of ${item.title}`}
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-7 text-center text-sm font-medium tabular-nums">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              disabled={disabled}
              className="flex h-9 w-9 items-center justify-center rounded-r-full transition-colors hover:bg-neutral-100 disabled:opacity-30 dark:hover:bg-neutral-800"
              aria-label={`Increase quantity of ${item.title}`}
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            {item.quantity > 1 && (
              <span className="text-heritage-muted hidden text-xs tabular-nums sm:inline">
                {formatPrice(item.unitPrice.amount, item.unitPrice.currencyCode)} each
              </span>
            )}
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              disabled={disabled}
              className="text-heritage-muted rounded-full p-2 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-40 dark:hover:bg-red-950/40"
              aria-label={`Remove ${item.title} from bag`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
