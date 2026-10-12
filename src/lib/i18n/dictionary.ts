import { cache } from 'react';
import commonEn from '@/locales/common/en.json';
import navigationEn from '@/locales/navigation/en.json';
import catalogEn from '@/locales/catalog/en.json';
import productEn from '@/locales/product/en.json';
import cartEn from '@/locales/cart/en.json';
import checkoutEn from '@/locales/checkout/en.json';
import policiesEn from '@/locales/policies/en.json';
import { DEFAULT_LOCALE, type Locale, type Namespace, resolveLocale } from './config';
import { getNestedValue, interpolate } from './interpolate';
import type {
  Dictionary,
  NamespaceDictionary,
  TranslationFn,
  TranslationParams,
} from './types';

/**
 * Static baseline English dictionary.
 * Serves as the canonical fallback whenever a localized string is missing.
 */
export const ENGLISH_DICTIONARY: Dictionary = {
  common: commonEn,
  navigation: navigationEn,
  catalog: catalogEn,
  product: productEn,
  cart: cartEn,
  checkout: checkoutEn,
  policies: policiesEn,
};

/**
 * Deep merges target translation with base English dictionary to ensure
 * zero missing keys at runtime even if regional translation is incomplete.
 */
function deepMerge<T extends Record<string, unknown>>(
  base: T,
  override: Record<string, unknown>,
): T {
  const result = { ...base };

  for (const key of Object.keys(override)) {
    const baseVal = base[key];
    const overrideVal = override[key];

    if (
      baseVal &&
      typeof baseVal === 'object' &&
      !Array.isArray(baseVal) &&
      overrideVal &&
      typeof overrideVal === 'object' &&
      !Array.isArray(overrideVal)
    ) {
      (result as Record<string, unknown>)[key] = deepMerge(
        baseVal as Record<string, unknown>,
        overrideVal as Record<string, unknown>,
      );
    } else if (overrideVal !== undefined && overrideVal !== '') {
      (result as Record<string, unknown>)[key] = overrideVal;
    }
  }

  return result;
}

/**
 * Dynamically loads a localized namespace dictionary with English fallback.
 * Loads feature module file: src/locales/[namespace]/[locale].json
 */
async function loadNamespaceDictionary<N extends Namespace>(
  locale: Locale,
  namespace: N,
): Promise<NamespaceDictionary<N>> {
  const safeLocale = resolveLocale(locale);

  if (safeLocale === DEFAULT_LOCALE) {
    return ENGLISH_DICTIONARY[namespace];
  }

  try {
    const moduleImport = await import(`@/locales/${namespace}/${safeLocale}.json`);
    const localizedData = (moduleImport.default ?? moduleImport) as Record<
      string,
      unknown
    >;
    return deepMerge(
      ENGLISH_DICTIONARY[namespace] as unknown as Record<string, unknown>,
      localizedData,
    ) as NamespaceDictionary<N>;
  } catch {
    // Regional translation file not yet created; safely return canonical English baseline
    return ENGLISH_DICTIONARY[namespace];
  }
}

/**
 * Cached getter for a specific namespace dictionary.
 * Safe to call multiple times within the same React Server Component render tree.
 */
export const getNamespaceDictionary = cache(
  async <N extends Namespace>(
    locale: Locale,
    namespace: N,
  ): Promise<NamespaceDictionary<N>> => {
    return loadNamespaceDictionary(locale, namespace);
  },
);

/**
 * Loads the complete application dictionary across all namespaces.
 */
export const getDictionary = cache(async (locale: Locale): Promise<Dictionary> => {
  const safeLocale = resolveLocale(locale);

  if (safeLocale === DEFAULT_LOCALE) {
    return ENGLISH_DICTIONARY;
  }

  const [common, navigation, catalog, product, cart, checkout, policies] =
    await Promise.all([
      getNamespaceDictionary(safeLocale, 'common'),
      getNamespaceDictionary(safeLocale, 'navigation'),
      getNamespaceDictionary(safeLocale, 'catalog'),
      getNamespaceDictionary(safeLocale, 'product'),
      getNamespaceDictionary(safeLocale, 'cart'),
      getNamespaceDictionary(safeLocale, 'checkout'),
      getNamespaceDictionary(safeLocale, 'policies'),
    ]);

  return {
    common,
    navigation,
    catalog,
    product,
    cart,
    checkout,
    policies,
  };
});

/**
 * Creates a typed translation function `t(keyPath, params)` for a namespace.
 *
 * @example
 * const t = await getTranslationFunction('en', 'cart');
 * t('cart.title'); // "Shopping Bag"
 * t('cart.freeShippingThreshold', { amount: '₹150' }); // "Add ₹150 more for Free Delivery!"
 */
export async function getTranslationFunction<N extends Namespace>(
  locale: Locale,
  namespace: N,
): Promise<{
  t: TranslationFn;
  dict: NamespaceDictionary<N>;
  locale: Locale;
}> {
  const dict = await getNamespaceDictionary(locale, namespace);

  const t: TranslationFn = (keyPath: string, params?: TranslationParams) => {
    const raw = getNestedValue(dict, keyPath);
    if (raw !== undefined) {
      return interpolate(raw, params);
    }

    // Fallback to English dictionary if key was missing in localized dict
    const englishFallback = getNestedValue(ENGLISH_DICTIONARY[namespace], keyPath);
    if (englishFallback !== undefined) {
      return interpolate(englishFallback, params);
    }

    // Final fallback: return keyPath for easy debugging
    return keyPath;
  };

  return { t, dict, locale };
}
