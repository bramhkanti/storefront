import Medusa from '@medusajs/js-sdk';

export interface MedusaClientConfig {
  baseUrl: string;
  publishableKey: string;
  timeoutMs?: number | undefined;
}

/**
 * Creates an instance of Medusa JS SDK.
 * Boundary rule: ONLY files inside src/lib/api/adapters/medusa/ are permitted to import Medusa SDK.
 */
export function createMedusaClient(config: MedusaClientConfig): Medusa {
  return new Medusa({
    baseUrl: config.baseUrl,
    publishableKey: config.publishableKey,
  });
}
