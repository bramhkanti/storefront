import type {
  SignatureRangeItem,
  TrustPillarItem,
  TestimonialItem,
  StorySectionData,
  PromoBannerData,
} from './types';

export const SIGNATURE_RANGE_ITEMS: SignatureRangeItem[] = [
  {
    id: 'range_achar',
    name: 'Achar',
    tagline: 'Tangy. Spicy. Irresistible.',
    href: '/achar',
    linkText: 'Shop Pickles',
    imageUrl: '/images/home/category-pickle.jpg',
    imageAlt:
      'Authentic sun-cured Indian mango and red chilli achar in traditional ceramic martaban jar',
    iconName: 'leaf',
  },
  {
    id: 'range_makhana',
    name: 'Makhana',
    tagline: 'Healthy. Crunchy. Natural.',
    href: '/makhana',
    linkText: 'Shop Makhana',
    imageUrl: '/images/home/category-makhana.jpg',
    imageAlt:
      'Slow-roasted Himalayan phool makhana foxnuts seasoned with organic herbs and rock salt',
    iconName: 'sparkle',
  },
  {
    id: 'range_sweets',
    name: 'Sweets',
    tagline: 'Traditional. Pure. Divine.',
    href: '/sweets',
    linkText: 'Shop Sweets',
    imageUrl: '/images/home/category-sweets.jpg',
    imageAlt:
      'Handcrafted pure cow ghee Indian mithai, besan ladoos and pedas with saffron and pistachios',
    iconName: 'sweet',
  },
  {
    id: 'range_gifting',
    name: 'Gifting & Festive',
    tagline: 'Perfect for every celebration.',
    href: '/collections/diwali-gifting',
    linkText: 'Shop Gift Packs',
    imageUrl: '/images/home/category-gifting.jpg',
    imageAlt:
      'Artisanal royal red festive gift hamper with handcrafted pickles and gourmet sweets',
    iconName: 'gift',
  },
];

export const TRUST_PILLARS: TrustPillarItem[] = [
  {
    id: 'pillar_veg',
    title: '100% Vegetarian Products',
    iconName: 'leaf',
  },
  {
    id: 'pillar_traditional',
    title: 'Traditional Recipes',
    iconName: 'pot',
  },
  {
    id: 'pillar_oil',
    title: 'Pure Cold-Pressed Oils',
    iconName: 'oil',
  },
  {
    id: 'pillar_preservatives',
    title: 'No Artificial Preservatives',
    iconName: 'shield',
  },
  {
    id: 'pillar_shipping',
    title: 'Free Express Shipping Above ₹499',
    iconName: 'truck',
  },
];

export const HERITAGE_STORY_DATA: StorySectionData = {
  eyebrow: 'OUR STORY',
  title: 'A Legacy of Taste and Trust',
  paragraphs: [
    'Bramhkanti began with a simple belief — that true flavour comes from pure ingredients, traditional methods and a mother’s touch.',
    'Rooted in the culinary heritage of Varanasi, our recipes are inspired by generations of home-cooked wisdom. We sun-ripen hand-picked fruits in ceramic martabans, hand-pound raw spices, and slow-cook in pure cold-pressed oils — bringing authentic, preservative-free nostalgia directly to your dining table.',
  ],
  ctaText: 'Know Our Story',
  ctaHref: '/policies/contact',
  imageUrl: '/images/home/story-spices.jpg',
  imageAlt:
    'Handcrafted rustic wooden bowl filled with yellow mustard seeds, raw green mangoes, and sun-dried chillies',
  overlayText: 'Timeless Recipes Passed Down Through Generations',
};

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: 'review_priya',
    quote:
      'Bramhkanti ka mango achar bilkul ghar jaisa swaad deta hai. The cold-pressed mustard oil aroma and tangy kick are authentic, spicy and completely natural!',
    author: 'Priya Sharma',
    location: 'Lucknow, Uttar Pradesh',
    rating: 5,
    avatarUrl: '/images/home/avatar-priya.jpg',
  },
  {
    id: 'review_rahul',
    quote:
      'Makhana is super crunchy, fresh and non-greasy. Very healthy, tasty and roasted to perfection. My entire family loves it!',
    author: 'Rahul Verma',
    location: 'Noida, NCR',
    rating: 5,
    avatarUrl: '/images/home/avatar-rahul.jpg',
  },
  {
    id: 'review_neha',
    quote:
      'The sweets are pure, rich and melt-in-mouth authentic. The festive gift box was the absolute highlight of our celebration!',
    author: 'Neha Singh',
    location: 'Varanasi, Uttar Pradesh',
    rating: 5,
    avatarUrl: '/images/home/avatar-neha.jpg',
  },
];

export const PROMO_BANNER_DATA: PromoBannerData = {
  eyebrow: 'BRING HOME THE TRUE TASTE OF INDIA',
  title: 'Taste Tradition. Feel the Purity.',
  description:
    'Order handcrafted Indian pickles, slow-roasted makhana, and pure desi ghee sweets made in small batches with ancestral care. Enjoy free pan-India express shipping on orders above ₹499.',
  ctaText: 'Shop Now',
  ctaHref: '/achar',
  trustBadges: ['Pure Ingredients', 'Traditional Recipes', 'Made with Love'],
  imageUrl: '/images/home/hero-barnie.jpg',
  imageAlt:
    'Traditional ceramic barnie pickle jar, authentic spices, and sun-cured achar composition',
};
