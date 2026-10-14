import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { BookOpen, Sparkles, Clock, ArrowRight, Sun, Flame, Leaf } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { SITE_CONFIG } from '@/content/site';
import { buildMetadata } from '@/lib/seo/metadata';
import { isSupportedLocale } from '@/lib/i18n';

interface BlogPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { locale } = await params;

  return buildMetadata({
    title: `Culinary Journal & Stories | ${SITE_CONFIG.brand.name} Heritage Foods`,
    description:
      'Explore ancestral recipes, natural sun-curing techniques, pure bilona desi ghee, and culinary heritage from the sacred kitchens of Varanasi.',
    canonicalPath: '/blog',
    locale: isSupportedLocale(locale) ? locale : 'en',
  });
}

const BLOG_ARTICLES = [
  {
    id: 'sun-cured-pickles-kashi',
    title: 'The Timeless Ritual of Sun-Cured Pickles in Kashi',
    category: 'Ancestral Technique',
    readTime: '4 min read',
    icon: Sun,
    accentClass: 'text-heritage-saffron-dark bg-heritage-saffron/15',
    excerpt:
      'Long before artificial vinegar and chemical accelerators entered Indian kitchens, achars were slowly cured under the natural Indian sun in ceramic martabans. Discover why patience creates the richest flavor.',
    highlight: 'Natural Solar Fermentation',
  },
  {
    id: 'bilona-desi-ghee-tradition',
    title: 'Bilona Desi Ghee: Churning Sacred Golden Purity',
    category: 'Vedic Purity',
    readTime: '3 min read',
    icon: Flame,
    accentClass: 'text-amber-700 bg-amber-500/10',
    excerpt:
      'Unlike commercial cream-boiled butter, authentic bilona ghee is churned from cultured whole milk curds using a two-way wooden churner. Learn the Ayurvedic science behind its aroma and health benefits.',
    highlight: 'Cultured Curd Churned',
  },
  {
    id: 'roasted-makhana-mithila-ponds',
    title: 'From Pristine Ponds to Feast: The Journey of Foxnut Makhana',
    category: 'Nutritious Superfood',
    readTime: '5 min read',
    icon: Leaf,
    accentClass: 'text-emerald-700 bg-emerald-500/10',
    excerpt:
      'Harvested by skilled indigenous communities from the wetlands of Mithila and Bihar, roasted lotus seed makhana is India’s oldest sacred fasting superfood, lightly crisp and mineral-rich.',
    highlight: '100% Farm Sourced',
  },
  {
    id: 'grandmother-spice-secrets',
    title: 'Five Ancestral Spices Every Indian Kitchen Cherishes',
    category: 'Culinary Wisdom',
    readTime: '4 min read',
    icon: Sparkles,
    accentClass: 'text-heritage-maroon bg-heritage-maroon/10',
    excerpt:
      'Kalonji, saunf, methi dana, rai, and pure hing — the quintessential Panch Phoron tradition of the Gangetic plains that balances digestion, preservation, and aromatic bliss in every bite.',
    highlight: 'Pure Whole Spices',
  },
];

export default function BlogPage(): ReactNode {
  const breadcrumbs = [{ name: 'Blog & Journal' }];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${SITE_CONFIG.brand.name} Culinary Journal`,
    description:
      'Heritage recipes, culinary philosophy, and traditional Indian food crafts.',
    url: 'https://bramhkanti.com/blog',
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.brand.legalName,
      logo: 'https://bramhkanti.com/logo.png',
    },
    blogPost: BLOG_ARTICLES.map((article) => ({
      '@type': 'BlogPosting',
      headline: article.title,
      description: article.excerpt,
      articleSection: article.category,
      timeRequired: article.readTime,
    })),
  };

  return (
    <div className="space-y-10 py-8 sm:space-y-14 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Container className="space-y-8">
        <Breadcrumbs items={breadcrumbs} />

        {/* Hero Section */}
        <section className="border-heritage-border bg-heritage-cream rounded-3xl border p-8 shadow-xs sm:p-12">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="vegetarian">100% Pure Veg</Badge>
              <span className="text-heritage-saffron-dark text-xs font-semibold tracking-wider uppercase">
                Culinary Journal & Wisdom
              </span>
            </div>

            <h1 className="text-heritage-maroon font-serif text-3xl font-extrabold tracking-tight sm:text-5xl">
              Stories from the Kitchen of Kashi
            </h1>

            <p className="text-heritage-muted text-sm leading-relaxed sm:text-base">
              Explore the timeless traditions, Vedic food wisdom, and grandmother recipes
              that shape every handcrafted delicacy in our Varanasi workshop.
            </p>

            <div className="text-heritage-muted flex items-center gap-2 pt-2 text-xs">
              <span className="flex items-center gap-1 font-medium text-emerald-800">
                <BookOpen className="h-3.5 w-3.5" />
                <span>Culinary Heritage Articles</span>
              </span>
              <span>•</span>
              <span>Slow Food Movement</span>
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {BLOG_ARTICLES.map((article) => (
            <article
              key={article.id}
              className="border-heritage-border bg-heritage-cream hover:border-heritage-maroon/40 flex flex-col justify-between rounded-2xl border p-6 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-8"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-heritage-saffron-dark text-[11px] font-bold tracking-wider uppercase">
                    {article.category}
                  </span>
                  <span className="text-heritage-muted flex items-center gap-1 text-xs">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{article.readTime}</span>
                  </span>
                </div>

                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${article.accentClass}`}
                  >
                    <article.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-heritage-charcoal font-serif text-lg font-bold sm:text-xl">
                      {article.title}
                    </h2>
                    <span className="bg-heritage-cream-dark text-heritage-maroon mt-1.5 inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold">
                      {article.highlight}
                    </span>
                  </div>
                </div>

                <p className="text-heritage-muted text-xs leading-relaxed sm:text-sm">
                  {article.excerpt}
                </p>
              </div>

              <div className="border-heritage-border/60 mt-6 border-t pt-4">
                <Link
                  href="/about"
                  className="text-heritage-maroon hover:text-heritage-maroon-hover inline-flex items-center gap-1 text-xs font-semibold transition-colors"
                >
                  <span>Read Full Story in Our Heritage Journey</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom Banner */}
        <section className="border-heritage-border bg-heritage-cream-dark/50 flex flex-col items-center justify-between gap-4 rounded-2xl border p-6 text-center sm:flex-row sm:p-8 sm:text-left">
          <div className="space-y-1">
            <h3 className="text-heritage-charcoal font-serif text-lg font-bold">
              Taste the Legacy in Person
            </h3>
            <p className="text-heritage-muted text-xs sm:text-sm">
              Discover sun-cured pickles, traditional sweets, and artisanal snacks
              prepared with sacred care.
            </p>
          </div>
          <Link
            href="/collections"
            className="bg-heritage-maroon hover:bg-heritage-maroon-hover inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold text-white transition-colors"
          >
            <span>Explore Collections</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </section>
      </Container>
    </div>
  );
}
