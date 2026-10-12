'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, ShoppingBag, Sparkles, Truck } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/Sheet';
import { Button } from '@/components/ui/Button';
import { useCartUi } from '@/lib/store';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/utils/money';
import { useTranslation } from '@/lib/i18n';
import { CartItemRow } from './CartItemRow';

const FREE_SHIPPING_THRESHOLD_PAISE = 49900; // ₹499.00

export function CartDrawer(): React.JSX.Element {
  const { isCartOpen, closeCart } = useCartUi();
  const { optimisticCart, updateItem, removeItem, isPending } = useCart();
  const { t } = useTranslation('cart');

  const cart = optimisticCart;
  const items = cart?.items ?? [];
  const itemCount = cart?.itemCount ?? 0;
  const subtotal = cart?.subtotal?.amount ?? 0;
  const shipping = cart?.shippingEstimate?.amount ?? 0;
  const total = cart?.total?.amount ?? 0;
  const currencyCode = cart?.currencyCode ?? 'INR';

  const freeShippingDelta = Math.max(0, FREE_SHIPPING_THRESHOLD_PAISE - subtotal);
  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD_PAISE) * 100),
  );
  const hasFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD_PAISE;

  return (
    <Sheet open={isCartOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent side="right" className="flex h-full w-full flex-col p-0 sm:max-w-md">
        {/* Drawer Header */}
        <SheetHeader className="p-5 pb-4">
          <SheetTitle className="text-heritage-maroon flex items-center gap-2 font-serif text-xl font-bold">
            <ShoppingBag className="h-5 w-5" />
            <span>{t('cart.title')}</span>
            {itemCount > 0 && (
              <span className="text-heritage-muted text-xs font-normal">
                ({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </span>
            )}
          </SheetTitle>

          {/* Free Shipping Progress Indicator */}
          {itemCount > 0 && (
            <div className="bg-heritage-cream-dark/50 border-heritage-border/60 mt-3 rounded-lg border p-3">
              <div className="text-heritage-charcoal flex items-center justify-between text-xs font-medium">
                <span className="flex items-center gap-1.5">
                  <Truck className="text-heritage-saffron-dark h-4 w-4" />
                  {hasFreeShipping ? (
                    <span className="text-heritage-green font-semibold">
                      🎉 Free Express Delivery unlocked!
                    </span>
                  ) : (
                    <span>
                      Add{' '}
                      <strong className="text-heritage-maroon">
                        {formatPrice(freeShippingDelta, currencyCode)}
                      </strong>{' '}
                      more for Free Shipping
                    </span>
                  )}
                </span>
                <span className="text-heritage-muted text-[10px]">
                  {freeShippingProgress}%
                </span>
              </div>
              <div className="bg-heritage-border mt-2 h-1.5 w-full overflow-hidden rounded-full">
                <div
                  className="bg-heritage-saffron h-full transition-all duration-500 ease-out"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}
        </SheetHeader>

        {/* Line Items List */}
        <div className="flex-1 overflow-y-auto px-5 py-2">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <div className="border-heritage-border bg-heritage-cream-dark/50 mb-4 flex h-16 w-16 items-center justify-center rounded-full border">
                <ShoppingBag className="text-heritage-muted h-8 w-8" />
              </div>
              <h3 className="text-heritage-charcoal font-serif text-lg font-bold">
                {t('cart.emptyTitle')}
              </h3>
              <p className="text-heritage-muted mt-1.5 max-w-xs text-xs leading-relaxed">
                {t('cart.emptyMessage')}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <Link
                  href="/achar"
                  onClick={closeCart}
                  className="bg-heritage-cream hover:bg-heritage-cream-dark border-heritage-border text-heritage-charcoal rounded-md border px-3 py-1.5 text-xs font-medium transition-colors"
                >
                  Pickle
                </Link>
                <Link
                  href="/makhana"
                  onClick={closeCart}
                  className="bg-heritage-cream hover:bg-heritage-cream-dark border-heritage-border text-heritage-charcoal rounded-md border px-3 py-1.5 text-xs font-medium transition-colors"
                >
                  Makhana
                </Link>
                <Link
                  href="/sweets"
                  onClick={closeCart}
                  className="bg-heritage-cream hover:bg-heritage-cream-dark border-heritage-border text-heritage-charcoal rounded-md border px-3 py-1.5 text-xs font-medium transition-colors"
                >
                  Sweets
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-heritage-border divide-y">
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

        {/* Footer / Summary / Checkout CTA */}
        {items.length > 0 && (
          <div className="border-heritage-border bg-heritage-cream border-t p-5 shadow-lg">
            <div className="space-y-1.5 text-xs">
              <div className="text-heritage-muted flex justify-between">
                <span>Subtotal</span>
                <span className="text-heritage-charcoal font-medium">
                  {formatPrice(subtotal, currencyCode)}
                </span>
              </div>
              <div className="text-heritage-muted flex justify-between">
                <span>Estimated Shipping</span>
                <span className="text-heritage-charcoal font-medium">
                  {shipping === 0 ? (
                    <span className="text-heritage-green font-semibold">FREE</span>
                  ) : (
                    formatPrice(shipping, currencyCode)
                  )}
                </span>
              </div>
              <div className="border-heritage-border/60 text-heritage-maroon flex justify-between border-t pt-2 text-base font-bold">
                <span>Total</span>
                <span className="font-serif">{formatPrice(total, currencyCode)}</span>
              </div>
              <div className="text-heritage-muted text-right text-[10px]">
                Inclusive of all statutory taxes
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Link href="/checkout" onClick={closeCart} className="block">
                <Button
                  size="lg"
                  className="w-full justify-center gap-2 font-semibold shadow-md"
                  disabled={isPending}
                >
                  <span>{t('cart.proceedToCheckout')}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <div className="flex items-center justify-between text-xs">
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="text-heritage-muted hover:text-heritage-maroon underline underline-offset-4"
                >
                  View Full Bag
                </Link>
                <span className="text-heritage-muted flex items-center gap-1 text-[11px]">
                  <Sparkles className="text-heritage-saffron-dark h-3 w-3" />
                  100% Vegetarian Purity Guaranteed
                </span>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
