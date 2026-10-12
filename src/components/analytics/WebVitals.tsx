'use client';

import { useReportWebVitals } from 'next/web-vitals';

/**
 * Client component monitoring real-user Core Web Vitals (CWV).
 * Tracks: LCP (Largest Contentful Paint), INP (Interaction to Next Paint),
 * CLS (Cumulative Layout Shift), FCP (First Contentful Paint), TTFB (Time to First Byte).
 */
export function WebVitals() {
  useReportWebVitals((metric) => {
    // Send to Google Analytics if available
    if (typeof window !== 'undefined' && 'gtag' in window) {
      const gtag = (window as unknown as { gtag: (...args: unknown[]) => void }).gtag;
      gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_label: metric.id,
        non_interaction: true,
      });
    }
  });

  return null;
}
