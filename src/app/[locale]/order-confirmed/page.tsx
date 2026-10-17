import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, MessageCircle, Package } from 'lucide-react';

import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';

import { getCheckoutService } from '@/lib/api/container';
import { publicEnv } from '@/lib/env.public';
import { describeOrderStatus } from '@/lib/orders/status';
import { formatPrice } from '@/lib/utils/money';
import { buildMetadata } from '@/lib/seo/metadata';

interface OrderConfirmedPageProps {
  searchParams: Promise<{ order?: string | undefined }>;
}

// Order details are shopper-specific, so render on every request.
export const instant = false;

export const metadata: Metadata = buildMetadata({
  title: 'Order Confirmed | Bramhkanti Heritage Foods',
  description:
    'Thank you for your order. Handcrafted heritage foods dispatched from Varanasi.',
  canonicalPath: '/order-confirmed',
  noindex: true,
});

const dateFormat = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export default async function OrderConfirmedPage({
  searchParams,
}: OrderConfirmedPageProps): Promise<React.JSX.Element> {
  const { order: orderId } = await searchParams;

  const order = orderId ? await getCheckoutService().getOrder(orderId) : null;

  if (!order) {
    return (
      <div className="bg-page text-fg py-20">
        <Container>
          <div className="mx-auto max-w-md text-center">
            <Package className="mx-auto h-12 w-12 text-neutral-300" />

            <h1 className="mt-4 text-2xl font-semibold">
              We couldn&apos;t find that order
            </h1>

            <p className="text-heritage-muted mt-2 text-sm">
              If you just placed it, check{' '}
              <Link href="/profile" className="underline underline-offset-4">
                My orders
              </Link>{' '}
              in your account.
            </p>

            <Link
              href="/"
              className="bg-primary hover:bg-primary-hover mt-6 inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white transition-colors"
            >
              Continue shopping
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  const status = describeOrderStatus(order);
  const firstName = order.shippingAddress?.firstName || 'there';
  const whatsapp = publicEnv.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const address = order.shippingAddress;

  return (
    <div className="bg-page text-fg min-h-screen py-10 sm:py-16">
      <Container>
        <div className="mx-auto max-w-2xl space-y-5">
          {/* Order confirmation */}
          <section className="border-line bg-surface rounded-3xl border p-8 text-center sm:p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <h1 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
              Thank you, {firstName}!
            </h1>

            <p className="text-fg-muted mx-auto mt-2 max-w-sm text-sm">
              Your order has been placed. We&apos;ll pack it fresh and share tracking
              details once it ships.
            </p>

            <div className="bg-surface-soft mt-6 inline-flex flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-2xl px-5 py-3 text-sm">
              <span>
                <span className="text-fg-muted">Order</span>{' '}
                <strong className="font-semibold">#{order.displayId}</strong>
              </span>

              <span>
                <span className="text-fg-muted">Placed</span>{' '}
                <strong className="font-semibold">
                  {dateFormat.format(new Date(order.createdAt))}
                </strong>
              </span>

              <span>
                <span className="text-fg-muted">Payment</span>{' '}
                <strong className="font-semibold">{status.payment}</strong>
              </span>
            </div>
          </section>

          {/* Ordered items and price summary */}
          <section className="border-line bg-surface rounded-3xl border p-6 sm:p-8">
            <h2 className="text-base font-semibold">Items</h2>

            <ul className="divide-line mt-4 divide-y">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center gap-4 py-3 first:pt-0">
                  <div className="bg-surface-soft relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                    {item.thumbnailUrl && (
                      <Image
                        src={item.thumbnailUrl}
                        alt={item.title}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{item.title}</p>

                    <p className="text-fg-muted text-sm">
                      {item.variantTitle} · Qty {item.quantity}
                    </p>
                  </div>

                  <span className="shrink-0 text-sm tabular-nums">
                    {formatPrice(item.total.amount, item.total.currencyCode)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="border-line mt-4 space-y-2 border-t pt-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-fg-muted">Items</dt>

                <dd className="tabular-nums">
                  {formatPrice(order.subtotal.amount, order.currencyCode)}
                </dd>
              </div>

              {order.discountTotal.amount > 0 && (
                <div className="flex justify-between gap-4">
                  <dt className="text-fg-muted">Discount</dt>

                  <dd className="text-emerald-700 tabular-nums">
                    −{formatPrice(order.discountTotal.amount, order.currencyCode)}
                  </dd>
                </div>
              )}

              <div className="flex justify-between gap-4">
                <dt className="text-fg-muted">
                  Delivery
                  {order.shippingMethodName ? ` · ${order.shippingMethodName}` : ''}
                </dt>

                <dd className="tabular-nums">
                  {order.shippingTotal.amount === 0
                    ? 'Free'
                    : formatPrice(order.shippingTotal.amount, order.currencyCode)}
                </dd>
              </div>

              <div className="border-line flex justify-between gap-4 border-t pt-3 text-base font-semibold">
                <dt>Total</dt>

                <dd className="tabular-nums">
                  {formatPrice(order.total.amount, order.currencyCode)}
                </dd>
              </div>
            </dl>
          </section>

          {/* Delivery address */}
          {address && (
            <section className="border-line bg-surface rounded-3xl border p-6 text-sm sm:p-8">
              <h2 className="text-base font-semibold">Delivering to</h2>

              <p className="mt-2">
                {address.firstName} {address.lastName} · {address.phone}
              </p>

              <p className="text-fg-muted">
                {address.address1}
                {address.address2 ? `, ${address.address2}` : ''}, {address.city},{' '}
                {address.province} {address.postalCode}
              </p>
            </section>
          )}

          {/* Order actions */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/profile" className="flex-1">
              <Button variant="outline" className="w-full rounded-xl">
                View my orders
              </Button>
            </Link>

            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(
                  `Hi, I placed order #${order.displayId}.`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
              >
                <MessageCircle className="h-4 w-4" />
                Questions? WhatsApp us
              </a>
            )}

            <Link href="/" className="flex-1">
              <Button className="w-full rounded-xl">Continue shopping</Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
