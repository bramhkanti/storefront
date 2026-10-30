export interface CollectionCraftPillar {
  icon:
    | 'sun'
    | 'leaf'
    | 'shield'
    | 'package'
    | 'award'
    | 'flame'
    | 'sparkles'
    | 'clock'
    | 'heart'
    | 'gift';
  title: string;
  description: string;
}

export interface CollectionFaqItem {
  question: string;
  answer: string;
}

export interface CollectionEditorialStory {
  title: string;
  subtitle: string;
  paragraphs: string[];
  quote?:
    | {
        text: string;
        author: string;
      }
    | undefined;
}

export interface EnrichedCollectionData {
  h1Title: string;
  badgeLabel: string;
  craftPillars: CollectionCraftPillar[];
  editorialStory: CollectionEditorialStory;
  faqs: CollectionFaqItem[];
  giftingNotes: string[];
}

const COLLECTION_REGISTRY: Record<string, EnrichedCollectionData> = {
  'grandmas-specials': {
    h1Title: "Grandma's Specials (Vintage Heirloom Recipes)",
    badgeLabel: '1952 Handwritten Family Recipes • Zero Shortcut',
    craftPillars: [
      {
        icon: 'heart',
        title: '1952 Heirloom Formulations',
        description:
          'Transcribed verbatim from grandmother’s handwritten recipe notebooks in Varanasi.',
      },
      {
        icon: 'sun',
        title: 'Terrace Sun-Cured Pickles',
        description:
          'Naturally aged in glazed ceramic barnies without artificial heating or chemical accelerants.',
      },
      {
        icon: 'sparkles',
        title: 'Bilona Desi Cow Ghee',
        description:
          'Sweets and snacks crafted exclusively in slow-clarified native cow milk ghee.',
      },
      {
        icon: 'shield',
        title: 'Zero Synthetic Preservatives',
        description:
          '100% free from industrial acetic acid, refined white sugar, or artificial colors.',
      },
    ],
    editorialStory: {
      title: 'Transcribed from Grandmother’s 1952 Recipe Diary',
      subtitle:
        'Preserving the reverence, patience, and authentic flavours of old Indian kitchens',
      paragraphs: [
        'Before commercial processing replaced culinary patience, food in our family home was prepared in harmony with seasons and sunlight. The Grandma’s Specials collection represents the most sacred heirloom recipes passed down through four generations in Varanasi.',
        'From our oil-free digestive Khatta Meetha Nimbu cured for eighteen months under open skies, to authentic Heeng Aam Achar seasoned with pure asafoetida and hand-pounded spices, every jar carries the unadulterated warmth of grandmother’s kitchen.',
        'We never cut corners with industrial acetic acid, synthetic thickeners, or refined sweeteners. Every batch is cooked in small woks or aged slowly in ceramic barnies, delivering the exact nostalgic taste that has nourished our family for over seven decades.',
      ],
      quote: {
        text: 'True taste cannot be rushed by machines. It asks for unhurried sunlight, honest spices, and pure cow ghee.',
        author: 'Heirloom Kitchen Diary, Varanasi (1952)',
      },
    },
    faqs: [
      {
        question: 'What makes Grandma’s Specials different from standard catalog items?',
        answer:
          'This curated collection features vintage heritage recipes that strictly follow our family’s 1952 culinary archives. They use zero oil or cold-pressed mustard oil, pure desi cow ghee, unrefined sweeteners (jaggery and khand), and long-duration sun maturation.',
      },
      {
        question:
          'Are the products in Grandma’s Specials suitable for elderly family members?',
        answer:
          'Yes, absolutely. Varieties like our Oil-Free Lemon Pickle and Gond Ladoo with Kashmiri Walnuts were traditionally formulated for digestive comfort, joint strength, and natural Ayurvedic vitality without harsh synthetic additives.',
      },
      {
        question: 'How are glass jars protected during transit across India?',
        answer:
          'All glass barnies are hermetically vacuum-sealed with food-safe aroma foils and cushioned inside heavy-duty 5-layer shock-absorbing transit boxes to ensure 100% breakage-free delivery to your doorstep.',
      },
      {
        question: 'Can I include a gift message with this hamper?',
        answer:
          'Yes. Every Grandma’s Specials package can include a complimentary handwritten personalized gift card with your custom blessing or message.',
      },
    ],
    giftingNotes: [
      'Cherished comfort gift for parents and grandparents living away from ancestral hometowns',
      'Nutritious festive blessing for postpartum mothers (Gond Ladoo with Walnuts)',
      'Auspicious gift hamper for housewarming ceremonies, Diwali, and family reunions',
    ],
  },

  'best-sellers': {
    h1Title: 'Best Sellers Collection (Top Customer Favorites & Combos)',
    badgeLabel: '50,000+ Happy Family Tables • Highest Rated Across India',
    craftPillars: [
      {
        icon: 'award',
        title: 'Top 1% Customer Favorites',
        description: 'Our most ordered pickles, sweets and makhana, picked for you.',
      },
      {
        icon: 'leaf',
        title: 'Cold-Pressed Virgin Oils',
        description:
          'Authentic wood-pressed Kachi Ghani mustard oil and native cow bilona ghee.',
      },
      {
        icon: 'sun',
        title: '21-Day Terrace Aging',
        description:
          'Sun-matured raw mangoes and hand-stuffed Banarasi red chillies for peak flavor.',
      },
      {
        icon: 'package',
        title: 'Breakage-Safe Delivery',
        description:
          'Packed in aroma-locked food-grade glass jars with 5-layer transit cushioning.',
      },
    ],
    editorialStory: {
      title: 'The Signature Delicacies Loved Across 50,000+ Dining Tables',
      subtitle:
        'The timeless classics that defined Bramhkanti’s artisanal reputation across India',
      paragraphs: [
        'Over the past decades, hundreds of thousands of food connoisseurs across India have made Bramhkanti a cherished staple of their daily meals. This Best Sellers collection brings together our most acclaimed culinary masterpieces in one place.',
        'Here you will find our iconic Banarasi Bharwa Lal Mirch stuffed with stone-ground spices, our crisp sun-cured Ramkela Mango Pickle, slow-roasted Besan Ladoo made in pure cow ghee, and crunchy Himalayan Pink Salt Makhana.',
        'Whether you are introducing someone to genuine Banarasi cuisine or restocking your family pantry with trusted staples, these customer-favorite selections represent the pinnacle of artisanal Indian culinary craft.',
      ],
      quote: {
        text: 'When food is made with pure ingredients and honest intention, every meal becomes a memorable celebration of heritage.',
        author: 'Bramhkanti Kitchen Master, Varanasi',
      },
    },
    faqs: [
      {
        question: 'Why are these products chosen for the Best Sellers collection?',
        answer:
          'These products represent our highest-rated creations based on verified customer reviews, consistent five-star satisfaction ratings, and the highest repeat re-order volume from dining tables across India.',
      },
      {
        question: 'Are items in this collection available as value combos?',
        answer:
          'Yes. We offer curated combo sets combining pickles, sweets, and roasted makhana at advantageous pricing compared to buying each individual pack separately.',
      },
      {
        question: 'What is the shelf life of items in the Best Sellers collection?',
        answer:
          'Our sun-cured pickles maintain peak freshness for 12 to 18 months, roasted makhana for 6 to 9 months, and pure ghee sweets for 30 to 45 days when stored in dry ambient conditions away from moisture.',
      },
      {
        question: 'How fast is dispatch for Best Seller orders?',
        answer:
          'Best seller batches are packed and dispatched within 24 to 48 hours via express air courier, arriving at most metro addresses within 2 to 4 business days.',
      },
    ],
    giftingNotes: [
      'The definitive welcome gift for anyone new to authentic regional Indian food',
      'Signature corporate hampers for festive client appreciation and annual milestones',
      'Pantry restock bundle ensuring healthy, preservative-free condiments on daily dining tables',
    ],
  },

  'diwali-gifting': {
    h1Title: 'Diwali & Festive Gifting Hampers (Royal Keepsake Presentations)',
    badgeLabel: 'Royal Brass & Glass Keepsake Hampers • Pan-India Express Delivery',
    craftPillars: [
      {
        icon: 'gift',
        title: 'Royal Festive Presentation',
        description:
          'Artisanal gift boxes featuring glazed ceramic barnies, brass accents, and festive ribbons.',
      },
      {
        icon: 'sparkles',
        title: '100% Desi Cow Ghee Sweets',
        description:
          'Freshly prepared festive mithai cooked exclusively in pure aromatic cow ghee.',
      },
      {
        icon: 'heart',
        title: 'Custom Handwritten Greeting',
        description:
          'Complimentary handwritten personalized festive message card placed inside every box.',
      },
      {
        icon: 'shield',
        title: 'Express Pan-India Transit',
        description:
          'Guaranteed intact festive delivery with real-time SMS and WhatsApp tracking.',
      },
    ],
    editorialStory: {
      title: 'The Sacred Indian Tradition of Wholesome Festive Gifting',
      subtitle:
        'Replace commercial mass-produced gift boxes with pure, handcrafted heritage delicacies',
      paragraphs: [
        'Festivals in India are celebrated around the dinner table, where families reunite over the aroma of warm ghee, fragrant roasted spices, and melt-in-mouth confections. Our Festive Gifting collection was created to bring genuine culinary reverence back to Indian celebrations.',
        'Instead of mass-manufactured confections loaded with artificial palm oil, chemical essences, and industrial preservatives, Bramhkanti festive hampers feature pure cow ghee sweets, sun-matured heirloom pickles, and jumbo roasted makhana.',
        'Presented in keepsake ceramic jars and royal gift packaging, each festive box is a heartfelt statement of love, good health, and timeless cultural heritage that leaves a lasting impression on family and esteemed corporate partners alike.',
      ],
      quote: {
        text: 'To gift pure food during festivities is to share divine health, affection, and auspicious blessings.',
        author: 'Bramhkanti Heritage Traditions',
      },
    },
    faqs: [
      {
        question: 'Can I customize the contents of a festive gifting hamper?',
        answer:
          'Yes. For orders of 5 hampers or more, our customer concierge can customize the specific combination of pickles, sweets, and makhana to suit your preferences and budget.',
      },
      {
        question: 'Do you support corporate bulk orders with custom branding?',
        answer:
          'Yes. We handle corporate festive gifting for organizations across India, including custom branded sleeves, personalized CEO letters, and multi-address doorstep dispatch.',
      },
      {
        question: 'How far in advance should I place orders for Diwali delivery?',
        answer:
          'We recommend ordering at least 7 to 10 days before major festivals like Diwali and Raksha Bandhan to guarantee seamless delivery ahead of holiday logistics cut-offs.',
      },
      {
        question: 'Can I include a personalized festive greeting card?',
        answer:
          'Yes, absolutely. During checkout you can enter your custom message, which our team handwrites onto a traditional festive greeting card placed inside the box.',
      },
    ],
    giftingNotes: [
      'Prestigious Diwali, Holi, and Raksha Bandhan gifts for relatives, mentors, and loved ones',
      'Executive corporate hampers for clients, business partners, and employee appreciation',
      'Wedding guest return gifts and auspicious family ceremony hampers',
    ],
  },
};

