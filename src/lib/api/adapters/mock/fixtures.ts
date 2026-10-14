import type { Category, Collection, Product, Redirect } from '../../contracts/domain';

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat_achar',
    handle: 'achar',
    name: 'Pickle',
    parentId: null,
    path: [{ id: 'cat_achar', handle: 'achar', name: 'Pickle' }],
    description:
      'Sun-dried, small-batch traditional Indian pickles handcrafted using cold-pressed mustard oil and hand-ground spices. Preserved naturally with no artificial vinegar or synthetic colors.',
    introContent:
      'In Indian households, the pickle jar (barnie) is not merely a condiment—it is a cherished repository of generations-old heritage, slow wisdom, and climatic harmony. At Bramhkanti, our achar is crafted strictly according to Vedic and regional recipes passed down across four generations. We source indigenous sour raw mangoes from Malihabad and Andhra orchards, plump hand-picked Banarasi red chillies, and organic baby limes. Every batch is slow-cured under natural sunlight in ceramic jars for up to 21 days, allowing the cold-pressed virgin mustard oil and whole spices (methi, saunf, kalonji, rai, and heeng) to mature naturally without any chemical preservatives or artificial vinegar.',
    faqs: [
      {
        question: 'How long do Bramhkanti pickles last without refrigeration?',
        answer:
          'Our pickles have a natural shelf life of 12 to 18 months at room temperature. Because we preserve them using traditional sun-drying, pure cold-pressed mustard oil, and natural sea salt, they do not require refrigeration. Always use a clean, dry spoon.',
      },
      {
        question: 'Are artificial preservatives or acetic acid used in your achar?',
        answer:
          'Never. We do not use commercial acetic acid, sodium benzoate, or artificial food coloring. Preservation occurs 100% through authentic sun-curing, oil immersion, and natural spices.',
      },
      {
        question: 'Which oil is used in your achar preparation?',
        answer:
          'We exclusively use wood-pressed (kachi ghani) virgin mustard oil sourced directly from organic farmers in Rajasthan and Uttar Pradesh.',
      },
    ],
    image: {
      url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=1200&auto=format&fit=crop&q=80',
      altText: 'Traditional Indian sun-dried pickle in ceramic barnie jar',
      width: 1200,
      height: 800,
    },
    seo: {
      title: 'Authentic Indian Pickles | Sun-Dried Traditional Achar | Bramhkanti',
      description:
        'Buy authentic handcrafted Indian pickles made with cold-pressed mustard oil and organic spices. Traditional mango, stuffed red chilli, and lemon achar.',
    },
    children: [
      {
        id: 'cat_achar_aam',
        handle: 'aam-ka-achar',
        name: 'Mango Pickle',
        parentId: 'cat_achar',
        path: [
          { id: 'cat_achar', handle: 'achar', name: 'Pickle' },
          { id: 'cat_achar_aam', handle: 'aam-ka-achar', name: 'Mango Pickle' },
        ],
        description:
          'Authentic Ramkela and Malihabadi raw mango pickles cured with cold-pressed virgin mustard oil and whole ground spices.',
        image: {
          url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
          altText: 'Traditional sun-dried mango pickle in ceramic barnie jar',
          width: 600,
          height: 600,
        },
        faqs: [],
        seo: {
          title: 'Authentic Mango Pickle (Aam Ka Achar) | Bramhkanti',
          description:
            'Traditional North Indian and Bihari style aam ka achar cured in cold-pressed mustard oil.',
        },
      },
      {
        id: 'cat_achar_nimbu',
        handle: 'nimbu',
        name: 'Lemon Pickle',
        parentId: 'cat_achar',
        path: [
          { id: 'cat_achar', handle: 'achar', name: 'Pickle' },
          { id: 'cat_achar_nimbu', handle: 'nimbu', name: 'Lemon Pickle' },
        ],
        description:
          'Century-old oil-free digestive lemon pickle aged in sunlight with black salt, roasted cumin, and organic jaggery.',
        image: {
          url: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=600&auto=format&fit=crop&q=80',
          altText: 'Ayurvedic sun-cured sweet and tangy nimbu lemon pickle',
          width: 600,
          height: 600,
        },
        faqs: [],
        seo: {
          title: 'Lemon Pickle (Khatta Meetha Nimbu) | Sweet & Tangy | Bramhkanti',
          description:
            'Digestive oil-free lemon pickle aged under sunlight with natural spices and black salt.',
        },
      },
      {
        id: 'cat_achar_bhara',
        handle: 'bhara-marcha',
        name: 'Stuffed Red Chilli',
        parentId: 'cat_achar',
        path: [
          { id: 'cat_achar', handle: 'achar', name: 'Pickle' },
          { id: 'cat_achar_bhara', handle: 'bhara-marcha', name: 'Stuffed Red Chilli' },
        ],
        description:
          'Famous Banarasi stuffed red chillies hand-packed with spicy amchur, saunf, methi, and mustard paste in pure kachi ghani oil.',
        image: {
          url: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600&auto=format&fit=crop&q=80',
          altText: 'Banarasi stuffed red chilli bhara marcha achar',
          width: 600,
          height: 600,
        },
        faqs: [],
        seo: {
          title: 'Banarasi Stuffed Red Chilli (Bhara Marcha) | Bramhkanti',
          description:
            'Signature Banarasi lal mirch ka bharwa achar made with plump winter red chillies.',
        },
      },
      {
        id: 'cat_achar_suran',
        handle: 'suran',
        name: 'Elephant Yam Pickle',
        parentId: 'cat_achar',
        path: [
          { id: 'cat_achar', handle: 'achar', name: 'Pickle' },
          { id: 'cat_achar_suran', handle: 'suran', name: 'Elephant Yam Pickle' },
        ],
        description:
          'Heirloom Banarasi and Bihari Oal (Elephant Yam) pickle slow-roasted with pungent mustard, ginger, green chillies, and lemon juice.',
        image: {
          url: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?w=600&auto=format&fit=crop&q=80',
          altText: 'Traditional Banarasi Oal Suran Jimikand Achar',
          width: 600,
          height: 600,
        },
        faqs: [],
        seo: {
          title: 'Elephant Yam Pickle (Suran / Jimikand) | Bramhkanti',
          description:
            'Traditional spicy elephant foot yam achar prepared with mustard oil, ginger, and garlic.',
        },
      },
      {
        id: 'cat_achar_gobhi',
        handle: 'gobhi',
        name: 'Cauliflower Pickle',
        parentId: 'cat_achar',
        path: [
          { id: 'cat_achar', handle: 'achar', name: 'Pickle' },
          { id: 'cat_achar_gobhi', handle: 'gobhi', name: 'Cauliflower Pickle' },
        ],
        description:
          'Crunchy winter spiced cauliflower pickle sun-dried and infused with jaggery, whole mustard seeds, and kachi ghani oil.',
        image: {
          url: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=600&auto=format&fit=crop&q=80',
          altText: 'Crisp spiced winter gobhi cauliflower pickle',
          width: 600,
          height: 600,
        },
        faqs: [],
        seo: {
          title: 'Winter Spiced Cauliflower Pickle (Gobhi Achar) | Bramhkanti',
          description:
            'Authentic crunchy winter cauliflower pickle cured in cold-pressed mustard oil.',
        },
      },
      {
        id: 'cat_achar_kathal',
        handle: 'kathal',
        name: 'Jackfruit Pickle',
        parentId: 'cat_achar',
        path: [
          { id: 'cat_achar', handle: 'achar', name: 'Pickle' },
          { id: 'cat_achar_kathal', handle: 'kathal', name: 'Jackfruit Pickle' },
        ],
        description:
          'Tender raw green jackfruit marinated in aromatic roasted spices, turmeric, and virgin mustard oil. Sun-cured to meaty perfection.',
        image: {
          url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
          altText: 'Tender raw kathal jackfruit pickle in mustard oil',
          width: 600,
          height: 600,
        },
        faqs: [],
        seo: {
          title: 'Traditional Jackfruit Pickle (Kathal Ka Achar) | Bramhkanti',
          description:
            'Mouth-watering raw jackfruit pickle seasoned with whole spices and cold-pressed mustard oil.',
        },
      },
      {
        id: 'cat_achar_mix',
        handle: 'mix-achar',
        name: 'Mixed Vegetable Pickle',
        parentId: 'cat_achar',
        path: [
          { id: 'cat_achar', handle: 'achar', name: 'Pickle' },
          { id: 'cat_achar_mix', handle: 'mix-achar', name: 'Mixed Vegetable Pickle' },
        ],
        description:
          'Vintage Pachranga mix containing crunchy lotus stem (kamal kakdi), raw mango, lime, carrot, and green chillies in spiced mustard oil.',
        image: {
          url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
          altText: 'Vintage Pachranga 5-vegetable mix pickle with lotus stem',
          width: 600,
          height: 600,
        },
        faqs: [],
        seo: {
          title: 'Vintage Mixed Vegetable Pickle (Pachranga Mix) | Bramhkanti',
          description:
            'Harmonious blend of lotus stem, mango, lime, and winter veggies in authentic mustard oil.',
        },
      },
    ],
  },
  {
    id: 'cat_makhana',
    handle: 'makhana',
    name: 'Makhana',
    parentId: null,
    path: [{ id: 'cat_makhana', handle: 'makhana', name: 'Makhana' }],
    description:
      'Jumbo grade organic foxnuts harvested directly from the wetlands of Mithila (Bihar). Slow-roasted to crisp perfection in pure ghee and extra virgin olive oil.',
    introContent:
      'Harvested sustainably from the pristine freshwater ponds of Mithila, Bihar, makhana (foxnut / lotus seed) is one of India’s most revered ancient superfoods. Packed with plant protein, calcium, magnesium, and essential antioxidants, makhana is naturally gluten-free with a remarkably low glycemic index. At Bramhkanti, we select only the top 5% hand-graded Jumbo 6+ lotus seeds. Instead of high-heat industrial frying, our makhana is gently slow-roasted in pure cow ghee or extra virgin cold-pressed olive oil, then dusted with stone-ground rock salt and natural spices for an irresistible, guilt-free crunch.',
    faqs: [
      {
        question: 'Are your makhanas deep-fried or baked/roasted?',
        answer:
          'None of our makhanas are deep-fried. They are gently slow-roasted in small batches using pure A2 cow ghee or extra virgin cold-pressed olive oil.',
      },
      {
        question: 'Where is your makhana sourced from?',
        answer:
          'We source 100% of our makhana directly from farmer cooperatives in the GI-tagged Mithila wetlands of Bihar.',
      },
      {
        question: 'Are Bramhkanti flavored makhanas gluten-free?',
        answer:
          'Yes, makhana is naturally gluten-free and processed in a dedicated facility with zero gluten cross-contamination.',
      },
    ],
    image: {
      url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200&auto=format&fit=crop&q=80',
      altText: 'Crispy roasted makhana with Indian spices',
      width: 1200,
      height: 800,
    },
    seo: {
      title: 'Organic Roasted Makhana (Foxnuts) Online | Bramhkanti',
      description:
        'Buy premium Jumbo roasted makhana online. Healthy superfood snacks roasted in pure ghee and olive oil with Himalayan pink salt and peri peri.',
    },
    children: [
      {
        id: 'cat_makhana_savory',
        handle: 'roasted-savory',
        name: 'Roasted Savory',
        parentId: 'cat_makhana',
        path: [
          { id: 'cat_makhana', handle: 'makhana', name: 'Makhana' },
          { id: 'cat_makhana_savory', handle: 'roasted-savory', name: 'Roasted Savory' },
        ],
        description:
          'Crisp savory flavored makhanas: Himalayan Pink Salt, Peri Peri, and Mint Pudina.',
        image: {
          url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80',
          altText: 'Crispy slow-roasted savory makhana foxnuts',
          width: 600,
          height: 600,
        },
        faqs: [],
        seo: {
          title: 'Savory Roasted Makhana Snacks | Bramhkanti',
          description:
            'Healthy savory foxnut snacks roasted in olive oil with natural herbs and spices.',
        },
      },
      {
        id: 'cat_makhana_sweet',
        handle: 'roasted-sweet',
        name: 'Sweet & Jaggery Roasted',
        parentId: 'cat_makhana',
        path: [
          { id: 'cat_makhana', handle: 'makhana', name: 'Makhana' },
          { id: 'cat_makhana_sweet', handle: 'roasted-sweet', name: 'Roasted Sweet' },
        ],
        description:
          'Naturally sweetened crunchy makhanas coated with organic jaggery gur and sesame seeds.',
        image: {
          url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
          altText: 'Caramelized sweet jaggery coated makhana',
          width: 600,
          height: 600,
        },
        faqs: [],
        seo: {
          title: 'Jaggery Gur Coated Makhana | Bramhkanti',
          description:
            'Crunchy sweet makhana caramelized in organic jaggery and pure cow ghee.',
        },
      },
      {
        id: 'cat_makhana_raw',
        handle: 'raw-organic',
        name: 'Raw Organic Jumbo',
        parentId: 'cat_makhana',
        path: [
          { id: 'cat_makhana', handle: 'makhana', name: 'Makhana' },
          { id: 'cat_makhana_raw', handle: 'raw-organic', name: 'Raw Organic Jumbo' },
        ],
        description:
          'Unprocessed Jumbo 6+ Grade Phool Makhana for home cooking and Ayurvedic kheer.',
        image: {
          url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
          altText: 'Raw organic jumbo grade phool makhana',
          width: 600,
          height: 600,
        },
        faqs: [],
        seo: {
          title: 'Raw Jumbo Grade Phool Makhana | Bramhkanti',
          description:
            'Top grade raw organic lotus seeds sourced directly from Mithila ponds.',
        },
      },
    ],
  },
  {
    id: 'cat_sweets',
    handle: 'sweets',
    name: 'Sweets',
    parentId: null,
    path: [{ id: 'cat_sweets', handle: 'sweets', name: 'Sweets' }],
    description:
      'Artisanal Indian sweets crafted exclusively with pure A2 Bilona Desi Cow Ghee, organic khandsari unrefined sugar, and premium California almonds and cashew nuts.',
    introContent:
      'The sacred tradition of Indian mithai is rooted in purity, auspiciousness, and celebration. In an era dominated by palm oil blends, refined white sugar, and artificial essences, Bramhkanti returns to pure, uncompromised satvik craftsmanship. Every batch of our sweets is handcrafted in small quantities using pure A2 Desi Cow Ghee, stone-ground flours, and sulfur-free unrefined desi khand. From our melt-in-mouth Besan Ladoo roasted slowly over low flame for three hours to rich Mathura Pedas and winter Gond Ladoos, we bring you the authentic taste of festive Indian homes without commercial stabilizers or glucose syrups.',
    faqs: [
      {
        question: 'What type of ghee is used in Bramhkanti sweets?',
        answer:
          'We exclusively use 100% pure Desi Cow Ghee made via the traditional bilona curd-churning method. We never use dalda, palm oil, or hydrogenated vegetable fats.',
      },
      {
        question: 'What is the shelf life of your sweets?',
        answer:
          'Depending on the sweet, shelf life ranges from 14 to 30 days. Dry fruit and besan sweets last 30+ days in airtight containers. Full storage instructions are printed on each pack.',
      },
      {
        question: 'Do you use refined white sugar?',
        answer:
          'No. We exclusively use unrefined Desi Khand and organic jaggery (gur), which retain natural trace minerals and offer a rich, rounded sweetness.',
      },
    ],
    image: {
      url: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=1200&auto=format&fit=crop&q=80',
      altText: 'Traditional Indian sweets made in pure desi ghee',
      width: 1200,
      height: 800,
    },
    seo: {
      title: 'Pure Desi Ghee Sweets & Mithai Online | Bramhkanti',
      description:
        'Order pure A2 Desi Ghee Indian sweets online. Besan Ladoo, Kaju Katli, Mathura Peda, and Gond Ladoo made with unrefined organic sugar.',
    },
    children: [
      {
        id: 'cat_sweets_besan',
        handle: 'besan-laddu',
        name: 'Besan Ladoo',
        parentId: 'cat_sweets',
        path: [
          { id: 'cat_sweets', handle: 'sweets', name: 'Sweets' },
          { id: 'cat_sweets_besan', handle: 'besan-laddu', name: 'Besan Ladoo' },
        ],
        description:
          'Coarsely milled organic Bengal gram flour slow-roasted for 3 hours in pure A2 Bilona cow ghee, blended with aromatic cardamom and unrefined desi khand.',
        image: {
          url: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=600&auto=format&fit=crop&q=80',
          altText: 'Danedar Desi Ghee Besan Laddu with dry fruits',
          width: 600,
          height: 600,
        },
        faqs: [],
        seo: {
          title: 'Danedar Desi Ghee Besan Ladoo Online | Bramhkanti',
          description:
            'Order authentic slow-roasted Besan Laddu made with pure A2 cow ghee and unrefined desi khand.',
        },
      },
      {
        id: 'cat_sweets_thekua',
        handle: 'thekua',
        name: 'Traditional Thekua',
        parentId: 'cat_sweets',
        path: [
          { id: 'cat_sweets', handle: 'sweets', name: 'Sweets' },
          { id: 'cat_sweets_thekua', handle: 'thekua', name: 'Traditional Thekua' },
        ],
        description:
          'Sacred festive delicacy from Bihar: stone-ground whole wheat, organic jaggery, green cardamom, fennel seeds, and desiccated coconut fried in pure A2 desi ghee.',
        image: {
          url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
          altText: 'Traditional khasta Bihari thekua in pure desi ghee',
          width: 600,
          height: 600,
        },
        faqs: [],
        seo: {
          title: 'Authentic Bihari Khasta Thekua Online | Pure Desi Ghee | Bramhkanti',
          description:
            'Crisp, aromatic traditional Thekua made with stone-ground wheat, gur, and pure cow ghee.',
        },
      },
      {
        id: 'cat_sweets_geeli',
        handle: 'geeli-barfi',
        name: 'Fresh Mawa Barfi',
        parentId: 'cat_sweets',
        path: [
          { id: 'cat_sweets', handle: 'sweets', name: 'Sweets' },
          { id: 'cat_sweets_geeli', handle: 'geeli-barfi', name: 'Fresh Mawa Barfi' },
        ],
        description:
          'Soft, moist traditional mawa malai barfi slow-cooked with fresh organic milk, raw khandsari, pistachios, and saffron strands.',
        image: {
          url: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=600&auto=format&fit=crop&q=80',
          altText: 'Rich moist traditional mawa malai geeli barfi',
          width: 600,
          height: 600,
        },
        faqs: [],
        seo: {
          title: 'Traditional Fresh Mawa Barfi | Moist Malai Fudge | Bramhkanti',
          description:
            'Melt-in-the-mouth soft geeli barfi made with pure fresh mawa, desi ghee, and pistachios.',
        },
      },
      {
        id: 'cat_sweets_motichur',
        handle: 'moti-chur-laddu',
        name: 'Motichoor Ladoo',
        parentId: 'cat_sweets',
        path: [
          { id: 'cat_sweets', handle: 'sweets', name: 'Sweets' },
          { id: 'cat_sweets_motichur', handle: 'moti-chur-laddu', name: 'Motichoor Ladoo' },
        ],
        description:
          'Ultra-fine gram flour pearls (boondi) fried in pure desi cow ghee, simmered in saffron-infused syrup, and garnished with roasted melon seeds (magaz).',
        image: {
          url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
          altText: 'Shahi Kesar Motichoor Ladoo in pure desi cow ghee',
          width: 600,
          height: 600,
        },
        faqs: [],
        seo: {
          title: 'Kesar Motichoor Ladoo in Pure Desi Ghee | Bramhkanti',
          description:
            'Festive saffron motichoor ladoo made with pure cow ghee and roasted melon seeds.',
        },
      },
    ],
  },
];

