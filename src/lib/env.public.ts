/**
 * Client-safe environment (`NEXT_PUBLIC_*` only).
 *
 * Each variable is referenced literally so Next.js can inline it into client
 * bundles at build time. Never add a non-public variable here.
 */
import { parseEnv, publicEnvSchema, type PublicEnv } from './env.schema';

export const publicEnv: PublicEnv = parseEnv(
  publicEnvSchema,
  {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_BRAND_NAME: process.env.NEXT_PUBLIC_BRAND_NAME,
    NEXT_PUBLIC_DEFAULT_LOCALE: process.env.NEXT_PUBLIC_DEFAULT_LOCALE,
    NEXT_PUBLIC_DEFAULT_CURRENCY: process.env.NEXT_PUBLIC_DEFAULT_CURRENCY,
    NEXT_PUBLIC_SUPPORT_EMAIL: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
    NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
    NEXT_PUBLIC_FSSAI_LICENSE_NUMBER: process.env.NEXT_PUBLIC_FSSAI_LICENSE_NUMBER,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },
  'public',
);
