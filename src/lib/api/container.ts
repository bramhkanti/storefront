import 'server-only';

import { serverEnv } from '@/lib/env';
import { MedusaAdapter } from './adapters/medusa';
import { MockAdapter } from './adapters/mock';
import type {
  CartService,
  CategoryReader,
  CollectionReader,
  ProductReader,
  RedirectReader,
  SearchService,
} from './contracts/readers';

/**
 * Dependency Inversion Principle: Composition Root.
 *
 * This module is the ONLY file in the entire codebase allowed to import and instantiate
 * concrete adapters (MockAdapter, MedusaAdapter). Features, layouts, and queries
 * consume small, role-based reader interfaces exported from contracts/readers.ts.
 */

interface ApiContainer {
  productReader: ProductReader;
  categoryReader: CategoryReader;
  collectionReader: CollectionReader;
  redirectReader: RedirectReader;
  searchService: SearchService;
  cartService: CartService;
}

let containerInstance: ApiContainer | null = null;

function createContainer(): ApiContainer {
  if (serverEnv.API_ADAPTER === 'medusa') {
    if (!serverEnv.API_BASE_URL || !serverEnv.MEDUSA_PUBLISHABLE_KEY) {
      throw new Error(
        'API_ADAPTER is set to "medusa" but API_BASE_URL or MEDUSA_PUBLISHABLE_KEY is missing.',
      );
    }

    const medusaAdapter = new MedusaAdapter({
      baseUrl: serverEnv.API_BASE_URL,
      publishableKey: serverEnv.MEDUSA_PUBLISHABLE_KEY,
      timeoutMs: serverEnv.API_TIMEOUT_MS,
    });

    return {
      productReader: medusaAdapter,
      categoryReader: medusaAdapter,
      collectionReader: medusaAdapter,
      redirectReader: medusaAdapter,
      searchService: medusaAdapter,
      cartService: medusaAdapter,
    };
  }

  // Default to MockAdapter (pure in-memory Indian food catalog fixtures)
  const mockAdapter = new MockAdapter();

  return {
    productReader: mockAdapter,
    categoryReader: mockAdapter,
    collectionReader: mockAdapter,
    redirectReader: mockAdapter,
    searchService: mockAdapter,
    cartService: mockAdapter,
  };
}

export function getContainer(): ApiContainer {
  if (!containerInstance) {
    containerInstance = createContainer();
  }
  return containerInstance;
}

// Role-based accessor functions (Interface Segregation Principle)
export function getProductReader(): ProductReader {
  return getContainer().productReader;
}

export function getCategoryReader(): CategoryReader {
  return getContainer().categoryReader;
}

export function getCollectionReader(): CollectionReader {
  return getContainer().collectionReader;
}

export function getRedirectReader(): RedirectReader {
  return getContainer().redirectReader;
}

export function getSearchService(): SearchService {
  return getContainer().searchService;
}

export function getCartService(): CartService {
  return getContainer().cartService;
}