export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: 'col_best_sellers',
    handle: 'best-sellers',
    title: 'Best Seller Combo',
    description:
      'Our most loved culinary creations: Banarasi Stuffed Red Chilli, Slow-Roasted Besan Ladoo, and Himalayan Pink Salt Makhana.',
    introContent:
      'The cornerstones of the Bramhkanti kitchen. These products have graced over 50,000 family dining tables across India, loved for their uncompromising quality and timeless nostalgic taste.',
    image: {
      url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&auto=format&fit=crop&q=80',
      altText: 'Bramhkanti best seller combo pickles, sweets and snacks assortment',
    },
    productCount: 10,
    seo: {
      title: 'Best Seller Combos & Delicacies | Bramhkanti',
      description:
        'Explore our highest-rated traditional achar, pure desi ghee sweets, and crispy makhana snacks in signature value combos.',
    },
  },
  {
    id: 'col_grandma',
    handle: 'grandmas-specials',
    title: 'Grand Maa',
    description:
      'Heritage recipes preserved without alteration: Sun-dried Heeng Mango Achar, Gond Ladoo with Kashmiri Walnuts, and Gur Makhana.',
    introContent:
      'Vintage recipes transcribed from grandmother’s handwritten recipe diaries from 1952. Prepared with the patience and reverence of old Indian kitchens.',
    image: {
      url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=1200&auto=format&fit=crop&q=80',
      altText: 'Traditional vintage kitchen spices and heirloom grandma recipes',
    },
    productCount: 6,
    seo: {
      title: 'Grand Maa Heritage Recipes | Authentic Indian Delicacies | Bramhkanti',
      description:
        'Timeless nostalgic recipes prepared exactly as our grandmothers made them over 70 years ago.',
    },
  },
  {
    id: 'col_diwali',
    handle: 'diwali-gifting',
    title: 'Diwali and Fest',
    description:
      'Curated festive hampers featuring royal brass barnies of aged achar, pure ghee handcrafted sweets, and roasted makhana jars.',
    introContent:
      'Celebrate Indian festivities with the gift of authentic taste, health, and tradition. Our festive gift boxes are presented in artisanal hand-carved wooden boxes and brass keepsake barnies.',
    image: {
      url: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=1200&auto=format&fit=crop&q=80',
      altText: 'Festive Indian gifting hamper with sweets and pickles',
    },
    productCount: 8,
    seo: {
      title: 'Diwali and Festive Gift Hampers | Sweets & Delicacies | Bramhkanti',
      description:
        'Send royal Indian festive gift boxes with pure ghee sweets, heritage achar, and roasted makhana.',
    },
  },
];

