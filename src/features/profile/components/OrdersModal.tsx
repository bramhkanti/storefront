'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, Clock, Loader2, Package, PackageCheck, Truck } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import type { Order } from '@/lib/api/contracts/domain';
import { listMyOrdersAction } from '@/lib/auth/actions';
import { describeOrderStatus, isActiveOrder } from '@/lib/orders/status';
import { useAuth } from '@/lib/store';
import { formatPrice } from '@/lib/utils/money';
import { cn } from '@/lib/utils/cn';

export interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'active' | 'past';
}

const dateFormat = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

function OrderCard({ order }: { order: Order }) {
  const [open, setOpen] = React.useState(false);
  const status = describeOrderStatus(order);

  return (
    <article className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-[#201d1a]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Order #{order.displayId}</p>
          <p className="text-heritage-muted text-xs">
            {dateFormat.format(new Date(order.createdAt))} · {order.itemCount}{' '}
            {order.itemCount === 1 ? 'item' : 'items'}
          </p>
        </div>
        <span
          className={cn(
            'rounded-full px-2.5 py-1 text-[11px] font-semibold',
            status.tone === 'success' &&
              'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
            status.tone === 'progress' &&
              'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
            status.tone === 'muted' &&
              'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300',
          )}
        >
          {status.label}
        </span>
      </div>

      <ul className="mt-3 space-y-2.5">
        {order.items.map((item) => (
          <li key={item.id} className="flex items-center gap-3">
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
              {item.thumbnailUrl && (
                <Image
                  src={item.thumbnailUrl}
                  alt=""
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <Link
                href={`/products/${item.handle}`}
                className="line-clamp-1 text-sm font-medium hover:underline"
              >
                {item.title}
              </Link>
              <p className="text-heritage-muted text-xs">
                {item.variantTitle} · Qty {item.quantity}
              </p>
            </div>
            <span className="text-sm tabular-nums">
              {formatPrice(item.total.amount, item.total.currencyCode)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-3 dark:border-neutral-800">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-heritage-muted inline-flex items-center gap-1 text-xs font-medium hover:text-neutral-900 dark:hover:text-neutral-100"
          aria-expanded={open}
        >
          Details
          <ChevronDown
            className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')}
          />
        </button>
        <span className="text-sm font-semibold tabular-nums">
          {formatPrice(order.total.amount, order.total.currencyCode)}
        </span>
      </div>

      {open && (
        <dl className="text-heritage-muted mt-3 space-y-1.5 text-xs">
          {order.shippingAddress && (
            <div>
              <dt className="font-medium text-neutral-900 dark:text-neutral-100">
                Delivering to
              </dt>
              <dd>
                {order.shippingAddress.firstName} {order.shippingAddress.lastName},{' '}
                {order.shippingAddress.address1}, {order.shippingAddress.city},{' '}
                {order.shippingAddress.province} {order.shippingAddress.postalCode}
              </dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt>Items</dt>
            <dd className="tabular-nums">
              {formatPrice(order.subtotal.amount, order.currencyCode)}
            </dd>
          </div>
          {order.discountTotal.amount > 0 && (
            <div className="flex justify-between">
              <dt>Discount</dt>
              <dd className="tabular-nums">
                −{formatPrice(order.discountTotal.amount, order.currencyCode)}
              </dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt>
              Delivery{order.shippingMethodName ? ` (${order.shippingMethodName})` : ''}
            </dt>
            <dd className="tabular-nums">
              {order.shippingTotal.amount === 0
                ? 'Free'
                : formatPrice(order.shippingTotal.amount, order.currencyCode)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt>Payment</dt>
            <dd>{status.payment}</dd>
          </div>
        </dl>
      )}
    </article>
  );
}

function OrdersModalBody({ initialTab }: { initialTab: 'active' | 'past' }) {
  const { logout, openAuthModal } = useAuth();
  const [tab, setTab] = React.useState(initialTab);
  const [orders, setOrders] = React.useState<Order[] | null>(null);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    let cancelled = false;
    void listMyOrdersAction(1).then(async (result) => {
      if (cancelled) return;
      if (result.ok) {
        setOrders(result.data.items);
      } else if (result.unauthenticated) {
        await logout();
        openAuthModal();
      } else {
        setError(result.error);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [logout, openAuthModal]);

  const active = orders?.filter(isActiveOrder) ?? [];
  const past = orders?.filter((o) => !isActiveOrder(o)) ?? [];
  const shown = tab === 'active' ? active : past;

  return (
    <>
      <DialogHeader className="text-left">
        <div className="bg-heritage-maroon-light text-heritage-maroon mb-2 flex h-10 w-10 items-center justify-center rounded-full">
          {tab === 'active' ? (
            <Truck className="h-5 w-5" />
          ) : (
            <Package className="h-5 w-5" />
          )}
        </div>
        <DialogTitle className="text-xl font-semibold tracking-tight">
          My orders
        </DialogTitle>
        <DialogDescription className="text-heritage-muted text-sm">
          Track deliveries and see what you ordered before.
        </DialogDescription>
      </DialogHeader>

      <div className="mt-4 grid grid-cols-2 gap-1 rounded-2xl bg-neutral-100 p-1 dark:bg-neutral-800/80">
        {(
          [
            ['active', 'In progress', active.length, Clock],
            ['past', 'Completed', past.length, PackageCheck],
          ] as const
        ).map(([key, label, count, Icon]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              'flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all',
              tab === key
                ? 'text-heritage-maroon bg-white shadow-xs dark:bg-[#25211d] dark:text-red-300'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400',
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
            {orders && ` (${count})`}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {!orders && !error && (
          <div className="text-heritage-muted flex items-center justify-center gap-2 py-10 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading orders…
          </div>
        )}
        {error && <p className="py-6 text-center text-sm text-red-600">{error}</p>}
        {orders && shown.length === 0 && (
          <div className="rounded-2xl border border-dashed border-neutral-300 px-4 py-10 text-center dark:border-neutral-700">
            <Package className="mx-auto mb-2 h-8 w-8 text-neutral-300" />
            <p className="text-sm font-medium">
              {tab === 'active' ? 'No orders on the way' : 'No completed orders yet'}
            </p>
          </div>
        )}
        {shown.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </>
  );
}

export function OrdersModal({
  isOpen,
  onClose,
  defaultTab = 'active',
}: OrdersModalProps): React.JSX.Element {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto p-6 sm:p-7 dark:border-neutral-800 dark:bg-[#1c1917]">
        {isOpen && <OrdersModalBody key={defaultTab} initialTab={defaultTab} />}
      </DialogContent>
    </Dialog>
  );
}
