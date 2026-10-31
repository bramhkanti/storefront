import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  Sun,
  Sparkles,
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { SITE_CONFIG } from '@/content/site';
import { buildMetadata } from '@/lib/seo/metadata';
import { isSupportedLocale } from '@/lib/i18n';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;

  return buildMetadata({
    title: `About Us | Heritage & Story of ${SITE_CONFIG.brand.name}`,
    description:
      'Discover Bramhkanti — pure sun-cured pickles, traditional sweets, and artisanal delicacies rooted in sacred Varanasi traditions. 100% pure vegetarian, handcrafted with ancestral recipes.',
    canonicalPath: '/about',
    locale: isSupportedLocale(locale) ? locale : 'en',
  });
}

export default function AboutPage(): ReactNode {
  const breadcrumbs = [{ name: 'About Us' }];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: `About ${SITE_CONFIG.brand.name} Heritage Foods`,
    description: SITE_CONFIG.brand.description,
    url: 'https://bramhkanti.com/about',
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.brand.legalName,
      url: 'https://bramhkanti.com',
      logo: 'https://bramhkanti.com/logo.png',
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
    <div className="space-y-12 py-8 sm:space-y-16 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Container className="space-y-10">
        <Breadcrumbs items={breadcrumbs} />

        {/* Hero Section */}
        <section className="border-heritage-border bg-heritage-cream relative overflow-hidden rounded-3xl border p-8 shadow-xs sm:p-14">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="vegetarian">100% Pure Veg</Badge>
              <span className="text-heritage-saffron-dark text-xs font-semibold tracking-wider uppercase">
                Varanasi Culinary Heritage
              </span>
            </div>

            <h1 className="text-heritage-maroon font-serif text-3xl font-extrabold tracking-tight sm:text-5xl">
              Sacred Flavours, Handcrafted in Varanasi
            </h1>

            <p className="text-heritage-charcoal text-base leading-relaxed sm:text-lg">
              At Bramhkanti, we believe food is not merely sustenance — it is a sacred
              offering. Born on the ghats of ancient Kashi, our mission is to revive
              timeless Indian grandmother recipes using pure cold-pressed oils, natural
              sun-curing, and zero synthetic preservatives.
            </p>

            <div className="text-heritage-muted flex flex-wrap items-center gap-4 pt-2 text-xs sm:text-sm">
              <span className="flex items-center gap-1.5 font-medium text-emerald-800">
                <ShieldCheck className="h-4 w-4" />
                <span>{SITE_CONFIG.brand.fssaiBadgeText}</span>
              </span>
              {SITE_CONFIG.brand.fssaiLicenseNumber && (
                <>
                  <span>•</span>
                  <span>FSSAI Lic. No. {SITE_CONFIG.brand.fssaiLicenseNumber}</span>
                </>
              )}
              <span>•</span>
              <span>Est. {SITE_CONFIG.brand.foundedYear}</span>
            </div>
          </div>
        </section>

        {/* Story Narrative Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Card 1: Sacred Roots */}
          <div className="border-heritage-border bg-heritage-cream/60 space-y-4 rounded-2xl border p-6 sm:p-8">
            <div className="bg-heritage-maroon/10 text-heritage-maroon inline-flex rounded-xl p-3">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="text-heritage-charcoal font-serif text-xl font-bold sm:text-2xl">
              1. Ancestral Roots & The Spirit of Kashi
            </h2>
            <p className="text-heritage-muted text-sm leading-relaxed sm:text-base">
              Varanasi is the cultural and spiritual cradle of India. For centuries, our
              households preserved the seasonal abundance of nature by transforming fresh
              green mangoes, red Banarasi chillies, and ginger into aromatic achars and
              sun-dried delicacies.
            </p>
            <p className="text-heritage-muted text-sm leading-relaxed sm:text-base">
              Bramhkanti honors this continuum of culinary wisdom. Every jar is
              handcrafted with unhurried care, invoking the authentic taste of
              grandmother’s kitchen.
            </p>
          </div>

          {/* Card 2: Slow Craft */}
          <div className="border-heritage-border bg-heritage-cream/60 space-y-4 rounded-2xl border p-6 sm:p-8">
            <div className="bg-heritage-saffron/15 text-heritage-saffron-dark inline-flex rounded-xl p-3">
              <Sun className="h-6 w-6" />
            </div>
            <h2 className="text-heritage-charcoal font-serif text-xl font-bold sm:text-2xl">
              2. Naturally Sun-Cured & Zero Chemicals
            </h2>
            <p className="text-heritage-muted text-sm leading-relaxed sm:text-base">
              Modern food production relies on chemical accelerators, synthetic vinegar,
              and artificial preservatives. We reject all shortcuts.
            </p>
            <ul className="text-heritage-charcoal space-y-2 text-sm sm:text-base">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="text-heritage-saffron-dark mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  Naturally sun-cured for weeks in traditional ceramic martabans.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="text-heritage-saffron-dark mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  Stone-ground regional spices hand-mixed with unrefined cold-pressed
                  mustard oil.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="text-heritage-saffron-dark mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  Hermetically sealed in food-grade packaging for spill-proof doorstep
                  transit.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Guarantees & Pillars */}
        <section className="space-y-6">
          <div className="text-center">
            <span className="text-heritage-saffron-dark text-xs font-semibold tracking-wider uppercase">
              Our Purity Standards
            </span>
            <h2 className="text-heritage-charcoal font-serif text-2xl font-bold sm:text-3xl">
              The Four Pillars of Bramhkanti
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SITE_CONFIG.guarantees.map((g) => (
              <div
                key={g.title}
                className="border-heritage-border bg-heritage-cream rounded-xl border p-5 transition-shadow hover:shadow-xs"
              >
                <h3 className="text-heritage-maroon font-serif text-base font-bold">
                  {g.title}
                </h3>
                <p className="text-heritage-muted mt-2 text-xs leading-relaxed sm:text-sm">
                  {g.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Community & Sourcing */}
        <section className="border-heritage-border bg-heritage-cream-dark/50 flex flex-col items-center justify-between gap-6 rounded-2xl border p-8 sm:flex-row sm:p-10">
          <div className="max-w-xl space-y-2">
            <div className="text-heritage-maroon flex items-center gap-2">
              <HeartHandshake className="h-5 w-5" />
              <span className="text-xs font-semibold tracking-wider uppercase">
                Farmer First
              </span>
            </div>
            <h3 className="text-heritage-charcoal font-serif text-xl font-bold sm:text-2xl">
              Ethically Sourced from Regional Farmers
            </h3>
            <p className="text-heritage-muted text-sm leading-relaxed">
              We partner directly with regional farmer cooperatives across Uttar Pradesh
              and Bihar for raw green mangoes, Guntur chillies, and premium Foxnut
              makhana. This ensures fair incomes for farming families and unmatched
              freshness for you.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/collections"
              className="bg-heritage-maroon hover:bg-heritage-maroon-hover inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white transition-colors"
            >
              <span>Explore Delicacies</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="border-heritage-border text-heritage-charcoal hover:bg-heritage-cream-dark inline-flex items-center rounded-lg border bg-white px-5 py-3 text-sm font-semibold transition-colors"
            >
              <span>Contact Us</span>
            </Link>
          </div>
        </section>
      </Container>
    </div>
  );
}
