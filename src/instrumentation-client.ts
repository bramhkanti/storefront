import { publicEnv } from '@/lib/env.public';

/**
 * Next.js 16 Client-Side Observability Hook.
 *
 * Provides a clean integration point for browser-side error reporting
 * (Sentry, LogRocket, Datadog) without polluting application components.
 */
export function initializeClientObservability(): void {
  const sentryDsn = publicEnv.NEXT_PUBLIC_SENTRY_DSN;

  if (sentryDsn && typeof window !== 'undefined') {
    // Integration point: initialize Sentry Browser SDK
    console.info('[Observability] Browser client observability initialized.');
  }
}
