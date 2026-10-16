'use client';

import * as React from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/lib/cart';
import { CartItemRow } from './CartItemRow';
import { CartSummary } from './CartSummary';
import { CheckoutCta } from './CheckoutCta';

/** Full-page bag; reads the same live cart as the drawer. */
export function CartView(): React.JSX.Element {
  const { optimisticCart: cart, updateItem, removeItem, isPending } = useCart();
  const items = cart?.items ?? [];

  if (!cart || items.length === 0) {
    return (
      <div className="mx-auto max-w-md py-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
          <ShoppingBag className="text-heritage-muted h-7 w-7" />
        </div>
        <h2 className="text-xl font-semibold">Your bag is empty</h2>
        <p className="text-heritage-muted mt-2 text-sm">
          Find something you&apos;ll love.
        </p>
        <Link href="/categories" className="mt-6 inline-block">
          <Button className="rounded-full px-6">Start shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="divide-y divide-neutral-100 rounded-2xl border border-neutral-200 bg-white px-5 sm:px-6 dark:divide-neutral-800 dark:border-neutral-800 dark:bg-[#1c1917]">
        {items.map((item) => (
          <CartItemRow
            key={item.id}
            item={item}
            size="large"
            disabled={isPending}
            onUpdateQuantity={updateItem}
            onRemove={removeItem}
          />
        ))}
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6 lg:sticky lg:top-24 dark:border-neutral-800 dark:bg-[#1c1917]">
        <h2 className="mb-4 text-base font-semibold">Order summary</h2>
        <CartSummary cart={cart} />
        <CheckoutCta disabled={isPending} reopenBag={false} className="mt-5" />
        <Link
          href="/categories"
          className="text-heritage-muted mt-3 block text-center text-sm hover:underline"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
