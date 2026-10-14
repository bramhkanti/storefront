import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import '../globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SearchModal } from '@/components/layout/SearchModal';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { ToastContainer } from '@/components/ui/Toast';
import { CartDrawer } from '@/features/cart';
import { getCategoryTree } from '@/features/catalog/queries';
import { StoreProvider } from '@/lib/store';
import { CartProvider } from '@/lib/cart';
import { ThemeProvider } from '@/lib/theme';
import {
  SUPPORTED_LOCALES,
  isSupportedLocale,
  LOCALE_METADATA,
  getNamespaceDictionary,
  I18nProvider,
  type Locale,
} from '@/lib/i18n';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { WebVitals } from '@/components/analytics/WebVitals';
import { publicEnv } from '@/lib/env.public';

export const instant = false;

export const metadata: Metadata = {
  title: {
    default: publicEnv.NEXT_PUBLIC_BRAND_NAME,
    template: `%s | ${publicEnv.NEXT_PUBLIC_BRAND_NAME}`,
  },
  description:
    'Handcrafted traditional Indian achar, pure desi ghee sweets, and slow-roasted makhana. Authentic recipes, no artificial preservatives.',
  metadataBase: new URL(publicEnv.NEXT_PUBLIC_SITE_URL),
};

export function generateStaticParams(): Array<{ locale: Locale }> {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const localeMeta = LOCALE_METADATA[locale];

  const [categories, commonDict, cartDict] = await Promise.all([
    getCategoryTree(),
    getNamespaceDictionary(locale, 'common'),
    getNamespaceDictionary(locale, 'cart'),
  ]);

  return (
    <html
      lang={localeMeta.bcp47}
      dir={localeMeta.direction}
      className="scroll-smooth"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('bramhkanti_theme')||'system';var d=s==='dark'||(s==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d){document.documentElement.classList.add('dark');document.documentElement.setAttribute('data-theme','dark');document.documentElement.style.colorScheme='dark';}else{document.documentElement.classList.remove('dark');document.documentElement.setAttribute('data-theme','light');document.documentElement.style.colorScheme='light';}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="bg-heritage-cream text-heritage-charcoal selection:bg-heritage-saffron-light selection:text-heritage-maroon flex min-h-screen flex-col dark:bg-[#161412] dark:text-[#f5f0e8]">
        <ThemeProvider>
          <I18nProvider
            locale={locale}
            dictionaries={{ common: commonDict, cart: cartDict }}
          >
            <StoreProvider>
              <CartProvider>
                <Header categories={categories} />
                <main id="main-content" className="flex-1 pb-16 lg:pb-0">
                  {children}
                </main>
                <Footer categories={categories} />
                <MobileBottomNav />
                <CartDrawer />
                <SearchModal />
                <ToastContainer />
                <GoogleAnalytics />
                <WebVitals />
              </CartProvider>
            </StoreProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
