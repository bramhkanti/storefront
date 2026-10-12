import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Lock, ShieldCheck, Truck } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { getCart } from '@/lib/cart/queries';
import { formatPrice } from '@/lib/utils/money';
import { SITE_CONFIG } from '@/content/site';
import { I18nProvider, getNamespaceDictionary } from '@/lib/i18n';
import { CheckoutForm } from './CheckoutForm';

export const metadata: Metadata = {
  title: 'Secure Checkout',
  description: 'Complete your authentic Indian food order.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CheckoutPage(): Promise<React.JSX.Element> {
  const [cart, checkoutDict] = await Promise.all([
    getCart(),
    getNamespaceDictionary('en', 'checkout'),
  ]);
  const items = cart?.items ?? [];
  const subtotal = cart?.subtotal?.amount ?? 0;
  const shipping = cart?.shippingEstimate?.amount ?? 0;
  const total = cart?.total?.amount ?? 0;
  const currencyCode = cart?.currencyCode ?? 'INR';

  return (
    <div className="py-10 sm:py-16">
      <Container>
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between border-b pb-4">
            <Link
              href="/cart"
              className="text-heritage-muted hover:text-heritage-maroon flex items-center gap-1.5 text-xs font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Bag</span>
            </Link>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <Lock className="h-3.5 w-3.5" />
              <span>256-Bit SSL Encrypted Checkout</span>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-5">
            {/* Interactive Checkout Form */}
            <div className="lg:col-span-3">
              <I18nProvider locale="en" dictionaries={{ checkout: checkoutDict }}>
                <CheckoutForm
                  totalAmount={total}
                  currencyCode={currencyCode}
                  itemCount={items.length}
                />
              </I18nProvider>
            </div>

            {/* Order Review Summary */}
            <div className="space-y-4 lg:col-span-2">
              <div className="border-heritage-border bg-heritage-cream rounded-xl border p-6 shadow-xs">
                <h2 className="text-heritage-charcoal mb-4 font-serif text-base font-bold">
                  Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
                </h2>

                <div className="divide-heritage-border/60 max-h-60 divide-y overflow-y-auto pr-1 text-xs">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between py-2.5 first:pt-0">
                      <div>
                        <div className="text-heritage-charcoal font-medium">
                          {item.title}
                        </div>
                        <div className="text-heritage-muted text-[11px]">
                          Qty: {item.quantity} • {item.variantTitle}
                        </div>
                      </div>
                      <div className="text-heritage-maroon font-semibold">
                        {formatPrice(
                          item.totalPrice.amount,
                          item.totalPrice.currencyCode,
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-heritage-border/60 mt-4 space-y-2 border-t pt-3 text-xs">
                  <div className="text-heritage-muted flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-heritage-charcoal font-medium">
                      {formatPrice(subtotal, currencyCode)}
                    </span>
                  </div>
                  <div className="text-heritage-muted flex justify-between">
                    <span>Express Delivery</span>
                    <span className="text-heritage-charcoal font-medium">
                      {shipping === 0 ? (
                        <span className="text-heritage-green font-semibold">FREE</span>
                      ) : (
                        formatPrice(shipping, currencyCode)
                      )}
                    </span>
                  </div>
                  <div className="border-heritage-border/60 text-heritage-maroon flex justify-between border-t pt-2 text-base font-bold">
                    <span>Total Payable</span>
                    <span className="font-serif">{formatPrice(total, currencyCode)}</span>
                  </div>
                </div>
              </div>

              {/* Guarantees */}
              <div className="border-heritage-border bg-heritage-cream-dark/30 text-heritage-muted space-y-2 rounded-xl border p-4 text-xs">
                <div className="flex items-center gap-2">
                  <Truck className="text-heritage-saffron-dark h-4 w-4 shrink-0" />
                  <span>Ships in 24 hours from Varanasi with insulated packaging</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-heritage-green h-4 w-4 shrink-0" />
                  <span>{SITE_CONFIG.brand.fssaiBadgeText}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
