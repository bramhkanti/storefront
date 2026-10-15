'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Check, CreditCard, Lock, MapPin, Plus, Truck, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { INDIAN_STATES } from '@/content/indian-states';
import type { Cart, PaymentMethod, ShippingOption } from '@/lib/api/contracts/domain';
import type { SavedAddress } from '@/lib/auth/profile';
import { useCart } from '@/lib/cart';
import { useAuth, useToast } from '@/lib/store';
import { formatPrice } from '@/lib/utils/money';
import { cn } from '@/lib/utils/cn';
import {
  placeOrderAction,
  saveCheckoutAddressAction,
  selectShippingOptionAction,
  startPaymentAction,
  type CheckoutAddressInput,
  type CheckoutFieldErrors,
} from '../actions';
import { isRazorpaySessionData, openRazorpayCheckout } from '../razorpay';
import { OrderSummary } from './OrderSummary';

type Step = 'address' | 'delivery' | 'payment';

export interface CheckoutFlowProps {
  initialCart: Cart;
  initialShippingOptions: ShippingOption[];
  paymentMethods: PaymentMethod[];
  brandName: string;
}

const EMPTY_FORM: CheckoutAddressInput = {
  fullName: '',
  phone: '',
  email: '',
  address1: '',
  address2: '',
  city: '',
  province: '',
  postalCode: '',
  saveToAccount: true,
};

function formFromCart(cart: Cart): CheckoutAddressInput | null {
  const a = cart.shippingAddress;
  if (!a) return null;
  return {
    fullName: [a.firstName, a.lastName].filter(Boolean).join(' '),
    phone: a.phone.replace(/\D/g, '').slice(-10),
    email: cart.email ?? '',
    address1: a.address1,
    address2: a.address2 ?? '',
    city: a.city,
    province: a.province,
    postalCode: a.postalCode,
    saveToAccount: false,
  };
}

function formFromSaved(saved: SavedAddress, email?: string): CheckoutAddressInput {
  return {
    fullName: saved.name,
    phone: saved.phone.replace(/\D/g, '').slice(-10),
    email: email ?? '',
    address1: saved.street,
    address2: saved.landmark ?? '',
    city: saved.city,
    province: saved.state,
    postalCode: saved.pincode,
    saveToAccount: false,
  };
}

const inputBase =
  'h-11 w-full rounded-xl border bg-white px-3.5 text-sm outline-none transition-colors focus:border-heritage-maroon focus:ring-2 focus:ring-heritage-maroon/15 dark:bg-neutral-900';

