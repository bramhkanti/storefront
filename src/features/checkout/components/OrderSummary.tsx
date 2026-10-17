'use client';

import * as React from 'react';
import Image from 'next/image';
import { Tag, X } from 'lucide-react';
import type { Cart } from '@/lib/api/contracts/domain';
import { updatePromoCodeAction } from '@/lib/cart/actions';
import { formatPrice } from '@/lib/utils/money';
import { cn } from '@/lib/utils/cn';

export interface OrderSummaryProps {
  cart: Cart;
  onCartChange: (cart: Cart) => void;
  disabled?: boolean | undefined;
}

function Row({
  label,
  value,
  strong,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  strong?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex items-baseline justify-between gap-4',
        strong ? 'text-base font-semibold' : 'text-sm',
      )}
    >
      <span className={strong ? '' : 'text-heritage-muted'}>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

export function OrderSummary({ cart, onCartChange, disabled }: OrderSummaryProps) {
  const [code, setCode] = React.useState('');
  const [promoError, setPromoError] = React.useState('');
  const [isApplying, setIsApplying] = React.useState(false);
  const currency = cart.currencyCode;
  const discount = cart.discountTotal?.amount ?? 0;

  const updatePromo = async (value: string, mode: 'apply' | 'remove') => {
    setIsApplying(true);
    setPromoError('');
    const result = await updatePromoCodeAction(value, mode);
    setIsApplying(false);
    if (result.success && result.cart) {
      onCartChange(result.cart);
      setCode('');
    } else {
      setPromoError(result.error ?? 'Could not apply the code');
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 dark:border-neutral-800 dark:bg-[#1c1917]">
      <h2 className="text-base font-semibold">
        Order summary{' '}
        <span className="text-heritage-muted font-normal">
          · {cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'}
        </span>
      </h2>

      <ul className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
        {cart.items.map((item) => (
          <li key={item.id} className="flex items-center gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
              {item.thumbnailUrl && (
                <Image
                  src={item.thumbnailUrl}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              )}
              <span className="absolute -top-0 -right-0 flex h-5 min-w-5 items-center justify-center rounded-bl-lg bg-neutral-900/80 px-1 text-[11px] font-semibold text-white">
                {item.quantity}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-sm font-medium">{item.title}</p>
              <p className="text-heritage-muted text-xs">{item.variantTitle}</p>
            </div>
            <span className="text-sm tabular-nums">
              {formatPrice(item.totalPrice.amount, item.totalPrice.currencyCode)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-5 border-t border-neutral-100 pt-4 dark:border-neutral-800">
        {cart.promoCodes && cart.promoCodes.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {cart.promoCodes.map((applied) => (
              <span
                key={applied}
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
              >
                <Tag className="h-3 w-3" />
                {applied}
                <button
                  type="button"
                  aria-label={`Remove code ${applied}`}
                  disabled={isApplying || disabled}
                  onClick={() => updatePromo(applied, 'remove')}
                  className="hover:text-emerald-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (code.trim()) void updatePromo(code, 'apply');
            }}
          >
            <input
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setPromoError('');
              }}
              placeholder="Discount code"
              aria-label="Discount code"
              className="focus:border-heritage-maroon h-10 min-w-0 flex-1 rounded-xl border border-neutral-200 bg-transparent px-3 text-sm uppercase outline-none dark:border-neutral-700"
            />
            <button
              type="submit"
              disabled={!code.trim() || isApplying || disabled}
              className="h-10 rounded-xl border border-neutral-300 px-4 text-sm font-medium transition-colors hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              {isApplying ? 'Applying…' : 'Apply'}
            </button>
          </form>
        )}
        {promoError && <p className="mt-2 text-xs text-red-600">{promoError}</p>}
      </div>

      <div className="mt-4 space-y-2 border-t border-neutral-100 pt-4 dark:border-neutral-800">
        <Row label="Items" value={formatPrice(cart.subtotal.amount, currency)} />
        {discount > 0 && (
          <Row
            label="Discount"
            value={
              <span className="text-emerald-700">−{formatPrice(discount, currency)}</span>
            }
          />
        )}
        <Row
          label="Delivery"
          value={
            cart.shippingEstimate === undefined ? (
              <span className="text-heritage-muted">Next step</span>
            ) : cart.shippingEstimate.amount === 0 ? (
              <span className="font-medium text-emerald-700">Free</span>
            ) : (
              formatPrice(cart.shippingEstimate.amount, currency)
            )
          }
        />
        <div className="pt-2">
          <Row strong label="Total" value={formatPrice(cart.total.amount, currency)} />
          <p className="text-heritage-muted mt-1 text-right text-xs">
            Prices include GST
          </p>
        </div>
      </div>
    </div>
  );
}
