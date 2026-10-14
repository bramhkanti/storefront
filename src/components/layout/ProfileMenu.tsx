'use client';

import * as React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/store';

export function ProfileMenu(): React.JSX.Element {
  const { user, isAuthenticated } = useAuth();

  const displayInitial = isAuthenticated && user?.initials ? user.initials : 'A';

  return (
    <Link
      href="/profile"
      aria-label={
        isAuthenticated && user ? `Profile for ${user.name}` : 'Account & Profile'
      }
      className="text-heritage-charcoal hover:text-heritage-maroon focus-visible:outline-heritage-maroon relative inline-flex h-9 w-9 items-center justify-center rounded-full transition-transform hover:scale-105 focus-visible:outline-2"
    >
      <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white shadow-xs">
        {displayInitial}
        <span
          className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-neutral-900"
          aria-hidden="true"
        />
      </span>
      <span className="sr-only">Profile</span>
    </Link>
  );
}
