'use client';

import * as React from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';

export interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  React.useEffect(() => {
    // Log upstream or unexpected render errors
    console.error('Unhandled route error:', error);
  }, [error]);

  return (
    <div className="py-20 text-center sm:py-32">
      <Container className="max-w-xl space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-800">
          <AlertTriangle className="h-8 w-8" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <div className="text-xs font-semibold tracking-wider text-rose-800 uppercase">
            Unexpected Condition
          </div>
          <h1 className="text-heritage-maroon font-serif text-3xl font-extrabold tracking-tight sm:text-4xl">
            Something Went Awry
          </h1>
          <p className="text-heritage-muted text-sm leading-relaxed">
            We encountered a temporary hiccup retrieving this culinary experience. Please
            try refreshing or return to the main showcase.
          </p>
          {error.digest && (
            <p className="text-heritage-muted font-mono text-[11px]">
              Reference code: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button onClick={reset} size="md" className="rounded-full">
            <RotateCcw className="h-4 w-4" />
            <span>Try Again</span>
          </Button>
          <Link href="/">
            <Button variant="secondary" size="md" className="rounded-full">
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
