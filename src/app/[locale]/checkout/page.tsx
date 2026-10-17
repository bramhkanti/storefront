import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Lock, ShoppingBag } from 'lucide-react';

import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { CheckoutFlow } from '@/features/checkout/components/CheckoutFlow';
import { getCheckoutService } from '@/lib/api/container';
import type { PaymentMethod, ShippingOption } from '@/lib/api/contracts/domain';
import { getCart } from '@/lib/cart/queries';
import { publicEnv } from '@/lib/env.public';

// Per-shopper data (cookies): render on every request.
export const instant = false;

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your order.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CheckoutPage(): Promise<React.JSX.Element> {
  const cart = await getCart();

  // Handle an empty cart before requesting checkout options.
  if (!cart || cart.items.length === 0) {
    return (
      <div className="py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-md text-center">
            <ShoppingBag
              className="mx-auto h-12 w-12 text-neutral-300"
              aria-hidden="true"
            />

            <h1 className="mt-4 text-2xl font-semibold tracking-tight">
              Your bag is empty
            </h1>

            <p className="text-heritage-muted mt-2 text-sm">
              Add something delicious before checking out.
            </p>

            <Link href="/" className="mt-6 inline-block">
              <Button className="rounded-full px-6">Continue shopping</Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  // Preserve the existing checkout API integration.
  const checkout = getCheckoutService();

  const [shippingOptions, paymentMethods] = await Promise.all([
    cart.shippingAddress
      ? checkout.listShippingOptions(cart.id).catch((): ShippingOption[] => [])
      : Promise.resolve<ShippingOption[]>([]),

    checkout.listPaymentMethods(cart.id).catch((): PaymentMethod[] => []),
  ]);

  return (
    <div className="bg-neutral-50 py-8 sm:py-12 dark:bg-[#12100e]">
      <Container>
        <div className="mb-6 flex items-center justify-between gap-4 sm:mb-8">
          <div>
            <Link
              href="/cart"
              className="text-heritage-muted hover:text-heritage-charcoal inline-flex items-center gap-1.5 text-sm transition-colors"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to bag
            </Link>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Checkout
            </h1>
          </div>

          <span className="text-heritage-muted hidden items-center gap-1.5 text-sm sm:inline-flex">
            <Lock className="h-4 w-4" aria-hidden="true" />
            Secure checkout
          </span>
        </div>

        <CheckoutFlow
          initialCart={cart}
          initialShippingOptions={shippingOptions}
          paymentMethods={paymentMethods}
          brandName={publicEnv.NEXT_PUBLIC_BRAND_NAME}
        />
      </Container>
    </div>
  );
}
