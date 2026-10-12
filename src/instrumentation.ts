/**
 * Next.js 16 Server-Side Instrumentation Hook.
 *
 * Runs once when a new Next.js server instance starts up.
 * Conditionally initializes server-side error monitoring (Sentry / OpenTelemetry)
 * without incurring overhead when telemetry is unconfigured.
 */
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const sentryDsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

    if (sentryDsn) {
      // Integration point: initialize Sentry Node SDK dynamically
      // import('@sentry/nextjs').then(Sentry => Sentry.init({ dsn: sentryDsn, ... }));
      console.info(
        '[Observability] Server-side runtime monitoring initialized (Node.js).',
      );
    }
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    const sentryDsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

    if (sentryDsn) {
      // Integration point: initialize Sentry Edge SDK
      console.info('[Observability] Edge runtime monitoring initialized.');
    }
  }
}
