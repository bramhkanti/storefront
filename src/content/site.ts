import { ENGLISH_DICTIONARY } from '@/lib/i18n';

const { common, navigation, cart } = ENGLISH_DICTIONARY;

/**
 * Centralized site copy, brand constants, and regulatory metadata.
 *
 * Sourced directly from localized modular dictionaries to maintain
 * a strict single source of truth across the entire storefront.
 */
export const SITE_CONFIG = {
  brand: {
    name: common.brand.name,
    legalName: common.brand.legalName,
    tagline: common.brand.tagline,
    description: common.brand.description,
    foundedYear: 2024,
    copyrightYear: 2026,
    fssaiLicenseNumber: '10024011000123',
    fssaiBadgeText: common.certifications.fssaiBadge,
    countryOfOrigin: 'India',
  },
  contact: {
    supportEmail: navigation.contact.supportEmail,
    supportPhone: navigation.contact.supportPhone,
    whatsappNumber: '+91 98765 43210',
    whatsappMessageUrl:
      'https://wa.me/919876543210?text=Hello%20Bramhkanti,%20I%20have%20an%20inquiry%20about%20my%20order.',
    operatingHours: navigation.contact.operatingHours,
    address: {
      line1: 'Bramhkanti Heritage Works, Ghat Road',
      city: 'Varanasi',
      state: 'Uttar Pradesh',
      postalCode: '221001',
      country: 'India',
    },
  },
  guarantees: [
    {
      title: common.guarantees.sunCured.title,
      description: common.guarantees.sunCured.description,
    },
    {
      title: common.guarantees.desiGhee.title,
      description: common.guarantees.desiGhee.description,
    },
    {
      title: common.guarantees.makhana.title,
      description: common.guarantees.makhana.description,
    },
    {
      title: common.guarantees.vegetarian.title,
      description: common.guarantees.vegetarian.description,
    },
  ],
  ui: {
    skipToContent: common.ui.skipToContent,
    searchPlaceholder: common.ui.searchPlaceholder,
    cartTitle: cart.cart.title,
    emptyCartText: cart.cart.emptyMessage,
    continueShopping: cart.cart.exploreCatalog,
    checkoutButton: cart.cart.proceedToCheckout,
    subtotalLabel: cart.cart.subtotalLabel,
    shippingNote: cart.cart.shippingNote,
    outOfStockBadge: common.actions.soldOut,
    vegetarianBadge: common.certifications.vegBadge,
    currencySymbol: common.ui.currencySymbol,
  },
  footer: {
    aboutTitle: navigation.sections.aboutTitle,
    aboutCopy: navigation.sections.aboutCopy,
    categoriesTitle: navigation.sections.categories,
    customerCareTitle: navigation.sections.customerCare,
    legalTitle: navigation.sections.policiesTrust,
    rightsReserved: navigation.legal.rightsReserved,
  },
} as const;
