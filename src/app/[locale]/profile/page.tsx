import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { ProfileView } from '@/features/profile';
import { buildMetadata } from '@/lib/seo/metadata';
import {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  isSupportedLocale,
  type Locale,
} from '@/lib/i18n';
import { SITE_CONFIG } from '@/content/site';

export const instant = false;

interface ProfilePageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams(): Array<{ locale: Locale }> {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = (isSupportedLocale(locale) ? locale : DEFAULT_LOCALE) as Locale;

  return buildMetadata({
    title: `My Profile | ${SITE_CONFIG.brand.name} Handcrafted Heritage`,
    description:
      'Manage your Bramhkanti profile, track your heritage pickles and sweets orders, and manage delivery addresses.',
    canonicalPath: '/profile',
    locale: safeLocale,
    noindex: true,
  });
}

export default async function ProfilePage({
  params,
}: ProfilePageProps): Promise<ReactNode> {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  return <ProfileView />;
}
