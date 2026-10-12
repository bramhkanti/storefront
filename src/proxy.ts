import { NextResponse, type NextRequest } from 'next/server';
import { getRedirectReader } from '@/lib/api/container';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from '@/lib/i18n';

/**
 * Next.js 16 Network Boundary: proxy.ts
 *
 * Runs before requests complete to handle edge/server routing concerns:
 * 1. Apex Canonical Redirects (www.bramhkanti.com -> bramhkanti.com)
 * 2. Trailing Slash Normalization
 * 3. Database / Adapter Redirects (301 moved, 410 gone)
 * 4. Multi-Language Clean URL Routing (Rewrites un-prefixed English URLs to [locale] segment)
 * 5. Faceted Search Filter Crawler Headers (X-Robots-Tag: noindex, follow)
 * 6. Production Security Headers (CSP, HSTS, X-Frame-Options, etc.)
 */
export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname, search, searchParams } = request.nextUrl;
  const host = request.headers.get('host') ?? '';

  // 1. Apex Domain 301 Redirect: www -> non-www
  if (host.startsWith('www.')) {
    const apexHost = host.replace(/^www\./, '');
    const destination = new URL(`${pathname}${search}`, `https://${apexHost}`);
    return NextResponse.redirect(destination, 301);
  }

  // 2. Trailing Slash Normalization: /path/ -> /path (exclude root /)
  if (pathname !== '/' && pathname.endsWith('/')) {
    const cleanPath = pathname.replace(/\/+$/, '');
    const destination = new URL(`${cleanPath}${search}`, request.url);
    return NextResponse.redirect(destination, 301);
  }

  // 3. Status Code Routing via RedirectReader
  try {
    const redirectRule = await getRedirectReader().getRedirect(pathname);
    if (redirectRule) {
      if (redirectRule.statusCode === 301 || redirectRule.statusCode === 302) {
        const destination = new URL(redirectRule.toPath, request.url);
        return NextResponse.redirect(destination, redirectRule.statusCode);
      }
      if (redirectRule.statusCode === 410) {
        return new NextResponse(
          '410 Gone: This heritage food product has been permanently discontinued.',
          {
            status: 410,
            headers: {
              'Content-Type': 'text/plain; charset=utf-8',
              'X-Robots-Tag': 'noindex',
            },
          },
        );
      }
    }
  } catch (error) {
    // Fail-safe: if upstream redirect check fails, continue request without breaking
    console.error('Redirect lookup error in proxy:', error);
  }

  // 4. Multi-Language Route Resolution:
  // Non-storefront routes (API, sitemaps, robots.txt, internal chunks) bypass locale rewriting
  const isExcluded =
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname === '/robots.txt' ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/icon') ||
    pathname.startsWith('/sitemap');

  let activeLocale: Locale = DEFAULT_LOCALE;
  let response: NextResponse;

  if (isExcluded) {
    response = NextResponse.next();
  } else {
    const hasLocalePrefix = SUPPORTED_LOCALES.some(
      (loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`),
    );

    if (hasLocalePrefix) {
      // Direct access to /hi/* or /mr/* or /en/*
      const matchedLocale = SUPPORTED_LOCALES.find(
        (loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`),
      );
      if (matchedLocale) {
        activeLocale = matchedLocale;
      }
      response = NextResponse.next();
    } else {
      // Clean URL: un-prefixed English request (e.g. /achar -> internally rewrites to /en/achar)
      const rewriteDestination = new URL(
        `/${DEFAULT_LOCALE}${pathname === '/' ? '' : pathname}${search}`,
        request.url,
      );
      response = NextResponse.rewrite(rewriteDestination);
    }
  }

  // Set active locale header for downstream Server Components
  response.headers.set('x-bramhkanti-locale', activeLocale);

  // 5. Faceted Search Query Filter Headers: Prevent thin crawler duplicate indexing
  const hasFilterParams =
    searchParams.has('minPrice') ||
    searchParams.has('maxPrice') ||
    searchParams.has('priceRange') ||
    searchParams.has('spiceLevel') ||
    searchParams.has('inStockOnly') ||
    searchParams.has('sort') ||
    searchParams.has('tags') ||
    (searchParams.has('page') && searchParams.get('page') !== '1');

  if (hasFilterParams) {
    response.headers.set('X-Robots-Tag', 'noindex, follow');
  }

  // 6. Comprehensive Production Security Headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload',
  );

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "object-src 'none'",
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public asset extensions (svg, png, jpg, jpeg, gif, webp, ico)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