export function getEnrichedCollection(
  handle: string,
  title: string,
  description?: string,
): EnrichedCollectionData {
  const existing = COLLECTION_REGISTRY[handle];
  if (existing) {
    return existing;
  }

  // Graceful fallback for dynamically added collections
  return {
    h1Title: `${title} (Curated Artisanal Hamper)`,
    badgeLabel: '100% Pure Vegetarian • Handcrafted in Varanasi',
    craftPillars: [
      {
        icon: 'sparkles',
        title: 'Handcrafted Heritage Recipe',
        description:
          'Prepared using traditional Banarasi methods with zero chemical preservatives.',
      },
      {
        icon: 'leaf',
        title: 'Pure Natural Ingredients',
        description:
          'Seasoned with cold-pressed virgin oils, pure cow ghee, and unrefined sweeteners.',
      },
      {
        icon: 'package',
        title: 'Aroma-Lock Packaging',
        description:
          'Hermetically sealed food-grade packaging ensuring fresh pantry arrival.',
      },
      {
        icon: 'shield',
        title: 'Satvik & Vegetarian Facility',
        description: 'Crafted in our certified hygienic heritage kitchen in Varanasi.',
      },
    ],
    editorialStory: {
      title: `The Story Behind Our ${title} Collection`,
      subtitle: 'Artisanal excellence and regional culinary traditions',
      paragraphs: [
        description ||
          `Our ${title} collection brings together signature handcrafted recipes prepared with unwavering dedication to authentic Indian culinary traditions.`,
        'Every item is crafted in small batches using pure, wholesome ingredients with zero industrial chemicals, artificial coloring, or synthetic stabilizers.',
        'Dispatched fresh from our heritage facility in Varanasi directly to your doorstep anywhere in India.',
      ],
    },
    faqs: [
      {
        question: `What is included in the ${title} collection?`,
        answer:
          description ||
          `This curated collection brings together a handpicked assortment of authentic handcrafted delicacies from our regional heritage kitchen.`,
      },
      {
        question: 'How long do items in this collection stay fresh?',
        answer:
          'Depending on the specific items, freshness ranges from 30 days for pure ghee sweets to 12–18 months for sun-cured pickles stored in dry ambient conditions.',
      },
      {
        question: 'Can I send this collection as a gift to family or friends?',
        answer:
          'Yes. All collections are packaged securely in gift-worthy presentation boxes with the option to include a complimentary personalized greeting note.',
      },
    ],
    giftingNotes: [
      'Thoughtful gift for festivals, family celebrations, and housewarmings',
      'Artisanal tasting hamper for lovers of regional Indian gourmet delicacies',
      'Pure satvik festive treat prepared without chemical additives',
    ],
  };
}
