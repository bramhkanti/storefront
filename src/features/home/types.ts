export interface SignatureRangeItem {
  id: string;
  name: string;
  tagline: string;
  href: string;
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
