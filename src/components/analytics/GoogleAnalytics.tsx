'use client';

import Script from 'next/script';
import { publicEnv } from '@/lib/env.public';

/**
 * Consent-aware, lazy-loaded Google Analytics 4 integration.
 * Injected with strategy="afterInteractive" to preserve main-thread performance
 * and Core Web Vitals (INP / LCP).
 */
export function GoogleAnalytics() {
  const measurementId = publicEnv.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (!measurementId) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'analytics_storage': 'denied'
            });
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
