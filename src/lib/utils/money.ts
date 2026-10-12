/**
 * Pure money utilities operating strictly on integer minor units (paise in INR).
 * No floating point arithmetic is used for prices.
 */

export interface FormattedPriceOptions {
  /** If true, omits ".00" for whole rupee amounts (e.g. ₹350 instead of ₹350.00). Defaults to true. */
  trimTrailingZeroes?: boolean;
}

/**
 * Formats an amount in minor units (e.g. 35000 paise = ₹350) according to locale and currency.
 */
export function formatPrice(
  amountMinor: number,
  currencyCode = 'INR',
  locale = 'en-IN',
  options: FormattedPriceOptions = {},
): string {
  const { trimTrailingZeroes = true } = options;

  if (!Number.isFinite(amountMinor)) {
    return '₹0';
  }

  const major = amountMinor / 100;

  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: trimTrailingZeroes && amountMinor % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(major);
}

/**
 * Computes discount percentage as an integer (e.g., 20 for 20% off).
 */
export function calculateDiscountPercent(
  originalPriceMinor: number,
  currentPriceMinor: number,
): number {
  if (originalPriceMinor <= 0 || currentPriceMinor >= originalPriceMinor) {
    return 0;
  }
  const diff = originalPriceMinor - currentPriceMinor;
  return Math.round((diff / originalPriceMinor) * 100);
}
