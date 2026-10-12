'use client';

import * as React from 'react';
import { DEFAULT_LOCALE, type Locale, type Namespace } from './config';
import { getNestedValue, interpolate } from './interpolate';
import type {
  Dictionary,
  NamespaceDictionary,
  TranslationFn,
  TranslationParams,
} from './types';

interface I18nContextValue {
  locale: Locale;
  dictionaries: Partial<Dictionary>;
}

const I18nContext = React.createContext<I18nContextValue | null>(null);

export interface I18nProviderProps {
  locale?: Locale;
  dictionaries?: Partial<Dictionary>;
  children: React.ReactNode;
}

/**
 * Lightweight Client Component Context Provider for localized UI text.
 * Ships only the active locale and specifically requested namespace dictionaries,
 * preventing any client bundle bloat.
 */
export function I18nProvider({
  locale = DEFAULT_LOCALE,
  dictionaries = {},
  children,
}: I18nProviderProps) {
  const value = React.useMemo<I18nContextValue>(
    () => ({
      locale,
      dictionaries,
    }),
    [locale, dictionaries],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/**
 * Hook to access typed translation helper within Client Components.
 *
 * @example
 * const { t, dict } = useTranslation('cart');
 * t('cart.title'); // "Shopping Bag"
 * t('cart.freeShippingThreshold', { amount: '₹150' });
 */
export function useTranslation<N extends Namespace>(
  namespace: N,
): {
  t: TranslationFn;
  dict: Partial<NamespaceDictionary<N>>;
  locale: Locale;
} {
  const context = React.useContext(I18nContext);
  const locale = context?.locale ?? DEFAULT_LOCALE;
  const dict = React.useMemo<Partial<NamespaceDictionary<N>>>(
    () => (context?.dictionaries[namespace] ?? {}) as Partial<NamespaceDictionary<N>>,
    [context?.dictionaries, namespace],
  );

  const t: TranslationFn = React.useCallback(
    (keyPath: string, params?: TranslationParams) => {
      const raw = getNestedValue(dict, keyPath);
      if (raw !== undefined) {
        return interpolate(raw, params);
      }
      return keyPath;
    },
    [dict],
  );

  return { t, dict, locale };
}
