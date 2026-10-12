/**
 * Internationalization (i18n) Configuration & Constants.
 *
 * Single source of truth for supported regional locales, fallback rules,
 * cookie identifiers, and modular namespaces.
 */

export const SUPPORTED_LOCALES = ['en', 'hi'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export const NAMESPACES = [
  'common',
  'navigation',
  'catalog',
  'product',
  'cart',
  'checkout',
  'policies',
] as const;
export type Namespace = (typeof NAMESPACES)[number];

export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';
export const LOCALE_HEADER_NAME = 'x-bramhkanti-locale';

export const LOCALE_METADATA: Record<
  Locale,
  {
    name: string;
    nativeName: string;
    bcp47: string;
    direction: 'ltr';
  }
> = {
  en: {
    name: 'English',
    nativeName: 'English',
    bcp47: 'en-IN',
    direction: 'ltr',
  },
  hi: {
    name: 'Hindi',
    nativeName: 'हिन्दी',
    bcp47: 'hi-IN',
    direction: 'ltr',
  },
};

/**
 * Validates if a string is a registered supported locale.
 */
export function isSupportedLocale(
  candidate: string | undefined | null,
): candidate is Locale {
  if (!candidate) return false;
  return (SUPPORTED_LOCALES as readonly string[]).includes(candidate);
}

/**
 * Resolves safe fallback locale when candidate is missing or invalid.
 */
export function resolveLocale(candidate: string | undefined | null): Locale {
  if (isSupportedLocale(candidate)) {
    return candidate;
  }
  return DEFAULT_LOCALE;
}

/**
 * Strips any registered locale prefix from a pathname.
 *
 * @example
 * getPathnameWithoutLocale('/') // '/'
 * getPathnameWithoutLocale('/hi') // '/'
 * getPathnameWithoutLocale('/hi/achar') // '/achar'
 * getPathnameWithoutLocale('/en/achar') // '/achar'
 * getPathnameWithoutLocale('/achar') // '/achar'
 */
export function getPathnameWithoutLocale(pathname: string): string {
  if (!pathname || pathname === '/') return '/';

  for (const loc of SUPPORTED_LOCALES) {
    if (pathname === `/${loc}`) {
      return '/';
    }
    if (pathname.startsWith(`/${loc}/`)) {
      const stripped = pathname.slice(loc.length + 1);
      return stripped.startsWith('/') ? stripped : `/${stripped}`;
    }
  }

  return pathname.startsWith('/') ? pathname : `/${pathname}`;
}

/**
 * Builds the localized destination path for a given target locale.
 *
 * @example
 * getLocalizedPath('/achar', 'hi') // '/hi/achar'
 * getLocalizedPath('/hi/achar', 'en') // '/achar'
 * getLocalizedPath('/', 'hi') // '/hi'
 * getLocalizedPath('/hi', 'en') // '/'
 */
export function getLocalizedPath(pathname: string, targetLocale: Locale): string {
  const cleanPath = getPathnameWithoutLocale(pathname);

  if (targetLocale === DEFAULT_LOCALE) {
    return cleanPath;
  }

  return cleanPath === '/' ? `/${targetLocale}` : `/${targetLocale}${cleanPath}`;
}
