import { SITE_CONFIG } from './site';

export type PolicySlug = 'shipping' | 'refund' | 'privacy' | 'terms';

export interface PolicySection {
  heading: string;
  paragraphs: string[];
  bulletPoints?: string[];
}

export interface PolicyContent {
  slug: PolicySlug;
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: PolicySection[];
}

export const POLICIES: Record<PolicySlug, PolicyContent> = {
  shipping: {
    slug: 'shipping',
    title: 'Pan-India Shipping & Delivery Policy',
    subtitle:
      'Handcrafted heritage batches safely dispatched from our culinary workshop in Varanasi directly to your doorstep.',
    lastUpdated: 'October 2026',
    sections: [
      {
        heading: '1. Dispatch Timelines & Kitchen Preparation',
        paragraphs: [
          'Because Bramhkanti foods are prepared in authentic small batches without chemical accelerators, all orders undergo rigorous seal inspections before dispatch.',
          'Orders placed before 2:00 PM IST are dispatched within 24 hours from our licensed culinary workshop in Varanasi, Uttar Pradesh.',
        ],
      },
      {
        heading: '2. Shipping Rates & Free Delivery Milestone',
        paragraphs: [
          'We believe authentic Indian heritage foods should be accessible across every state and union territory without excessive delivery markups.',
        ],
        bulletPoints: [
          'Orders of ₹499 and above: 100% FREE Pan-India Express Delivery.',
          'Orders below ₹499: A flat subsidized logistics fee of ₹60 is applied at checkout.',
          'Zero hidden surcharges: All prices are fully inclusive of statutory GST and transit insurance.',
        ],
      },
      {
        heading: '3. Estimated Delivery Times across India',
        paragraphs: [
          'Transit timelines are calculated from the moment of dispatch by our premium courier partners (Blue Dart, Delhivery, and India Post Speed Post for defense / remote postal codes):',
        ],
        bulletPoints: [
          'Delhi-NCR, Uttar Pradesh & Northern Hubs: 2 to 3 business days.',
          'Mumbai, Pune, Bengaluru, Hyderabad, Chennai, Kolkata: 3 to 4 business days.',
          'Tier-2 / Tier-3 Cities & Towns: 4 to 5 business days.',
          'North-Eastern States, J&K, Island Territories: 5 to 7 business days.',
        ],
      },
      {
        heading: '4. Food-Grade Spill-Proof Packaging',
        paragraphs: [
          'Oil-based traditional pickles and ghee-rich sweets require specialized transit packaging. Every Bramhkanti container is hermetically sealed with induction foil, cushioned with recyclable honeycomb wrap, and packed in reinforced corrugated mailers to prevent leakage or breakage during transit.',
        ],
      },
      {
        heading: '5. Real-Time Consignment Tracking',
        paragraphs: [
          'The moment your package departs Varanasi, a tracking link is sent via SMS and WhatsApp. You may also contact our customer care desk at care@bramhkanti.com or WhatsApp (+91 98765 43210) for real-time delivery status.',
        ],
      },
    ],
  },

  refund: {
    slug: 'refund',
    title: 'Refund, Replacement & Food Safety Policy',
    subtitle:
      '100% customer satisfaction guarantee adhering to FSSAI food safety and hygiene protocols.',
    lastUpdated: 'October 2026',
    sections: [
      {
        heading: '1. Food Safety & Return Exemption',
        paragraphs: [
          'Under the Food Safety and Standards Authority of India (FSSAI) guidelines and sanitary standards, perishable food articles (pickles, desi ghee mithai, and roasted makhana) cannot be accepted for return or restocking once the package has been delivered and opened.',
          'This policy safeguards every customer from cross-contamination and guarantees that every jar arriving at your table was packed fresh at our kitchen.',
        ],
      },
      {
        heading: '2. Damaged, Tampered, or Defective Consignments',
        paragraphs: [
          'In the rare event that your package sustains transit damage, arrives with a broken tamper-evident seal, or suffers from leakage, Bramhkanti provides a 100% Hassle-Free Replacement or Full Refund Guarantee.',
        ],
        bulletPoints: [
          'Step 1: Inspect your consignment upon receipt from the courier partner.',
          'Step 2: If the outer packaging or inner jar seal is compromised, take 1 or 2 clear photographs of the package.',
          'Step 3: Share the photos with your Order ID on WhatsApp at +91 98765 43210 or email care@bramhkanti.com within 24 hours of delivery.',
        ],
      },
      {
        heading: '3. Resolution & Reimbursement Process',
        paragraphs: [
          'Upon review of the report by our quality assurance desk (typically within 4 business hours):',
        ],
        bulletPoints: [
          'Free Replacement: A fresh replacement consignment will be dispatched immediately within 24 hours via air express at zero cost to you.',
          'Full Refund: If you prefer a refund, the complete transaction amount will be credited back to your original source of payment (UPI, NetBanking, Card) within 5 to 7 banking days.',
          'Cash on Delivery (COD) orders: Refund is disbursed instantly via UPI to your confirmed VPA upon approval.',
        ],
      },
      {
        heading: '4. Cancellation Terms',
        paragraphs: [
          'Orders may be cancelled free of charge at any point prior to physical dispatch from our Varanasi kitchen (typically within 4 hours of placing the order). Once dispatched with an active courier airway bill (AWB), the consignment cannot be recalled.',
        ],
      },
    ],
  },

  privacy: {
    slug: 'privacy',
    title: 'Privacy & Data Protection Policy',
    subtitle:
      'We respect your privacy as sacred. Your personal and contact information is never traded or compromised.',
    lastUpdated: 'October 2026',
    sections: [
      {
        heading: '1. Information We Collect & Why',
        paragraphs: [
          'Bramhkanti Foods Private Limited collects only the minimal customer information strictly necessary to process orders, generate compliant tax invoices, and facilitate courier delivery:',
        ],
        bulletPoints: [
          'Full Name and Postal Delivery Address: Used exclusively for package dispatch and delivery routing.',
          'Mobile Number: Required by courier partners for delivery OTP verification and SMS/WhatsApp dispatch alerts.',
          'Email Address: Used for sending PDF tax invoices and order confirmations.',
        ],
      },
      {
        heading: '2. Payment Security & Zero Financial Storage',
        paragraphs: [
          'Bramhkanti operates on a zero-financial-data footprint. We do not store, log, or have access to your credit card numbers, debit card CVVs, net banking credentials, or UPI PINs.',
          'All online transactions are processed through RBI-authorized, PCI-DSS Level 1 certified payment gateways using 256-bit SSL encryption.',
        ],
      },
      {
        heading: '3. Absolute Non-Disclosure & Anti-Spam Pledge',
        paragraphs: [
          'We will never sell, lease, trade, or distribute your customer data to third-party telemarketers or advertisers. Your phone number will only be contacted regarding active orders or customer support queries initiated by you.',
        ],
      },
      {
        heading: '4. Cookies & Web Vitals Telemetry',
        paragraphs: [
          'Our website utilizes strictly essential session cookies to manage shopping bag items across pages (bramhkanti_cart_id). Anonymous Core Web Vitals telemetry is measured to guarantee fast page rendering speeds without tracking individual user identities.',
        ],
      },
      {
        heading: '5. Grievance Officer & Contact',
        paragraphs: [
          `For inquiries regarding personal data privacy, contact our Grievance Officer at care@bramhkanti.com or write to ${SITE_CONFIG.brand.legalName}, ${SITE_CONFIG.contact.address.line1}, ${SITE_CONFIG.contact.address.city}, ${SITE_CONFIG.contact.address.state} - ${SITE_CONFIG.contact.address.postalCode}.`,
        ],
      },
    ],
  },

  terms: {
    slug: 'terms',
    title: 'Terms of Service & Food Regulatory Compliance',
    subtitle:
      'Official terms governing commercial transactions, food safety certifications, and digital storefront usage.',
    lastUpdated: 'October 2026',
    sections: [
      {
        heading: '1. Regulatory Identification & FSSAI Licensing',
        paragraphs: [
          `This e-commerce platform is owned and operated by ${SITE_CONFIG.brand.legalName}, registered in the Republic of India.`,
          `All food processing, packaging, and distribution conforms strictly to the Food Safety and Standards Act, 2006 under FSSAI Central/State Registration License No. ${SITE_CONFIG.brand.fssaiLicenseNumber}.`,
        ],
      },
      {
        heading: '2. Pricing, Invoicing & GST',
        paragraphs: [
          'All product prices displayed on bramhkanti.com are denominated in Indian National Rupees (INR) and are inclusive of Goods and Services Tax (GST) at applicable statutory rates.',
          'We reserve the right to revise catalog prices or discontinue seasonal harvest batches at any time without prior notice.',
        ],
      },
      {
        heading: '3. Consumer Protection (E-Commerce) Rules, 2020 Compliance',
        paragraphs: [
          'In accordance with the Consumer Protection (E-Commerce) Rules, 2020 issued by the Ministry of Consumer Affairs, Government of India:',
        ],
        bulletPoints: [
          `Legal Entity: ${SITE_CONFIG.brand.legalName}.`,
          `Registered Workshop Address: ${SITE_CONFIG.contact.address.line1}, ${SITE_CONFIG.contact.address.city}, ${SITE_CONFIG.contact.address.state} - ${SITE_CONFIG.contact.address.postalCode}.`,
          `Customer Support Email: ${SITE_CONFIG.contact.supportEmail}.`,
          `Country of Origin: All raw materials, spices, and finished food packages are 100% Made in India.`,
        ],
      },
      {
        heading: '4. Intellectual Property',
        paragraphs: [
          'The trademark "Bramhkanti", brand logos, culinary descriptions, photography, packaging designs, and ancestral recipes are the exclusive intellectual property of Bramhkanti Foods Private Limited.',
        ],
      },
      {
        heading: '5. Governing Law & Judicial Jurisdiction',
        paragraphs: [
          'These Terms shall be interpreted and governed by the laws of India. Any legal dispute, proceeding, or arbitration arising from transactions on this storefront shall fall under the exclusive jurisdiction of the competent courts in Varanasi, Uttar Pradesh.',
        ],
      },
    ],
  },
};
