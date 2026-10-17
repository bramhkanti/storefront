'use client';

import * as React from 'react';
import Link from 'next/link';
import { ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/Sheet';
import { Button } from '@/components/ui/Button';
import { useCartUi } from '@/lib/store';
import { useCart } from '@/lib/cart';
import { useTranslation } from '@/lib/i18n';
import { CartItemRow } from './CartItemRow';
import { CartSummary } from './CartSummary';
import { CheckoutCta } from './CheckoutCta';

export function CartDrawer(): React.JSX.Element {
  const { isCartOpen, closeCart } = useCartUi();
  const { optimisticCart: cart, updateItem, removeItem, isPending } = useCart();
  const { t } = useTranslation('cart');

  const items = cart?.items ?? [];
  const itemCount = cart?.itemCount ?? 0;

  return (
    <Sheet open={isCartOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent side="right" className="flex h-full w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
          <SheetTitle className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            {t('cart.title')}
            {itemCount > 0 && (
              <span className="text-heritage-muted text-sm font-normal">
                ({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                <ShoppingBag className="text-heritage-muted h-7 w-7" />
              </div>
              <h3 className="text-base font-semibold">{t('cart.emptyTitle')}</h3>
              <p className="text-heritage-muted mt-1.5 max-w-xs text-sm">
                {t('cart.emptyMessage')}
              </p>
              <Link href="/categories" onClick={closeCart} className="mt-6">
                <Button className="rounded-full px-6">Start shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  disabled={isPending}
                  onUpdateQuantity={updateItem}
                  onRemove={removeItem}
                  onItemClick={closeCart}
                />
              ))}
            </div>
          )}
        </div>

        {cart && items.length > 0 && (
          <div className="border-t border-neutral-100 bg-white p-5 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.12)] dark:border-neutral-800 dark:bg-[#1c1917]">
            <CartSummary cart={cart} />
            <CheckoutCta disabled={isPending} onNavigate={closeCart} className="mt-4" />
            <div className="text-heritage-muted mt-4 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" /> Secure checkout
              </span>
              <span className="flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5" /> Delivery across India
              </span>
              <Link
                href="/cart"
                onClick={closeCart}
                className="font-medium text-neutral-700 underline-offset-4 hover:underline dark:text-neutral-300"
              >
                View bag
              </Link>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
