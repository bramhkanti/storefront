import * as React from 'react';
import type { Cart } from '@/lib/api/contracts/domain';
import { formatPrice } from '@/lib/utils/money';

/** Totals block shared by the bag drawer and bag page. */
export function CartSummary({ cart }: { cart: Cart }) {
  const discount = cart.discountTotal?.amount ?? 0;
  // Before checkout no delivery option is chosen, so the payable amount is items − discount.
  const total = cart.shippingEstimate
    ? cart.total.amount
    : cart.subtotal.amount - discount;

  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between">
        <dt className="text-heritage-muted">Items</dt>
        <dd className="tabular-nums">
          {formatPrice(cart.subtotal.amount, cart.currencyCode)}
        </dd>
      </div>
      {discount > 0 && (
        <div className="flex justify-between">
          <dt className="text-heritage-muted">Discount</dt>
          <dd className="text-emerald-700 tabular-nums">
            −{formatPrice(discount, cart.currencyCode)}
          </dd>
        </div>
      )}
      <div className="flex justify-between">
        <dt className="text-heritage-muted">Delivery</dt>
        <dd className="text-heritage-muted">
          {cart.shippingEstimate
            ? formatPrice(cart.shippingEstimate.amount, cart.currencyCode)
            : 'Calculated at checkout'}
        </dd>
      </div>
      <div className="flex justify-between border-t border-neutral-100 pt-3 text-base font-semibold dark:border-neutral-800">
        <dt>{cart.shippingEstimate ? 'Total' : 'Subtotal'}</dt>
        <dd className="tabular-nums">{formatPrice(total, cart.currencyCode)}</dd>
      </div>
      <p className="text-heritage-muted text-right text-xs">Prices include GST</p>
    </dl>
  );
}
