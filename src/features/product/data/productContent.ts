import type { Product } from '@/lib/api/contracts/domain';

export interface SnapshotHighlight {
  id: string;
  icon: 'sun' | 'leaf' | 'shield' | 'package' | 'sparkles' | 'flame' | 'clock';
  label: string;
  description: string;
}

export interface ProductFaqItem {
  question: string;
  answer: string;
}

export interface EnrichedProductContent {
  brandOrigin: string;
  subtitle: string;
  highlights: SnapshotHighlight[];
  heritageStory: {
    title: string;
    narrative: string[];
    artisanQuote?: string;
  };
  tastingAndPairings: {
    flavorProfile: string[];
    bestEnjoyedWith: string[];
    chefTip: string;
  };
  faqs: ProductFaqItem[];
  shippingHighlights: {
    dispatchTime: string;
    packagingStandard: string;
    transitAssurance: string;
  };
  keyHighlights: string[];
  ingredientsGrid: Array<{
    name: string;
    detail: string;
    icon: string;
  }>;
  storageInstructions: Array<{
    icon: string;
    text: string;
  }>;
  desktopAttributeBar: Array<{
    icon: string;
    label: string;
  }>;
  mobileTrustBadges: Array<{
    icon: string;
    label: string;
  }>;
}

/**
 * Returns category-tailored artisanal storytelling, snapshot view points,
 * culinary pairing recommendations, and customer FAQs for any catalog product.
 */