export const MOCK_REDIRECTS: Redirect[] = [
  { fromPath: '/pickles', toPath: '/achar', statusCode: 301 },
  { fromPath: '/mithai', toPath: '/sweets', statusCode: 301 },
  { fromPath: '/foxnuts', toPath: '/makhana', statusCode: 301 },
  { fromPath: '/achar/mango-pickles', toPath: '/achar/aam-ka-achar', statusCode: 301 },
  { fromPath: '/achar/chilli-pickles', toPath: '/achar/bhara-marcha', statusCode: 301 },
  { fromPath: '/achar/heritage-specials', toPath: '/achar/nimbu', statusCode: 301 },
  { fromPath: '/sweets/ladoo-collection', toPath: '/sweets/besan-laddu', statusCode: 301 },
  { fromPath: '/sweets/regional-sweets', toPath: '/sweets/thekua', statusCode: 301 },
  { fromPath: '/collections/best-seller-combo', toPath: '/collections/best-sellers', statusCode: 301 },
  { fromPath: '/collections/grand-maa', toPath: '/collections/grandmas-specials', statusCode: 301 },
  { fromPath: '/collections/diwali-and-fest', toPath: '/collections/diwali-gifting', statusCode: 301 },
  {
    fromPath: '/products/old-mango-pickle',
    toPath: '/products/heritage-aam-ka-achar',
    statusCode: 301,
  },
  { fromPath: '/products/discontinued-garlic-paste', toPath: '', statusCode: 410 },
];

/** Standard Food Safety compliance attributes shared across products */
const BASE_FOOD_ATTRS = {
  fssaiLicenseNumber: '12345678901234',
  isVegetarian: true,
  countryOfOrigin: 'India',
  storage: 'Store in a cool, dry, and hygienic place away from direct sunlight.',
};

