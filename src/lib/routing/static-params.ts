/**
 * Next.js Cache Components require every `generateStaticParams` to return at
 * least one entry. A new or small catalog can legitimately have none (no
 * subcategories yet, no collections), so fall back to a placeholder the page
 * resolves to a 404.
 */
export function atLeastOne<T extends Record<string, string>>(
  params: T[],
  placeholder: T,
): T[] {
  return params.length > 0 ? params : [placeholder];
}

export const PLACEHOLDER_SLUG = '__none__';