export function getEnrichedProductContent(
  product: Product,
  categoryName?: string,
): EnrichedProductContent {
  const normCategory = (categoryName ?? product.primaryCategoryId).toLowerCase();
  const titleLower = product.title.toLowerCase();

  // 1. Snapshot highlights based on category
  let highlights: SnapshotHighlight[];

  if (
    normCategory.includes('achar') ||
    titleLower.includes('achar') ||
    titleLower.includes('pickle')
  ) {
    highlights = [
      {
        id: 'sun-curing',
        icon: 'sun',
        label: '21-Day Sun Cured',
        description:
          'Matured slowly in glazed ceramic barnies under the natural Indian sun.',
      },
      {
        id: 'pure-oil',
        icon: 'leaf',
        label: 'Wood-Pressed Virgin Mustard Oil',
        description:
          'Kachi Ghani cold-pressed mustard oil creates a natural, breathable seal.',
      },
      {
        id: 'no-chemicals',
        icon: 'shield',
        label: 'Zero Synthetic Preservatives',
        description:
          '100% free from synthetic vinegar, acetic acid, and chemical stabilizers.',
      },
      {
        id: 'breakage-proof',
        icon: 'package',
        label: 'Aroma-Lock Glass Packaging',
        description:
          'Packed in food-grade glass jars with 5-layer shockproof transit cushion.',
      },
    ];
  } else if (
    normCategory.includes('sweet') ||
    titleLower.includes('sweet') ||
    titleLower.includes('laddu')
  ) {
    highlights = [
      {
        id: 'desi-ghee',
        icon: 'sparkles',
        label: '100% Pure Desi Ghee',
        description: 'Crafted exclusively in aromatic slow-clarified native cow ghee.',
      },
      {
        id: 'fresh-batch',
        icon: 'clock',
        label: 'Small-Batch Fresh Preparation',
        description:
          'Cooked fresh upon order confirmation to preserve melt-in-mouth texture.',
      },
      {
        id: 'natural-sweeteners',
        icon: 'leaf',
        label: 'Unrefined Heritage Sweetening',
        description:
          'Infused with organic jaggery and bura sugar with no artificial coloring.',
      },
      {
        id: 'transit-fresh',
        icon: 'package',
        label: 'Vacuum Fresh Transit Pack',
        description:
          'Sealed with food-safe aroma locks to reach you as fresh as from the wok.',
      },
    ];
  } else if (
    normCategory.includes('makhana') ||
    titleLower.includes('makhana') ||
    titleLower.includes('snack')
  ) {
    highlights = [
      {
        id: 'jumbo-grade',
        icon: 'sparkles',
        label: 'Jumbo Grade 6+ Lotus Pops',
        description:
          'Directly sourced from pristine Mithila wetlands for maximum crunch.',
      },
      {
        id: 'slow-roasted',
        icon: 'flame',
        label: 'Slow Wood-Fired Roasted',
        description: 'Crisped in gentle heat without deep frying or trans fats.',
      },
      {
        id: 'natural-spices',
        icon: 'leaf',
        label: 'Stone-Ground Natural Spices',
        description: 'Seasoned with Himalayan rock salt and hand-blended herbs.',
      },
      {
        id: 'moisture-barrier',
        icon: 'package',
        label: 'Quad-Layer Crunch Guard Pack',
        description:
          'Nitrogen-flushed foil pouch preserving peak crispness across all seasons.',
      },
    ];
  } else {
    highlights = [
      {
        id: 'ancestral-recipe',
        icon: 'sparkles',
        label: 'Ancestral Culinary Craft',
        description: 'Authentic regional recipes passed down across four generations.',
      },
      {
        id: 'clean-ingredients',
        icon: 'leaf',
        label: '100% Natural Raw Materials',
        description:
          'Directly sourced from indigenous farmer cooperatives across Uttar Pradesh & Bihar.',
      },
      {
        id: 'pure-veg',
        icon: 'shield',
        label: 'Pure Vegetarian Kitchen',
        description:
          'Prepared in a dedicated, hygienic, and FSSAI-compliant heritage facility.',
      },
      {
        id: 'safe-transit',
        icon: 'package',
        label: 'Breakage-Free Courier Transit',
        description:
          'Eco-conscious protective cushioning with a free replacement guarantee.',
      },
    ];
  }

  // 2. Heritage Storytelling Narrative
  const heritageStory = {
    title: `The Story Behind Our ${product.title}`,
    narrative: [
      `In our Varanasi kitchen, every jar of ${product.title} is made following culinary principles handed down through generations. Rather than rushing fermentation with synthetic vinegars or chemical accelerants, our artisans honor the rhythm of nature.`,
      `We start with hand-selected seasonal produce sourced directly from trusted regional orchards. The ingredients are meticulously washed in filtered spring water, hand-sliced, and sun-dried on clean terrace beds where the dry north-Indian winds and bright sunlight draw out surplus moisture while concentrating pure flavors.`,
      `Next comes the sacred spice blend: whole seeds of fenugreek, fennel, mustard, and nigella (kalonji) gently roasted over embers and crushed on stone mortar (sil-batta). Bound together with wood-pressed virgin oil and rock salt, the batch is transferred to traditional porcelain barnies where sunlight does the patient work of aging and curing.`,
    ],
    artisanQuote:
      '"True taste cannot be manufactured in a hurry. When you give pure spices, honest oil, and sunshine the time they ask for, the food becomes an heirloom."',
  };

  // 3. Tasting Notes & Pairings
  const tastingAndPairings = {
    flavorProfile: [
      'Bold, rustic pungency with deep warmth',
      'Pleasing tartness balanced with stone-ground aromatics',
      'Firm, satisfying texture that retains its character over time',
    ],
    bestEnjoyedWith: [
      'Hot flaky ajwain or aloo parathas with fresh white butter',
      'A comforting bowl of dal-khichdi with a dollop of desi cow ghee',
      'Crisp mathri, poori-chhole, or classic Banarasi breakfast platters',
      'Simple steamed rice, yellow arhar dal, and roasted papad',
    ],
    chefTip:
      'Always serve using a completely clean, dry wooden or stainless steel spoon. Do not mix wet spoons into the jar, as natural oil-preserved foods thrive when kept free of external moisture.',
  };

  // 4. Comprehensive Product FAQs (Matching Mockup)
  const faqs: ProductFaqItem[] = [
    {
      question: 'Is this pickle 100% natural?',
      answer:
        'Yes, absolutely. Our pickles are 100% natural, prepared using traditional sun-curing methods with whole spices and cold-pressed mustard oil. We use zero artificial colors, synthetic flavors, or synthetic acetic acid.',
    },
    {
      question: 'How long does it stay fresh?',
      answer:
        'It remains fresh for 12 months from the date of packaging. Keep it stored in a cool, dry place and always use a clean, dry spoon to retain its fresh aroma.',
    },
    {
      question: 'Do you use preservatives?',
      answer:
        'We never use synthetic chemical preservatives, sodium benzoate, or artificial acids. Our natural preservation comes strictly from high-grade sea salt, cold-pressed mustard oil, and natural sunlight curing.',
    },
    {
      question: 'Can I order in bulk?',
      answer:
        'Yes! We cater to wedding gifting, family festivities, and corporate gifting with custom packaging and special bulk kitchen pricing. Contact our kitchen team directly.',
    },
    {
      question: 'What is the shelf life?',
      answer:
        'Best before 12 months from the date of packaging when stored in ambient conditions away from moisture.',
    },
  ];

  // 6. Section Specific Datasets matching the uploaded mockup
  const keyHighlights = [
    'Made with real, handpicked mangoes',
    'Authentic North Indian recipe',
    'Rich in traditional spices and flavours',
    'No artificial preservatives',
    'Pure, natural and safe',
  ];

  const ingredientsGrid = [
    { name: 'Raw Mango', detail: '(Seasonal)', icon: 'mango' },
    { name: 'Mustard Oil', detail: '(Cold Pressed)', icon: 'oil' },
    { name: 'Hand-Crushed Spices', detail: 'Artisanal Blend', icon: 'spices' },
    { name: 'Fennel Seeds', detail: '(Saunf)', icon: 'seed' },
    { name: 'Fenugreek Seeds', detail: '(Methi)', icon: 'grain' },
    { name: 'Red Chilli Powder', detail: 'Mathania Blend', icon: 'chilli' },
  ];

  const storageInstructions = [
    { icon: 'sun', text: 'Store in a cool, dry place away from direct sunlight.' },
    { icon: 'spoon', text: 'Use a dry spoon.' },
    { icon: 'clock', text: 'Best before 12 months from the date of packaging.' },
  ];

  const desktopAttributeBar = [
    { icon: 'leaf-slash', label: 'No Preservatives' },
    { icon: 'award', label: 'FSSAI Certified' },
    { icon: 'leaf', label: '100% Natural Ingredients' },
    { icon: 'shield', label: 'Freshness Guarantee' },
  ];

  const mobileTrustBadges = [
    { icon: 'leaf-slash', label: 'No Preservatives' },
    { icon: 'award', label: 'FSSAI\nCertified' },
    { icon: 'leaf', label: '100% Natural Ingredients' },
    { icon: 'shield', label: 'Freshness Guarantee' },
  ];

  return {
    brandOrigin: 'BRAMHKANTI HERITAGE • VARANASI KITCHEN',
    subtitle: categoryName ?? 'Heritage Collection',
    highlights,
    heritageStory,
    tastingAndPairings,
    faqs,
    shippingHighlights: {
      dispatchTime: 'Dispatched within 24 hours directly from Varanasi',
      packagingStandard: 'Aroma-sealed food-grade glass jar with bubble cocoon armor',
      transitAssurance:
        'Pan-India insured express delivery via premium air/surface couriers',
    },
    keyHighlights,
    ingredientsGrid,
    storageInstructions,
    desktopAttributeBar,
    mobileTrustBadges,
  };
}
