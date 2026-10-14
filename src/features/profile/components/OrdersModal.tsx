'use client';

import * as React from 'react';
import { Package, Truck, CheckCircle2, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/Dialog';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils/money';

export interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'active' | 'past';
}

interface OrderItem {
  id: string;
  orderNumber: string;
  date: string;
  status: 'in_transit' | 'delivered';
  statusText: string;
  items: Array<{ name: string; quantity: number; weight: string }>;
  totalAmount: number;
  deliveryEta: string;
}

const DEMO_ORDERS: OrderItem[] = [
  {
    id: 'ord_1',
    orderNumber: 'BK-89412',
    date: '12 Oct 2026',
    status: 'in_transit',
    statusText: 'In Transit — Dispatched from Varanasi Barnie Facility',
    items: [
      { name: 'Banarasi Traditional Aam Achar (Sun-Cured)', quantity: 2, weight: '500g Glass Jar' },
      { name: 'Himalayan Pink Salt Slow-Roasted Makhana', quantity: 3, weight: '150g Pouch' },
    ],
    totalAmount: 114000, // ₹1,140 in paise
    deliveryEta: '15 Oct 2026',
  },
  {
    id: 'ord_2',
    orderNumber: 'BK-76190',
    date: '28 Sep 2026',
    status: 'delivered',
    statusText: 'Delivered to Varanasi address',
    items: [
      { name: 'Pure Desi Cow Ghee Besan Ladoo', quantity: 1, weight: '500g Heritage Box' },
      { name: 'Stuffed Red Chilli Pickle (Bharwa Lal Mirch)', quantity: 1, weight: '400g Glass Jar' },
    ],
    totalAmount: 98000, // ₹980 in paise
    deliveryEta: '01 Oct 2026',
  },
];

interface OrdersModalBodyProps {
  initialTab: 'active' | 'past';
  onClose: () => void;
}

function OrdersModalBody({ initialTab, onClose }: OrdersModalBodyProps): React.JSX.Element {
  const [activeTab, setActiveTab] = React.useState<'active' | 'past'>(initialTab);

  const activeOrders = React.useMemo(
    () => DEMO_ORDERS.filter((o) => o.status === 'in_transit'),
    [],
  );

  const pastOrders = React.useMemo(
    () => DEMO_ORDERS.filter((o) => o.status === 'delivered'),
    [],
  );

  const displayedOrders = activeTab === 'active' ? activeOrders : pastOrders;

  return (
    <>
      <DialogHeader className="text-left">
        <div className="flex items-center gap-2.5">
          <div className="bg-heritage-maroon-light dark:bg-heritage-maroon/20 text-heritage-maroon flex h-9 w-9 items-center justify-center rounded-full shrink-0">
            {activeTab === 'active' ? (
              <Truck className="h-5 w-5" />
            ) : (
              <Package className="h-5 w-5" />
            )}
          </div>
          <div>
            <DialogTitle className="text-heritage-maroon dark:text-red-400 font-serif text-xl font-bold">
              {activeTab === 'active' ? 'My Active Orders' : 'My Past Orders'}
            </DialogTitle>
            <DialogDescription className="text-heritage-muted dark:text-neutral-400 text-xs">
              {activeTab === 'active'
                ? 'Track ongoing consignments and live delivery dispatches from Varanasi.'
                : 'Review delivered heritage delicacy orders, quantities, and receipts.'}
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      {/* Tab Controls */}
      <div className="mt-4 grid grid-cols-2 gap-1.5 p-1 bg-neutral-200/60 dark:bg-neutral-800/80 rounded-2xl">
        <button
          type="button"
          onClick={() => setActiveTab('active')}
          className={`py-2 px-3 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'active'
              ? 'bg-white dark:bg-[#25211d] text-heritage-maroon dark:text-red-300'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          <span>Active Orders ({activeOrders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('past')}
          className={`py-2 px-3 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'past'
              ? 'bg-white dark:bg-[#25211d] text-heritage-maroon dark:text-red-300'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
          }`}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Past Orders ({pastOrders.length})</span>
        </button>
      </div>

      {/* Order Cards List */}
      <div className="mt-4 space-y-4">
        {displayedOrders.length === 0 ? (
          <div className="text-center py-10 px-4 bg-white dark:bg-[#201d1a] rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800">
            <Package className="h-8 w-8 text-neutral-300 dark:text-neutral-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              {activeTab === 'active'
                ? 'No active orders in transit'
                : 'No past orders found'}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs mx-auto">
              {activeTab === 'active'
                ? 'Your placed orders will show up here with live package tracking and delivery ETA.'
                : 'Delivered orders will appear here for easy reordering and invoice records.'}
            </p>
          </div>
        ) : (
          displayedOrders.map((order) => (
            <div
              key={order.id}
              className="border-heritage-border/80 dark:border-neutral-800 bg-white dark:bg-[#201d1a] rounded-2xl border p-4"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <div>
                  <span className="text-heritage-charcoal dark:text-neutral-100 font-mono text-xs font-bold">
                    Order #{order.orderNumber}
                  </span>
                  <p className="text-heritage-muted dark:text-neutral-400 text-[11px]">{order.date}</p>
                </div>
                {order.status === 'in_transit' ? (
                  <Badge variant="saffron" className="flex items-center gap-1 text-[11px]">
                    <Clock className="h-3 w-3" />
                    <span>In Transit</span>
                  </Badge>
                ) : (
                  <Badge variant="vegetarian" className="flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Delivered</span>
                  </Badge>
                )}
              </div>

              <div className="divide-neutral-100 dark:divide-neutral-800 divide-y py-2.5">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 text-xs">
                    <div>
                      <p className="text-heritage-charcoal dark:text-neutral-200 font-medium">{item.name}</p>
                      <p className="text-heritage-muted dark:text-neutral-400 text-[11px]">
                        Qty: {item.quantity} · {item.weight}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-heritage-border/60 dark:border-neutral-800/80 bg-heritage-cream-dark/30 dark:bg-neutral-800/40 mt-1 flex items-center justify-between rounded-xl border p-2.5 text-xs">
                <div>
                  <p className="text-heritage-muted dark:text-neutral-400 text-[10px] uppercase tracking-wider font-semibold">
                    Total Amount
                  </p>
                  <p className="text-heritage-charcoal dark:text-neutral-100 font-bold">
                    {formatPrice(order.totalAmount, 'INR')}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-heritage-maroon dark:text-red-400 text-xs font-semibold">
                  {order.status === 'in_transit' ? (
                    <>
                      <Truck className="h-4 w-4" />
                      <span>ETA: {order.deliveryEta}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-700 dark:text-emerald-400">Delivered</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-5 flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          className="rounded-xl text-xs"
        >
          Close
        </Button>
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
      <DialogContent className="border-heritage-border bg-heritage-cream dark:bg-[#1c1917] dark:border-neutral-800 max-h-[90vh] max-w-lg overflow-y-auto p-6 sm:p-7">
        {isOpen && (
          <OrdersModalBody
            key={defaultTab}
            initialTab={defaultTab}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
