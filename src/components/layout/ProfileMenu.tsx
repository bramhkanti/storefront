'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  User,
  LogIn,
  LogOut,
  Package,
  MapPin,
  MessageCircle,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth, useToast } from '@/lib/store';
import { SITE_CONFIG } from '@/content/site';

export function ProfileMenu(): React.JSX.Element {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement | null>(null);

  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const { addToast } = useToast();

  // Close dropdown on click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on Escape key
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleOpenAuth = () => {
    setIsOpen(false);
    openAuthModal();
  };

  const handleSignOut = () => {
    logout();
    setIsOpen(false);
    addToast({
      type: 'info',
      message: 'You have been signed out successfully.',
    });
  };

  return (
    <div ref={menuRef} className="relative">
      {/* Header Profile Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={
          isAuthenticated && user
            ? `Account menu for ${user.name}`
            : 'Account & Sign In menu'
        }
        className="text-heritage-charcoal hover:bg-heritage-cream-dark hover:text-heritage-maroon focus-visible:outline-heritage-maroon relative inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors focus-visible:outline-2"
      >
        {isAuthenticated && user ? (
          <span className="bg-heritage-maroon ring-heritage-border relative flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white ring-1">
            {user.initials}
            <span
              className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-1 ring-white"
              aria-hidden="true"
            />
          </span>
        ) : (
          <User className="h-5 w-5" aria-hidden="true" />
        )}
        <span className="sr-only">Account</span>
      </button>

      {/* Dropdown Card */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu-button"
          className="border-heritage-border bg-heritage-cream animate-in fade-in-0 zoom-in-95 absolute right-0 z-50 mt-2 w-72 origin-top-right rounded-xl border p-2 shadow-xl ring-1 ring-black/5"
        >
          {isAuthenticated && user ? (
            /* Authenticated Customer View */
            <div className="space-y-1">
              <div className="bg-heritage-cream-dark/60 border-heritage-border/60 rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <div className="bg-heritage-maroon flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-serif text-sm font-bold text-white">
                    {user.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-heritage-charcoal truncate text-sm font-semibold">
                      {user.name}
                    </p>
                    <p className="text-heritage-muted truncate text-xs">{user.phone}</p>
                  </div>
                </div>
                <div className="mt-2.5 flex items-center gap-1.5 rounded-sm bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-800">
                  <ShieldCheck
                    className="h-3.5 w-3.5 text-emerald-600"
                    aria-hidden="true"
                  />
                  <span>Verified Bramhkanti Customer</span>
                </div>
              </div>

              <div className="pt-1">
                <Link
                  href="/account/orders"
                  onClick={() => setIsOpen(false)}
                  className="text-heritage-charcoal hover:bg-heritage-cream-dark hover:text-heritage-maroon flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-medium transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <Package className="text-heritage-muted h-4 w-4" aria-hidden="true" />
                    <span>My Orders</span>
                  </span>
                  {user.orderCount ? (
                    <span className="bg-heritage-maroon-light text-heritage-maroon rounded-full px-2 py-0.5 text-[10px] font-semibold">
                      {user.orderCount} active
                    </span>
                  ) : (
                    <ChevronRight className="text-heritage-muted h-3.5 w-3.5" />
                  )}
                </Link>

                <Link
                  href="/account/addresses"
                  onClick={() => setIsOpen(false)}
                  className="text-heritage-charcoal hover:bg-heritage-cream-dark hover:text-heritage-maroon flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-medium transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <MapPin className="text-heritage-muted h-4 w-4" aria-hidden="true" />
                    <span>Saved Addresses</span>
                  </span>
                  <ChevronRight className="text-heritage-muted h-3.5 w-3.5" />
                </Link>

                <a
                  href={SITE_CONFIG.contact.whatsappMessageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="text-heritage-charcoal hover:bg-heritage-cream-dark hover:text-heritage-maroon flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-medium transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <MessageCircle
                      className="h-4 w-4 text-emerald-600"
                      aria-hidden="true"
                    />
                    <span>Customer Care (WhatsApp)</span>
                  </span>
                  <ChevronRight className="text-heritage-muted h-3.5 w-3.5" />
                </a>
              </div>

              <div className="border-heritage-border/80 border-t pt-1">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="text-heritage-maroon hover:bg-heritage-maroon-light flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-xs font-semibold transition-colors"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            /* Guest Customer View */
            <div className="space-y-3 p-2">
              <div className="space-y-1">
                <p className="text-heritage-charcoal font-serif text-sm font-bold">
                  Welcome to Bramhkanti
                </p>
                <p className="text-heritage-muted text-xs leading-relaxed">
                  Sign in to track orders, manage delivery addresses, and enjoy pure
                  heritage delicacies.
                </p>
              </div>

              <Button
                variant="primary"
                onClick={handleOpenAuth}
                className="w-full text-xs font-semibold shadow-xs"
              >
                <LogIn className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Sign In / Register</span>
              </Button>

              <div className="border-heritage-border/80 border-t pt-2">
                <a
                  href={SITE_CONFIG.contact.whatsappMessageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="text-heritage-muted hover:text-heritage-maroon flex items-center justify-between py-1 text-xs transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                    <span>WhatsApp Customer Help</span>
                  </span>
                  <ChevronRight className="h-3 w-3" />
                </a>

                <Link
                  href="/policies/contact"
                  onClick={() => setIsOpen(false)}
                  className="text-heritage-muted hover:text-heritage-maroon flex items-center justify-between py-1 text-xs transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
                    <span>Heritage Quality Guarantee</span>
                  </span>
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
