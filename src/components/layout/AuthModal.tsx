'use client';

import * as React from 'react';
import { ArrowLeft, ShieldCheck, Smartphone } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import {
  completeRegistrationAction,
  requestOtpAction,
  verifyOtpAction,
} from '@/lib/auth/actions';
import type { UserProfile } from '@/lib/auth/profile';
import { useCart } from '@/lib/cart';
import { useAuth, useCartUi, useToast, useWishlist } from '@/lib/store';
import { cn } from '@/lib/utils/cn';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

type Step = 'phone' | 'otp' | 'name';

function OtpInput({
  value,
  onChange,
  disabled,
  hasError,
}: {
  value: string;
  onChange: (next: string) => void;
  disabled: boolean;
  hasError: boolean;
}) {
  const refs = React.useRef<Array<HTMLInputElement | null>>([]);

  const setDigit = (index: number, digit: string) => {
    const chars = value.padEnd(OTP_LENGTH, ' ').split('');
    chars[index] = digit || ' ';
    onChange(chars.join('').replace(/\s+$/, ''));
  };

  return (
    <div
      className="flex justify-between gap-2"
      role="group"
      aria-label="One-time password"
    >
      {Array.from({ length: OTP_LENGTH }, (_, index) => (
        <input
          key={index}
          ref={(el) => {
            refs.current[index] = el;
          }}
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={OTP_LENGTH}
          aria-label={`Digit ${index + 1}`}
          disabled={disabled}
          value={value[index]?.trim() ?? ''}
          autoFocus={index === 0}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, '');
            if (digits.length > 1) {
              // Paste or SMS autofill of the whole code.
              onChange(digits.slice(0, OTP_LENGTH));
              refs.current[Math.min(digits.length, OTP_LENGTH) - 1]?.focus();
              return;
            }
            setDigit(index, digits);
            if (digits && index < OTP_LENGTH - 1) refs.current[index + 1]?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && !value[index]?.trim() && index > 0) {
              refs.current[index - 1]?.focus();
            }
          }}
          className={cn(
            'focus:border-heritage-maroon focus:ring-heritage-maroon/15 h-13 w-full min-w-0 rounded-xl border bg-white text-center text-xl font-semibold tabular-nums transition-colors outline-none focus:ring-2 dark:bg-neutral-900',
            hasError ? 'border-red-400' : 'border-heritage-border',
          )}
        />
      ))}
    </div>
  );
}