export const MOCK_PRODUCTS: Product[] = [
  // --- ACHAR PRODUCTS (8) ---
  {
    id: 'prod_achar_01',
    handle: 'heritage-aam-ka-achar',
    title: 'Heritage Sun-Dried Aam Ka Achar (Mango Pickle)',
    description:
      'Authentic North Indian raw mango pickle prepared with sour Ramkela mangoes, hand-crushed fenugreek seeds, fennel, and cold-pressed virgin mustard oil. Sun-cured for 21 days.',
    images: [
      {
        id: 'img_a01_1',
        url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
        altText: 'Heritage Mango Pickle in traditional ceramic barnie jar',
      },
      {
        id: 'img_a01_2',
        url: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?w=800&auto=format&fit=crop&q=80',
        altText: 'Raw mangoes marinated in turmeric and mustard oil',
      },
    ],
    primaryCategoryId: 'cat_achar',
    categoryIds: ['cat_achar', 'cat_achar_aam'],
    collectionIds: ['col_best_sellers', 'col_grandma'],
    tags: ['mango', 'mustard-oil', 'sun-dried', 'spicy'],
    variants: [
      {
        id: 'var_a01_250',
        title: '250g Glass Jar',
        packSize: '250g',
        sku: 'BK-ACH-MAN-250',
        price: { amount: 24900, currencyCode: 'INR' },
        compareAtPrice: { amount: 29900, currencyCode: 'INR' },
        inStock: true,
        stockQuantity: 150,
        weightGrams: 300,
      },
      {
        id: 'var_a01_500',
        title: '500g Glass Jar',
        packSize: '500g',
        sku: 'BK-ACH-MAN-500',
        price: { amount: 44900, currencyCode: 'INR' },
        compareAtPrice: { amount: 54900, currencyCode: 'INR' },
        inStock: true,
        stockQuantity: 280,
        weightGrams: 580,
      },
      {
        id: 'var_a01_1kg',
        title: '1kg Heritage Barnie',
        packSize: '1kg',
        sku: 'BK-ACH-MAN-1000',
        price: { amount: 79900, currencyCode: 'INR' },
        compareAtPrice: { amount: 99900, currencyCode: 'INR' },
        inStock: true,
        stockQuantity: 95,
        weightGrams: 1150,
      },
    ],
    foodAttributes: {
      ...BASE_FOOD_ATTRS,
      ingredients: [
        'Raw Mango Cuts (62%)',
        'Cold Pressed Mustard Oil',
        'Iodized Rock Salt',
        'Fennel Seeds (Saunf)',
        'Fenugreek (Methi)',
        'Turmeric',
        'Red Chilli Powder',
        'Kalonji (Nigella)',
        'Asafoetida (Heeng)',
      ],
      allergens: ['Mustard'],
      shelfLife: '12 Months',
      netWeight: '500g',
    },
    attributes: {
      spiceLevel: 'Medium',
      oilType: 'Mustard Oil',
      mangoVariety: 'Ramkela Desi Mango',
    },
    seo: {
      title: 'Heritage Sun-Dried Aam Ka Achar (500g / 1kg) | Bramhkanti',
      description:
        'Buy traditional authentic mango pickle made with pure mustard oil and hand-ground spices. Preserved with natural sun curing.',
    },
    status: 'published',
    featured: true,
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-10-01T12:00:00Z',
  },
  {
    id: 'prod_achar_02',
    handle: 'banarasi-stuffed-red-chilli-achar',
    title: 'Banarasi Bharwa Lal Mirch Achar (Stuffed Red Chilli)',
    description:
      'The crown jewel of Varanasi culinary traditions. Whole plump red chillies deseeded, hand-stuffed with aromatic roasted spices, and slow-steeped in mustard oil.',
    images: [
      {
        id: 'img_a02_1',
        url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
        altText: 'Banarasi Bharwa Lal Mirch Achar in oil',
      },
    ],
    primaryCategoryId: 'cat_achar',
    categoryIds: ['cat_achar', 'cat_achar_bhara'],
    collectionIds: ['col_best_sellers', 'col_diwali'],
    tags: ['chilli', 'banarasi', 'bharwa', 'spicy'],
    variants: [
      {
        id: 'var_a02_500',
        title: '500g Glass Jar',
        packSize: '500g',
        sku: 'BK-ACH-RLM-500',
        price: { amount: 49900, currencyCode: 'INR' },
        compareAtPrice: { amount: 59900, currencyCode: 'INR' },
        inStock: true,
        stockQuantity: 120,
        weightGrams: 600,
      },
      {
        id: 'var_a02_1kg',
        title: '1kg Glass Jar',
        packSize: '1kg',
        sku: 'BK-ACH-RLM-1000',
        price: { amount: 89900, currencyCode: 'INR' },
        inStock: true,
        stockQuantity: 45,
        weightGrams: 1200,
      },
    ],
    foodAttributes: {
      ...BASE_FOOD_ATTRS,
      ingredients: [
        'Whole Banarasi Red Chillies (55%)',
        'Mustard Oil',
        'Dry Mango Powder (Amchur)',
        'Fennel',
        'Coriander Seeds',
        'Cumin',
        'Black Salt',
        'Rock Salt',
        'Heeng',
      ],
      allergens: ['Mustard'],
      shelfLife: '12 Months',
      netWeight: '500g',
    },
    attributes: {
      spiceLevel: 'Hot',
      oilType: 'Mustard Oil',
    },
    seo: {
      title: 'Banarasi Bharwa Lal Mirch Achar | Stuffed Red Chilli Pickle',
      description:
        'Original Banarasi stuffed red chilli pickle made with hand-selected winter chillies and spicy amchur masala.',
    },
    status: 'published',
    featured: true,
    createdAt: '2026-01-18T10:00:00Z',
    updatedAt: '2026-10-01T12:00:00Z',
  },
  {
    id: 'prod_achar_03',
    handle: 'khatta-meetha-nimbu-achar',
    title: 'Khatta Meetha Nimbu Achar (Sweet & Sour Lemon Pickle, Zero Oil)',
    description:
      'A century-old oil-free digestive lemon pickle aged in sunlight with black salt, cumin, and unrefined jaggery. Rich in digestive enzymes.',
    images: [
      {
        id: 'img_a03_1',
        url: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=800&auto=format&fit=crop&q=80',
        altText: 'Sweet and sour lemon pickle in jar',
      },
    ],
    primaryCategoryId: 'cat_achar',
    categoryIds: ['cat_achar', 'cat_achar_nimbu'],
    collectionIds: ['col_grandma'],
    tags: ['lemon', 'oil-free', 'digestive', 'sweet-sour'],
    variants: [
      {
        id: 'var_a03_400',
        title: '400g Glass Jar',
        packSize: '400g',
        sku: 'BK-ACH-NIM-400',
        price: { amount: 37900, currencyCode: 'INR' },
        inStock: true,
        stockQuantity: 180,
        weightGrams: 480,
      },
    ],
    foodAttributes: {
      ...BASE_FOOD_ATTRS,
      ingredients: [
        'Kagzi Nimbu (Lemon 65%)',
        'Organic Jaggery (Gur)',
        'Kala Namak',
        'Sendha Namak',
        'Roasted Cumin',
        'Black Pepper',
        'Ajwain',
      ],
      allergens: [],
      shelfLife: '18 Months',
      netWeight: '400g',
    },
    attributes: {
      spiceLevel: 'Mild',
      oilType: 'Sun Dried / Oil Free',
    },
    seo: {
      title: 'Oil-Free Khatta Meetha Nimbu Achar | Sweet & Sour Lemon Pickle',
      description:
        'Ayurvedic oil-free sweet and sour lemon pickle aged with digestive herbs and organic jaggery.',
    },
    status: 'published',
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-10-01T12:00:00Z',
  },
  {
    id: 'prod_achar_04',
    handle: 'hari-mirch-ka-achar',
    title: 'Rajasthani Teekha Hari Mirch Achar (Green Chilli Pickle)',
    description:
      'Crisp green chillies slit and seasoned with crushed yellow mustard seeds (rai kuria) and freshly squeezed lime juice.',
    images: [
      {
        id: 'img_a04_1',
        url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
        altText: 'Spicy green chilli pickle with rai',
      },
    ],
    primaryCategoryId: 'cat_achar',
    categoryIds: ['cat_achar', 'cat_achar_bhara'],
    collectionIds: [],
    tags: ['green-chilli', 'spicy', 'mustard'],
    variants: [
      {
        id: 'var_a04_300',
        title: '300g Glass Jar',
        packSize: '300g',
        sku: 'BK-ACH-HM-300',
        price: { amount: 26900, currencyCode: 'INR' },
        inStock: true,
        stockQuantity: 90,
        weightGrams: 360,
      },
    ],
    foodAttributes: {
      ...BASE_FOOD_ATTRS,
      ingredients: [
        'Fresh Green Chillies (60%)',
        'Mustard Oil',
        'Yellow Mustard Seeds',
        'Lime Juice',
        'Turmeric',
        'Salt',
        'Heeng',
      ],
      allergens: ['Mustard'],
      shelfLife: '9 Months',
      netWeight: '300g',
    },
    attributes: {
      spiceLevel: 'Extra Hot',
      oilType: 'Mustard Oil',
    },
    seo: {
      title: 'Rajasthani Spicy Green Chilli Achar | Bramhkanti',
      description: 'Zesty green chilli pickle with yellow mustard seeds and lime juice.',
    },
    status: 'published',
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-10-01T12:00:00Z',
  },
  {
    id: 'prod_achar_05',
    handle: 'lahsun-ka-achar',
    title: 'Desi Lahsun Ka Achar (Garlic Pickle in Mustard Oil)',
    description:
      'Whole peeled desi garlic cloves cured in cold-pressed mustard oil with spicy crushed whole spices. High in allicin and natural immunity.',
    images: [
      {
        id: 'img_a05_1',
        url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
        altText: 'Garlic pickle in mustard oil',
      },
    ],
    primaryCategoryId: 'cat_achar',
    categoryIds: ['cat_achar', 'cat_achar_mix'],
    collectionIds: [],
    tags: ['garlic', 'immunity', 'mustard-oil'],
    variants: [
      {
        id: 'var_a05_350',
        title: '350g Glass Jar',
        packSize: '350g',
        sku: 'BK-ACH-GAR-350',
        price: { amount: 34900, currencyCode: 'INR' },
        inStock: true,
        stockQuantity: 110,
        weightGrams: 420,
      },
    ],
    foodAttributes: {
      ...BASE_FOOD_ATTRS,
      ingredients: [
        'Desi Garlic Cloves (58%)',
        'Cold Pressed Mustard Oil',
        'Rai',
        'Fenugreek',
        'Kalonji',
        'Red Chilli',
        'Rock Salt',
      ],
      allergens: ['Mustard'],
      shelfLife: '12 Months',
      netWeight: '350g',
    },
    attributes: {
      spiceLevel: 'Medium',
      oilType: 'Mustard Oil',
    },
    seo: {
      title: 'Desi Lahsun Ka Achar | Garlic Pickle in Mustard Oil | Bramhkanti',
      description:
        'Ayurvedic garlic pickle prepared with pure mustard oil and aromatic spices.',
    },
    status: 'published',
    createdAt: '2026-02-15T10:00:00Z',
    updatedAt: '2026-10-01T12:00:00Z',
  },
  {
    id: 'prod_achar_06',
    handle: 'mixed-pachranga-achar',
    title: 'Vintage Pachranga Mixed Pickle',
    description:
      'Harmonious North Indian blend of lotus stem (kamal kakdi), raw mango, lime, carrot, and green chillies.',
    images: [
      {
        id: 'img_a06_1',
        url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
        altText: 'Mixed Pachranga pickle jar',
      },
    ],
    primaryCategoryId: 'cat_achar',
    categoryIds: ['cat_achar', 'cat_achar_mix'],
    collectionIds: ['col_best_sellers'],
    tags: ['mixed', 'lotus-stem', 'traditional'],
    variants: [
      {
        id: 'var_a06_500',
        title: '500g Glass Jar',
        packSize: '500g',
        sku: 'BK-ACH-MIX-500',
        price: { amount: 39900, currencyCode: 'INR' },
        inStock: true,
        stockQuantity: 220,
        weightGrams: 580,
      },
    ],
    foodAttributes: {
      ...BASE_FOOD_ATTRS,
      ingredients: [
        'Raw Mango, Lime, Carrot, Green Chilli, Lotus Stem (62%)',
        'Mustard Oil',
        'Spices Mix',
        'Salt',
        'Turmeric',
      ],
      allergens: ['Mustard'],
      shelfLife: '12 Months',
      netWeight: '500g',
    },
    attributes: {
      spiceLevel: 'Medium',
      oilType: 'Mustard Oil',
    },
    seo: {
      title: 'Vintage Pachranga Mixed Pickle | Bramhkanti',
      description:
        'Traditional 5-vegetable mixed Indian pickle with lotus stem and mango.',
    },
    status: 'published',
    createdAt: '2026-02-20T10:00:00Z',
    updatedAt: '2026-10-01T12:00:00Z',
  },
  {
    id: 'prod_achar_07',
    handle: 'amla-murabba-honey',
    title: 'Organic Amla Murabba in Wild Forest Honey',
    description:
      'Whole Banarasi amla slow-cooked in raw certified organic honey with green cardamom and saffron strands.',
    images: [
      {
        id: 'img_a07_1',
        url: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=800&auto=format&fit=crop&q=80',
        altText: 'Amla Murabba in honey jar',
      },
    ],
    primaryCategoryId: 'cat_achar',
    categoryIds: ['cat_achar', 'cat_achar_nimbu'],
    collectionIds: ['col_grandma'],
    tags: ['amla', 'murabba', 'honey', 'ayurvedic'],
    variants: [
      {
        id: 'var_a07_500',
        title: '500g Glass Jar',
        packSize: '500g',
        sku: 'BK-ACH-AML-500',
        price: { amount: 54900, currencyCode: 'INR' },
        inStock: true,
        stockQuantity: 80,
        weightGrams: 620,
      },
    ],
    foodAttributes: {
      ...BASE_FOOD_ATTRS,
      ingredients: [
        'Whole Banarasi Amla (50%)',
        'Raw Forest Honey (48%)',
        'Cardamom',
        'Kesar Saffron',
      ],
      allergens: [],
      shelfLife: '12 Months',
      netWeight: '500g',
    },
    attributes: {
      spiceLevel: 'Mild',
      oilType: 'Sun Dried / Oil Free',
    },
    seo: {
      title: 'Organic Honey Amla Murabba | Bramhkanti Ayurvedic Foods',
      description:
        'Natural Indian gooseberry murabba preserved in pure forest honey and saffron.',
    },
    status: 'published',
    createdAt: '2026-02-25T10:00:00Z',
    updatedAt: '2026-10-01T12:00:00Z',
  },
  {
    id: 'prod_achar_08',
    handle: 'heeng-aam-achar-oil-free',
    title: 'Shuddh Heeng Aam Achar (Oil-Free Asafoetida Mango)',
    description:
      'Rare heirloom recipe from Agra. Chopped sour mango chunks cured solely in rock salt and high-grade roasted Hing (asafoetida). Zero oil added.',
    images: [
      {
        id: 'img_a08_1',
        url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
        altText: 'Hing Aam ka Achar oil-free',
      },
    ],
    primaryCategoryId: 'cat_achar',
    categoryIds: ['cat_achar', 'cat_achar_aam'],
    collectionIds: ['col_grandma'],
    tags: ['heeng', 'oil-free', 'mango'],
    variants: [
      {
        id: 'var_a08_300',
        title: '300g Glass Jar',
        packSize: '300g',
        sku: 'BK-ACH-HNG-300',
        price: { amount: 39900, currencyCode: 'INR' },
        inStock: false,
        stockQuantity: 0,
        weightGrams: 360,
      },
    ],
    foodAttributes: {
      ...BASE_FOOD_ATTRS,
      ingredients: [
        'Raw Mango Cuts (70%)',
        'Sendha Namak',
        'Pure Royal Asafoetida (Heeng 5%)',
        'Red Chilli Powder',
      ],
      allergens: [],
      shelfLife: '12 Months',
      netWeight: '300g',
    },
    attributes: {
      spiceLevel: 'Hot',
      oilType: 'Sun Dried / Oil Free',
    },
    seo: {
      title: 'Oil-Free Heeng Aam Achar | Hing Mango Pickle | Bramhkanti',
      description:
        'Zero oil authentic asafoetida mango pickle cured in Himalayan rock salt.',
    },
    status: 'published',
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-10-01T12:00:00Z',
  },
  {
    id: 'prod_achar_09',
    handle: 'banarasi-oal-suran-ka-achar',
    title: 'Traditional Banarasi Oal Suran Ka Achar (Jimikand Pickle)',
    description:
      'Authentic heirloom Banarasi elephant foot yam (suran / oal) grated and slow-roasted with virgin mustard oil, green chillies, ginger, and amchur.',
    images: [
      {
        id: 'img_a09_1',
        url: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?w=800&auto=format&fit=crop&q=80',
        altText: 'Traditional Banarasi Suran Achar jar',
      },
    ],
    primaryCategoryId: 'cat_achar',
    categoryIds: ['cat_achar', 'cat_achar_suran'],
    collectionIds: ['col_grandma'],
    tags: ['suran', 'jimikand', 'oal', 'banarasi'],
    variants: [
      {
        id: 'var_a09_400',
        title: '400g Glass Jar',
        packSize: '400g',
        sku: 'BK-ACH-SRN-400',
        price: { amount: 38900, currencyCode: 'INR' },
        inStock: true,
        stockQuantity: 85,
        weightGrams: 480,
      },
    ],
    foodAttributes: {
      ...BASE_FOOD_ATTRS,
      ingredients: [
        'Elephant Foot Yam / Suran (60%)',
        'Cold-Pressed Virgin Mustard Oil',
        'Ginger',
        'Green Chillies',
        'Dry Mango Powder (Amchur)',
        'Yellow Mustard Seeds',
        'Sendha Namak',
      ],
      allergens: ['Mustard'],
      shelfLife: '12 Months',
      netWeight: '400g',
    },
    attributes: {
      spiceLevel: 'Medium',
      oilType: 'Mustard Oil',
    },
    seo: {
      title: 'Traditional Suran Ka Achar | Banarasi Jimikand Pickle | Bramhkanti',
      description:
        'Authentic spicy Banarasi elephant foot yam pickle handcrafted in virgin mustard oil.',
    },
    status: 'published',
    createdAt: '2026-03-05T10:00:00Z',
    updatedAt: '2026-10-01T12:00:00Z',
  },
  {
    id: 'prod_achar_10',
    handle: 'winter-spiced-gobhi-achar',
    title: 'Winter Spiced Gobhi Ka Achar (Cauliflower Pickle)',
    description:
      'Crisp seasonal winter cauliflower florets sun-dried on cotton sheets, marinated in wood-pressed mustard oil with rai, ginger, and jaggery.',
    images: [
      {
        id: 'img_a10_1',
        url: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=800&auto=format&fit=crop&q=80',
        altText: 'Winter Spiced Gobhi Cauliflower Pickle jar',
      },
    ],
    primaryCategoryId: 'cat_achar',
    categoryIds: ['cat_achar', 'cat_achar_gobhi'],
    collectionIds: ['col_best_sellers'],
    tags: ['gobhi', 'cauliflower', 'winter-special'],
    variants: [
      {
        id: 'var_a10_450',
        title: '450g Glass Jar',
        packSize: '450g',
        sku: 'BK-ACH-GBH-450',
        price: { amount: 36900, currencyCode: 'INR' },
        inStock: true,
        stockQuantity: 110,
        weightGrams: 520,
      },
    ],
    foodAttributes: {
      ...BASE_FOOD_ATTRS,
      ingredients: [
        'Fresh Winter Cauliflower (65%)',
        'Kachi Ghani Mustard Oil',
        'Organic Jaggery',
        'Ginger',
        'Rai (Mustard Seeds)',
        'Red Chilli',
        'Rock Salt',
      ],
      allergens: ['Mustard'],
      shelfLife: '9 Months',
      netWeight: '450g',
    },
    attributes: {
      spiceLevel: 'Medium',
      oilType: 'Mustard Oil',
    },
    seo: {
      title: 'Winter Spiced Gobhi Ka Achar | Cauliflower Pickle | Bramhkanti',
      description:
        'Traditional crunchy winter gobhi achar marinated with jaggery and cold-pressed mustard oil.',
    },
    status: 'published',
    createdAt: '2026-03-10T10:00:00Z',
    updatedAt: '2026-10-01T12:00:00Z',
  },
  {
    id: 'prod_achar_11',
    handle: 'traditional-kathal-ka-achar',
    title: 'Traditional Kathal Ka Achar (Raw Jackfruit Pickle)',
    description:
      'Tender baby green jackfruit cut into succulent chunks, sun-cured with roasted methi, saunf, kalonji, and generous virgin mustard oil.',
    images: [
      {
        id: 'img_a11_1',
        url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
        altText: 'Traditional Kathal Raw Jackfruit Pickle jar',
      },
    ],
    primaryCategoryId: 'cat_achar',
    categoryIds: ['cat_achar', 'cat_achar_kathal'],
    collectionIds: ['col_grandma', 'col_best_sellers'],
    tags: ['kathal', 'jackfruit', 'traditional'],
    variants: [
      {
        id: 'var_a11_500',
        title: '500g Glass Jar',
        packSize: '500g',
        sku: 'BK-ACH-KTH-500',
        price: { amount: 42900, currencyCode: 'INR' },
        inStock: true,
        stockQuantity: 95,
        weightGrams: 580,
      },
    ],
    foodAttributes: {
      ...BASE_FOOD_ATTRS,
      ingredients: [
        'Baby Raw Jackfruit (Kathal 62%)',
        'Virgin Cold-Pressed Mustard Oil',
        'Amchur Powder',
        'Roasted Methi & Saunf',
        'Kalonji',
        'Turmeric',
        'Sea Salt',
      ],
      allergens: ['Mustard'],
      shelfLife: '12 Months',
      netWeight: '500g',
    },
    attributes: {
      spiceLevel: 'Medium',
      oilType: 'Mustard Oil',
    },
    seo: {
      title: 'Traditional Kathal Ka Achar | Raw Jackfruit Pickle | Bramhkanti',
      description:
        'Aromatic tender kathal jackfruit pickle steeped in pure mustard oil and authentic spices.',
    },
    status: 'published',
    createdAt: '2026-03-12T10:00:00Z',
    updatedAt: '2026-10-01T12:00:00Z',
  },

  // --- SWEETS PRODUCTS (8) ---
  {
    id: 'prod_sweet_01',
    handle: 'shuddh-desi-ghee-besan-ladoo',
    title: 'Pure Desi Ghee Besan Ladoo (Danedar)',
    description:
      'Coarsely milled organic Bengal gram flour roasted slowly over three hours in pure A2 Bilona cow ghee, blended with cardamom and unrefined desi khand.',
    images: [
      {
        id: 'img_s01_1',
        url: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=800&auto=format&fit=crop&q=80',
        altText: 'Pure Desi Ghee Besan Ladoo box',
      },
    ],
    primaryCategoryId: 'cat_sweets',
    categoryIds: ['cat_sweets', 'cat_sweets_besan'],
    collectionIds: ['col_best_sellers', 'col_diwali'],
    tags: ['besan-ladoo', 'desi-ghee', 'festive', 'traditional'],
    variants: [
      {
        id: 'var_s01_400',
        title: '400g Box (8 pcs)',
        packSize: '400g',
        sku: 'BK-SWT-BES-400',
        price: { amount: 48000, currencyCode: 'INR' },
        compareAtPrice: { amount: 55000, currencyCode: 'INR' },
        inStock: true,
        stockQuantity: 140,
        weightGrams: 450,
      },
      {
        id: 'var_s01_800',
        title: '800g Gift Box (16 pcs)',
        packSize: '800g',
        sku: 'BK-SWT-BES-800',
        price: { amount: 89900, currencyCode: 'INR' },
        inStock: true,
        stockQuantity: 80,
        weightGrams: 890,
      },
    ],
    foodAttributes: {
      ...BASE_FOOD_ATTRS,
      ingredients: [
        'Coarse Gram Flour (Besan 40%)',
        'Pure Desi Cow Ghee (35%)',
        'Unrefined Desi Khand (23%)',
        'Green Cardamom',
        'Almond Slivers',
      ],
      allergens: ['Tree Nuts', 'Milk / Ghee'],
      shelfLife: '30 Days',
      netWeight: '400g',
    },
    attributes: {
      milkContent: 'Cow Milk',
      gheeType: 'A2 Gir Cow Ghee',
      shelfLifeDays: 30,
      refrigerationRequired: false,
    },
    seo: {
      title: 'Danedar Desi Ghee Besan Ladoo Online | Bramhkanti',
      description:
        'Order authentic slow-roasted Besan Ladoo made with pure A2 cow ghee and unrefined desi khand.',
    },
    status: 'published',
    featured: true,
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-10-01T12:00:00Z',
  },
  {
    id: 'prod_sweet_02',
    handle: 'mathura-special-khoya-peda',
    title: 'Mathura Ke Special Khoya Peda',
    description:
      'Authentic Mathura peda prepared by slow-caramelizing pure full-cream buffalo milk mawa in iron kadhais, dusted with boora sugar and green cardamom.',
    images: [
      {
        id: 'img_s02_1',
        url: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=800&auto=format&fit=crop&q=80',
        altText: 'Mathura Khoya Peda box',
      },
    ],
    primaryCategoryId: 'cat_sweets',
    categoryIds: ['cat_sweets', 'cat_sweets_geeli'],
    collectionIds: ['col_best_sellers'],
    tags: ['peda', 'khoya', 'mathura'],
    variants: [
      {
        id: 'var_s02_400',
        title: '400g Box',
        packSize: '400g',
        sku: 'BK-SWT-PED-400',
        price: { amount: 44000, currencyCode: 'INR' },
        inStock: true,
        stockQuantity: 110,
        weightGrams: 440,
      },
    ],
    foodAttributes: {
      ...BASE_FOOD_ATTRS,
      ingredients: [
        'Pure Buffalo Milk Khoya (Mawa 72%)',
        'Unrefined Sugar',
        'Green Cardamom Powder',
        'Nutmeg',
      ],
      allergens: ['Milk / Dairy'],
      shelfLife: '20 Days',
      netWeight: '400g',
    },
    attributes: {
      milkContent: 'Pure Buffalo Milk',
      gheeType: 'Desi Cow Ghee',
      shelfLifeDays: 20,
      refrigerationRequired: false,
    },
    seo: {
      title: 'Original Mathura Ke Peda Online | Bramhkanti',
      description:
        'Order famous Mathura Khoya Peda made with slow-caramelized pure milk mawa.',
    },
    status: 'published',
    createdAt: '2026-02-05T10:00:00Z',
    updatedAt: '2026-10-01T12:00:00Z',
  },
  {
    id: 'prod_sweet_03',
    handle: 'royal-kaju-katli',
    title: 'Royal Silver Kaju Katli (Pure Cashew Fudge)',
    description:
      'Silky, melt-in-mouth diamond cuts crafted with 75% Goan cashew nuts and zero added flour, starch, or artificial fragrance.',
    images: [
      {
        id: 'img_s03_1',
        url: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=800&auto=format&fit=crop&q=80',
        altText: 'Diamond shaped Kaju Katli slices',
      },
    ],
    primaryCategoryId: 'cat_sweets',
    categoryIds: ['cat_sweets', 'cat_sweets_geeli'],
    collectionIds: ['col_diwali', 'col_best_sellers'],
    tags: ['kaju-katli', 'cashew', 'festive'],
    variants: [
      {
        id: 'var_s03_500',
        title: '500g Gift Box',
        packSize: '500g',
        sku: 'BK-SWT-KAJ-500',
        price: { amount: 69900, currencyCode: 'INR' },
        compareAtPrice: { amount: 79900, currencyCode: 'INR' },
        inStock: true,
        stockQuantity: 160,
        weightGrams: 550,
      },
    ],
    foodAttributes: {
      ...BASE_FOOD_ATTRS,
      ingredients: [
        'Selected Cashew Nuts (Kaju 75%)',
        'Sugar',
        'Pure Cow Ghee',
        'Vegetarian Silver Leaf',
      ],
      allergens: ['Tree Nuts (Cashew)'],
      shelfLife: '25 Days',
      netWeight: '500g',
    },
    attributes: {
      milkContent: 'Vegan / Dairy Free',
      gheeType: 'Desi Cow Ghee',
      shelfLifeDays: 25,
      refrigerationRequired: false,
    },
    seo: {
      title: 'Royal Kaju Katli Online | Pure Cashew Sweet | Bramhkanti',
      description:
        'Buy premium 75% cashew Kaju Katli without fillers or artificial essence.',
    },
    status: 'published',
    featured: true,
    createdAt: '2026-02-12T10:00:00Z',
    updatedAt: '2026-10-01T12:00:00Z',
  },
  {
    id: 'prod_sweet_04',
    handle: 'ayurvedic-gond-ke-ladoo',
    title: 'Ayurvedic Gond Ke Ladoo (Winter Superfood)',
    description:
      'Traditional postpartum and winter strengthening ladoos made with edible gum (dink/gond), whole wheat, dry ginger, makhana powder, and Kashmiri walnuts in pure A2 cow ghee.',
    images: [
      {
        id: 'img_s04_1',
        url: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=800&auto=format&fit=crop&q=80',
        altText: 'Gond ke ladoo with nuts and seeds',
      },
    ],
    primaryCategoryId: 'cat_sweets',
    categoryIds: ['cat_sweets', 'cat_sweets_besan'],
    collectionIds: ['col_grandma'],
    tags: ['gond', 'ayurvedic', 'winter-special', 'nutrition'],
    variants: [
      {
        id: 'var_s04_500',
        title: '500g Box (10 pcs)',
        packSize: '500g',
        sku: 'BK-SWT-GND-500',
        price: { amount: 64900, currencyCode: 'INR' },
        inStock: true,
        stockQuantity: 75,
        weightGrams: 550,
      },
    ],
    foodAttributes: {
      ...BASE_FOOD_ATTRS,
      ingredients: [
        'Edible Gum (Gond 22%)',
        'A2 Cow Ghee (30%)',
        'Whole Wheat Flour',
        'Organic Jaggery',
        'Dry Fruits (Almonds, Cashews, Walnuts)',
        'Makhana Powder',
        'Sonth (Dry Ginger)',
      ],
      allergens: ['Tree Nuts', 'Wheat / Gluten', 'Milk / Ghee'],
      shelfLife: '45 Days',
      netWeight: '500g',
    },
    attributes: {
      milkContent: 'Cow Milk',
      gheeType: 'A2 Gir Cow Ghee',
      shelfLifeDays: 45,
      refrigerationRequired: false,
    },
    seo: {
      title: 'Ayurvedic Gond Ke Ladoo | Traditional Immunity Sweet | Bramhkanti',
      description:
        'Strengthening winter Gond ladoos made with edible gum, nuts, and A2 cow ghee.',
    },
    status: 'published',
    createdAt: '2026-02-18T10:00:00Z',
    updatedAt: '2026-10-01T12:00:00Z',
  },
  {
    id: 'prod_sweet_05',
    handle: 'motichoor-ladoo-kesar',
    title: 'Desi Ghee Shahi Motichoor Ladoo with Saffron',
    description:
      'Ultra-fine gram flour pearls (boondi) fried in pure desi cow ghee, simmered in saffron-infused syrup, and garnished with roasted melon seeds (magaz).',
    images: [
      {
        id: 'img_s05_1',
        url: 'https://images.unsplash.com/photo-1505253758473-96b3015f21c9?w=800&auto=format&fit=crop&q=80',
        altText: 'Kesar Motichoor Ladoo box',
      },
    ],
    primaryCategoryId: 'cat_sweets',
    categoryIds: ['cat_sweets', 'cat_sweets_motichur'],
    collectionIds: ['col_diwali'],
    tags: ['motichoor', 'kesar', 'desi-ghee'],
    variants: [
      {
        id: 'var_s05_400',
        title: '400g Box',
        packSize: '400g',
        sku: 'BK-SWT-MOT-400',
        price: { amount: 46000, currencyCode: 'INR' },
        inStock: true,
        stockQuantity: 120,
        weightGrams: 440,
      },
    ],
    foodAttributes: {
      ...BASE_FOOD_ATTRS,
      ingredients: [
        'Besan Boondi (45%)',
        'Desi Cow Ghee (30%)',
        'Sugar',
        'Kashmiri Saffron (Kesar)',
        'Melon Seeds (Magaz)',
        'Cardamom',
      ],
      allergens: ['Milk / Ghee'],
      shelfLife: '14 Days',
      netWeight: '400g',
    },
    attributes: {
      milkContent: 'Cow Milk',
      gheeType: 'Desi Cow Ghee',
      shelfLifeDays: 14,
      refrigerationRequired: false,
    },
    seo: {
      title: 'Kesar Motichoor Ladoo in Pure Desi Ghee | Bramhkanti',
      description:
        'Festive saffron motichoor ladoo made with pure cow ghee and melon seeds.',
    },
    status: 'published',
    createdAt: '2026-02-22T10:00:00Z',
    updatedAt: '2026-10-01T12:00:00Z',
  },
  {
    id: 'prod_sweet_06',
    handle: 'panjabi-dry-fruit-pinni',
    title: 'Punjabi Atta Pinni with Kashmiri Dry Fruits',
    description:
      'Heirloom Punjabi winter delicacy: stone-ground whole wheat slow-roasted with desi ghee, makhana, melon seeds, and crushed nuts.',
    images: [
      {
        id: 'img_s06_1',
        url: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=800&auto=format&fit=crop&q=80',
        altText: 'Traditional Punjabi Pinni in box',
      },
    ],
    primaryCategoryId: 'cat_sweets',
    categoryIds: ['cat_sweets', 'cat_sweets_besan'],
    collectionIds: ['col_grandma'],
    tags: ['pinni', 'punjabi', 'dry-fruits'],
    variants: [
      {
        id: 'var_s06_500',
        title: '500g Box',
        packSize: '500g',
        sku: 'BK-SWT-PIN-500',
        price: { amount: 58000, currencyCode: 'INR' },
        inStock: true,
        stockQuantity: 65,
        weightGrams: 550,
      },
    ],
    foodAttributes: {
      ...BASE_FOOD_ATTRS,
      ingredients: [
        'Whole Wheat Flour (Atta 35%)',
        'Desi Cow Ghee (30%)',
        'Khand Sugar',
        'Almonds, Cashews, Pistachios (25%)',
        'Cardamom',
      ],
      allergens: ['Wheat / Gluten', 'Tree Nuts', 'Milk / Ghee'],
      shelfLife: '30 Days',
      netWeight: '500g',
    },
    attributes: {
      milkContent: 'Cow Milk',
      gheeType: 'Desi Cow Ghee',
      shelfLifeDays: 30,
      refrigerationRequired: false,
    },
    seo: {
      title: 'Traditional Punjabi Pinni | Dry Fruit Atta Pinni | Bramhkanti',
      description:
        'Order authentic Punjabi Pinni packed with dry fruits, whole wheat, and pure desi ghee.',
    },
    status: 'published',
    createdAt: '2026-03-05T10:00:00Z',
    updatedAt: '2026-10-01T12:00:00Z',
  },
  {
    id: 'prod_sweet_07',
    handle: 'mysore-pak-soft-ghee',
    title: 'Royal Soft Desi Ghee Mysore Pak',
    description:
      'Melt-in-the-mouth soft Mysore Pak crafted with equal parts roasted besan, caramelized sugar, and hot bubbling desi ghee.',
    images: [
      {
        id: 'img_s07_1',
        url: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=800&auto=format&fit=crop&q=80',
        altText: 'Soft Desi Ghee Mysore Pak cubes',
      },
    ],
    primaryCategoryId: 'cat_sweets',
    categoryIds: ['cat_sweets', 'cat_sweets_geeli'],
    collectionIds: [],
    tags: ['mysore-pak', 'south-indian', 'ghee'],
    variants: [
      {
        id: 'var_s07_400',
        title: '400g Box',
        packSize: '400g',
        sku: 'BK-SWT-MYS-400',
        price: { amount: 49900, currencyCode: 'INR' },
        inStock: true,
        stockQuantity: 95,
        weightGrams: 440,
      },
    ],
    foodAttributes: {
      ...BASE_FOOD_ATTRS,
      ingredients: ['Pure Desi Cow Ghee (45%)', 'Gram Flour (Besan 25%)', 'Sugar (30%)'],
      allergens: ['Milk / Ghee'],
      shelfLife: '20 Days',
      netWeight: '400g',
    },
    attributes: {
      milkContent: 'Cow Milk',
      gheeType: 'Desi Cow Ghee',
      shelfLifeDays: 20,
      refrigerationRequired: false,
    },
    seo: {
      title: 'Soft Desi Ghee Mysore Pak Online | Bramhkanti',
      description: 'Melt-in-mouth soft Mysore Pak made with 100% pure cow ghee.',
    },
    status: 'published',
    createdAt: '2026-03-10T10:00:00Z',
    updatedAt: '2026-10-01T12:00:00Z',
  },
  {
    id: 'prod_sweet_08',
    handle: 'dry-fruit-sugarfree-ladoo',
    title: 'Anjeer & Dates Dry Fruit Ladoo (No Added Sugar)',
    description:
      'Naturally sweetened with rich Afghani figs (anjeer) and Arabian dates, combined with roasted almonds, pistachios, and cashew nuts.',
    images: [
      {
        id: 'img_s08_1',
        url: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=800&auto=format&fit=crop&q=80',
        altText: 'Sugarfree Dry Fruit Ladoo',
      },
    ],
    primaryCategoryId: 'cat_sweets',
    categoryIds: ['cat_sweets', 'cat_sweets_besan'],
    collectionIds: ['col_diwali'],
    tags: ['sugar-free', 'anjeer', 'dates', 'dry-fruits'],
    variants: [
      {
        id: 'var_s08_400',
        title: '400g Box (8 pcs)',
        packSize: '400g',
        sku: 'BK-SWT-ANJ-400',
        price: { amount: 69900, currencyCode: 'INR' },
        inStock: true,
        stockQuantity: 70,
        weightGrams: 450,
      },
    ],
    foodAttributes: {
      ...BASE_FOOD_ATTRS,
      ingredients: [
        'Figs (Anjeer 35%)',
        'Dates (Khajoor 30%)',
        'Almonds, Cashews, Pistachios (30%)',
        'Desi Cow Ghee (5%)',
      ],
      allergens: ['Tree Nuts', 'Milk / Ghee'],
      shelfLife: '45 Days',
      netWeight: '400g',
    },
    attributes: {
      milkContent: 'Vegan / Dairy Free',
      gheeType: 'Desi Cow Ghee',
      shelfLifeDays: 45,
      refrigerationRequired: false,
    },
    seo: {
      title: 'Sugar-Free Anjeer Date Ladoo | Healthy Dry Fruit Sweet | Bramhkanti',
      description:
        'Zero added sugar dry fruit ladoos made with natural figs, dates, and nuts.',
    },
    status: 'published',
    createdAt: '2026-03-15T10:00:00Z',
    updatedAt: '2026-10-01T12:00:00Z',
  },
  {
    id: 'prod_sweet_09',
    handle: 'authentic-bihari-khasta-thekua',
    title: 'Authentic Bihari Khasta Thekua (Desi Ghee & Gur)',
    description:
      'Traditional crisp and flaky sacred Thekua handcrafted using coarsely stone-ground whole wheat, organic Desi Gur (jaggery), green cardamom, fennel seeds, and pure A2 cow ghee.',
    images: [
      {
        id: 'img_s09_1',
        url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80',
        altText: 'Authentic Bihari Khasta Thekua in pure desi ghee',
      },
    ],
    primaryCategoryId: 'cat_sweets',
    categoryIds: ['cat_sweets', 'cat_sweets_thekua'],
    collectionIds: ['col_grandma', 'col_best_sellers'],
    tags: ['thekua', 'bihari', 'jaggery', 'desi-ghee', 'chhath-puja'],
    variants: [
      {
        id: 'var_s09_400',
        title: '400g Gift Box (12 pcs)',
        packSize: '400g',
        sku: 'BK-SWT-THK-400',
        price: { amount: 42000, currencyCode: 'INR' },
        compareAtPrice: { amount: 48000, currencyCode: 'INR' },
        inStock: true,
        stockQuantity: 100,
        weightGrams: 460,
      },
      {
        id: 'var_s09_800',
        title: '800g Family Pack (24 pcs)',
        packSize: '800g',
        sku: 'BK-SWT-THK-800',
        price: { amount: 79900, currencyCode: 'INR' },
        inStock: true,
        stockQuantity: 60,
        weightGrams: 890,
      },
    ],
    foodAttributes: {
      ...BASE_FOOD_ATTRS,
      ingredients: [
        'Whole Wheat Flour (Atta 45%)',
        'Organic Jaggery (Gur 28%)',
        'Pure Desi Cow Ghee (22%)',
        'Fennel Seeds (Saunf)',
        'Cardamom',
        'Dry Grated Coconut',
      ],
      allergens: ['Wheat / Gluten', 'Milk / Ghee'],
      shelfLife: '30 Days',
      netWeight: '400g',
    },
    attributes: {
      milkContent: 'Cow Milk',
      gheeType: 'A2 Gir Cow Ghee',
      shelfLifeDays: 30,
      refrigerationRequired: false,
    },
    seo: {
      title: 'Authentic Bihari Khasta Thekua Online | Pure Desi Ghee | Bramhkanti',
      description:
        'Buy traditional authentic Khasta Thekua made with stone-ground whole wheat, organic jaggery, and pure A2 cow ghee.',
    },
    status: 'published',
    featured: true,
    createdAt: '2026-03-18T10:00:00Z',
    updatedAt: '2026-10-01T12:00:00Z',
  },
  {
    id: 'prod_sweet_10',
    handle: 'traditional-malai-geeli-barfi',
    title: 'Traditional Malai Geeli Barfi in Pure Desi Ghee',
    description:
      'Luxurious, melt-in-mouth traditional moist mawa malai barfi slow-simmered in small iron kadhais with fresh cow milk cream, sulfur-free raw sugar, and chopped Iranian pistachios.',
    images: [
      {
        id: 'img_s10_1',
        url: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=800&auto=format&fit=crop&q=80',
        altText: 'Traditional Malai Geeli Barfi with pistachios',
      },
    ],
    primaryCategoryId: 'cat_sweets',
    categoryIds: ['cat_sweets', 'cat_sweets_geeli'],
    collectionIds: ['col_diwali', 'col_best_sellers'],
    tags: ['geeli-barfi', 'malai', 'mawa', 'pure-ghee', 'mithai'],
    variants: [
      {
        id: 'var_s10_400',
        title: '400g Artisanal Box',
        packSize: '400g',
        sku: 'BK-SWT-GLB-400',
        price: { amount: 52000, currencyCode: 'INR' },
        compareAtPrice: { amount: 59000, currencyCode: 'INR' },
        inStock: true,
        stockQuantity: 75,
        weightGrams: 450,
      },
    ],
    foodAttributes: {
      ...BASE_FOOD_ATTRS,
      ingredients: [
        'Fresh Full Cream Cow Milk Khoya / Mawa (70%)',
        'Pure Desi Cow Ghee (15%)',
        'Desi Khand Sugar (12%)',
        'Pistachio Nuts (3%)',
        'Kashmiri Saffron (Kesar)',
        'Cardamom',
      ],
      allergens: ['Milk / Dairy', 'Tree Nuts (Pistachio)'],
      shelfLife: '14 Days',
      netWeight: '400g',
    },
    attributes: {
      milkContent: 'Cow Milk',
      gheeType: 'A2 Gir Cow Ghee',
      shelfLifeDays: 14,
      refrigerationRequired: true,
    },
    seo: {
      title: 'Traditional Malai Geeli Barfi Online | Pure Milk Mithai | Bramhkanti',
      description:
        'Order fresh melt-in-mouth soft Geeli Barfi crafted with pure cow milk mawa and pistachios.',
    },
    status: 'published',
    featured: true,
    createdAt: '2026-03-20T10:00:00Z',
    updatedAt: '2026-10-01T12:00:00Z',
  },

  // --- MAKHANA PRODUCTS (8) ---
  {
    id: 'prod_mak_01',
    handle: 'himalayan-pink-salt-makhana',
    title: 'Himalayan Pink Salt Slow-Roasted Makhana',
    description:
      'Jumbo 6+ grade lotus seeds slow-roasted in cold-pressed extra virgin olive oil and seasoned with mineral-rich stone-ground Himalayan pink rock salt.',
    images: [
      {
        id: 'img_m01_1',
        url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80',
        altText: 'Himalayan Pink Salt roasted makhana jar',
      },
    ],
    primaryCategoryId: 'cat_makhana',
    categoryIds: ['cat_makhana', 'cat_makhana_savory'],
    collectionIds: ['col_best_sellers'],
    tags: ['pink-salt', 'olive-oil', 'superfood', 'gluten-free'],
    variants: [
      {
        id: 'var_m01_100',
        title: '100g Pouch',
        packSize: '100g',
        sku: 'BK-MAK-SAL-100',
        price: { amount: 16900, currencyCode: 'INR' },
        compareAtPrice: { amount: 19900, currencyCode: 'INR' },
        inStock: true,
        stockQuantity: 300,
        weightGrams: 120,
      },
      {
        id: 'var_m01_250',
        title: '250g Value Jar',
        packSize: '250g',
        sku: 'BK-MAK-SAL-250',
        price: { amount: 37900, currencyCode: 'INR' },
        compareAtPrice: { amount: 44900, currencyCode: 'INR' },
        inStock: true,
        stockQuantity: 180,
        weightGrams: 280,
      },
    ],
    foodAttributes: {
      ...BASE_FOOD_ATTRS,
      ingredients: [
        'Jumbo Foxnuts / Makhana (88%)',
        'Cold Pressed Extra Virgin Olive Oil (10%)',
        'Himalayan Pink Rock Salt (2%)',
      ],
      allergens: [],
      shelfLife: '6 Months',
      netWeight: '100g',
    },
    attributes: {
      roastType: 'Slow Roasted in Olive Oil',
      flavor: 'Himalayan Pink Salt',
      sizeGrade: 'Jumbo 6+',
    },
    seo: {
      title: 'Himalayan Pink Salt Roasted Makhana | Olive Oil Foxnuts',
      description:
        'Crunchy healthy roasted foxnuts seasoned with Himalayan pink rock salt. Sourced from Mithila ponds.',
    },
    status: 'published',
    featured: true,
    createdAt: '2026-01-25T10:00:00Z',
    updatedAt: '2026-10-01T12:00:00Z',
  },
  {
    id: 'prod_mak_02',
    handle: 'zesty-peri-peri-makhana',
    title: 'Zesty Peri Peri Roasted Makhana',
    description:
      'Crispy foxnuts tossed in an exhilarating blend of African bird’s eye chilli, dried garlic, onion powder, and aromatic herbs.',
    images: [
      {
        id: 'img_m02_1',
        url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80',
        altText: 'Spicy peri peri makhana snacks',
      },
    ],
    primaryCategoryId: 'cat_makhana',
    categoryIds: ['cat_makhana', 'cat_makhana_savory'],
    collectionIds: ['col_best_sellers'],
    tags: ['peri-peri', 'spicy', 'olive-oil'],
    variants: [
      {
        id: 'var_m02_100',
        title: '100g Pouch',
        packSize: '100g',
        sku: 'BK-MAK-PRP-100',
        price: { amount: 17900, currencyCode: 'INR' },
        inStock: true,
        stockQuantity: 210,
        weightGrams: 120,
      },
    ],
    foodAttributes: {
      ...BASE_FOOD_ATTRS,
      ingredients: [
        'Jumbo Makhana (85%)',
        'Olive Oil (10%)',
        'Peri Peri Seasoning (Chilli, Garlic, Onion, Oregano, Salt 5%)',
      ],
      allergens: [],
      shelfLife: '6 Months',
      netWeight: '100g',
    },
    attributes: {
      roastType: 'Slow Roasted in Olive Oil',
      flavor: 'Peri Peri',
      sizeGrade: 'Jumbo 6+',
    },
    seo: {
      title: 'Spicy Peri Peri Roasted Makhana | Healthy Snack | Bramhkanti',
      description:
        'Zesty peri peri flavored roasted foxnuts with natural herbs and spices.',
    },
    status: 'published',
    createdAt: '2026-02-02T10:00:00Z',
    updatedAt: '2026-10-01T12:00:00Z',
  },
  {
    id: 'prod_mak_03',
    handle: 'desi-ghee-roasted-makhana',
    title: 'Pure Desi Ghee Slow-Roasted Makhana',
    description:
      'The traditional Indian home-style snack: Jumbo lotus seeds slow-roasted in pure A2 cow ghee with rock salt and crushed black pepper.',
    images: [
      {
        id: 'img_m03_1',
        url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80',
        altText: 'Desi ghee roasted makhana with black pepper',
      },
    ],
    primaryCategoryId: 'cat_makhana',
    categoryIds: ['cat_makhana', 'cat_makhana_savory'],
    collectionIds: ['col_grandma', 'col_best_sellers'],
    tags: ['desi-ghee', 'kali-mirch', 'ayurvedic'],
    variants: [
      {
        id: 'var_m03_150',
        title: '150g Jar',
        packSize: '150g',
        sku: 'BK-MAK-GHE-150',
        price: { amount: 26900, currencyCode: 'INR' },
        inStock: true,
        stockQuantity: 190,
        weightGrams: 180,
      },
    ],
    foodAttributes: {
      ...BASE_FOOD_ATTRS,
      ingredients: [
        'Jumbo Makhana (85%)',
        'Pure A2 Cow Ghee (12%)',
        'Sendha Namak (Rock Salt 2%)',
        'Crushed Black Pepper (1%)',
      ],
      allergens: ['Milk / Ghee'],
      shelfLife: '6 Months',
      netWeight: '150g',
    },
    attributes: {
      roastType: 'Pure Desi Ghee Roasted',
      flavor: 'Himalayan Pink Salt',
      sizeGrade: 'Jumbo 6+',
    },
    seo: {
      title: 'Desi Ghee Roasted Makhana Online | Bramhkanti',
      description:
        'Authentic Indian makhana roasted in pure cow ghee and crushed black pepper.',
    },
    status: 'published',
    featured: true,
    createdAt: '2026-02-08T10:00:00Z',
    updatedAt: '2026-10-01T12:00:00Z',
  },
  {
    id: 'prod_mak_04',
    handle: 'pudina-mint-crispy-makhana',
    title: 'Cool Pudina (Mint) Crispy Makhana',
    description:
      'Refreshing roasted lotus seeds infused with real dried spearmint, coriander leaves, dry mango powder, and black salt.',
    images: [
      {
        id: 'img_m04_1',
        url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80',
        altText: 'Pudina mint flavored makhana',
      },
    ],
    primaryCategoryId: 'cat_makhana',
    categoryIds: ['cat_makhana', 'cat_makhana_savory'],
    collectionIds: [],
    tags: ['pudina', 'mint', 'chatpata'],
    variants: [
      {
        id: 'var_m04_100',
        title: '100g Pouch',
        packSize: '100g',
        sku: 'BK-MAK-MIN-100',
        price: { amount: 16900, currencyCode: 'INR' },
        inStock: true,
        stockQuantity: 140,
        weightGrams: 120,
      },
    ],
    foodAttributes: {
      ...BASE_FOOD_ATTRS,
      ingredients: [
        'Jumbo Makhana (86%)',
        'Olive Oil (10%)',
        'Pudina Masala Mix (Mint, Amchur, Salt 4%)',
      ],
      allergens: [],
      shelfLife: '6 Months',
      netWeight: '100g',
    },
    attributes: {
      roastType: 'Slow Roasted in Olive Oil',
      flavor: 'Mint Pudina',
      sizeGrade: 'Jumbo 6+',
    },
    seo: {
      title: 'Chatpata Pudina Mint Roasted Makhana | Bramhkanti',
      description: 'Refreshing mint flavored roasted foxnuts for afternoon tea snacking.',
    },
    status: 'published',
    createdAt: '2026-02-14T10:00:00Z',
    updatedAt: '2026-10-01T12:00:00Z',
  },
  {
    id: 'prod_mak_05',
    handle: 'gur-jaggery-caramelized-makhana',
    title: 'Gur (Organic Jaggery) Caramelized Makhana',
    description:
      'A sublime guilt-free dessert snack: Crisp foxnuts glazed with molten Kolhapuri organic jaggery, toasted sesame seeds, and a pinch of green cardamom.',
    images: [
      {
        id: 'img_m05_1',
        url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80',
        altText: 'Jaggery glazed sweet makhana with sesame',
      },
    ],
    primaryCategoryId: 'cat_makhana',
    categoryIds: ['cat_makhana', 'cat_makhana_sweet'],
    collectionIds: ['col_diwali'],
    tags: ['jaggery', 'gur', 'sweet', 'sesame'],
    variants: [
      {
        id: 'var_m05_150',
        title: '150g Jar',
        packSize: '150g',
        sku: 'BK-MAK-GUR-150',
        price: { amount: 24900, currencyCode: 'INR' },
        inStock: true,
        stockQuantity: 170,
        weightGrams: 180,
      },
    ],
    foodAttributes: {
      ...BASE_FOOD_ATTRS,
      ingredients: [
        'Jumbo Makhana (50%)',
        'Organic Jaggery (Gur 42%)',
        'Toasted Sesame Seeds (Til 5%)',
        'Desi Cow Ghee (3%)',
        'Cardamom',
      ],
      allergens: ['Sesame', 'Milk / Ghee'],
      shelfLife: '6 Months',
      netWeight: '150g',
    },
    attributes: {
      roastType: 'Pure Desi Ghee Roasted',
      flavor: 'Jaggery Gur',
      sizeGrade: 'Jumbo 6+',
    },
    seo: {
      title: 'Organic Gur Caramelized Makhana | Sweet Jaggery Foxnuts',
      description:
        'Healthy crunchy sweet makhana glazed with pure jaggery, sesame seeds, and ghee.',
    },
    status: 'published',
    createdAt: '2026-02-24T10:00:00Z',
    updatedAt: '2026-10-01T12:00:00Z',
  },
  {
    id: 'prod_mak_06',
    handle: 'cream-and-onion-makhana',
    title: 'Herb Cream & Onion Roasted Makhana',
    description:
      'Gourmet roasted foxnuts dusted with creamy dairy milk solids, toasted onion flakes, chives, and fresh cracked pepper.',
    images: [
      {
        id: 'img_m06_1',
        url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80',
        altText: 'Cream and onion makhana snack',
      },
    ],
    primaryCategoryId: 'cat_makhana',
    categoryIds: ['cat_makhana', 'cat_makhana_savory'],
    collectionIds: [],
    tags: ['cream-onion', 'savory', 'snack'],
    variants: [
      {
        id: 'var_m06_100',
        title: '100g Pouch',
        packSize: '100g',
        sku: 'BK-MAK-CNO-100',
        price: { amount: 17900, currencyCode: 'INR' },
        inStock: true,
        stockQuantity: 130,
        weightGrams: 120,
      },
    ],
    foodAttributes: {
      ...BASE_FOOD_ATTRS,
      ingredients: [
        'Jumbo Makhana (85%)',
        'Olive Oil (10%)',
        'Sour Cream & Onion Seasoning (Milk solids, Onion, Herbs 5%)',
      ],
      allergens: ['Milk / Dairy'],
      shelfLife: '6 Months',
      netWeight: '100g',
    },
    attributes: {
      roastType: 'Slow Roasted in Olive Oil',
      flavor: 'Cream & Onion',
      sizeGrade: 'Jumbo 6+',
    },
    seo: {
      title: 'Cream & Onion Roasted Makhana | Bramhkanti Snacks',
      description: 'Savory herb cream and onion flavored roasted foxnuts.',
    },
    status: 'published',
    createdAt: '2026-03-02T10:00:00Z',
    updatedAt: '2026-10-01T12:00:00Z',
  },
  {
    id: 'prod_mak_07',
    handle: 'raw-jumbo-organic-phool-makhana',
    title: 'Raw Jumbo 6+ Grade Phool Makhana (Unroasted)',
    description:
      'Pure, unprocessed, top-tier lotus seeds hand-selected from the freshwater wetlands of Mithila. Perfect for homemade kheer, curries, and custom roasting.',
    images: [
      {
        id: 'img_m07_1',
        url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80',
        altText: 'Raw organic jumbo phool makhana',
      },
    ],
    primaryCategoryId: 'cat_makhana',
    categoryIds: ['cat_makhana', 'cat_makhana_raw'],
    collectionIds: ['col_best_sellers'],
    tags: ['raw', 'unroasted', 'jumbo', 'mithila'],
    variants: [
      {
        id: 'var_m07_250',
        title: '250g Zip Pouch',
        packSize: '250g',
        sku: 'BK-MAK-RAW-250',
        price: { amount: 34900, currencyCode: 'INR' },
        inStock: true,
        stockQuantity: 240,
        weightGrams: 270,
      },
      {
        id: 'var_m07_500',
        title: '500g Value Pack',
        packSize: '500g',
        sku: 'BK-MAK-RAW-500',
        price: { amount: 64900, currencyCode: 'INR' },
        compareAtPrice: { amount: 74900, currencyCode: 'INR' },
        inStock: true,
        stockQuantity: 150,
        weightGrams: 530,
      },
    ],
    foodAttributes: {
      ...BASE_FOOD_ATTRS,
      ingredients: ['100% Raw Jumbo Grade Lotus Seeds (Phool Makhana)'],
      allergens: [],
      shelfLife: '12 Months',
      netWeight: '250g',
    },
    attributes: {
      roastType: 'Air Roasted',
      flavor: 'Plain Raw',
      sizeGrade: 'Jumbo 6+',
    },
    seo: {
      title: 'Raw Jumbo 6+ Organic Phool Makhana (250g / 500g) | Bramhkanti',
      description:
        'Buy GI-tagged raw Mithila lotus seeds online. Premium jumbo size for healthy cooking.',
    },
    status: 'published',
    createdAt: '2026-03-08T10:00:00Z',
    updatedAt: '2026-10-01T12:00:00Z',
  },
  {
    id: 'prod_mak_08',
    handle: 'royal-diwali-makhana-trio',
    title: 'Royal Makhana Trio Festive Gift Box',
    description:
      'Luxurious festive gift pack featuring three 100g tins: Pink Salt & Olive Oil, Pure Desi Ghee & Black Pepper, and Jaggery Sesame.',
    images: [
      {
        id: 'img_m08_1',
        url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80',
        altText: 'Festive Makhana Trio gift tins',
      },
    ],
    primaryCategoryId: 'cat_makhana',
    categoryIds: ['cat_makhana', 'cat_makhana_savory', 'cat_makhana_sweet'],
    collectionIds: ['col_diwali'],
    tags: ['gifting', 'trio', 'festive'],
    variants: [
      {
        id: 'var_m08_300',
        title: '3x100g Tins Gift Pack',
        packSize: '300g',
        sku: 'BK-MAK-TRI-300',
        price: { amount: 59900, currencyCode: 'INR' },
        compareAtPrice: { amount: 69900, currencyCode: 'INR' },
        inStock: true,
        stockQuantity: 85,
        weightGrams: 450,
      },
    ],
    foodAttributes: {
      ...BASE_FOOD_ATTRS,
      ingredients: [
        'Jumbo Makhana',
        'Extra Virgin Olive Oil',
        'Desi Cow Ghee',
        'Organic Jaggery',
        'Rock Salt',
        'Black Pepper',
        'Sesame',
      ],
      allergens: ['Milk / Ghee', 'Sesame'],
      shelfLife: '6 Months',
      netWeight: '300g',
    },
    attributes: {
      roastType: 'Slow Roasted in Olive Oil',
      flavor: 'Himalayan Pink Salt',
      sizeGrade: 'Jumbo 6+',
    },
    seo: {
      title: 'Royal Makhana Trio Gift Box | Healthy Festive Gifting | Bramhkanti',
      description:
        'Festive healthy gift set with three gourmet flavors of roasted makhana.',
    },
    status: 'published',
    createdAt: '2026-03-12T10:00:00Z',
    updatedAt: '2026-10-01T12:00:00Z',
  },
];
