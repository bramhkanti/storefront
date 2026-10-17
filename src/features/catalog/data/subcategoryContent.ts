export interface SubcategoryCraftPillar {
  icon:
    | 'sun'
    | 'leaf'
    | 'shield'
    | 'package'
    | 'award'
    | 'flame'
    | 'sparkles'
    | 'clock'
    | 'droplets';
  title: string;
  description: string;
}

export interface SubcategoryFaqItem {
  question: string;
  answer: string;
}

export interface EnrichedSubcategoryData {
  h1Title: string;
  badgeLabel: string;
  craftPillars: SubcategoryCraftPillar[];
  faqs: SubcategoryFaqItem[];
  pairingNotes: string[];
}

const SUBCATEGORY_REGISTRY: Record<string, EnrichedSubcategoryData> = {
  // --- ACHAR SUBCATEGORIES ---
  nimbu: {
    h1Title: 'Traditional Lemon Pickle (Khatta Meetha Nimbu Ka Achar)',
    badgeLabel: '100% Oil-Free Ayurvedic Digestive',
    craftPillars: [
      {
        icon: 'droplets',
        title: 'Zero Oil Formulation',
        description:
          'Naturally preserved in native lemon juice without a single drop of cooking oil.',
      },
      {
        icon: 'sun',
        title: '18-Month Vedic Sunlight Aging',
        description: 'Patiently matured in ceramic barnies under open Varanasi sunshine.',
      },
      {
        icon: 'leaf',
        title: 'Black Salt & Roasted Cumin',
        description:
          'Seasoned with hand-pounded kala namak, bhuna jeera, and organic jaggery.',
      },
      {
        icon: 'shield',
        title: 'Natural Digestive Tonic',
        description:
          'Traditional Ayurvedic preparation that soothes gut health and digestion.',
      },
    ],
    faqs: [
      {
        question: 'Is this lemon pickle completely oil-free?',
        answer:
          'Yes, 100%. Our Khatta Meetha Nimbu pickle uses zero added oil. Preservation occurs entirely through natural citrus acid, mineral sea salt, and sunlight curing.',
      },
      {
        question: 'What is the taste and spice profile?',
        answer:
          'It delivers a harmoniously balanced sweet and tangy punch with warm digestive spices (roasted cumin, black pepper, and black salt), rather than fiery chilli heat.',
      },
      {
        question: 'How long can this lemon pickle stay fresh?',
        answer:
          'Because traditional lemon pickle improves with age, it remains fresh for 18 to 24 months at ambient room temperature. Always use a dry spoon.',
      },
    ],
    pairingNotes: [
      'Hot dal-khichdi with a dollop of pure desi cow ghee',
      'Comforting bowl of curd rice or buttermilk khichdi',
      'Flaky ajwain parathas or crisp mathri for tea-time snacking',
    ],
  },

  'aam-ka-achar': {
    h1Title: 'Heritage Mango Pickle (Sun-Dried Aam Ka Achar)',
    badgeLabel: 'Ramkela Mangoes • Cold-Pressed Mustard Oil',
    craftPillars: [
      {
        icon: 'sun',
        title: '21-Day Sun Cured',
        description: 'Matured slowly in glazed porcelain barnies under the summer sun.',
      },
      {
        icon: 'leaf',
        title: 'Wood-Pressed Mustard Oil',
        description: 'Authentic kachi ghani virgin mustard oil for natural preservation.',
      },
      {
        icon: 'sparkles',
        title: 'Ramkela Sour Mangoes',
        description:
          'Hand-sliced firm raw mangoes known for their sharp, long-lasting bite.',
      },
      {
        icon: 'shield',
        title: 'Zero Synthetic Acetic Acid',
        description:
          '100% free from industrial vinegar, artificial coloring, or preservatives.',
      },
    ],
    faqs: [
      {
        question: 'Which mango variety is used in your Aam Ka Achar?',
        answer:
          'We exclusively use Ramkela and select Malihabadi desi raw mangoes, prized for their high natural tartness and firm flesh that retains crunch over months of oil immersion.',
      },
      {
        question: 'How is this mango pickle preserved without vinegar?',
        answer:
          'Preservation follows our family’s 80-year-old technique: sun-curing to extract surplus moisture, immersion in cold-pressed virgin mustard oil, and natural sea salt with whole fenugreek and fennel seeds.',
      },
      {
        question: 'Does this mango pickle require refrigeration?',
        answer:
          'No refrigeration is needed. Keep the jar in ambient conditions away from moisture, ensuring the oil covers the mango pieces.',
      },
    ],
    pairingNotes: [
      'Classic North Indian poori-aloo and dal-chawal lunch platters',
      'Crisp Banarasi kachori-sabzi or travel paratha rolls',
      'Daily comfort meals of steamed basmati rice, arhar dal, and roasted papad',
    ],
  },

  'bhara-marcha': {
    h1Title: 'Banarasi Stuffed Red Chilli Pickle (Bharwa Lal Mirch)',
    badgeLabel: 'Plump Winter Red Chillies • Hand-Stuffed',
    craftPillars: [
      {
        icon: 'flame',
        title: 'Signature Banarasi Red Chillies',
        description:
          'Plump, fleshy winter red chillies hand-selected from Varanasi farms.',
      },
      {
        icon: 'leaf',
        title: 'Stone-Pounded Masala Stuffing',
        description:
          'Generously hand-stuffed with amchur, yellow mustard seeds, saunf, and kalonji.',
      },
      {
        icon: 'droplets',
        title: 'Virgin Kachi Ghani Oil Immersion',
        description: 'Immersed in wood-pressed cold mustard oil for peak aromatic depth.',
      },
      {
        icon: 'sun',
        title: 'Patient Terrace Aging',
        description:
          'Cured under natural sunlight until the chilli skin softens to buttery perfection.',
      },
    ],
    faqs: [
      {
        question: 'How spicy is the Banarasi Bharwa Lal Mirch?',
        answer:
          'These large red chillies are moderately spicy rather than searing hot. The real flavor comes from the sour, tangy, and aromatic stone-ground mustard and amchur stuffing inside.',
      },
      {
        question: 'How is each chilli prepared?',
        answer:
          'Each winter chilli is hand-wiped, carefully de-seeded, and stuffed by hand by our experienced kitchen women using our ancestral spice blend.',
      },
      {
        question: 'Can the oil and stuffing from the jar be used?',
        answer:
          'Yes! The flavored mustard oil and leftover stuffing make an incredible seasoning for plain parathas, khichdi, or roasted potatoes.',
      },
    ],
    pairingNotes: [
      'Hot makki or bajra roti with fresh white homemade butter (safed makhan)',
      'Aloo or sattu stuffed parathas with fresh dahi',
      'Rustic Bihari litti-chokha and dal meals',
    ],
  },

  suran: {
    h1Title: 'Traditional Elephant Yam Pickle (Banarasi Suran / Jimikand)',
    badgeLabel: 'Slow-Cooked Jimikand • Pungent Mustard & Ginger',
    craftPillars: [
      {
        icon: 'leaf',
        title: 'Indigenous Elephant Foot Yam',
        description:
          'Meticulously peeled and slow-treated to eliminate any throat irritation.',
      },
      {
        icon: 'flame',
        title: 'Spiced Ginger-Mustard Kick',
        description:
          'Grated jimikand folded with pungent yellow rai, fresh ginger, and green chillies.',
      },
      {
        icon: 'droplets',
        title: 'Cold-Pressed Mustard Oil',
        description: 'Infused with virgin kachi ghani oil for authentic Banarasi taste.',
      },
      {
        icon: 'shield',
        title: 'Vedic Nutritional Heritage',
        description:
          'Celebrated in Ayurvedic traditions for supporting metabolic and digestive balance.',
      },
    ],
    faqs: [
      {
        question: 'Does your Suran pickle itch the throat?',
        answer:
          'Not at all. We treat the raw jimikand following our ancestral method using natural lemon juice, rock salt, and sun-curing, completely eliminating the calcium oxalate that causes itchiness.',
      },
      {
        question: 'What is the texture of this pickle?',
        answer:
          'It has a finely textured, spreadable consistency almost like a coarse chutney, making it effortless to spread on hot flatbreads.',
      },
      {
        question: 'What is its shelf life?',
        answer:
          'It stays fresh for 12 months at room temperature when kept away from water contact.',
      },
    ],
    pairingNotes: [
      'Layered into hot plain parathas or thepla as a spicy spread',
      'Mixed directly into hot steamed rice with a teaspoon of ghee',
      'Served alongside festive Diwali and Chhath vegetarian feasts',
    ],
  },

  gobhi: {
    h1Title: 'Winter Spiced Cauliflower Pickle (Gobhi Ka Achar)',
    badgeLabel: 'Crisp Seasonal Florets • Mustard & Jaggery Marination',
    craftPillars: [
      {
        icon: 'sun',
        title: 'Cotton-Sheet Sun Drying',
        description:
          'Seasonal winter cauliflower florets sun-dried on clean cotton sheets.',
      },
      {
        icon: 'sparkles',
        title: 'Touch of Organic Jaggery',
        description:
          'Marinated with sweet unrefined gur to balance the mustard pungency.',
      },
      {
        icon: 'leaf',
        title: 'Ginger & Rai Seeds',
        description:
          'Spiced with freshly cracked ginger slivers and whole yellow mustard.',
      },
      {
        icon: 'shield',
        title: 'Crunch Preservation',
        description:
          'Preserved without boiling to maintain an extraordinarily crisp, satisfying bite.',
      },
    ],
    faqs: [
      {
        question: 'Does the cauliflower remain crunchy over time?',
        answer:
          'Yes! We do not boil or blanch the cauliflower in water. Instead, moisture is removed purely by terrace sun-drying, keeping the florets pleasantly crunchy.',
      },
      {
        question: 'Is this sweet or spicy?',
        answer:
          'It is a classic Punjabi and Uttar Pradesh winter combination: bold mustard heat, tang, and a subtle undertone of organic jaggery sweetness.',
      },
      {
        question: 'When is this pickle prepared?',
        answer:
          'It is crafted exclusively during the peak winter months when Indian cauliflower is sweetest, firmest, and most flavorful.',
      },
    ],
    pairingNotes: [
      'Stuffed mooli or gobhi parathas on crisp winter mornings',
      'Hot dal-roti meals with green chutney and sliced onions',
      'Piping hot vegetable pulao or fragrant tahri',
    ],
  },

  kathal: {
    h1Title: 'Traditional Jackfruit Pickle (Kathal Ka Achar)',
    badgeLabel: 'Tender Raw Green Jackfruit • Meaty Vegetarian Bite',
    craftPillars: [
      {
        icon: 'leaf',
        title: 'Tender Raw Green Jackfruit',
        description:
          'Hand-cut young raw kathal before seeds mature for maximum tenderness.',
      },
      {
        icon: 'flame',
        title: 'Whole Roasted Masala Blend',
        description:
          'Seasoned with roasted coriander, cumin, methi, and aromatic turmeric.',
      },
      {
        icon: 'droplets',
        title: 'Cold-Pressed Mustard Oil',
        description: 'Slowly absorbs spiced mustard oil to achieve a hearty, rich bite.',
      },
      {
        icon: 'sun',
        title: 'Patient Sun Fermentation',
        description:
          'Matured for 3 weeks in ceramic barnies for authentic rustic texture.',
      },
    ],
    faqs: [
      {
        question: 'What makes Kathal Ka Achar so popular among vegetarians?',
        answer:
          'Raw jackfruit has a remarkably dense, fibrous texture that absorbs rich spices like no other vegetable, often called the ultimate vegetarian delicacy of North India.',
      },
      {
        question: 'Are there hard seeds inside?',
        answer:
          'No. We exclusively harvest young, tender green jackfruit before the inner seeds harden, ensuring every single piece is soft and easy to chew.',
      },
      {
        question: 'What is its shelf life?',
        answer:
          'It stays fresh for 12 months in ambient room temperature. Always ensure the jackfruit pieces are submerged under oil.',
      },
    ],
    pairingNotes: [
      'Sattu parathas or plain layered parathas with fresh curd',
      'Steamed rice with Panchmel dal or spicy chhole',
      'Classic festive Indian thali spreads',
    ],
  },

  'mix-achar': {
    h1Title: 'Vintage Mixed Vegetable Pickle (Pachranga Mix Achar)',
    badgeLabel: 'Lotus Stem, Mango, Lime & Carrots • Master Blend',
    craftPillars: [
      {
        icon: 'sparkles',
        title: 'Crunchy Kamal Kakdi (Lotus Stem)',
        description:
          'Infused with crisp water-lily root for a distinctive, luxurious crunch.',
      },
      {
        icon: 'leaf',
        title: '5-Harvest Farm Blend',
        description:
          'Harmonious medley of raw mango, tender carrot, green chilli, lime, and ginger.',
      },
      {
        icon: 'droplets',
        title: 'Pure Kachi Ghani Mustard Oil',
        description:
          'Bound together with cold-pressed mustard oil and hand-crushed whole spices.',
      },
      {
        icon: 'sun',
        title: 'Natural Sun Curing',
        description:
          'Aged in sunlight without chemical stabilizers, vinegar, or synthetic coloring.',
      },
    ],
    faqs: [
      {
        question: 'What vegetables are included in this Pachranga mix?',
        answer:
          'Our signature mix contains lotus stem (kamal kakdi), raw Ramkela mango, fresh winter carrots, whole green chillies, and sun-cured limes.',
      },
      {
        question: 'Is there any artificial vinegar used to soften the vegetables?',
        answer:
          'Never. We rely purely on the natural citric acid of our cured lemons and the natural curing power of raw mangoes and sea salt.',
      },
      {
        question: 'How long does this mixed pickle last?',
        answer:
          'Best before 12 to 18 months from packaging date when stored away from moisture.',
      },
    ],
    pairingNotes: [
      'Ideal companion for any Indian meal, from simple dal-chawal to festive biryanis',
      'Crisp mathri, fafda, or poori-sabzi breakfast spreads',
      'Lunchbox flatbread rolls for office or school',
    ],
  },

  // --- MAKHANA SUBCATEGORIES ---
  'roasted-savory': {
    h1Title: 'Savory Slow-Roasted Makhana (Flavored Foxnuts)',
    badgeLabel: 'GI-Tagged Mithila Jumbo 6+ • Slow Roasted in Pure Ghee',
    craftPillars: [
      {
        icon: 'award',
        title: 'Top 5% Jumbo Grade',
        description:
          'Only the largest, fluffiest lotus seeds hand-selected from Bihar wetlands.',
      },
      {
        icon: 'flame',
        title: 'Never Deep-Fried',
        description:
          'Slow-roasted gently in pure cow ghee and cold-pressed extra virgin olive oil.',
      },
      {
        icon: 'leaf',
        title: 'Natural Stone-Ground Spices',
        description:
          'Dusted with Himalayan pink rock salt, mint pudina, and authentic peri peri.',
      },
      {
        icon: 'shield',
        title: 'Zero Trans Fat & Gluten-Free',
        description:
          '100% natural, clean protein superfood snack with zero synthetic MSG.',
      },
    ],
    faqs: [
      {
        question: 'How are your savory makhanas cooked?',
        answer:
          'Unlike commercial snack brands that deep-fry in palm oil, our makhanas are gently roasted in small batches using pure A2 cow ghee and cold-pressed extra virgin olive oil.',
      },
      {
        question: 'Are these snacks suitable for weight management and fasting (vrat)?',
        answer:
          'Yes! Makhana is naturally low in sodium, cholesterol-free, and packed with plant protein and fiber. Our Himalayan Pink Salt flavor is 100% fasting-friendly (vrat approved).',
      },
      {
        question: 'How do you keep them crisp in all seasons?',
        answer:
          'We pack our roasted makhana in quad-layer nitrogen-flushed foil pouches that prevent moisture absorption and lock in maximum crunch.',
      },
    ],
    pairingNotes: [
      'Mid-evening tea-time pairing with hot masala chai or green tea',
      'Guilt-free late night or movie snack alternative to greasy chips',
      'Nutritious post-workout or school snack pack for kids',
    ],
  },

  'roasted-sweet': {
    h1Title: 'Sweet Jaggery Roasted Makhana (Gur Phool Makhana)',
    badgeLabel: 'Organic Gur Caramel • Sesame Seeds • Pure Desi Ghee',
    craftPillars: [
      {
        icon: 'sparkles',
        title: 'Organic Jaggery Caramel',
        description:
          'Glazed with unrefined mineral-rich desi gur for deep caramel sweetness.',
      },
      {
        icon: 'flame',
        title: 'A2 Cow Ghee Toasted',
        description:
          'Lightly tossed in pure cow ghee to achieve a delicate candy-like crisp.',
      },
      {
        icon: 'leaf',
        title: 'Roasted White Sesame (Til)',
        description:
          'Garnished with nutty roasted sesame seeds for added calcium and warmth.',
      },
      {
        icon: 'shield',
        title: '0% Refined White Sugar',
        description:
          'Pure, guilt-free sweetening with no synthetic flavors or food dyes.',
      },
    ],
    faqs: [
      {
        question: 'Is there any refined white sugar in this sweet makhana?',
        answer:
          'None whatsoever. We sweeten exclusively with certified organic jaggery (gur) that retains natural iron, potassium, and trace minerals.',
      },
      {
        question: 'What is the texture like?',
        answer:
          'It delivers a delightful crisp crunch on the outside from the delicate caramel jaggery shell, followed by a featherlight melt-in-mouth interior.',
      },
      {
        question: 'Can this be consumed during religious fasts (vrat)?',
        answer:
          'Yes, our sweet gur makhana uses pure satvik ingredients: makhana, organic jaggery, pure cow ghee, and cardamom, making it ideal for festive fasting.',
      },
    ],
    pairingNotes: [
      'Healthy post-meal dessert bite to satisfy sweet cravings',
      'Energy-boosting trail snack for outdoor travels and hikes',
      'Festive gifting accompaniment during Diwali and Rakhi',
    ],
  },

  'raw-organic': {
    h1Title: 'Raw Organic Jumbo Phool Makhana (6+ Grade)',
    badgeLabel: 'Unprocessed Lotus Seeds • Directly from Mithila Wetlands',
    craftPillars: [
      {
        icon: 'award',
        title: 'GI-Tagged Mithila Origin',
        description:
          'Sourced directly from farmer-owned wetlands in Darbhanga & Madhubani.',
      },
      {
        icon: 'sparkles',
        title: 'Jumbo 6+ Hand-Graded',
        description: 'Uniformly large diameter seeds with minimal black shell residue.',
      },
      {
        icon: 'shield',
        title: 'Zero Chemical Bleaching',
        description:
          'Naturally sun-dried with no sulfur fumes or chemical whitening agents.',
      },
      {
        icon: 'leaf',
        title: 'Versatile Culinary Staple',
        description:
          'Perfect for roasting at home, rich kheer, or royal makhana curries.',
      },
    ],
    faqs: [
      {
        question: 'Why is 6+ grade makhana considered superior?',
        answer:
          '6+ refers to seeds with a diameter greater than 6 millimeters. Larger seeds puff into exceptionally tender, cloud-like kernels that absorb ghee and spices uniformly.',
      },
      {
        question: 'How should raw makhana be prepared at home?',
        answer:
          'Heat a teaspoon of ghee in a thick-bottomed pan, add the makhana, and roast on medium-low flame for 5–7 minutes until crisp to the bite. Season to your taste.',
      },
      {
        question: 'How should raw makhana be stored?',
        answer:
          'Store in an airtight container in a dry pantry. If they ever absorb ambient humidity, a quick 2-minute dry roast in a pan restores complete crispness.',
      },
    ],
    pairingNotes: [
      'Rich festive Makhana Kheer flavored with saffron and cardamom',
      'Royal Shahi Kaju-Makhana curry for dinner gatherings',
      'Freshly roasted at home with your favorite family seasonings',
    ],
  },

  // --- SWEETS SUBCATEGORIES ---
  'besan-laddu': {
    h1Title: 'Danedar Desi Ghee Besan Ladoo (Banarasi Heritage)',
    badgeLabel: 'Pure A2 Cow Ghee • Coarse Gram Flour • Desi Khand',
    craftPillars: [
      {
        icon: 'flame',
        title: '3-Hour Slow Low-Flame Roasting',
        description:
          'Gram flour roasted patiently in brass woks until deeply golden and fragrant.',
      },
      {
        icon: 'droplets',
        title: '100% Pure A2 Cow Ghee',
        description:
          'Prepared strictly in pure cow milk bilona ghee with zero vegetable dalda.',
      },
      {
        icon: 'leaf',
        title: 'Unrefined Desi Khand Sugar',
        description:
          'Sweetened with traditional raw sulfur-free bura sugar for authentic grain (danedar).',
      },
      {
        icon: 'sparkles',
        title: 'Almonds, Cashews & Green Cardamom',
        description:
          'Folded with crushed California nuts and freshly pounded green cardamom.',
      },
    ],
    faqs: [
      {
        question: 'Why is your Besan Ladoo called "Danedar"?',
        answer:
          'We use coarsely stone-milled organic chana dal rather than ultra-fine flour, paired with unrefined desi khand. This produces an authentic grainy melt-in-mouth texture rather than sticky paste.',
      },
      {
        question: 'Do you use palm oil or hydrogenated vegetable fat (vanaspati)?',
        answer:
          'Never. Every single ladoo is crafted in 100% pure Desi Cow Ghee. We never blend oils or use commercial emulsifiers.',
      },
      {
        question: 'What is the shelf life of these ladoos?',
        answer:
          'Besan Ladoo has a natural shelf life of 30 to 45 days at ambient room temperature in an airtight box. Do not refrigerate, as ghee sweetening is best enjoyed soft.',
      },
    ],
    pairingNotes: [
      'Auspicious festive celebrations, puja bhog, and Diwali gifting',
      'Daily morning or post-meal healthy sweet craving with warm milk',
      'Care packages and homecoming gifts for family living away from home',
    ],
  },

  thekua: {
    h1Title: 'Traditional Bihari Khasta Thekua (Pure Desi Ghee)',
    badgeLabel: 'Stone-Ground Wheat • Organic Jaggery • Saunf & Coconut',
    craftPillars: [
      {
        icon: 'sparkles',
        title: 'Sacred Chhath Puja Heritage',
        description:
          'Crafted following sacred Vedic protocols of ritual culinary purity.',
      },
      {
        icon: 'leaf',
        title: 'Stone-Ground Whole Wheat & Gur',
        description:
          'Milled wheat flour kneaded with organic jaggery syrup, cardamom, and fennel.',
      },
      {
        icon: 'droplets',
        title: 'Fried in Pure A2 Desi Cow Ghee',
        description:
          'Golden-fried in slow-heated cow ghee for an incomparably crisp (khasta) crumb.',
      },
      {
        icon: 'shield',
        title: 'Traditional Wooden Moulds',
        description:
          'Hand-pressed onto heritage carved wooden sancha moulds for auspicious floral motifs.',
      },
    ],
    faqs: [
      {
        question: 'What gives your Thekua its signature "Khasta" crunch?',
        answer:
          'The secret is our strict ratio of pure Desi Cow Ghee moyan (shortening) rubbed thoroughly into stone-ground wheat flour before kneading with warm jaggery syrup.',
      },
      {
        question: 'Is this made with maida (refined flour)?',
        answer:
          'No. Our authentic recipe uses 100% stone-ground whole wheat (chakki atta) and zero refined maida, keeping it wholesome and traditional.',
      },
      {
        question: 'How long can Thekua be kept without spoiling?',
        answer:
          'Traditional Thekua is famous as an Indian travel cookie because it naturally stays fresh and crisp for 30 to 40 days at room temperature without preservatives.',
      },
    ],
    pairingNotes: [
      'Traditional evening tea pairing with piping hot spiced chai',
      'Long-distance train and flight travel snack that never spoils',
      'Special festive celebrations, Chhath Puja prasad, and family gatherings',
    ],
  },

  'geeli-barfi': {
    h1Title: 'Fresh Mawa Malai Barfi (Rich Moist Fudge)',
    badgeLabel: 'Pure Fresh Milk Mawa • Saffron & Pistachio',
    craftPillars: [
      {
        icon: 'sparkles',
        title: 'Slow-Simmered Fresh Mawa',
        description:
          'Crafted from pure organic whole milk condensed slowly in copper woks.',
      },
      {
        icon: 'droplets',
        title: 'Pure Desi Ghee Touch',
        description:
          'Enriched with a touch of native cow ghee to keep the fudge tender and moist.',
      },
      {
        icon: 'leaf',
        title: 'Shahi Kashmiri Kesar & Pista',
        description:
          'Garnished with fragrant saffron strands and slivers of green Iranian pistachio.',
      },
      {
        icon: 'shield',
        title: 'Fresh Kitchen Dispatch',
        description: 'Made fresh upon order confirmation to ensure unmatched freshness.',
      },
    ],
    faqs: [
      {
        question: 'Why is this called "Geeli" Barfi?',
        answer:
          '"Geeli" refers to its tender, velvety moisture. Unlike dry, chalky commercial barfis, our fudge retains soft natural milk moisture for a luxurious melt-in-mouth experience.',
      },
      {
        question: 'Do you use milk powder or artificial thickeners?',
        answer:
          'No synthetic powders or starches. We reduce fresh farm milk patiently over wood and ember heat to form pure unadulterated khoya.',
      },
      {
        question: 'What is its shelf life and storage advice?',
        answer:
          'Because it is crafted with fresh milk mawa, shelf life is 10–12 days at ambient temperature, or up to 20 days when refrigerated.',
      },
    ],
    pairingNotes: [
      'Auspicious wedding gifting, baby announcements, and housewarmings',
      'Served warm with a light sprinkle of crushed green cardamom',
      'Classic Banarasi festive thali dessert finale',
    ],
  },

  'moti-chur-laddu': {
    h1Title: 'Shahi Kesar Motichoor Ladoo (Pure Desi Ghee)',
    badgeLabel: 'Ultra-Fine Boondi • Kashmiri Saffron • Magaz Seeds',
    craftPillars: [
      {
        icon: 'sparkles',
        title: 'Micro-Pearled Boondi Pearls',
        description: 'Fine gram flour drops fried delicately in pure A2 cow ghee.',
      },
      {
        icon: 'flame',
        title: 'Pure Desi Cow Ghee Cooked',
        description:
          'Boondi fried exclusively in fragrant cow ghee with no blended fats.',
      },
      {
        icon: 'leaf',
        title: 'Infused with Real Saffron',
        description:
          'Simmered in saffron-scented syrup garnished with roasted melon seeds (magaz).',
      },
      {
        icon: 'shield',
        title: 'Melt-in-Mouth Juiciness',
        description:
          'Gently hand-rolled while warm to lock in succulent sweetness in every bite.',
      },
    ],
    faqs: [
      {
        question: 'What is the difference between Motichoor Ladoo and Boondi Ladoo?',
        answer:
          'Motichoor uses ultra-fine micro-droplets of gram flour (almost grain-sized) that soak syrup deeply, creating a tender, juicy texture that dissolves instantly in the mouth.',
      },
      {
        question: 'Do you use artificial orange food coloring?',
        answer:
          'We use natural Kashmiri saffron (kesar) and minimal food-grade natural carotene to achieve its royal golden hue with zero harsh chemical dyes.',
      },
      {
        question: 'How long do these ladoos stay fresh?',
        answer:
          'Best enjoyed within 14 days of dispatch when stored in an ambient cool, dry container.',
      },
    ],
    pairingNotes: [
      'Ganesh Puja, Hanuman Jayanti, and temple bhog offerings',
      'Wedding celebrations and celebratory family distributions',
      'Festive evening dessert paired with roasted nuts',
    ],
  },
};