export function AuthModal(): React.JSX.Element {
  const { isAuthModalOpen, closeAuthModal, login, authIntent, clearAuthIntent } =
    useAuth();
  const { openCart } = useCartUi();
  const { refreshCart } = useCart();
  const { addToast } = useToast();
  const {
    pendingWishlistProduct,
    addToWishlist,
    setPendingWishlistProduct,
    loadWishlistForUser,
  } = useWishlist();

  const [step, setStep] = React.useState<Step>('phone');
  const [phone, setPhone] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [resendIn, setResendIn] = React.useState(0);

  React.useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  const reset = () => {
    setStep('phone');
    setOtp('');
    setFullName('');
    setError('');
    setIsSubmitting(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeAuthModal();
      clearAuthIntent();
      setPendingWishlistProduct(null);
      reset();
    }
  };

  const finishLogin = async (user: UserProfile, isNew: boolean) => {
    login(user);
    loadWishlistForUser(user.id);
    await refreshCart();
    // Logged in from the bag: take the shopper straight back to it.
    if (authIntent === 'checkout') {
      clearAuthIntent();
      openCart();
    }
    if (pendingWishlistProduct) {
      addToWishlist(pendingWishlistProduct);
      setPendingWishlistProduct(null);
      addToast({
        type: 'success',
        message: `Saved "${pendingWishlistProduct.title}" to your wishlist`,
      });
    } else {
      const firstName = user.firstName || 'there';
      addToast({
        type: 'success',
        message: isNew
          ? `Welcome to Bramhkanti, ${firstName}!`
          : `Welcome back, ${firstName}!`,
      });
    }
    reset();
  };

  const sendOtp = async () => {
    setError('');
    setIsSubmitting(true);
    const result = await requestOtpAction(phone);
    setIsSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return false;
    }
    setResendIn(RESEND_SECONDS);
    return true;
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }
    if (await sendOtp()) {
      setOtp('');
      setStep('otp');
    }
  };

  const verify = async (code: string) => {
    if (code.length !== OTP_LENGTH) {
      setError('Enter the 6-digit code');
      return;
    }
    setError('');
    setIsSubmitting(true);
    const result = await verifyOtpAction(phone, code);
    if (!result.ok) {
      setIsSubmitting(false);
      setError(result.error);
      setOtp('');
      return;
    }
    if (result.data.status === 'needs_profile') {
      setIsSubmitting(false);
      setStep('name');
      return;
    }
    await finishLogin(result.data.user, false);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void verify(otp);
  };

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    const result = await completeRegistrationAction(fullName.trim());
    if (!result.ok) {
      setIsSubmitting(false);
      setError(result.error);
      return;
    }
    await finishLogin(result.data, true);
  };

  const titles: Record<Step, { title: string; description: string }> = {
    phone: {
      title: 'Log in or sign up',
      description: pendingWishlistProduct
        ? `Verify your number to save "${pendingWishlistProduct.title}" to your wishlist.`
        : 'Track orders, save addresses and check out faster.',
    },
    otp: {
      title: 'Enter verification code',
      description: `We sent a 6-digit code to +91 ${phone.slice(0, 5)} ${phone.slice(5)}`,
    },
    name: {
      title: 'One last thing',
      description: 'What should we call you? This appears on your orders.',
    },
  };

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md p-6 sm:p-8">
        <DialogHeader className="text-left">
          <div className="bg-heritage-maroon-light text-heritage-maroon mb-3 flex h-11 w-11 items-center justify-center rounded-full">
            {step === 'phone' ? (
              <Smartphone className="h-5 w-5" aria-hidden="true" />
            ) : (
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            )}
          </div>
          <DialogTitle className="text-heritage-charcoal text-xl font-semibold tracking-tight dark:text-neutral-50">
            {titles[step].title}
          </DialogTitle>
          <DialogDescription className="text-heritage-muted text-sm">
            {titles[step].description}
          </DialogDescription>
        </DialogHeader>

        {step === 'phone' && (
          <form onSubmit={handlePhoneSubmit} className="mt-6 space-y-4" noValidate>
            <div>
              <label
                htmlFor="auth-phone"
                className="text-heritage-charcoal mb-1.5 block text-sm font-medium dark:text-neutral-200"
              >
                Mobile number
              </label>
              <div
                className={cn(
                  'focus-within:border-heritage-maroon focus-within:ring-heritage-maroon/15 flex h-12 overflow-hidden rounded-xl border bg-white focus-within:ring-2 dark:bg-neutral-900',
                  error ? 'border-red-400' : 'border-heritage-border',
                )}
              >
                <span className="text-heritage-muted border-heritage-border flex items-center border-r px-3.5 text-sm font-medium">
                  +91
                </span>
                <input
                  id="auth-phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  autoFocus
                  maxLength={10}
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value.replace(/\D/g, '').slice(0, 10));
                    setError('');
                  }}
                  placeholder="98765 43210"
                  className="text-heritage-charcoal w-full bg-transparent px-3.5 text-base tracking-wide outline-none dark:text-neutral-50"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'auth-error' : undefined}
                />
              </div>
            </div>

            {error && (
              <p id="auth-error" role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              isLoading={isSubmitting}
              className="w-full rounded-xl"
            >
              Get OTP
            </Button>
            <p className="text-heritage-muted text-center text-xs">
              By continuing you agree to our terms and privacy policy.
            </p>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="mt-6 space-y-4" noValidate>
            <OtpInput
              value={otp}
              onChange={(next) => {
                setOtp(next);
                setError('');
                // Verify as soon as the last digit is typed or pasted.
                if (next.length === OTP_LENGTH && !isSubmitting) void verify(next);
              }}
              disabled={isSubmitting}
              hasError={Boolean(error)}
            />

            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              isLoading={isSubmitting}
              className="w-full rounded-xl"
            >
              Verify and continue
            </Button>

            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => {
                  setStep('phone');
                  setError('');
                }}
                className="text-heritage-muted hover:text-heritage-charcoal inline-flex items-center gap-1"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Change number
              </button>
              <button
                type="button"
                disabled={resendIn > 0 || isSubmitting}
                onClick={async () => {
                  if (await sendOtp()) {
                    setOtp('');
                    addToast({ type: 'info', message: 'A new code is on its way' });
                  }
                }}
                className="text-heritage-maroon disabled:text-heritage-muted font-medium disabled:font-normal"
              >
                {resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend code'}
              </button>
            </div>
          </form>
        )}

        {step === 'name' && (
          <form onSubmit={handleNameSubmit} className="mt-6 space-y-4" noValidate>
            <div>
              <label
                htmlFor="auth-name"
                className="text-heritage-charcoal mb-1.5 block text-sm font-medium dark:text-neutral-200"
              >
                Full name
              </label>
              <input
                id="auth-name"
                autoFocus
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Asha Verma"
                className="border-heritage-border text-heritage-charcoal focus:border-heritage-maroon focus:ring-heritage-maroon/15 h-12 w-full rounded-xl border bg-white px-3.5 text-base outline-none focus:ring-2 dark:bg-neutral-900 dark:text-neutral-50"
              />
            </div>
            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}
            <Button
              type="submit"
              size="lg"
              isLoading={isSubmitting}
              className="w-full rounded-xl"
            >
              {fullName.trim() ? 'Create account' : 'Skip for now'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
