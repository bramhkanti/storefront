export interface SignatureRangeItem {
  id: string;
  name: string;
  tagline: string;
  href: string;
  /** Category handles this card can point to (first that exists wins). */
  categoryHandles?: string[] | undefined;
  /** Or a collection handle. Cards matching neither are hidden. */
  collectionHandle?: string | undefined;
  linkText: string;
  imageUrl: string;
  imageAlt: string;
  iconName: 'leaf' | 'sparkle' | 'sweet' | 'gift';
}

export interface TrustPillarItem {
  id: string;
  title: string;
  iconName: 'leaf' | 'pot' | 'oil' | 'shield' | 'truck';
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  location: string;
  rating: number;
  avatarUrl: string;
}

export interface StorySectionData {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  ctaText: string;
  ctaHref: string;
  imageUrl: string;
  imageAlt: string;
  overlayText: string;
}

export interface PromoBannerData {
  eyebrow: string;
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  trustBadges: string[];
  imageUrl: string;
  imageAlt: string;
}

export interface HeroSlide {
  id: string;
  eyebrow?: string | undefined;
  title: string;
  description?: string | undefined;
  imageUrl: string;
  /** Optional portrait image for phones. */
  mobileImageUrl?: string | undefined;
  imageAlt: string;
  /** Tailwind object-position class, e.g. 'object-[70%_center]'. */
  imagePosition?: string | undefined;
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel?: string | undefined;
  secondaryHref?: string | undefined;
  /** Short trust points under the buttons. */
  badges?: string[] | undefined;
}
