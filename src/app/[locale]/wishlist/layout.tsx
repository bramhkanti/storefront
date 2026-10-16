import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SITE_CONFIG } from '@/content/site';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
  title: `My Wishlist | ${SITE_CONFIG.brand.name} Handcrafted Heritage`,
  description:
    'Browse your saved delicacies, check batch availability, and move handcrafted favorites directly to your shopping bag.',
  canonicalPath: '/wishlist',
  noindex: true,
});

export default function WishlistLayout({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  return children;
}
