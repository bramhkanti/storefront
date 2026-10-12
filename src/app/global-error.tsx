'use client';

import * as React from 'react';
import { COLOR_TOKENS } from '@/lib/tokens';

export interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  React.useEffect(() => {
    console.error('Fatal unhandled error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body
        className="flex min-h-screen items-center justify-center p-6 text-center font-sans"
        style={{
          backgroundColor: COLOR_TOKENS.heritage.cream,
          color: COLOR_TOKENS.heritage.charcoal,
        }}
      >
        <div className="max-w-md space-y-4">
          <h1
            className="text-3xl font-bold"
            style={{ color: COLOR_TOKENS.primary.DEFAULT }}
          >
            Application Error
          </h1>
          <p className="text-sm" style={{ color: COLOR_TOKENS.heritage.muted }}>
            An unexpected error occurred in the storefront. Please try reloading the page.
          </p>
          {error.digest && (
            <p className="font-mono text-xs text-gray-500">
              Error Digest: {error.digest}
            </p>
          )}
          <div className="pt-2">
            <button
              type="button"
              onClick={reset}
              className="rounded-md px-4 py-2 text-sm font-semibold text-white shadow-xs transition-colors"
              style={{
                backgroundColor: COLOR_TOKENS.primary.DEFAULT,
              }}
            >
              Reload Application
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
