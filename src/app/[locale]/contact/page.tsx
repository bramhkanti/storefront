import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  MessageCircle,
  Mail,
  Clock,
  MapPin,
  ShieldCheck,
  Gift,
  ArrowRight,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { SITE_CONFIG } from '@/content/site';
import { buildMetadata } from '@/lib/seo/metadata';
import { isSupportedLocale } from '@/lib/i18n';

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;

  return buildMetadata({
    title: `Contact Us & Customer Support | ${SITE_CONFIG.brand.name}`,
    description:
      'Connect with Bramhkanti Customer Care for parcel tracking, bulk festive gifting, wedding orders, or ingredient inquiries. WhatsApp, email, or visit our Varanasi workshop.',
    canonicalPath: '/contact',
    locale: isSupportedLocale(locale) ? locale : 'en',
  });
}

export default function ContactPage(): ReactNode {
  const breadcrumbs = [{ name: 'Contact Us' }];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: `Contact ${SITE_CONFIG.brand.name}`,
    url: 'https://bramhkanti.com/contact',
    mainEntity: {
      '@type': 'Organization',
      name: SITE_CONFIG.brand.legalName,
      url: 'https://bramhkanti.com',
      logo: 'https://bramhkanti.com/logo.png',
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: SITE_CONFIG.contact.whatsappNumber,
          contactType: 'customer service',
          email: SITE_CONFIG.contact.supportEmail,
          availableLanguage: ['English', 'Hindi'],
          hoursAvailable: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
            ],
            opens: '09:00',
            closes: '19:00',
          },
        },
      ],
      address: {
        '@type': 'PostalAddress',
        streetAddress: SITE_CONFIG.contact.address.line1,
        addressLocality: SITE_CONFIG.contact.address.city,
        addressRegion: SITE_CONFIG.contact.address.state,
        postalCode: SITE_CONFIG.contact.address.postalCode,
        addressCountry: SITE_CONFIG.contact.address.country,
      },
    },
  };

  return (
    <div className="space-y-10 py-8 sm:space-y-14 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Container className="space-y-8">
        <Breadcrumbs items={breadcrumbs} />

        {/* Hero Header */}
        <section className="border-heritage-border bg-heritage-cream rounded-3xl border p-8 shadow-xs sm:p-12">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="vegetarian">100% Pure Veg</Badge>
              <span className="text-heritage-saffron-dark text-xs font-semibold tracking-wider uppercase">
                Customer Care & Helpdesk
              </span>
            </div>

            <h1 className="text-heritage-maroon font-serif text-3xl font-extrabold tracking-tight sm:text-5xl">
              We’re Here for You
            </h1>

            <p className="text-heritage-muted text-sm leading-relaxed sm:text-base">
              Have a question about your order, transit tracking, ancestral recipes, or
              custom wedding gifting? Reach out to our customer care desk directly — we
              are always delighted to help.
            </p>

            <div className="text-heritage-muted flex items-center gap-2 pt-2 text-xs">
              <span className="flex items-center gap-1 font-medium text-emerald-800">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Certified Pure Veg Workshop</span>
              </span>
              <span>•</span>
              <span>Lic. No. {SITE_CONFIG.brand.fssaiLicenseNumber}</span>
            </div>
          </div>
        </section>

        {/* Support Channels Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* WhatsApp Card */}
          <div className="border-heritage-border bg-heritage-cream flex flex-col justify-between rounded-2xl border p-6 shadow-xs sm:p-8">
            <div className="space-y-3">
              <div className="inline-flex rounded-xl bg-emerald-500/10 p-3 text-emerald-700">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h2 className="text-heritage-charcoal font-serif text-lg font-bold sm:text-xl">
                WhatsApp Support
              </h2>
              <p className="text-heritage-muted text-xs leading-relaxed sm:text-sm">
                Get real-time order updates, tracking information, and instant culinary
                recommendations on WhatsApp.
              </p>
              <p className="text-heritage-charcoal font-mono text-sm font-semibold">
                {SITE_CONFIG.contact.whatsappNumber}
              </p>
            </div>
            <div className="pt-6">
              <a
                href={SITE_CONFIG.contact.whatsappMessageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-800"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Email Support Card */}
          <div className="border-heritage-border bg-heritage-cream flex flex-col justify-between rounded-2xl border p-6 shadow-xs sm:p-8">
            <div className="space-y-3">
              <div className="bg-heritage-maroon/10 text-heritage-maroon inline-flex rounded-xl p-3">
                <Mail className="h-6 w-6" />
              </div>
              <h2 className="text-heritage-charcoal font-serif text-lg font-bold sm:text-xl">
                Email Customer Care
              </h2>
              <p className="text-heritage-muted text-xs leading-relaxed sm:text-sm">
                For order receipts, tax invoices, corporate inquiries, or escalations,
                drop us an email anytime.
              </p>
              <p className="text-heritage-charcoal text-sm font-semibold">
                {SITE_CONFIG.contact.supportEmail}
              </p>
            </div>
            <div className="pt-6">
              <a
                href={`mailto:${SITE_CONFIG.contact.supportEmail}`}
                className="bg-heritage-maroon hover:bg-heritage-maroon-hover inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold text-white transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>Send Us an Email</span>
              </a>
            </div>
          </div>

          {/* Operating Hours Card */}
          <div className="border-heritage-border bg-heritage-cream flex flex-col justify-between rounded-2xl border p-6 shadow-xs sm:p-8">
            <div className="space-y-3">
              <div className="bg-heritage-saffron/15 text-heritage-saffron-dark inline-flex rounded-xl p-3">
                <Clock className="h-6 w-6" />
              </div>
              <h2 className="text-heritage-charcoal font-serif text-lg font-bold sm:text-xl">
                Operating Hours
              </h2>
              <p className="text-heritage-muted text-xs leading-relaxed sm:text-sm">
                Our kitchen dispatch and customer care desk in Varanasi operates during
                standard business hours:
              </p>
              <p className="text-heritage-charcoal text-sm font-semibold">
                {SITE_CONFIG.contact.operatingHours}
              </p>
            </div>
            <div className="pt-6">
              <span className="border-heritage-border bg-heritage-cream-dark/60 text-heritage-charcoal inline-flex w-full items-center justify-center rounded-lg border px-4 py-2.5 text-xs font-medium">
                Sunday: Closed for Preparation
              </span>
            </div>
          </div>
        </div>

        {/* Location & Workshop Address */}
        <section className="border-heritage-border bg-heritage-cream rounded-2xl border p-6 shadow-xs sm:p-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-3">
              <div className="bg-heritage-maroon/10 text-heritage-maroon inline-flex rounded-xl p-2.5">
                <MapPin className="h-5 w-5" />
              </div>
              <h2 className="text-heritage-charcoal font-serif text-xl font-bold sm:text-2xl">
                Culinary Workshop & Registered Office
              </h2>
              <p className="text-heritage-charcoal text-sm font-semibold">
                {SITE_CONFIG.brand.legalName}
              </p>
              <p className="text-heritage-muted text-sm leading-relaxed">
                {SITE_CONFIG.contact.address.line1}
                <br />
                {SITE_CONFIG.contact.address.city}, {SITE_CONFIG.contact.address.state} -{' '}
                {SITE_CONFIG.contact.address.postalCode}
                <br />
                {SITE_CONFIG.contact.address.country}
              </p>
              <p className="text-heritage-muted pt-1 text-xs">
                FSSAI License No.{' '}
                <span className="text-heritage-charcoal font-mono font-medium">
                  {SITE_CONFIG.brand.fssaiLicenseNumber}
                </span>
              </p>
            </div>

            {/* Custom Wedding & Bulk Inquiries */}
            <div className="border-heritage-border bg-heritage-cream-dark/40 space-y-3 rounded-xl border p-6">
              <div className="text-heritage-maroon flex items-center gap-2">
                <Gift className="h-5 w-5" />
                <h3 className="font-serif text-lg font-bold">Bulk & Festive Gifting</h3>
              </div>
              <p className="text-heritage-muted text-xs leading-relaxed sm:text-sm">
                Planning wedding favors, corporate Diwali hampers, or bespoke gift sets in
                traditional brass martabans? We curate customized packaging tailored to
                your celebrations.
              </p>
              <a
                href={`${SITE_CONFIG.contact.whatsappMessageUrl}&text=Hello%20Bramhkanti,%20I%20am%20interested%20in%20bulk/corporate%20gifting.`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-heritage-maroon hover:text-heritage-maroon-hover inline-flex items-center gap-1.5 text-xs font-semibold underline underline-offset-2 transition-colors"
              >
                <span>Inquire for Custom Hampers</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* Helpful Policy Links */}
        <section className="border-heritage-border bg-heritage-cream/50 flex flex-wrap items-center justify-between gap-4 rounded-xl border p-6">
          <div className="space-y-1">
            <h3 className="text-heritage-charcoal text-sm font-bold">
              Looking for Order Policies?
            </h3>
            <p className="text-heritage-muted text-xs">
              Check out our standard dispatch timelines, free shipping milestone, or
              replacement guarantee.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/policies/shipping"
              className="border-heritage-border text-heritage-charcoal hover:bg-heritage-cream-dark inline-flex items-center gap-1.5 rounded-lg border bg-white px-3.5 py-2 text-xs font-semibold transition-colors"
            >
              <Truck className="text-heritage-maroon h-3.5 w-3.5" />
              <span>Shipping Policy</span>
            </Link>
            <Link
              href="/policies/refund"
              className="border-heritage-border text-heritage-charcoal hover:bg-heritage-cream-dark inline-flex items-center gap-1.5 rounded-lg border bg-white px-3.5 py-2 text-xs font-semibold transition-colors"
            >
              <RotateCcw className="text-heritage-maroon h-3.5 w-3.5" />
              <span>Refund Policy</span>
            </Link>
          </div>
        </section>
      </Container>
    </div>
  );
}
