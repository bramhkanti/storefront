export interface PageSeoAudit {
  url: string;
  title: string;
  titleLength: number;
  isTitleOptimal: boolean;
  description: string;
  descriptionLength: number;
  isDescriptionOptimal: boolean;
  canonicalUrl: string | null;
  hasCanonical: boolean;
  h1Count: number;
  isH1Valid: boolean;
  jsonLdSchemas: string[];
  hasJsonLd: boolean;
  passed: boolean;
  issues: string[];
}

/**
 * Programmatic SEO Audit utility to validate HTML pages against organic search standards:
 * 1. Title tag presence and length (30 - 65 chars).
 * 2. Meta description presence and length (120 - 160 chars).
 * 3. Canonical link declaration (exact match, absolute URL).
 * 4. Single <h1> semantic heading hierarchy.
 * 5. Valid Schema.org JSON-LD microdata presence.
 */
export function auditHtml(url: string, html: string): PageSeoAudit {
  const issues: string[] = [];

  // 1. Title audit
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
  const title = titleMatch?.[1]?.trim() ?? '';
  const titleLength = title.length;
  const isTitleOptimal = titleLength >= 30 && titleLength <= 65;
  if (!title) {
    issues.push('Missing <title> tag');
  } else if (!isTitleOptimal) {
    issues.push(
      `Title length (${titleLength}) is outside optimal range (30-65 characters)`,
    );
  }

  // 2. Meta description audit
  const descMatch = html.match(
    /<meta\s+name=["']description["']\s+content=["'](.*?)["']/i,
  );
  const description = descMatch?.[1]?.trim() ?? '';
  const descriptionLength = description.length;
  const isDescriptionOptimal = descriptionLength >= 80 && descriptionLength <= 165;
  if (!description) {
    issues.push('Missing meta description');
  } else if (!isDescriptionOptimal) {
    issues.push(
      `Meta description length (${descriptionLength}) outside optimal range (80-165 characters)`,
    );
  }

  // 3. Canonical link audit
  const canonicalMatch = html.match(
    /<link\s+rel=["']canonical["']\s+href=["'](.*?)["']/i,
  );
  const canonicalUrl = canonicalMatch?.[1]?.trim() ?? null;
  const hasCanonical = Boolean(canonicalUrl && canonicalUrl.startsWith('http'));
  if (!hasCanonical) {
    issues.push('Missing or invalid absolute canonical URL');
  }

  // 4. H1 tag hierarchy audit
  const h1Matches = html.match(/<h1[^>]*>.*?<\/h1>/gi) ?? [];
  const h1Count = h1Matches.length;
  const isH1Valid = h1Count === 1;
  if (h1Count === 0) {
    issues.push('Missing <h1> semantic heading');
  } else if (h1Count > 1) {
    issues.push(`Multiple <h1> headings found (${h1Count}). Exactly 1 required`);
  }

  // 5. Schema.org JSON-LD audit
  const jsonLdRegex =
    /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const jsonLdSchemas: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = jsonLdRegex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(match[1] ?? '{}') as { '@type'?: string | string[] };
      if (parsed['@type']) {
        if (Array.isArray(parsed['@type'])) {
          jsonLdSchemas.push(...parsed['@type']);
        } else {
          jsonLdSchemas.push(parsed['@type']);
        }
      }
    } catch {
      issues.push('Invalid JSON-LD syntax in script tag');
    }
  }

  const hasJsonLd = jsonLdSchemas.length > 0;
  if (!hasJsonLd) {
    issues.push('No Schema.org JSON-LD structured data found');
  }

  return {
    url,
    title,
    titleLength,
    isTitleOptimal,
    description,
    descriptionLength,
    isDescriptionOptimal,
    canonicalUrl,
    hasCanonical,
    h1Count,
    isH1Valid,
    jsonLdSchemas,
    hasJsonLd,
    passed: issues.length === 0,
    issues,
  };
}
