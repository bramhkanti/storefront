'use client';

/**
 * Razorpay Standard Checkout in the browser.
 * https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/
 *
 * The handler only tells us the shopper finished the Razorpay popup. The
 * order is created by the backend after it verifies the payment with
 * Razorpay server-to-server, so nothing here is trusted as proof of payment.
 */

const SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

interface RazorpayInstance {
  open(): void;
  on(
    event: 'payment.failed',
    handler: (response: { error?: { description?: string } }) => void,
  ): void;
}

type RazorpayConstructor = new (options: Record<string, unknown>) => RazorpayInstance;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

let scriptPromise: Promise<RazorpayConstructor> | null = null;

function loadScript(): Promise<RazorpayConstructor> {
  if (window.Razorpay) return Promise.resolve(window.Razorpay);
  scriptPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () =>
      window.Razorpay
        ? resolve(window.Razorpay)
        : reject(new Error('Razorpay failed to load'));
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error('Could not load Razorpay. Check your connection and try again.'));
    };
    document.body.appendChild(script);
  });
  return scriptPromise;
}

export interface RazorpaySessionData {
  razorpay_order_id: string;
  key_id: string;
  /** Paise. */
  amount: number;
  currency: string;
}

export function isRazorpaySessionData(
  data: Record<string, unknown>,
): data is Record<string, unknown> & RazorpaySessionData {
  return (
    typeof data.razorpay_order_id === 'string' &&
    typeof data.key_id === 'string' &&
    typeof data.amount === 'number'
  );
}

export type RazorpayOutcome =
  { status: 'paid' } | { status: 'dismissed'; lastError?: string | undefined };

export async function openRazorpayCheckout(
  session: RazorpaySessionData,
  prefill: {
    name?: string | undefined;
    contact?: string | undefined;
    email?: string | undefined;
  },
  brandName: string,
): Promise<RazorpayOutcome> {
  const Razorpay = await loadScript();

  return new Promise((resolve) => {
    // Razorpay lets the shopper retry inside the popup after a failure, so a
    // failure is only reported if they then close it.
    let lastError: string | undefined;
    const instance = new Razorpay({
      key: session.key_id,
      order_id: session.razorpay_order_id,
      amount: session.amount,
      currency: session.currency,
      name: brandName,
      description: 'Order payment',
      prefill,
      theme: { color: '#dc2b1b' },
      handler: () => resolve({ status: 'paid' }),
      modal: {
        ondismiss: () => resolve({ status: 'dismissed', lastError }),
        confirm_close: true,
      },
    });
    instance.on('payment.failed', (response) => {
      lastError = response.error?.description ?? 'Payment failed';
    });
    instance.open();
  });
}
