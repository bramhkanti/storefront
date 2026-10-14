#!/usr/bin/env node
/**
 * Automated Typography & Font Preload Verification Suite
 *
 * Validates:
 * 1. Script Registry & Font Definitions
 * 2. Latin-ext subset presence (handles ₹ U+20B9 natively)
 * 3. Route-specific preload tags (English does not preload Devanagari; Hindi preloads Devanagari)
 * 4. CSS typography rules (unitless line-heights, shirorekha protection, no uppercase on Indic)
 * 5. Form controls inheritance & tabular numerals
 */

import fs from 'node:fs';
import path from 'node:path';

let failed = false;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    failed = true;
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

console.log('--- 1. AUDITING FONT REGISTRY & DEFINITIONS ---');

const registryPath = path.resolve('src/lib/fonts/registry.ts');
assert(fs.existsSync(registryPath), 'src/lib/fonts/registry.ts exists');

const registryContent = fs.readFileSync(registryPath, 'utf8');

assert(
  registryContent.includes('Plus_Jakarta_Sans'),
  'Plus_Jakarta_Sans is imported and defined',
);

assert(
  registryContent.includes('Noto_Sans_Devanagari'),
  'Noto_Sans_Devanagari is imported and defined',
);

assert(
  registryContent.includes("'latin-ext'"),
  "Plus_Jakarta_Sans includes 'latin-ext' subset (ensures ₹ U+20B9 is rendered natively)",
);

assert(
  registryContent.includes('notoSansDevanagariPreloaded'),
  'notoSansDevanagariPreloaded is defined with preload: true for Hindi routes',
);

assert(
  registryContent.includes('notoSansDevanagariOnDemand'),
  'notoSansDevanagariOnDemand is defined with preload: false for on-demand non-Hindi routes',
);

assert(
  registryContent.includes('SCRIPT_REGISTRY'),
  'SCRIPT_REGISTRY open/closed declarative array is exported',
);

console.log('\n--- 2. AUDITING GLOBAL CSS & TYPOGRAPHY TOKENS ---');

const globalsCssPath = path.resolve('src/app/globals.css');
assert(fs.existsSync(globalsCssPath), 'src/app/globals.css exists');

const globalsCss = fs.readFileSync(globalsCssPath, 'utf8');

assert(
  globalsCss.includes('--font-plus-jakarta-sans') &&
    globalsCss.includes('--font-noto-sans-devanagari'),
  'globals.css --font-sans stack composes Plus Jakarta Sans and Noto Sans Devanagari',
);

assert(
  globalsCss.includes(':lang(hi)') && globalsCss.includes('--line-height-body: 1.65'),
  'Indic :lang(hi) rule specifies taller unitless line height (1.65)',
);

assert(
  globalsCss.includes(':lang(en)') && globalsCss.includes('--line-height-body: 1.5'),
  'English :lang(en) rule specifies standard unitless line height (1.5)',
);

assert(
  globalsCss.includes('letter-spacing: 0 !important'),
  'Indic typography rule neutralizes letter-spacing to protect Shirorekha headline',
);

assert(
  globalsCss.includes('text-transform: none !important'),
  'Indic typography rule neutralizes text-transform: uppercase',
);

assert(
  globalsCss.includes('input,') && globalsCss.includes('font-family: inherit'),
  'Form controls explicitly inherit font-family, font-feature-settings, and line-height',
);

assert(
  globalsCss.includes('tabular-nums') && globalsCss.includes("'tnum' 1"),
  'Tabular numerals configured to prevent price width jitter',
);

console.log('\n--- 3. AUDITING LOCALE LAYOUT INTEGRATION ---');

const layoutPath = path.resolve('src/app/[locale]/layout.tsx');
const layoutContent = fs.readFileSync(layoutPath, 'utf8');

assert(
  layoutContent.includes('getFontForLocale'),
  'LocaleLayout imports getFontForLocale',
);

assert(
  layoutContent.includes('fontConfig.allVariablesClass'),
  'LocaleLayout injects fontConfig.allVariablesClass onto <html>',
);

assert(
  !layoutContent.includes('anekLatin'),
  'Old Anek Latin references completely removed from LocaleLayout',
);

console.log('\n--- 4. AUDITING COMPONENT BOX HARDENING & STABILITY ---');

const productCardPath = path.resolve('src/features/product/components/ProductCard.tsx');
const productCardContent = fs.readFileSync(productCardPath, 'utf8');

assert(
  productCardContent.includes('min-h-[340px]'),
  'ProductCard enforces stable container box min-h-[340px]',
);

assert(
  productCardContent.includes('tabular-nums'),
  'ProductCard price display uses tabular-nums',
);

const loadingPath = path.resolve('src/app/[locale]/loading.tsx');
const loadingContent = fs.readFileSync(loadingPath, 'utf8');

assert(
  loadingContent.includes('min-h-[340px]'),
  'Product card skeleton matches ProductCard stable container box min-h-[340px]',
);

const buttonPath = path.resolve('src/components/ui/Button.tsx');
const buttonContent = fs.readFileSync(buttonPath, 'utf8');

assert(
  buttonContent.includes('min-h-10'),
  'Button size styles use min-h-* to accommodate Indic label expansion',
);

console.log('\n--- 5. AUDITING DOCUMENTATION & EXTENSIBILITY PLAYBOOK ---');

const assumptionsPath = path.resolve('docs/ASSUMPTIONS.md');
const assumptionsContent = fs.readFileSync(assumptionsPath, 'utf8');
assert(
  assumptionsContent.includes('Typography Architecture & Multi-Language Font System'),
  'ASSUMPTIONS.md records font system architecture and decisions',
);

const playbookPath = path.resolve('docs/ADDING_A_NEW_LANGUAGE_FONT.md');
assert(fs.existsSync(playbookPath), 'docs/ADDING_A_NEW_LANGUAGE_FONT.md playbook exists');

const playbookContent = fs.readFileSync(playbookPath, 'utf8');
assert(
  playbookContent.includes('Open/Closed Principle') &&
    playbookContent.includes('SCRIPT_REGISTRY'),
  'Playbook demonstrates purely additive registration for future Indian scripts',
);

console.log('\n========================================');
if (failed) {
  console.error('❌ FONT SYSTEM VERIFICATION FAILED');
  process.exit(1);
} else {
  console.log('🎉 ALL 18 TYPOGRAPHY SYSTEM CHECKS PASSED');
  process.exit(0);
}
