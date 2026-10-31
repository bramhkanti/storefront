import { publicEnv } from '@/lib/env.public';
import { ENGLISH_DICTIONARY } from '@/lib/i18n';

const { common, navigation, cart } = ENGLISH_DICTIONARY;

// Real business details come from NEXT_PUBLIC_* settings (deploy/.env, then
// rebuild the storefront). Unset values are hidden instead of showing samples.
const FSSAI_LICENSE = publicEnv.NEXT_PUBLIC_FSSAI_LICENSE_NUMBER ?? '';
const WHATSAPP_DIGITS = publicEnv.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '';
const SUPPORT_EMAIL =
  publicEnv.NEXT_PUBLIC_SUPPORT_EMAIL ?? navigation.contact.supportEmail;

/** 919876543210 -> '+91 98765 43210'. */
function formatPhone(digits: string): string {
  if (!digits) return '';
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  return `+${digits}`;
}

const ORDER_HELP_TEXT = 'Hello Bramhkanti, I have an inquiry about my order.';

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
    fssaiLicenseNumber: FSSAI_LICENSE,
    fssaiBadgeText: FSSAI_LICENSE
      ? `FSSAI Lic. No. ${FSSAI_LICENSE} • 100% Pure Vegetarian`
      : '100% Pure Vegetarian',
    countryOfOrigin: 'India',
  },
  contact: {
    supportEmail: SUPPORT_EMAIL,
    supportPhone: formatPhone(WHATSAPP_DIGITS),
    whatsappNumber: formatPhone(WHATSAPP_DIGITS),
    /** Empty when NEXT_PUBLIC_WHATSAPP_NUMBER is not set. */
    whatsappMessageUrl: WHATSAPP_DIGITS
      ? `https://wa.me/${WHATSAPP_DIGITS}?text=${encodeURIComponent(ORDER_HELP_TEXT)}`
      : '',
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
