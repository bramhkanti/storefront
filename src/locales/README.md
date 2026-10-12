# Bramhkanti Internationalization (i18n) Architecture

This directory houses the localized dictionaries for the Bramhkanti storefront organized by **feature module**.

---

## 1. Directory Structure (Module-First)

```
src/locales/
├── common/               # Global brand attributes, certifications, shared actions
│   ├── en.json           # English baseline
│   └── hi.json           # Hindi translation
├── navigation/           # Header navigation, category links, customer care, footer
│   ├── en.json
│   └── hi.json
├── catalog/              # Faceted search filters, sort orders, spice levels, empty states
│   ├── en.json
│   └── hi.json
├── product/              # Pack selector, stock status, ingredients, allergen cards
│   ├── en.json
│   └── hi.json
├── cart/                 # Shopping bag, free delivery milestones, line item controls
│   ├── en.json
│   └── hi.json
├── checkout/             # Delivery address form, PIN code/mobile validation, COD/UPI
│   ├── en.json
│   └── hi.json
├── policies/             # Legal disclaimers, shipping promises, refund rules
│   ├── en.json
│   └── hi.json
└── README.md             # Architecture & developer guide
```

---

## 2. How to Add a New Language (e.g. Marathi `mr` or Gujarati `gu`)

Adding a new language takes less than 2 minutes with **zero architectural changes**:

### Step 1: Register the Locale

Open `src/lib/i18n/config.ts` and add the language code to `SUPPORTED_LOCALES` and `LOCALE_METADATA`:

```ts
export const SUPPORTED_LOCALES = ['en', 'hi', 'mr'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const LOCALE_METADATA: Record<Locale, LocaleMetadata> = {
  en: { name: 'English', nativeName: 'English', bcp47: 'en-IN', direction: 'ltr' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी', bcp47: 'hi-IN', direction: 'ltr' },
  mr: { name: 'Marathi', nativeName: 'मराठी', bcp47: 'mr-IN', direction: 'ltr' },
};
```

### Step 2: Add Regional Translation Files

Create `<locale>.json` inside any or all module folders:

- `src/locales/common/mr.json`
- `src/locales/cart/mr.json`
- `src/locales/product/mr.json`
  ...and so on.

---

## 3. Automatic English Fallback

You do **not** need to translate every module or string at once.
Any key missing in `hi` or `mr` will **automatically fall back to the English dictionary** at runtime via `deepMerge`.
UI components will never display `undefined` or crash.

---

## 4. How to Use Translations in Code

### In React Server Components (RSC — 0 KB Client JS)

```tsx
import { getTranslationFunction } from '@/lib/i18n';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = await getTranslationFunction(locale, 'product');

  return (
    <div>
      <h1>{t('details.selectPackSize')}</h1>
      <p>{t('details.deliveryEstimate')}</p>
    </div>
  );
}
```

### In Interactive Client Components

```tsx
'use client';

import { useTranslation } from '@/lib/i18n';

export function CartSummary() {
  const { t } = useTranslation('cart');

  return <button>{t('cart.proceedToCheckout')}</button>;
}
```

Preload client-required dictionaries server-side in `src/app/[locale]/layout.tsx` so client components hydrate instantaneously with zero network waterfalls.
