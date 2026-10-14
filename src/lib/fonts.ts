import { Anek_Latin, Anek_Devanagari } from 'next/font/google';

/**
 * Anek Superfamily Multi-Script Font Definitions.
 *
 * Meticulously engineered by Ek Type for Google Fonts with unified vertical metrics
 * across all major Indian scripts, ensuring seamless multi-language typography
 * without layout shifts (CLS 0) or baseline jumping.
 */

export const anekLatin = Anek_Latin({
  subsets: ['latin'],
  variable: '--font-anek-latin',
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
});

export const anekDevanagari = Anek_Devanagari({
  subsets: ['devanagari', 'latin'],
  variable: '--font-anek-devanagari',
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
});

export interface LocaleFontConfig {
  variable: string;
  variableName: string;
  fontName: string;
}

/**
 * Mapping of supported/future locale codes to respective Anek fonts.
 * Extensible for all 10 Indian scripts in the Anek superfamily:
 * - Anek Devanagari: Hindi (hi), Marathi (mr), Sanskrit (sa), Bhojpuri (bho)
 * - Anek Bangla: Bengali (bn), Assamese (as)
 * - Anek Gujarati: Gujarati (gu)
 * - Anek Gurmukhi: Punjabi (pa)
 * - Anek Kannada: Kannada (kn)
 * - Anek Malayalam: Malayalam (ml)
 * - Anek Odia: Odia (or)
 * - Anek Tamil: Tamil (ta)
 * - Anek Telugu: Telugu (te)
 * - Anek Latin: English (en)
 */
const LOCALE_FONT_MAP: Record<string, LocaleFontConfig> = {
  en: {
    variable: anekLatin.variable,
    variableName: '--font-anek-latin',
    fontName: 'Anek Latin',
  },
  hi: {
    variable: anekDevanagari.variable,
    variableName: '--font-anek-devanagari',
    fontName: 'Anek Devanagari',
  },
  mr: {
    variable: anekDevanagari.variable,
    variableName: '--font-anek-devanagari',
    fontName: 'Anek Devanagari',
  },
};

/**
 * Dynamically resolves the optimized font configuration for any active locale.
 * Falls back to Anek Latin if the locale is not yet registered.
 */
export function getFontForLocale(locale: string): LocaleFontConfig {
  return LOCALE_FONT_MAP[locale] || LOCALE_FONT_MAP['en']!;
}
