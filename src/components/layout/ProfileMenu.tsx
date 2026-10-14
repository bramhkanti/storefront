'use client';

import * as React from 'react';
import Link from 'next/link';
import { User } from 'lucide-react';
import { useAuth } from '@/lib/store';

export function ProfileMenu(): React.JSX.Element {
  const { user, isAuthenticated } = useAuth();

  return (
    <Link
      href="/profile"
      aria-label={
        isAuthenticated && user
          ? `Profile for ${user.name}`
          : 'Account & Profile'
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
      <span className="sr-only">Profile</span>
    </Link>
  );
}