function Field({
  id,
  label,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string | undefined;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function StepCard({
  index,
  title,
  icon: Icon,
  active,
  done,
  summary,
  onEdit,
  children,
}: {
  index: number;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  done: boolean;
  summary?: React.ReactNode;
  onEdit?: (() => void) | undefined;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-labelledby={`step-${index}`}
      className={cn(
        'rounded-2xl border bg-white p-5 transition-shadow sm:p-6 dark:bg-[#1c1917]',
        active
          ? 'border-neutral-300 shadow-sm dark:border-neutral-700'
          : 'border-neutral-200 dark:border-neutral-800',
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <h2
          id={`step-${index}`}
          className="flex items-center gap-3 text-base font-semibold"
        >
          <span
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold',
              done
                ? 'bg-emerald-600 text-white'
                : active
                  ? 'bg-heritage-maroon text-white'
                  : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800',
            )}
          >
            {done ? <Check className="h-4 w-4" /> : index}
          </span>
          <Icon className="text-heritage-muted h-4 w-4" />
          {title}
        </h2>
        {done && !active && onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="text-heritage-maroon text-sm font-medium hover:underline"
          >
            Change
          </button>
        )}
      </div>
      {!active && done && summary && (
        <div className="text-heritage-muted mt-3 pl-10 text-sm">{summary}</div>
      )}
      {active && <div className="mt-5">{children}</div>}
    </section>
  );
}

const PAYMENT_ICONS = { razorpay: CreditCard, cod: Wallet, other: CreditCard } as const;

export function CheckoutFlow({
  initialCart,
  initialShippingOptions,
  paymentMethods,
  brandName,
}: CheckoutFlowProps) {
  const router = useRouter();
  const { user, isAuthenticated, isSessionLoaded, openAuthModal } = useAuth();
  const { setCart: setGlobalCart, refreshCart } = useCart();
  const { addToast } = useToast();

  const [cart, setCartState] = React.useState(initialCart);
  const [shippingOptions, setShippingOptions] = React.useState(initialShippingOptions);
  const [step, setStep] = React.useState<Step>(
    initialCart.shippingAddress
      ? initialCart.shippingOptionId
        ? 'payment'
        : 'delivery'
      : 'address',
  );
  const [form, setForm] = React.useState<CheckoutAddressInput>(
    () => formFromCart(initialCart) ?? EMPTY_FORM,
  );
  const [selectedAddressId, setSelectedAddressId] = React.useState<string | 'new' | null>(
    null,
  );
  const [fieldErrors, setFieldErrors] = React.useState<CheckoutFieldErrors>({});
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState<null | 'address' | 'delivery' | 'order'>(null);
  const [paymentProviderId, setPaymentProviderId] = React.useState(
    paymentMethods[0]?.providerId ?? '',
  );

  const savedAddresses = user?.addresses ?? [];

  const setCart = (next: Cart) => {
    setCartState(next);
    setGlobalCart(next);
  };

  // Logged-in shoppers start from their default saved address.
  React.useEffect(() => {
    if (initialCart.shippingAddress || selectedAddressId !== null || !user) return;
    const preferred = user.addresses.find((a) => a.isDefault) ?? user.addresses[0];
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time prefill once the session loads
    setSelectedAddressId(preferred ? preferred.id : 'new');
    setForm(
      preferred
        ? formFromSaved(preferred, user.email)
        : {
            ...EMPTY_FORM,
            fullName: user.name === 'Bramhkanti customer' ? '' : user.name,
            phone: user.phone.replace(/\D/g, '').slice(-10),
            email: user.email ?? '',
          },
    );
  }, [user, initialCart.shippingAddress, selectedAddressId]);

  const update =
    (key: keyof CheckoutAddressInput) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value =
        key === 'phone' || key === 'postalCode'
          ? e.target.value.replace(/\D/g, '')
          : e.target.value;
      setForm((f) => ({ ...f, [key]: value }));
      setFieldErrors((errs) => ({ ...errs, [key]: undefined }));
    };

  const submitAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy('address');
    setError('');
    const result = await saveCheckoutAddressAction({
      ...form,
      saveToAccount: isAuthenticated && selectedAddressId === 'new' && form.saveToAccount,
    });
    setBusy(null);
    if (!result.ok) {
      setError(result.error);
      setFieldErrors('fieldErrors' in result ? (result.fieldErrors ?? {}) : {});
      return;
    }
    setCart(result.data.cart);
    setShippingOptions(result.data.shippingOptions);
    setStep('delivery');
  };

  const chooseShipping = async (optionId: string) => {
    setBusy('delivery');
    setError('');
    const result = await selectShippingOptionAction(optionId);
    setBusy(null);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setCart(result.data);
    setStep('payment');
  };

  const finishOrder = async (): Promise<boolean> => {
    // The backend may need a moment to see a Razorpay payment as captured.
    for (let attempt = 0; attempt < 4; attempt++) {
      const result = await placeOrderAction();
      if (result.ok) {
        await refreshCart();
        router.push(`/order-confirmed?order=${encodeURIComponent(result.data.orderId)}`);
        return true;
      }
      if (attempt === 3) {
        setError(result.error);
        return false;
      }
      await new Promise((r) => setTimeout(r, 1500));
    }
    return false;
  };

  const placeOrder = async () => {
    const method = paymentMethods.find((m) => m.providerId === paymentProviderId);
    if (!method) {
      setError('Choose a payment method');
      return;
    }
    setBusy('order');
    setError('');
    const session = await startPaymentAction(method.providerId);
    if (!session.ok) {
      setBusy(null);
      setError(session.error);
      return;
    }

    if (method.kind === 'razorpay') {
      if (!isRazorpaySessionData(session.data.data)) {
        setBusy(null);
        setError('Online payment is not available right now. Please try another method.');
        return;
      }
      try {
        const outcome = await openRazorpayCheckout(
          session.data.data,
          {
            name: form.fullName,
            contact: `+91${form.phone}`,
            email: form.email || undefined,
          },
          brandName,
        );
        if (outcome.status === 'dismissed') {
          setBusy(null);
          if (outcome.lastError) setError(outcome.lastError);
          return;
        }
      } catch (err) {
        setBusy(null);
        setError(err instanceof Error ? err.message : 'Payment could not be started');
        return;
      }
    }

    const placed = await finishOrder();
    if (!placed) setBusy(null);
  };

  const selectedOption = shippingOptions.find((o) => o.id === cart.shippingOptionId);
  const addressDone = Boolean(cart.shippingAddress);
  const deliveryDone = Boolean(cart.shippingOptionId);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
      <div className="space-y-4">
        {isSessionLoaded && !isAuthenticated && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-sm dark:border-neutral-800 dark:bg-[#1c1917]">
            <span>
              <strong className="font-semibold">Have an account?</strong>{' '}
              <span className="text-heritage-muted">
                Log in to use saved addresses and track this order.
              </span>
            </span>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={openAuthModal}
            >
              Log in with OTP
            </Button>
          </div>
        )}

        <StepCard
          index={1}
          title="Delivery address"
          icon={MapPin}
          active={step === 'address'}
          done={addressDone}
          onEdit={busy ? undefined : () => setStep('address')}
          summary={
            cart.shippingAddress && (
              <>
                <span className="font-medium text-neutral-900 dark:text-neutral-100">
                  {cart.shippingAddress.firstName} {cart.shippingAddress.lastName}
                </span>{' '}
                · {cart.shippingAddress.phone}
                <br />
                {cart.shippingAddress.address1}
                {cart.shippingAddress.address2
                  ? `, ${cart.shippingAddress.address2}`
                  : ''}
                , {cart.shippingAddress.city}, {cart.shippingAddress.province}{' '}
                {cart.shippingAddress.postalCode}
              </>
            )
          }
        >
          {isAuthenticated && savedAddresses.length > 0 && (
            <div className="mb-5 grid gap-3 sm:grid-cols-2">
              {savedAddresses.map((saved) => (
                <button
                  key={saved.id}
                  type="button"
                  onClick={() => {
                    setSelectedAddressId(saved.id);
                    setForm(formFromSaved(saved, user?.email));
                    setFieldErrors({});
                  }}
                  className={cn(
                    'rounded-xl border p-3.5 text-left text-sm transition-colors',
                    selectedAddressId === saved.id
                      ? 'border-heritage-maroon ring-heritage-maroon/15 bg-heritage-maroon-light/40 ring-2'
                      : 'border-neutral-200 hover:border-neutral-300 dark:border-neutral-700',
                  )}
                >
                  <span className="font-semibold">{saved.label}</span>
                  <span className="text-heritage-muted mt-1 line-clamp-2 block text-xs">
                    {saved.name}, {saved.street}, {saved.city} {saved.pincode}
                  </span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setSelectedAddressId('new');
                  setForm({
                    ...EMPTY_FORM,
                    fullName: user?.name ?? '',
                    phone: user?.phone.replace(/\D/g, '').slice(-10) ?? '',
                    email: user?.email ?? '',
                  });
                }}
                className={cn(
                  'flex items-center justify-center gap-2 rounded-xl border border-dashed p-3.5 text-sm font-medium',
                  selectedAddressId === 'new'
                    ? 'border-heritage-maroon text-heritage-maroon'
                    : 'border-neutral-300 text-neutral-600 dark:border-neutral-700',
                )}
              >
                <Plus className="h-4 w-4" /> New address
              </button>
            </div>
          )}

          <form
            onSubmit={submitAddress}
            noValidate
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <Field
              id="fullName"
              label="Full name"
              error={fieldErrors.fullName}
              className="sm:col-span-2"
            >
              <input
                id="fullName"
                autoComplete="name"
                value={form.fullName}
                onChange={update('fullName')}
                className={cn(
                  inputBase,
                  fieldErrors.fullName
                    ? 'border-red-400'
                    : 'border-neutral-200 dark:border-neutral-700',
                )}
              />
            </Field>
            <Field id="phone" label="Mobile number" error={fieldErrors.phone}>
              <div
                className={cn(
                  'focus-within:border-heritage-maroon focus-within:ring-heritage-maroon/15 flex h-11 overflow-hidden rounded-xl border bg-white focus-within:ring-2 dark:bg-neutral-900',
                  fieldErrors.phone
                    ? 'border-red-400'
                    : 'border-neutral-200 dark:border-neutral-700',
                )}
              >
                <span className="text-heritage-muted flex items-center border-r border-neutral-200 px-3 text-sm dark:border-neutral-700">
                  +91
                </span>
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  maxLength={10}
                  value={form.phone}
                  onChange={update('phone')}
                  className="w-full bg-transparent px-3 text-sm outline-none"
                />
              </div>
            </Field>
            <Field
              id="email"
              label="Email (optional, for receipt)"
              error={fieldErrors.email}
            >
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={form.email ?? ''}
                onChange={update('email')}
                className={cn(
                  inputBase,
                  fieldErrors.email
                    ? 'border-red-400'
                    : 'border-neutral-200 dark:border-neutral-700',
                )}
              />
            </Field>
            <Field
              id="address1"
              label="House no., building, street"
              error={fieldErrors.address1}
              className="sm:col-span-2"
            >
              <input
                id="address1"
                autoComplete="address-line1"
                value={form.address1}
                onChange={update('address1')}
                className={cn(
                  inputBase,
                  fieldErrors.address1
                    ? 'border-red-400'
                    : 'border-neutral-200 dark:border-neutral-700',
                )}
              />
            </Field>
            <Field
              id="address2"
              label="Area, landmark (optional)"
              className="sm:col-span-2"
            >
              <input
                id="address2"
                autoComplete="address-line2"
                value={form.address2 ?? ''}
                onChange={update('address2')}
                className={cn(inputBase, 'border-neutral-200 dark:border-neutral-700')}
              />
            </Field>
            <Field id="postalCode" label="PIN code" error={fieldErrors.postalCode}>
              <input
                id="postalCode"
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={6}
                value={form.postalCode}
                onChange={update('postalCode')}
                className={cn(
                  inputBase,
                  fieldErrors.postalCode
                    ? 'border-red-400'
                    : 'border-neutral-200 dark:border-neutral-700',
                )}
              />
            </Field>
            <Field id="city" label="City" error={fieldErrors.city}>
              <input
                id="city"
                autoComplete="address-level2"
                value={form.city}
                onChange={update('city')}
                className={cn(
                  inputBase,
                  fieldErrors.city
                    ? 'border-red-400'
                    : 'border-neutral-200 dark:border-neutral-700',
                )}
              />
            </Field>
            <Field
              id="province"
              label="State"
              error={fieldErrors.province}
              className="sm:col-span-2"
            >
              <select
                id="province"
                autoComplete="address-level1"
                value={form.province}
                onChange={update('province')}
                className={cn(
                  inputBase,
                  fieldErrors.province
                    ? 'border-red-400'
                    : 'border-neutral-200 dark:border-neutral-700',
                )}
              >
                <option value="">Select state</option>
                {INDIAN_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </Field>
            {isAuthenticated && selectedAddressId === 'new' && (
              <label className="flex items-center gap-2 text-sm sm:col-span-2">
                <input
                  type="checkbox"
                  checked={Boolean(form.saveToAccount)}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, saveToAccount: e.target.checked }))
                  }
                  className="accent-heritage-maroon h-4 w-4"
                />
                Save this address to my account
              </label>
            )}
            <div className="sm:col-span-2">
              <Button
                type="submit"
                size="lg"
                isLoading={busy === 'address'}
                className="w-full rounded-xl sm:w-auto sm:px-8"
              >
                Continue to delivery
              </Button>
            </div>
          </form>
        </StepCard>

        <StepCard
          index={2}
          title="Delivery option"
          icon={Truck}
          active={step === 'delivery'}
          done={deliveryDone && step !== 'address'}
          onEdit={busy ? undefined : () => setStep('delivery')}
          summary={
            selectedOption &&
            `${selectedOption.name} · ${selectedOption.amount.amount === 0 ? 'Free' : formatPrice(selectedOption.amount.amount, selectedOption.amount.currencyCode)}`
          }
        >
          {shippingOptions.length === 0 ? (
            <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
              We can&apos;t deliver to this address online yet. Please contact us on
              WhatsApp to place the order.
            </p>
          ) : (
            <div className="space-y-3">
              {shippingOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  disabled={busy !== null}
                  onClick={() => chooseShipping(option.id)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-xl border p-4 text-left text-sm transition-colors disabled:opacity-60',
                    cart.shippingOptionId === option.id
                      ? 'border-heritage-maroon ring-heritage-maroon/15 ring-2'
                      : 'border-neutral-200 hover:border-neutral-300 dark:border-neutral-700',
                  )}
                >
                  <span className="font-medium">{option.name}</span>
                  <span className="tabular-nums">
                    {option.amount.amount === 0 ? (
                      <span className="font-semibold text-emerald-700">Free</span>
                    ) : (
                      formatPrice(option.amount.amount, option.amount.currencyCode)
                    )}
                  </span>
                </button>
              ))}
            </div>
          )}
        </StepCard>

        <StepCard
          index={3}
          title="Payment"
          icon={Lock}
          active={step === 'payment'}
          done={false}
        >
          {paymentMethods.length === 0 ? (
            <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
              Payments are not set up yet. Please try again later.
            </p>
          ) : (
            <div className="space-y-3">
              {paymentMethods.map((method) => {
                const Icon = PAYMENT_ICONS[method.kind];
                return (
                  <label
                    key={method.providerId}
                    className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm transition-colors',
                      paymentProviderId === method.providerId
                        ? 'border-heritage-maroon ring-heritage-maroon/15 ring-2'
                        : 'border-neutral-200 hover:border-neutral-300 dark:border-neutral-700',
                    )}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.providerId}
                      checked={paymentProviderId === method.providerId}
                      onChange={() => setPaymentProviderId(method.providerId)}
                      className="accent-heritage-maroon h-4 w-4"
                    />
                    <Icon className="text-heritage-muted h-4 w-4" />
                    <span className="font-medium">{method.label}</span>
                  </label>
                );
              })}
            </div>
          )}

          <Button
            size="lg"
            onClick={placeOrder}
            isLoading={busy === 'order'}
            disabled={busy !== null || paymentMethods.length === 0 || !deliveryDone}
            className="mt-5 w-full rounded-xl"
          >
            <Lock className="h-4 w-4" />
            {paymentMethods.find((m) => m.providerId === paymentProviderId)?.kind ===
            'razorpay'
              ? 'Pay'
              : 'Place order'}{' '}
            {formatPrice(cart.total.amount, cart.currencyCode)}
          </Button>
          <p className="text-heritage-muted mt-3 text-center text-xs">
            {paymentMethods.find((m) => m.providerId === paymentProviderId)?.kind ===
            'cod'
              ? 'Pay in cash or UPI when your order arrives.'
              : 'Your order is confirmed once the payment is verified.'}
          </p>
        </StepCard>

        {error && (
          <p
            role="alert"
            className="rounded-xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
          >
            {error}
          </p>
        )}
      </div>

      <div className="lg:sticky lg:top-24">
        <OrderSummary
          cart={cart}
          disabled={busy !== null}
          onCartChange={(next) => {
            setCart(next);
            addToast({ type: 'success', message: 'Bag updated' });
          }}
        />
      </div>
    </div>
  );
}
