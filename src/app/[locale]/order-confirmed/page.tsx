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

interface OrderConfirmedPageProps {
  searchParams: Promise<{ order?: string | undefined }>;
}

// Per-shopper data (cookies): render on every request.
export const instant = false;

export const metadata: Metadata = {
  title: 'Order confirmed',
  description: 'Thank you for your order.',
  robots: { index: false, follow: false },
};

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
      <div className="py-20">
        <Container>
          <div className="mx-auto max-w-md text-center">
            <Package className="mx-auto h-12 w-12 text-neutral-300" />
            <h1 className="mt-4 text-2xl font-semibold">
              We couldn&apos;t find that order
            </h1>
            <p className="text-heritage-muted mt-2 text-sm">
              If you just placed it, check{' '}
              <Link href="/profile" className="underline">
                My orders
              </Link>{' '}
              in your account.
            </p>
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
    <div className="bg-neutral-50 py-10 sm:py-16 dark:bg-[#12100e]">
      <Container>
        <div className="mx-auto max-w-2xl space-y-5">
          <div className="rounded-3xl border border-neutral-200 bg-white p-8 text-center sm:p-10 dark:border-neutral-800 dark:bg-[#1c1917]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
              Thank you, {firstName}!
            </h1>
            <p className="text-heritage-muted mx-auto mt-2 max-w-sm text-sm">
              Your order has been placed. We&apos;ll pack it fresh and share tracking once
              it ships.
            </p>
            <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-2xl bg-neutral-50 px-5 py-3 text-sm dark:bg-neutral-800/60">
              <span>
                <span className="text-heritage-muted">Order</span>{' '}
                <strong className="font-semibold">#{order.displayId}</strong>
              </span>
              <span>
                <span className="text-heritage-muted">Placed</span>{' '}
                <strong className="font-semibold">
                  {dateFormat.format(new Date(order.createdAt))}
                </strong>
              </span>
              <span>
                <span className="text-heritage-muted">Payment</span>{' '}
                <strong className="font-semibold">{status.payment}</strong>
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 dark:border-neutral-800 dark:bg-[#1c1917]">
            <h2 className="text-base font-semibold">Items</h2>
            <ul className="mt-4 divide-y divide-neutral-100 dark:divide-neutral-800">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center gap-4 py-3 first:pt-0">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
                    {item.thumbnailUrl && (
                      <Image
                        src={item.thumbnailUrl}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-heritage-muted text-sm">
                      {item.variantTitle} · Qty {item.quantity}
                    </p>
                  </div>
                  <span className="tabular-nums">
                    {formatPrice(item.total.amount, item.total.currencyCode)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-4 space-y-2 border-t border-neutral-100 pt-4 text-sm dark:border-neutral-800">
              <div className="flex justify-between">
                <dt className="text-heritage-muted">Items</dt>
                <dd className="tabular-nums">
                  {formatPrice(order.subtotal.amount, order.currencyCode)}
                </dd>
              </div>
              {order.discountTotal.amount > 0 && (
                <div className="flex justify-between">
                  <dt className="text-heritage-muted">Discount</dt>
                  <dd className="text-emerald-700 tabular-nums">
                    −{formatPrice(order.discountTotal.amount, order.currencyCode)}
                  </dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-heritage-muted">
                  Delivery
                  {order.shippingMethodName ? ` · ${order.shippingMethodName}` : ''}
                </dt>
                <dd className="tabular-nums">
                  {order.shippingTotal.amount === 0
                    ? 'Free'
                    : formatPrice(order.shippingTotal.amount, order.currencyCode)}
                </dd>
              </div>
              <div className="flex justify-between pt-2 text-base font-semibold">
                <dt>Total</dt>
                <dd className="tabular-nums">
                  {formatPrice(order.total.amount, order.currencyCode)}
                </dd>
              </div>
            </dl>
          </div>

          {address && (
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 text-sm sm:p-8 dark:border-neutral-800 dark:bg-[#1c1917]">
              <h2 className="text-base font-semibold">Delivering to</h2>
              <p className="mt-2">
                {address.firstName} {address.lastName} · {address.phone}
              </p>
              <p className="text-heritage-muted">
                {address.address1}
                {address.address2 ? `, ${address.address2}` : ''}, {address.city},{' '}
                {address.province} {address.postalCode}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/profile" className="flex-1">
              <Button variant="outline" className="w-full rounded-xl">
                View my orders
              </Button>
            </Link>
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hi, I placed order #${order.displayId}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
              >
                <MessageCircle className="h-4 w-4" /> Questions? WhatsApp us
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
