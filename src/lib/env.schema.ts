/**
 * Environment schemas (pure: no `process.env` access here).
 *
 * - `serverEnvSchema` describes server-only variables (secrets, upstream config).
 * - `publicEnvSchema` describes `NEXT_PUBLIC_*` variables that are safe to ship
 *   to the browser.
 *
 * Reading `process.env` is restricted (lint-enforced) to `env.ts` (server) and
 * `env.public.ts` (client-safe, literal `NEXT_PUBLIC_*` references so Next can
 * inline them at build time).
 */
import { z } from 'zod';

/** Treat empty strings as "unset" so `FOO=` in a .env file behaves like a missing var. */
const optionalString = z.preprocess(
  (value) => (value === '' ? undefined : value),
  z.string().min(1).optional(),
);

const optionalUrl = z.preprocess(
  (value) => (value === '' ? undefined : value),
  z.url().optional(),
);

export const API_ADAPTERS = ['mock', 'medusa'] as const;
export type ApiAdapterName = (typeof API_ADAPTERS)[number];

export const serverEnvSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    API_ADAPTER: z.enum(API_ADAPTERS).default('mock'),
    API_BASE_URL: optionalUrl,
    MEDUSA_PUBLISHABLE_KEY: optionalString,
    MEDUSA_REGION_ID: optionalString,
    API_TIMEOUT_MS: z.coerce.number().int().positive().max(60_000).default(8_000),
    API_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(2),
    /** Shared secret for POST /api/revalidate. Endpoint is disabled when unset. */
    REVALIDATE_SECRET: z.preprocess(
      (value) => (value === '' ? undefined : value),
      z.string().min(32, 'REVALIDATE_SECRET must be at least 32 characters').optional(),
    ),
    SENTRY_DSN: optionalUrl,
    BUILD_VERSION: optionalString,
  })
  .superRefine((env, ctx) => {
    if (env.API_ADAPTER !== 'medusa') return;
    if (!env.API_BASE_URL) {
      ctx.addIssue({
        code: 'custom',
        path: ['API_BASE_URL'],
        message: 'API_BASE_URL is required when API_ADAPTER=medusa',
      });
    }
    if (!env.MEDUSA_PUBLISHABLE_KEY) {
      ctx.addIssue({
        code: 'custom',
        path: ['MEDUSA_PUBLISHABLE_KEY'],
        message: 'MEDUSA_PUBLISHABLE_KEY is required when API_ADAPTER=medusa',
      });
    }
  });

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z
    .url()
    .default('https://bramhkanti.com')
    .transform((url) => url.replace(/\/+$/, '')),
  NEXT_PUBLIC_BRAND_NAME: z.string().min(1).default('Bramhkanti'),
  NEXT_PUBLIC_DEFAULT_LOCALE: z.string().min(2).default('en-IN'),
  NEXT_PUBLIC_DEFAULT_CURRENCY: z.string().length(3).default('INR'),
  NEXT_PUBLIC_SUPPORT_EMAIL: z.preprocess(
    (value) => (value === '' ? undefined : value),
    z.email().optional(),
  ),
  NEXT_PUBLIC_WHATSAPP_NUMBER: z.preprocess(
    (value) => (value === '' ? undefined : value),
    z
      .string()
      .regex(/^\d{10,15}$/, 'WhatsApp number must be digits only, incl. country code')
      .optional(),
  ),
  NEXT_PUBLIC_FSSAI_LICENSE_NUMBER: z.preprocess(
    (value) => (value === '' ? undefined : value),
    z
      .string()
      .regex(/^\d{14}$/, 'FSSAI license number must be 14 digits')
      .optional(),
  ),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.preprocess(
    (value) => (value === '' ? undefined : value),
    z
      .string()
      .regex(/^G-[A-Z0-9]+$/)
      .optional(),
  ),
  NEXT_PUBLIC_SENTRY_DSN: optionalUrl,
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;

/** Parses a raw env record, throwing a readable error listing every invalid key. */
export function parseEnv<TSchema extends z.ZodType>(
  schema: TSchema,
  source: Record<string, string | undefined>,
  label: string,
): z.infer<TSchema> {
  const result = schema.safeParse(source);
  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('\n');
    throw new Error(`Invalid ${label} environment variables:\n${details}`);
  }
  return result.data;
}
