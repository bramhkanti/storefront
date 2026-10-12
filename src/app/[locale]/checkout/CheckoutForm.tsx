'use client';

import * as React from 'react';
import { useActionState } from 'react';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { placeOrderAction, type PlaceOrderState } from '@/features/checkout/actions';
import { formatPrice } from '@/lib/utils/money';
import { useTranslation } from '@/lib/i18n';

export interface CheckoutFormProps {
  totalAmount: number;
  currencyCode: string;
  itemCount: number;
}

export function CheckoutForm({
  totalAmount,
  currencyCode,
  itemCount,
}: CheckoutFormProps): React.JSX.Element {
  const { t } = useTranslation('checkout');
  const [state, formAction, isPending] = useActionState<PlaceOrderState, FormData>(
    placeOrderAction,
    {},
  );

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs text-red-800">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      {/* 1. Delivery Address */}
      <div className="border-heritage-border bg-heritage-cream rounded-xl border p-6 shadow-xs">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-heritage-charcoal font-serif text-lg font-bold">
            1. {t('checkout.deliveryDetails')}
          </h2>
          <Badge variant="saffron">Pan-India Delivery</Badge>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              htmlFor="fullName"
              className="text-heritage-charcoal block text-xs font-semibold"
            >
              Full Name *
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Aditya Sharma"
              required
              disabled={isPending}
              className={`border-heritage-border bg-heritage-cream focus:border-heritage-maroon mt-1 w-full rounded-md border p-2 text-xs focus:outline-hidden ${
                state.fieldErrors?.fullName ? 'border-red-500 bg-red-50/30' : ''
              }`}
            />
            {state.fieldErrors?.fullName && (
              <p className="mt-1 text-[11px] text-red-600">
                {state.fieldErrors.fullName}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="text-heritage-charcoal block text-xs font-semibold"
            >
              Mobile Number (for SMS & WhatsApp dispatch alerts) *
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+91 98765 43210"
              required
              disabled={isPending}
              className={`border-heritage-border bg-heritage-cream focus:border-heritage-maroon mt-1 w-full rounded-md border p-2 text-xs focus:outline-hidden ${
                state.fieldErrors?.phone ? 'border-red-500 bg-red-50/30' : ''
              }`}
            />
            {state.fieldErrors?.phone && (
              <p className="mt-1 text-[11px] text-red-600">{state.fieldErrors.phone}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="postalCode"
              className="text-heritage-charcoal block text-xs font-semibold"
            >
              PIN Code *
            </label>
            <input
              id="postalCode"
              name="postalCode"
              type="text"
              maxLength={6}
              placeholder="221001"
              required
              disabled={isPending}
              className={`border-heritage-border bg-heritage-cream focus:border-heritage-maroon mt-1 w-full rounded-md border p-2 text-xs focus:outline-hidden ${
                state.fieldErrors?.postalCode ? 'border-red-500 bg-red-50/30' : ''
              }`}
            />
            {state.fieldErrors?.postalCode && (
              <p className="mt-1 text-[11px] text-red-600">
                {state.fieldErrors.postalCode}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="addressLine1"
              className="text-heritage-charcoal block text-xs font-semibold"
            >
              Flat / House No., Apartment, Street *
            </label>
            <input
              id="addressLine1"
              name="addressLine1"
              type="text"
              placeholder="House #12, Assi Ghat Road"
              required
              disabled={isPending}
              className={`border-heritage-border bg-heritage-cream focus:border-heritage-maroon mt-1 w-full rounded-md border p-2 text-xs focus:outline-hidden ${
                state.fieldErrors?.addressLine1 ? 'border-red-500 bg-red-50/30' : ''
              }`}
            />
            {state.fieldErrors?.addressLine1 && (
              <p className="mt-1 text-[11px] text-red-600">
                {state.fieldErrors.addressLine1}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="city"
              className="text-heritage-charcoal block text-xs font-semibold"
            >
              City / District *
            </label>
            <input
              id="city"
              name="city"
              type="text"
              placeholder="Varanasi"
              required
              disabled={isPending}
              className={`border-heritage-border bg-heritage-cream focus:border-heritage-maroon mt-1 w-full rounded-md border p-2 text-xs focus:outline-hidden ${
                state.fieldErrors?.city ? 'border-red-500 bg-red-50/30' : ''
              }`}
            />
            {state.fieldErrors?.city && (
              <p className="mt-1 text-[11px] text-red-600">{state.fieldErrors.city}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="state"
              className="text-heritage-charcoal block text-xs font-semibold"
            >
              State *
            </label>
            <input
              id="state"
              name="state"
              type="text"
              placeholder="Uttar Pradesh"
              required
              disabled={isPending}
              className={`border-heritage-border bg-heritage-cream focus:border-heritage-maroon mt-1 w-full rounded-md border p-2 text-xs focus:outline-hidden ${
                state.fieldErrors?.state ? 'border-red-500 bg-red-50/30' : ''
              }`}
            />
            {state.fieldErrors?.state && (
              <p className="mt-1 text-[11px] text-red-600">{state.fieldErrors.state}</p>
            )}
          </div>
        </div>
      </div>

      {/* 2. Payment Method */}
      <div className="border-heritage-border bg-heritage-cream rounded-xl border p-6 shadow-xs">
        <h2 className="text-heritage-charcoal mb-4 font-serif text-lg font-bold">
          2. Payment Method
        </h2>

        <div className="space-y-3 text-xs">
          <label className="border-heritage-maroon bg-heritage-cream-dark/50 flex cursor-pointer items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-2.5">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                defaultChecked
                disabled={isPending}
                className="accent-heritage-maroon"
              />
              <span className="text-heritage-charcoal font-semibold">
                Cash on Delivery (COD)
              </span>
            </div>
            <Badge variant="vegetarian">Available</Badge>
          </label>

          <label className="border-heritage-border hover:border-heritage-muted flex cursor-pointer items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-2.5">
              <input
                type="radio"
                name="paymentMethod"
                value="upi"
                disabled={isPending}
                className="accent-heritage-maroon"
              />
              <span className="text-heritage-charcoal font-semibold">
                Instant UPI (GPay / PhonePe / Paytm on Delivery)
              </span>
            </div>
            <span className="text-heritage-muted text-[10px]">Instant QR</span>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        disabled={isPending || itemCount === 0}
        className="w-full justify-center gap-2 font-semibold shadow-md"
      >
        {isPending ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>{t('checkout.summary.submitting')}</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="h-5 w-5" />
            <span>
              {t('checkout.summary.placeOrder')} •{' '}
              {formatPrice(totalAmount, currencyCode)}
            </span>
          </>
        )}
      </Button>
    </form>
  );
}
