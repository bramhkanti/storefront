export * from './registry';

import {
  plusJakartaSans,
  notoSansDevanagariPreloaded,
  getScriptForLocale,
  getFontClassesForLocale,
} from './registry';

export interface LocaleFontConfig {
  variable: string;
  variableName: string;
  fontName: string;
  allVariablesClass: string;
}

/**
 * Resolves font configuration for a given locale.
 */
export function getFontForLocale(locale: string): LocaleFontConfig {
  const script = getScriptForLocale(locale);
  const isHindiScript = script.id === 'devanagari';
  const activeFont = isHindiScript ? notoSansDevanagariPreloaded : plusJakartaSans;

  return {
    variable: activeFont.variable,
    variableName: script.fontVariable,
    fontName: script.name,
    allVariablesClass: getFontClassesForLocale(locale),
  };
}
