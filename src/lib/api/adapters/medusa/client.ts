import Medusa, { FetchError } from '@medusajs/js-sdk';
import { UpstreamError, UserFacingError } from '../../errors';

export interface MedusaClientConfig {
  baseUrl: string;
  publishableKey: string;
  /** Optional fixed region; discovered from the backend (INR region) when unset. */
  regionId?: string | undefined;
  timeoutMs?: number | undefined;
}

/**
 * Creates an instance of Medusa JS SDK.
 * Boundary rule: ONLY files inside src/lib/api/adapters/medusa/ are permitted to import Medusa SDK.
 *
 * The adapter is a process-wide singleton shared by every request, so the SDK
 * must never remember a customer token: `nostore` + explicit headers per call.
 */
export function createMedusaClient(config: MedusaClientConfig): Medusa {
  return new Medusa({
    baseUrl: config.baseUrl,
    publishableKey: config.publishableKey,
    auth: { type: 'jwt', jwtTokenStorageMethod: 'nostore' },
  });
}

export function bearer(token: string): { authorization: string } {
  return { authorization: `Bearer ${token}` };
}

/**
 * Converts an SDK error. 4xx messages from Medusa are written for end users
 * (wrong OTP, invalid promo code, out of stock), so they pass through;
 * anything else becomes a generic upstream error.
 */
export function toAppError(error: unknown, fallback: string): Error {
  if (error instanceof UserFacingError || error instanceof UpstreamError) {
    return error;
  }
  if (
    error instanceof FetchError &&
    error.status &&
    error.status >= 400 &&
    error.status < 500
  ) {
    return new UserFacingError(error.message || fallback, error.status, error);
  }
  return new UpstreamError(fallback, 502, error);
}
