import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for combining conditional CSS class names with Tailwind class merging.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
