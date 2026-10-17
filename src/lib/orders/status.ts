import type { Order } from '@/lib/api/contracts/domain';

export interface OrderStatusView {
  label: string;
  tone: 'success' | 'progress' | 'muted';
  payment: string;
}

/** Plain-language order status for customers. */
export function describeOrderStatus(order: Order): OrderStatusView {
  const cod = order.paymentProviderId === 'pp_system_default';
  const payment =
    order.paymentStatus === 'captured'
      ? 'Paid online'
      : order.paymentStatus === 'refunded'
        ? 'Refunded'
        : order.paymentStatus === 'partially_refunded'
          ? 'Partially refunded'
          : cod
            ? 'Cash on delivery'
            : order.paymentStatus === 'authorized'
              ? 'Payment authorised'
              : 'Payment pending';

  if (order.status === 'canceled' || order.fulfillmentStatus === 'canceled') {
    return { label: 'Cancelled', tone: 'muted', payment };
  }
  switch (order.fulfillmentStatus) {
    case 'delivered':
      return { label: 'Delivered', tone: 'success', payment };
    case 'shipped':
      return { label: 'Shipped', tone: 'progress', payment };
    case 'fulfilled':
      return { label: 'Packed', tone: 'progress', payment };
    default:
      return { label: 'Order placed', tone: 'progress', payment };
  }
}

export function isActiveOrder(order: Order): boolean {
  return (
    order.status !== 'canceled' &&
    order.fulfillmentStatus !== 'delivered' &&
    order.fulfillmentStatus !== 'canceled'
  );
}
