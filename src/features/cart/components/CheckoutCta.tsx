'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, LockKeyhole, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth, useCartUi } from '@/lib/store';
import { cn } from '@/lib/utils/cn';

export interface CheckoutCtaProps {
  disabled?: boolean | undefined;
  /** Called before navigating away (the drawer closes itself). */
  onNavigate?: (() => void) | undefined;
  className?: string | undefined;
  /** Reopen the bag drawer after login (true inside the drawer). */
  reopenBag?: boolean | undefined;
}

/** Masks a phone as "+91 98•••••210" for the "logged in as" line. */
function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '').slice(-10);
  if (digits.length !== 10) return phone;
  return `+91 ${digits.slice(0, 2)}•••••${digits.slice(7)}`;
}

/**
 * Checkout needs a logged-in shopper. Guests see a login button; after the OTP
 * login the bag reopens and this turns into the checkout button.
 */
export function CheckoutCta({
  disabled,
  onNavigate,
  className,
  reopenBag = true,
}: CheckoutCtaProps) {
  const { user, isAuthenticated, isSessionLoaded, openAuthModal, openAuthModalFor } =
    useAuth();
  const { closeCart } = useCartUi();

  if (!isSessionLoaded) {
    return (
      <div
        className={cn(
          'h-12 w-full animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800',
          className,
        )}
        aria-hidden="true"
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={cn('space-y-2.5', className)}>
        <Button
          size="lg"
          className="w-full rounded-xl"
          disabled={disabled}
          onClick={() => {
            if (!reopenBag) {
              openAuthModal();
              return;
            }
            // The login dialog can't sit on top of the drawer; it reopens after login.
            closeCart();
            openAuthModalFor('checkout');
          }}
        >
          <Smartphone className="h-4 w-4" />
          Log in to checkout
        </Button>
        <p className="text-heritage-muted flex items-center justify-center gap-1.5 text-center text-xs">
          <LockKeyhole className="h-3 w-3" />
          Quick OTP login on your mobile. Your bag stays saved.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-2.5', className)}>
      <Link
        href="/checkout"
        onClick={() => onNavigate?.()}
        aria-disabled={disabled}
        className={cn('block', disabled && 'pointer-events-none')}
      >
        <Button size="lg" className="w-full rounded-xl" disabled={disabled}>
          Checkout
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
      {user?.phone && (
        <p className="text-heritage-muted text-center text-xs">
          Logged in as{' '}
          <span className="font-medium text-neutral-700 tabular-nums dark:text-neutral-300">
            {maskPhone(user.phone)}
          </span>
        </p>
      )}
    </div>
  );
}
