import type common from '@/locales/common/en.json';
import type navigation from '@/locales/navigation/en.json';
import type catalog from '@/locales/catalog/en.json';
import type product from '@/locales/product/en.json';
import type cart from '@/locales/cart/en.json';
import type checkout from '@/locales/checkout/en.json';
import type policies from '@/locales/policies/en.json';
import type { Namespace } from './config';

/**
 * Full application dictionary schema inferred directly from the English source of truth.
 */
export interface Dictionary {
  common: typeof common;
  navigation: typeof navigation;
  catalog: typeof catalog;
  product: typeof product;
  cart: typeof cart;
  checkout: typeof checkout;
  policies: typeof policies;
}

/**
 * Specific namespace dictionary type.
 */
export type NamespaceDictionary<N extends Namespace> = Dictionary[N];

/**
 * Translation parameter map for dynamic string interpolation.
 */
export type TranslationParams = Record<string, string | number>;

/**
 * DeepPartial type used for non-English dictionaries to allow safe progressive translations
 * with guaranteed English fallback.
 */
export type DeepPartial<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T extends object
      ? { [P in keyof T]?: DeepPartial<T[P]> }
      : T;

/**
 * Translation function contract.
 */
export type TranslationFn = (keyPath: string, params?: TranslationParams) => string;
