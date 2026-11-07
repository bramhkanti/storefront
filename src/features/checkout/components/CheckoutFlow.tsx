'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Banknote,
  Check,
  CreditCard,
  Lock,
  MapPin,
  Plus,
  ShieldCheck,
  Smartphone,
  Truck,
} from 'lucide-react';
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

type Step = 'address' | 'payment';

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

const PAYMENT_ICONS = { razorpay: CreditCard, cod: Banknote, other: CreditCard } as const;

const PAYMENT_COPY: Partial<
  Record<PaymentMethod['kind'], { title: string; hint: string; tag?: string }>
> = {
  razorpay: {
    title: 'Pay online',
    hint: 'UPI, cards, netbanking and wallets',
    tag: 'Recommended',
  },
  cod: { title: 'Cash on delivery', hint: 'Pay in cash or UPI when your order arrives' },
};

function shippingLabel(option: ShippingOption | undefined): string {
  if (!option) return '';
  return option.amount.amount === 0
    ? 'Free'
    : formatPrice(option.amount.amount, option.amount.currencyCode);
}

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
    initialCart.shippingAddress ? 'payment' : 'address',
  );
  const [form, setForm] = React.useState<CheckoutAddressInput>(
    () => formFromCart(initialCart) ?? EMPTY_FORM,
  );
  const [selectedAddressId, setSelectedAddressId] = React.useState<string | 'new' | null>(
    null,
  );
  const [fieldErrors, setFieldErrors] = React.useState<CheckoutFieldErrors>({});
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState<
    null | 'address' | 'delivery' | 'order' | 'confirming'
  >(null);
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

  // Delivery is picked for the shopper: the current choice, else the cheapest.
  const pickDefaultShipping = async (options: ShippingOption[]): Promise<boolean> => {
    const cheapest = [...options].sort((a, b) => a.amount.amount - b.amount.amount)[0];
    if (!cheapest) return false;
    const result = await selectShippingOptionAction(cheapest.id);
    if (!result.ok) {
      setError(result.error);
      return false;
    }
    setCart(result.data);
    return true;
  };

  // A cart that already has an address but no delivery option (e.g. after a
  // reload) gets the default option too.
  const autoPicked = React.useRef(false);
  React.useEffect(() => {
    if (autoPicked.current || step !== 'payment' || cart.shippingOptionId) return;
    if (shippingOptions.length === 0) return;
    autoPicked.current = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time default once payment opens
    setBusy('delivery');
    void pickDefaultShipping(shippingOptions).finally(() => setBusy(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once when payment opens
  }, [step, cart.shippingOptionId, shippingOptions]);

  const submitAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy('address');
    setError('');
    const result = await saveCheckoutAddressAction({
      ...form,
      saveToAccount: isAuthenticated && selectedAddressId === 'new' && form.saveToAccount,
    });
    if (!result.ok) {
      setBusy(null);
      setError(result.error);
      setFieldErrors('fieldErrors' in result ? (result.fieldErrors ?? {}) : {});
      return;
    }
    setCart(result.data.cart);
    setShippingOptions(result.data.shippingOptions);
    const current = result.data.shippingOptions.some(
      (o) => o.id === result.data.cart.shippingOptionId,
    );
    if (!current) {
      autoPicked.current = true;
      await pickDefaultShipping(result.data.shippingOptions);
    }
    setBusy(null);
    setStep('payment');
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
          setError(
            outcome.lastError
              ? `${outcome.lastError}. You can try again or choose Cash on delivery.`
              : 'Payment was cancelled. You can try again or choose Cash on delivery.',
          );
          return;
        }
        setBusy('confirming');
      } catch (err) {
        setBusy(null);
        setError(err instanceof Error ? err.message : 'Payment could not be started');
        return;
      }
    }

    const placed = await finishOrder();
    if (!placed) setBusy(null);
  };

  // Checkout needs a logged-in shopper (the server actions check this too).
  const gate = !isSessionLoaded ? (
    <div className="space-y-4" aria-busy="true" aria-label="Loading checkout">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-20 animate-pulse rounded-2xl bg-neutral-200/70 dark:bg-neutral-800"
        />
      ))}
    </div>
  ) : !isAuthenticated ? (
    <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center sm:p-10 dark:border-neutral-800 dark:bg-[#1c1917]">
      <div className="bg-heritage-maroon-light text-heritage-maroon mx-auto flex h-14 w-14 items-center justify-center rounded-full">
        <Smartphone className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-xl font-semibold tracking-tight">Log in to checkout</h2>
      <p className="text-heritage-muted mx-auto mt-2 max-w-sm text-sm">
        Verify your mobile number with a one-time code. We&apos;ll keep your bag, save
        your address and send order updates to this number.
      </p>
      <Button size="lg" className="mt-6 rounded-xl px-8" onClick={openAuthModal}>
        Log in with OTP
      </Button>
    </div>
  ) : null;

  const selectedOption = shippingOptions.find((o) => o.id === cart.shippingOptionId);
  const selectedMethod = paymentMethods.find((m) => m.providerId === paymentProviderId);
  const addressDone = Boolean(cart.shippingAddress);
  const deliveryDone = Boolean(cart.shippingOptionId);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
      <div className="space-y-4">
        {gate ?? (
          <>
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
                    className={cn(
                      inputBase,
                      'border-neutral-200 dark:border-neutral-700',
                    )}
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
                    Continue to payment
                  </Button>
                </div>
              </form>
            </StepCard>

            <StepCard
              index={2}
              title="Payment"
              icon={Lock}
              active={step === 'payment'}
              done={false}
            >
              {/* Delivery: chosen automatically, switchable when there are several */}
              {shippingOptions.length === 0 ? (
                <p className="mb-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                  We can&apos;t deliver to this address online yet. Please contact us on
                  WhatsApp to place the order.
                </p>
              ) : shippingOptions.length === 1 || !selectedOption ? (
                <div className="bg-surface-soft text-fg mb-5 flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm">
                  <span className="flex items-center gap-2">
                    <Truck className="text-fg-muted h-4 w-4" />
                    {selectedOption?.name ?? shippingOptions[0]?.name}
                  </span>
                  <span className="font-semibold tabular-nums">
                    {busy === 'delivery'
                      ? '…'
                      : shippingLabel(selectedOption ?? shippingOptions[0])}
                  </span>
                </div>
              ) : (
                <fieldset className="mb-5">
                  <legend className="text-fg mb-2 text-sm font-semibold">Delivery</legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {shippingOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        disabled={busy !== null}
                        onClick={() => chooseShipping(option.id)}
                        aria-pressed={cart.shippingOptionId === option.id}
                        className={cn(
                          'flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors disabled:opacity-60',
                          cart.shippingOptionId === option.id
                            ? 'border-primary bg-primary-tint/40'
                            : 'border-line hover:border-line-strong',
                        )}
                      >
                        <span className="flex items-center gap-2 font-medium">
                          <Truck className="text-fg-muted h-4 w-4" />
                          {option.name}
                        </span>
                        <span className="font-semibold tabular-nums">
                          {shippingLabel(option)}
                        </span>
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}

              {paymentMethods.length === 0 ? (
                <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                  Payments are not set up yet. Please try again later.
                </p>
              ) : (
                <div role="radiogroup" aria-label="Payment method" className="space-y-3">
                  {paymentMethods.map((method) => {
                    const Icon = PAYMENT_ICONS[method.kind];
                    const copy = PAYMENT_COPY[method.kind];
                    const selected = paymentProviderId === method.providerId;
                    return (
                      <button
                        key={method.providerId}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        disabled={busy === 'order' || busy === 'confirming'}
                        onClick={() => {
                          setPaymentProviderId(method.providerId);
                          setError('');
                        }}
                        className={cn(
                          'flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all disabled:cursor-not-allowed sm:p-5',
                          selected
                            ? 'border-primary bg-primary-tint/30 ring-primary/15 ring-2'
                            : 'border-line hover:border-line-strong',
                        )}
                      >
                        <span
                          className={cn(
                            'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
                            selected ? 'border-primary' : 'border-line-strong',
                          )}
                        >
                          {selected && (
                            <span className="bg-primary h-2.5 w-2.5 rounded-full" />
                          )}
                        </span>
                        <span
                          className={cn(
                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                            selected
                              ? 'bg-primary text-on-primary'
                              : 'bg-surface-soft text-fg',
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="text-fg flex flex-wrap items-center gap-2 text-sm font-semibold sm:text-base">
                            {copy?.title ?? method.label}
                            {copy?.tag && (
                              <span className="bg-success-tint text-success-text rounded-full px-2 py-0.5 text-[11px] font-semibold">
                                {copy.tag}
                              </span>
                            )}
                          </span>
                          <span className="text-fg-muted mt-0.5 block text-xs sm:text-sm">
                            {copy?.hint ?? ''}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {error && (
                <p
                  role="alert"
                  className="bg-danger-tint text-danger mt-5 rounded-xl px-4 py-3 text-sm"
                >
                  {error}
                </p>
              )}

              <Button
                size="lg"
                onClick={placeOrder}
                isLoading={busy === 'order' || busy === 'confirming'}
                disabled={busy !== null || paymentMethods.length === 0 || !deliveryDone}
                className="mt-5 h-13 w-full rounded-xl text-base"
              >
                {busy === 'confirming' ? (
                  'Confirming your payment…'
                ) : selectedMethod?.kind === 'cod' ? (
                  <>Place order · {formatPrice(cart.total.amount, cart.currencyCode)}</>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Pay {formatPrice(cart.total.amount, cart.currencyCode)} securely
                  </>
                )}
              </Button>
              <p className="text-fg-muted mt-3 flex items-center justify-center gap-1.5 text-center text-xs">
                {selectedMethod?.kind === 'cod' ? (
                  'Pay in cash or UPI when your order arrives.'
                ) : (
                  <>
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Secured by Razorpay. Your order is confirmed once payment is verified.
                  </>
                )}
              </p>
            </StepCard>
          </>
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
