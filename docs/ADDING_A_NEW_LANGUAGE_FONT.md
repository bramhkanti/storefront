# Playbook: Adding a New Language Font

This playbook guides engineers on how to add a new regional script font to the Bramhkanti storefront (such as Telugu, Marathi, Tamil, Kannada, Malayalam, Bengali, Gujarati, Punjabi, or Odia).

The typography system is architected around the **Open/Closed Principle**:
Adding a new language script is purely additive. You only need to define the font and register its metadata in **one single place** (`src/lib/fonts/registry.ts`). **Zero changes** to existing components, layouts, or CSS are required.

---

## Architecture Overview

```
                      +-----------------------------+
                      |   src/lib/fonts/registry.ts |
                      |    (SCRIPT_REGISTRY Entry)   |
                      +--------------+--------------+
                                     |
               +---------------------+---------------------+
               |                                           |
               v                                           v
    +----------------------+                    +--------------------+
    |   getFontClasses()   |                    |   FONT_SANS_STACK  |
    | (Injected onto <html>|                    | (Global Fallback)  |
    +----------------------+                    +--------------------+
               |                                           |
               +---------------------+---------------------+
                                     |
                                     v
                       Unified Per-Character Fallback
                       (English + Indic Mixed Copy)
```

---

## Step-by-Step Instructions (Example: Adding Telugu `te`)

### Step 1: Define the Google Font Instance

Open `src/lib/fonts/registry.ts`.
Import `Noto_Sans_Telugu` from `next/font/google`:

```ts
import {
  Plus_Jakarta_Sans,
  Noto_Sans_Devanagari,
  Noto_Sans_Telugu, // <-- Add font import
} from 'next/font/google';
```

Define the preloaded (for core locale) and on-demand font instances (Note: Next.js Turbopack requires font loader options to be explicitly written literals, so `fallback` must be an inline array literal):

```ts
/**
 * Telugu Font: Noto Sans Telugu (Variable Font)
 */
export const notoSansTeluguPreloaded = Noto_Sans_Telugu({
  subsets: ['telugu'],
  variable: '--font-noto-sans-telugu',
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

export const notoSansTeluguOnDemand = Noto_Sans_Telugu({
  subsets: ['telugu'],
  variable: '--font-noto-sans-telugu',
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
```

### Step 2: Add Entry to `SCRIPT_REGISTRY`

In the same file (`src/lib/fonts/registry.ts`), append an entry to `SCRIPT_REGISTRY`:

```ts
export const SCRIPT_REGISTRY: readonly ScriptDeclaration[] = [
  // ... existing scripts (Latin, Devanagari)

  {
    id: 'telugu',
    name: 'Telugu',
    locales: ['te'],
    fontVariable: '--font-noto-sans-telugu',
    preloadPolicy: 'core', // 'core' if Telugu is primary market, 'lazy' otherwise
    tokens: {
      lineHeightBody: 1.65,
      lineHeightHeading: 1.35,
      baseSizeRatio: '105%',
      letterSpacing: '0',
      textTransform: 'none',
      fontSynthesis: 'none',
    },
    getFontInstance: (isLocaleActive) =>
      isLocaleActive ? notoSansTeluguPreloaded : notoSansTeluguOnDemand,
  },
];
```

Also add `var(--font-noto-sans-telugu)` to `FONT_SANS_STACK`:

```ts
export const FONT_SANS_STACK = [
  'var(--font-plus-jakarta-sans)',
  'var(--font-noto-sans-devanagari)',
  'var(--font-noto-sans-telugu)',
  ...SYSTEM_FALLBACK_FONTS,
].join(', ');
```

### Step 3: Register the Locale in `src/lib/i18n/config.ts`

Add `'te'` to `SUPPORTED_LOCALES` and its metadata:

```ts
export const SUPPORTED_LOCALES = ['en', 'hi', 'te'] as const;

export const LOCALE_METADATA = {
  // ... en, hi
  te: {
    name: 'Telugu',
    nativeName: 'తెలుగు',
    bcp47: 'te-IN',
    direction: 'ltr',
    script: 'Telugu',
    fontFamily: 'Noto Sans Telugu',
  },
};
```

---

## Verification Checklist

When adding a new script font, verify the following before committing:

- [ ] **Preload Audit**:
  - Run a build and inspect the HTML output for the new route (e.g. `/te`).
  - Confirm that `<link rel="preload" as="font">` tags appear for the new script on `/te`.
  - Confirm that on English routes (`/en` or `/`), the new script's font file is NOT preloaded and NOT downloaded if no Telugu characters are on the page.
- [ ] **CLS Measurement**:
  - Run Lighthouse CI (`pnpm lhci`).
  - Verify CLS remains `< 0.05` on the newly added locale route.
- [ ] **Shirorekha / Indic Integrity**:
  - Verify `letter-spacing: 0` is enforced.
  - Verify `text-transform: none` is active (no faux capitalization).
  - Verify `font-style: normal` (no slanted faux italics).
- [ ] **₹ (Rupee) Consistency**:
  - Verify that the `₹` sign next to numbers renders cleanly in Plus Jakarta Sans.
- [ ] **Typecheck & Lint**:
  - Run `pnpm typecheck` and `pnpm lint` to confirm 0 errors and 0 warnings.
