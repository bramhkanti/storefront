import { Plus_Jakarta_Sans, Noto_Sans_Devanagari } from 'next/font/google';
import type { NextFontWithVariable } from 'next/dist/compiled/@next/font/dist/types';

/**
 * Standard system UI font fallback chain.
 */
export const SYSTEM_FALLBACK_FONTS = [
  'system-ui',
  '-apple-system',
  'BlinkMacSystemFont',
  'Segoe UI',
  'Roboto',
  'Oxygen',
  'Ubuntu',
  'Cantarell',
  'sans-serif',
];

/**
 * Latin Font: Plus Jakarta Sans (Variable Font)
 *
 * Subsets: 'latin', 'latin-ext'
 * CRITICAL: 'latin-ext' includes U+20B9 (₹ Indian Rupee sign in the currency symbols block).
 * This ensures Plus Jakarta Sans draws the ₹ glyph natively and prevents English pages
 * from ever downloading the Devanagari font file just for the price symbol.
 */
export const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
  preload: true,
  fallback: [
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'sans-serif',
  ],
  adjustFontFallback: true,
});

/**
 * Devanagari Font: Noto Sans Devanagari (Variable Font)
 * Preloaded variant for Hindi/Marathi routes (core language).
 */
export const notoSansDevanagariPreloaded = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  variable: '--font-noto-sans-devanagari',
  display: 'swap',
  preload: true,
  fallback: [
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'sans-serif',
  ],
  adjustFontFallback: true,
});

/**
 * Devanagari Font: Noto Sans Devanagari (Variable Font)
 * On-demand variant for non-Hindi routes (preload: false).
 * Loads purely on-demand via CSS unicode-range splitting when mixed Devanagari text appears.
 */
export const notoSansDevanagariOnDemand = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  variable: '--font-noto-sans-devanagari',
  display: 'swap',
  preload: false,
  fallback: [
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'sans-serif',
  ],
  adjustFontFallback: true,
});

export interface ScriptTypographyTokens {
  /** Unitless body line height (e.g. 1.5 for English, 1.65 for Indic scripts) */
  lineHeightBody: number;
  /** Unitless heading line height (e.g. 1.25 for English, 1.35 for Indic scripts) */
  lineHeightHeading: number;
  /** Optical size scaling percentage relative to base rem (e.g. 100% or 105%) */
  baseSizeRatio: string;
  /** Enforced letter-spacing (0 for Indic to protect Shirorekha headline continuity) */
  letterSpacing: string;
  /** Text transformation rule (none for Indic where uppercase does not exist) */
  textTransform: 'none' | 'uppercase' | 'capitalize';
  /** Prevent browser faux bold / faux italic synthesis */
  fontSynthesis: 'none' | 'weight' | 'style' | 'weight style';
}

export interface ScriptDeclaration {
  id: string;
  name: string;
  locales: readonly string[];
  fontVariable: string;
  preloadPolicy: 'core' | 'lazy';
  tokens: ScriptTypographyTokens;
  getFontInstance: (isLocaleActive: boolean) => NextFontWithVariable;
}

/**
 * Single declarative registry of supported language scripts across India.
 *
 * OPEN/CLOSED EXTENSIBILITY:
 * Adding a new script (e.g. Telugu, Tamil, Bengali, Kannada) requires:
 * 1. Defining the font instance using next/font/google
 * 2. Adding one entry to this SCRIPT_REGISTRY array
 *
 * ZERO changes are needed to existing storefront components, layout code, or routing!
 */
export const SCRIPT_REGISTRY: readonly ScriptDeclaration[] = [
  {
    id: 'latin',
    name: 'Latin',
    locales: ['en'],
    fontVariable: '--font-plus-jakarta-sans',
    preloadPolicy: 'core',
    tokens: {
      lineHeightBody: 1.5,
      lineHeightHeading: 1.25,
      baseSizeRatio: '100%',
      letterSpacing: 'normal',
      textTransform: 'none',
      fontSynthesis: 'none',
    },
    getFontInstance: () => plusJakartaSans,
  },
  {
    id: 'devanagari',
    name: 'Devanagari',
    locales: ['hi', 'mr', 'sa', 'bho'],
    fontVariable: '--font-noto-sans-devanagari',
    preloadPolicy: 'core',
    tokens: {
      lineHeightBody: 1.65,
      lineHeightHeading: 1.35,
      baseSizeRatio: '105%',
      letterSpacing: '0',
      textTransform: 'none',
      fontSynthesis: 'none',
    },
    getFontInstance: (isLocaleActive) =>
      isLocaleActive ? notoSansDevanagariPreloaded : notoSansDevanagariOnDemand,
  },
] as const;

/**
 * Resolves the active script declaration for a given locale string.
 * Defaults to 'latin' if the locale is not yet registered.
 */
export function getScriptForLocale(locale: string): ScriptDeclaration {
  const match = SCRIPT_REGISTRY.find((script) => script.locales.includes(locale));
  return match ?? SCRIPT_REGISTRY[0]!;
}

/**
 * Resolves all font class names that should attach to <html> for a given locale route.
 *
 * Latin is always included.
 * If the route is a registered script locale (e.g. Hindi 'hi'), its preloaded font instance
 * is attached so Next.js emits <link rel="preload" as="font"> in <head>.
 * For non-active scripts, on-demand font instances (preload: false) are attached,
 * ensuring zero premature font file downloads and zero CLS.
 */
export function getFontClassesForLocale(locale: string): string {
  const activeScript = getScriptForLocale(locale);

  const classes: string[] = [plusJakartaSans.variable];

  for (const script of SCRIPT_REGISTRY) {
    if (script.id === 'latin') continue;
    const isCurrentScript = script.id === activeScript.id;
    const fontInstance = script.getFontInstance(isCurrentScript);
    classes.push(fontInstance.variable);
  }

  return classes.join(' ');
}

/**
 * Composed CSS font-family stack matching Latin first, followed by each script font,
 * then system UI fallbacks.
 *
 * This provides seamless per-character font fallback across mixed English and Indic copy
 * (e.g. English product name inside Hindi copy) without requiring custom markup.
 */
export const FONT_SANS_STACK = [
  'var(--font-plus-jakarta-sans)',
  'var(--font-noto-sans-devanagari)',
  ...SYSTEM_FALLBACK_FONTS,
].join(', ');
