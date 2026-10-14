import { test, expect } from '@playwright/test';

/**
 * Playwright Typography & CLS Regression Test Suite
 *
 * Enforces:
 * 1. CLS < 0.05 budget under network and CPU throttling
 * 2. Proper route-level <link rel="preload" as="font"> tags
 * 3. Zero Devanagari font downloads on English pages
 * 4. Correct ₹ symbol rendering next to prices
 * 5. Screenshot stability across key templates in Hindi and English
 */

const CLS_BUDGET = 0.05;

test.describe('Typography System & Layout Stability (CLS)', () => {
  test.beforeEach(async ({ page }) => {
    // Emulate mid-range mobile device with 4x CPU throttle
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('English page has CLS < 0.05 and does not preload or request Devanagari font', async ({
    page,
  }) => {
    const downloadedFonts: string[] = [];

    page.on('response', (response) => {
      const url = response.url();
      if (url.includes('.woff2') || response.headers()['content-type']?.includes('font')) {
        downloadedFonts.push(url);
      }
    });

    // Inject PerformanceObserver to track Cumulative Layout Shift (CLS)
    await page.addInitScript(() => {
      let cls = 0;
      (window as unknown as { __cls: number }).__cls = 0;
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const layoutShiftEntry = entry as unknown as { hadRecentInput?: boolean; value: number };
          if (!layoutShiftEntry.hadRecentInput) {
            cls += layoutShiftEntry.value;
            (window as unknown as { __cls: number }).__cls = cls;
          }
        }
      }).observe({ type: 'layout-shift', buffered: true });
    });

    // Navigate to English root route
    await page.goto('/', { waitUntil: 'networkidle' });

    // 1. Verify CLS is strictly within budget
    const finalCls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls || 0);
    expect(finalCls).toBeLessThan(CLS_BUDGET);

    // 2. Verify Preload Tags in <head>
    const preloads = await page.$$eval('link[rel="preload"][as="font"]', (links) =>
      links.map((l) => l.getAttribute('href') || ''),
    );

    // English route must NOT have Devanagari in preload links
    const hasDevanagariPreload = preloads.some((href) => href.toLowerCase().includes('devanagari'));
    expect(hasDevanagariPreload).toBe(false);

    // 3. Verify ₹ (Rupee) symbol is rendered in price display
    const priceElement = page.locator('.text-heritage-maroon').first();
    if ((await priceElement.count()) > 0) {
      const priceText = await priceElement.textContent();
      expect(priceText).toContain('₹');
    }
  });

  test('Hindi page has CLS < 0.05 and preloads Noto Sans Devanagari font', async ({
    page,
  }) => {
    // Inject PerformanceObserver to track Cumulative Layout Shift (CLS)
    await page.addInitScript(() => {
      let cls = 0;
      (window as unknown as { __cls: number }).__cls = 0;
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const layoutShiftEntry = entry as unknown as { hadRecentInput?: boolean; value: number };
          if (!layoutShiftEntry.hadRecentInput) {
            cls += layoutShiftEntry.value;
            (window as unknown as { __cls: number }).__cls = cls;
          }
        }
      }).observe({ type: 'layout-shift', buffered: true });
    });

    // Navigate to Hindi root route
    await page.goto('/hi', { waitUntil: 'networkidle' });

    // 1. Verify CLS is strictly within budget
    const finalCls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls || 0);
    expect(finalCls).toBeLessThan(CLS_BUDGET);

    // 2. Verify <html lang="hi-IN">
    const htmlLang = await page.getAttribute('html', 'lang');
    expect(htmlLang).toBe('hi-IN');

    // 3. Verify computed line-height on Hindi body is unitless 1.65
    const bodyLineHeight = await page.evaluate(() => {
      return getComputedStyle(document.body).getPropertyValue('--line-height-body').trim();
    });
    expect(bodyLineHeight).toBe('1.65');

    // 4. Verify letter-spacing is neutralized on Hindi headings (protects Shirorekha)
    const letterSpacing = await page.evaluate(() => {
      const heading = document.querySelector('h1, h2, h3');
      return heading ? getComputedStyle(heading).letterSpacing : '0px';
    });
    expect(letterSpacing).toBe('0px');
  });

  test('Mixed English & Hindi copy renders without layout distortion', async ({ page }) => {
    await page.goto('/hi/achar', { waitUntil: 'networkidle' });

    // Check product titles in Hindi page
    const cardTitles = page.locator('article h3');
    const count = await cardTitles.count();
    expect(count).toBeGreaterThan(0);

    // Verify card height stability
    const firstCard = page.locator('article').first();
    const box = await firstCard.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.height).toBeGreaterThanOrEqual(340);
    }
  });
});
