'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, Check } from 'lucide-react';
import {
  SUPPORTED_LOCALES,
  LOCALE_METADATA,
  LOCALE_COOKIE_NAME,
  getLocalizedPath,
  type Locale,
  useTranslation,
} from '@/lib/i18n';
import { cn } from '@/lib/utils/cn';

export interface LanguageSwitcherProps {
  /**
   * Presentation variant:
   * - 'banner': Minimalist inline switcher for the desktop top announcement banner.
   * - 'drawer': Touch-friendly segmented tile selector for the mobile navigation drawer.
   */
  variant?: 'banner' | 'drawer';
  className?: string;
  /**
   * Callback invoked after selecting a language (e.g. to close mobile menu).
   */
  onSelect?: () => void;
}

/**
 * Persists the user's explicit language preference to cookie.
 */
function persistLocaleCookie(locale: Locale): void {
  if (typeof document !== 'undefined') {
    document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; path=/; max-age=31536000; SameSite=Lax`;
  }
}

export function LanguageSwitcher({
  variant = 'banner',
  className,
  onSelect,
}: LanguageSwitcherProps) {
  const pathname = usePathname() || '/';
  const { locale: currentLocale, t } = useTranslation('common');

  const handleLanguageClick = (targetLocale: Locale) => {
    persistLocaleCookie(targetLocale);
    onSelect?.();
  };

  // 1. Desktop Top Banner Variant
  if (variant === 'banner') {
    return (
      <nav
        aria-label="Language switcher"
        className={cn('inline-flex items-center gap-1.5 text-xs', className)}
      >
        <Globe
          className="text-heritage-saffron-light h-3.5 w-3.5 shrink-0"
          aria-hidden="true"
        />
        <div className="flex items-center gap-1">
          {SUPPORTED_LOCALES.map((locale, index) => {
            const isActive = currentLocale === locale;
            const targetHref = getLocalizedPath(pathname, locale);
            const meta = LOCALE_METADATA[locale];

            return (
              <React.Fragment key={locale}>
                {index > 0 && (
                  <span className="text-[11px] text-white/40" aria-hidden="true">
                    /
                  </span>
                )}
                <Link
                  href={targetHref}
                  onClick={() => handleLanguageClick(locale)}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={`Switch language to ${meta.name}`}
                  className={cn(
                    'focus-visible:outline-heritage-saffron-light rounded-xs px-1 py-0.5 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-1',
                    isActive
                      ? 'text-heritage-saffron-light decoration-heritage-saffron-light font-bold underline decoration-2 underline-offset-4'
                      : 'text-white/75 hover:text-white',
                  )}
                >
                  <span>{meta.nativeName}</span>
                </Link>
              </React.Fragment>
            );
          })}
        </div>
      </nav>
    );
  }

  // 2. Mobile Left Drawer Variant
  return (
    <div
      className={cn('flex flex-col space-y-2.5', className)}
      role="group"
      aria-labelledby="mobile-lang-heading"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="text-heritage-maroon h-4 w-4 shrink-0" aria-hidden="true" />
          <span
            id="mobile-lang-heading"
            className="text-heritage-charcoal text-xs font-semibold tracking-wider uppercase"
          >
            {t('language.chooseLanguage')}
          </span>
        </div>
        <span className="text-heritage-muted text-[11px]">
          {LOCALE_METADATA[currentLocale]?.nativeName}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {SUPPORTED_LOCALES.map((locale) => {
          const isActive = currentLocale === locale;
          const targetHref = getLocalizedPath(pathname, locale);
          const meta = LOCALE_METADATA[locale];

          return (
            <Link
              key={locale}
              href={targetHref}
              onClick={() => handleLanguageClick(locale)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'focus-visible:outline-heritage-maroon flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm font-medium transition-all focus-visible:outline-2',
                isActive
                  ? 'bg-heritage-maroon border-heritage-maroon text-white shadow-xs'
                  : 'bg-heritage-cream border-heritage-border text-heritage-charcoal hover:bg-heritage-cream-dark hover:border-heritage-maroon/40',
              )}
            >
              <div className="flex flex-col text-left">
                <span className="text-sm font-semibold">{meta.nativeName}</span>
                <span
                  className={cn(
                    'text-[11px]',
                    isActive ? 'text-heritage-saffron-light' : 'text-heritage-muted',
                  )}
                >
                  {meta.name}
                </span>
              </div>
              {isActive && (
                <Check
                  className="text-heritage-saffron-light h-4 w-4 shrink-0"
                  aria-hidden="true"
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
