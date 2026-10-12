import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { getCart } from '@/lib/cart/queries';
import { formatPrice } from '@/lib/utils/money';
import { SITE_CONFIG } from '@/content/site';

export const metadata: Metadata = {
  title: 'Shopping Bag',
  description: 'Review your items and proceed to checkout.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CartPage(): Promise<React.JSX.Element> {
  const cart = await getCart();
  const items = cart?.items ?? [];
  const subtotal = cart?.subtotal?.amount ?? 0;
  const shipping = cart?.shippingEstimate?.amount ?? 0;
  const total = cart?.total?.amount ?? 0;
  const currencyCode = cart?.currencyCode ?? 'INR';

  return (
    <div className="py-10 sm:py-16">
      <Container>
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex items-center justify-between border-b pb-4">
            <h1 className="text-heritage-maroon font-serif text-3xl font-bold sm:text-4xl">
              Shopping Bag
            </h1>
            <span className="text-heritage-muted text-sm">
              {cart?.itemCount ?? 0} {cart?.itemCount === 1 ? 'item' : 'items'}
            </span>
          </div>

          {items.length === 0 ? (
            <div className="border-heritage-border bg-heritage-cream rounded-xl border p-12 text-center shadow-xs">
              <ShoppingBag className="text-heritage-muted mx-auto h-12 w-12" />
              <h2 className="text-heritage-charcoal mt-4 font-serif text-xl font-bold">
                Your bag is empty
              </h2>
              <p className="text-heritage-muted mt-2 text-sm leading-relaxed">
                Discover the taste of authentic Banarasi pickles, pure cow ghee sweets,
                and roasted makhana.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link href="/achar">
                  <Button variant="outline" size="sm">
                    Pickle
                  </Button>
                </Link>
                <Link href="/makhana">
                  <Button variant="outline" size="sm">
                    Makhana
                  </Button>
                </Link>
                <Link href="/sweets">
                  <Button variant="outline" size="sm">
                    Sweets
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Items List */}
              <div className="border-heritage-border bg-heritage-cream divide-heritage-border/60 divide-y rounded-xl border p-6 shadow-xs lg:col-span-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                  >
                    <div>
                      <Link
                        href={`/products/${item.handle}`}
                        className="text-heritage-charcoal hover:text-heritage-maroon font-serif text-base font-bold transition-colors"
                      >
                        {item.title}
                      </Link>
                      <div className="text-heritage-muted text-xs">
                        Pack: {item.variantTitle} • Qty: {item.quantity}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-heritage-maroon font-serif text-base font-bold">
                        {formatPrice(
                          item.totalPrice.amount,
                          item.totalPrice.currencyCode,
                        )}
                      </div>
                      <div className="text-heritage-muted text-[11px]">
                        {formatPrice(item.unitPrice.amount, item.unitPrice.currencyCode)}{' '}
                        each
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="border-heritage-border bg-heritage-cream h-fit space-y-4 rounded-xl border p-6 shadow-xs">
                <h2 className="text-heritage-charcoal font-serif text-lg font-bold">
                  Order Summary
                </h2>

                <div className="space-y-2 text-sm">
                  <div className="text-heritage-muted flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-heritage-charcoal font-medium">
                      {formatPrice(subtotal, currencyCode)}
                    </span>
                  </div>
                  <div className="text-heritage-muted flex justify-between">
                    <span>Shipping</span>
                    <span className="text-heritage-charcoal font-medium">
                      {shipping === 0 ? (
                        <span className="text-heritage-green font-semibold">FREE</span>
                      ) : (
                        formatPrice(shipping, currencyCode)
                      )}
                    </span>
                  </div>
                  <div className="border-heritage-border/60 text-heritage-maroon flex justify-between border-t pt-3 text-lg font-bold">
                    <span>Total</span>
                    <span className="font-serif">{formatPrice(total, currencyCode)}</span>
                  </div>
                </div>

                <Link href="/checkout" className="block pt-2">
                  <Button size="lg" className="w-full justify-center gap-2 font-semibold">
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <div className="text-heritage-muted flex items-center justify-center gap-1.5 pt-2 text-[11px]">
                  <ShieldCheck className="text-heritage-green h-4 w-4" />
                  <span>{SITE_CONFIG.brand.fssaiBadgeText}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
