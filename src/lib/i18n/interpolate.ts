import type { TranslationParams } from './types';

/**
 * Ultra-fast, zero-dependency string interpolator.
 * Replaces `{key}` and `{{key}}` tokens with matching parameters.
 *
 * @example
 * interpolate("Hello {name}!", { name: "Aditya" }) // "Hello Aditya!"
 * interpolate("Add {{amount}} more", { amount: "₹150" }) // "Add ₹150 more"
 */
export function interpolate(template: string, params?: TranslationParams): string {
  if (!params || Object.keys(params).length === 0) {
    return template;
  }

  return template.replace(/\{{1,2}\s*([\w.]+)\s*\}{1,2}/g, (match, key: string) => {
    const value = params[key];
    if (value !== undefined && value !== null) {
      return String(value);
    }
    return match;
  });
}

/**
 * Safely resolves a dot-delimited key path from a nested dictionary object.
 *
 * @example
 * getNestedValue({ brand: { name: "Bramhkanti" } }, "brand.name") // "Bramhkanti"
 */
export function getNestedValue(source: unknown, keyPath: string): string | undefined {
  if (!source || typeof source !== 'object') {
    return undefined;
  }

  const parts = keyPath.split('.');
  let current: unknown = source;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }

  return typeof current === 'string' ? current : undefined;
}