/**
 * Returns enriched culinary, SEO, and FAQ data tailored to the exact subcategory.
 * Provides resilient fallbacks if an unregistered subcategory slug is passed.
 */
export function getEnrichedSubcategory(
  parentHandle: string,
  subHandle: string,
  subName: string,
  subDesc?: string,
): EnrichedSubcategoryData {
  const existing = SUBCATEGORY_REGISTRY[subHandle];
  if (existing) {
    return existing;
  }

  // Graceful fallback for any dynamically added subcategory
  const isAchar = parentHandle.includes('achar') || parentHandle.includes('pickle');
  const isMakhana = parentHandle.includes('makhana');

  return {
    h1Title: `${subName} (Handcrafted Authentic Recipe)`,
    badgeLabel: '100% Pure Vegetarian • Vedic Heritage Recipe',
    craftPillars: isAchar
      ? [
          {
            icon: 'sun',
            title: '21-Day Sun Cured',
            description: 'Aged slowly in ceramic barnies under the natural Indian sun.',
          },
          {
            icon: 'leaf',
            title: 'Virgin Mustard Oil',
            description: 'Preserved naturally with cold-pressed kachi ghani mustard oil.',
          },
          {
            icon: 'shield',
            title: 'Zero Synthetic Vinegar',
            description:
              '100% free from industrial acetic acid, colors, and preservatives.',
          },
          {
            icon: 'package',
            title: 'Aroma-Lock Glass Jar',
            description:
              'Packed in food-safe glass jars with breakage-proof transit cushion.',
          },
        ]
      : isMakhana
        ? [
            {
              icon: 'award',
              title: 'GI-Tagged Mithila Origin',
              description:
                'Sourced sustainably from wetland farmers across Mithila, Bihar.',
            },
            {
              icon: 'sparkles',
              title: 'Top 5% Jumbo Grade',
              description:
                'Hand-selected largest lotus seeds for peak crunch and featherlight texture.',
            },
            {
              icon: 'flame',
              title: 'Slow-Roasted in Pure Ghee',
              description:
                'Never deep-fried. Gently roasted in native cow ghee and olive oil.',
            },
            {
              icon: 'shield',
              title: 'Pure Mineral Seasoning',
              description:
                'Dusted with Himalayan pink salt and stone-ground natural spices.',
            },
          ]
        : [
            {
              icon: 'sparkles',
              title: '100% Pure Desi Cow Ghee',
              description:
                'Crafted exclusively in aromatic slow-clarified native cow ghee.',
            },
            {
              icon: 'leaf',
              title: 'Unrefined Heritage Sweetener',
              description:
                'Infused with organic jaggery and sulfur-free unrefined desi khand.',
            },
            {
              icon: 'clock',
              title: 'Small-Batch Fresh Preparation',
              description:
                'Cooked fresh upon order confirmation to preserve melt-in-mouth texture.',
            },
            {
              icon: 'shield',
              title: 'Dedicated Satvik Facility',
              description: 'Prepared in a 100% vegetarian, hygienic heritage facility.',
            },
          ],
    faqs: [
      {
        question: `What makes Bramhkanti's ${subName} authentic?`,
        answer:
          subDesc ||
          `Our ${subName} is prepared following four generations of regional culinary recipes using pure, natural ingredients with zero synthetic chemicals or preservatives.`,
      },
      {
        question: 'How long does it stay fresh?',
        answer:
          'Depending on the variety, it stays fresh from 30 days (for sweets) to 12–18 months (for pickles) when stored in ambient conditions away from moisture.',
      },
      {
        question: 'Where is this crafted?',
        answer:
          'Every batch is handcrafted in our dedicated culinary facility in Varanasi, Uttar Pradesh, and dispatched fresh to your doorstep across India.',
      },
    ],
    pairingNotes: [
      'Served alongside traditional family lunch and dinner platters',
      'Delicious accompaniment for tea-time and travel snacks',
      'Festive celebratory thalis and auspicious occasions',
    ],
  };
}
