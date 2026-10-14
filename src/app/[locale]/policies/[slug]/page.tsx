import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { POLICIES, type PolicySlug } from '@/content/policies';
import { SITE_CONFIG } from '@/content/site';
import { buildMetadata } from '@/lib/seo/metadata';
import { isSupportedLocale } from '@/lib/i18n';

export const instant = false;

interface PolicyPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const VALID_SLUGS: PolicySlug[] = [
  'shipping',
  'refund',
  'privacy',
  'terms',
  'about',
  'contact',
];

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return VALID_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PolicyPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const policy = POLICIES[slug as PolicySlug];

  if (!policy) {
    return {};
  }

  return buildMetadata({
    title: `${policy.title} | ${SITE_CONFIG.brand.name} Heritage Foods`,
    description: policy.subtitle,
    canonicalPath: `/policies/${policy.slug}`,
    locale: isSupportedLocale(locale) ? locale : 'en',
  });
}

export default async function PolicyPage({
  params,
}: PolicyPageProps): Promise<ReactNode> {
  const { slug } = await params;
  const policy = POLICIES[slug as PolicySlug];

  if (!policy) {
    notFound();
  }

  const breadcrumbs = [
    { name: 'Policies', href: '/policies/shipping' },
    { name: policy.title },
  ];

  return (
    <div className="space-y-10 py-8 sm:space-y-12 sm:py-12">
      <Container className="space-y-8">
        <Breadcrumbs items={breadcrumbs} />

        {/* Policy Tab Navigation */}
        <div className="border-heritage-border flex flex-wrap gap-2 border-b pb-4">
          {VALID_SLUGS.map((s) => {
            const p = POLICIES[s];
            const isActive = s === policy.slug;
            const tabLabel =
              s === 'about'
                ? 'About Us'
                : s === 'contact'
                  ? 'Contact Us'
                  : `${p.title.split(' ')[0]} Policy`;
            return (
              <Link
                key={s}
                href={`/policies/${s}`}
                className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-heritage-maroon text-white shadow-xs'
                    : 'bg-heritage-cream-dark/60 text-heritage-charcoal hover:bg-heritage-cream-dark hover:text-heritage-maroon'
                }`}
              >
                {tabLabel}
              </Link>
            );
          })}
        </div>

        {/* Header Block */}
        <div className="border-heritage-border bg-heritage-cream rounded-2xl border p-6 shadow-xs sm:p-10">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="vegetarian">100% Pure Veg</Badge>
              <span className="text-heritage-saffron-dark text-xs font-semibold tracking-wider uppercase">
                Statutory Documentation
              </span>
            </div>

            <h1 className="text-heritage-maroon font-serif text-3xl font-extrabold tracking-tight sm:text-4xl">
              {policy.title}
            </h1>

            <p className="text-heritage-muted text-sm leading-relaxed sm:text-base">
              {policy.subtitle}
            </p>

            <div className="text-heritage-muted flex items-center gap-2 pt-2 text-xs">
              <span>Last updated: {policy.lastUpdated}</span>
              <span>•</span>
              <span className="flex items-center gap-1 font-medium text-emerald-800">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>{SITE_CONFIG.brand.fssaiBadgeText}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Policy Content Sections */}
        <div className="border-heritage-border bg-heritage-cream divide-heritage-border/60 max-w-4xl divide-y rounded-2xl border p-6 shadow-xs sm:p-10">
          {policy.sections.map((section) => (
            <section
              key={section.heading}
              className="space-y-3 py-6 first:pt-0 last:pb-0"
            >
              <h2 className="text-heritage-charcoal font-serif text-lg font-bold sm:text-xl">
                {section.heading}
              </h2>

              {section.paragraphs.map((p, idx) => (
                <p
                  key={idx}
                  className="text-heritage-muted text-sm leading-relaxed sm:text-base"
                >
                  {p}
                </p>
              ))}

              {section.bulletPoints && section.bulletPoints.length > 0 && (
                <ul className="text-heritage-charcoal mt-2 space-y-2 pl-4 text-xs sm:text-sm">
                  {section.bulletPoints.map((item, bIdx) => (
                    <li key={bIdx} className="list-disc leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </Container>
    </div>
  );
}
