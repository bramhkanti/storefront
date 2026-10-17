import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, ShieldCheck, HeartHandshake, Award } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { getCategoryTree } from '@/features/catalog/queries';
import { buildMetadata } from '@/lib/seo/metadata';
import { isSupportedLocale } from '@/lib/i18n';

export const instant = false;

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: 'All Categories & Traditional Delicacies | Bramhkanti',
    description:
      'Explore Bramhkanti’s complete selection of authentic sun-cured pickles (achar), organic slow-roasted makhana, and pure A2 desi cow ghee sweets handcrafted in Varanasi.',
    canonicalPath: '/categories',
    locale: isSupportedLocale(locale) ? locale : 'en',
  });
}

// Category Highlights & Trust Pillars
const CATEGORY_PILLARS = [
  {
    icon: Sparkles,
    title: '100% Satvik Purity',
    description: 'No commercial vinegar, zero chemical preservatives, zero palm oil.',
  },
  {
    icon: Award,
    title: 'Time-Tested Heritage',
    description:
      'Authentic 70-year-old family recipes passed down across four generations.',
  },
  {
    icon: HeartHandshake,
    title: 'Artisanal Craftsmanship',
    description:
      'Small-batch sun-curing and low-flame roasting by traditional Varanasi karigars.',
  },
];

export default async function CategoriesPage(): Promise<ReactNode> {
  const categories = await getCategoryTree();
  const mainCategories = categories.slice(0, 3);

  return (
    <div className="space-y-12 py-8 sm:space-y-16 sm:py-12">
      <Container className="space-y-10">
        {/* Breadcrumb Trail */}
        <Breadcrumbs items={[{ name: 'Categories', href: '/categories' }]} />

        {/* Hero Section */}
        <section
          aria-labelledby="categories-hero-heading"
          className="border-heritage-border from-heritage-cream via-heritage-cream-dark/50 to-heritage-cream-dark relative overflow-hidden rounded-3xl border bg-gradient-to-br p-8 shadow-sm sm:p-12 dark:from-[#221c17] dark:to-[#171411]"
        >
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="border-heritage-maroon/20 bg-heritage-maroon/10 text-heritage-maroon inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold">
              <Sparkles className="text-heritage-saffron h-3.5 w-3.5" />
              <span>Generational Recipes • Vedic Kitchen Craft</span>
            </div>
            <h1
              id="categories-hero-heading"
              className="text-heritage-charcoal font-serif text-3xl font-bold tracking-tight sm:text-5xl dark:text-neutral-100"
            >
              Our Handcrafted Categories
            </h1>
            <p className="text-heritage-muted text-sm leading-relaxed sm:text-base dark:text-neutral-400">
              From sun-drenched terrace jars of Malihabadi mango achar to slow-roasted A2
              desi cow ghee besan ladoos and giant organic Mithila foxnuts. Every creation
              honors the pure, uncompromising food rituals of traditional Indian homes.
            </p>

            {/* Quick Category Jump Tabs */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              {mainCategories.map((cat) => (
                <a
                  key={cat.id}
                  href={`#category-${cat.handle}`}
                  className="bg-heritage-cream text-heritage-charcoal hover:text-heritage-maroon hover:border-heritage-maroon border-heritage-border inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold transition-all hover:shadow-xs dark:bg-neutral-800"
                >
                  <span>{cat.name}</span>
                  <span className="text-heritage-muted text-[11px]">
                    ({cat.children?.length ?? 0})
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Category Sections */}
        <div className="space-y-16">
          {mainCategories.map((cat) => {
            const subcategories = cat.children || [];

            return (
              <section
                key={cat.id}
                id={`category-${cat.handle}`}
                aria-labelledby={`heading-${cat.handle}`}
                className="scroll-mt-24 space-y-6"
              >
                {/* Section Header */}
                <div className="border-heritage-border flex flex-col justify-between gap-4 border-b pb-4 sm:flex-row sm:items-end">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5">
                      <h2
                        id={`heading-${cat.handle}`}
                        className="text-heritage-maroon font-serif text-2xl font-bold sm:text-3xl"
                      >
                        {cat.name}
                      </h2>
                      <span className="bg-heritage-saffron-light/60 text-heritage-saffron-dark rounded-full px-2.5 py-0.5 text-xs font-semibold">
                        {subcategories.length} Specialties
                      </span>
                    </div>
                    <p className="text-heritage-muted max-w-2xl text-xs sm:text-sm dark:text-neutral-400">
                      {cat.description}
                    </p>
                  </div>

                  <Link
                    href={`/${cat.handle}`}
                    className="text-heritage-maroon hover:text-heritage-maroon-hover group inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
                  >
                    <span>View All {cat.name} Products</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>

                {/* Subcategory Grid - Strictly 4 in a row on desktop */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {subcategories.map((sub) => {
                    const imageUrl =
                      sub.image?.url ||
                      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80';
                    const altText = sub.image?.altText || sub.name;

                    return (
                      <Link
                        key={sub.id}
                        href={`/${cat.handle}/${sub.handle}`}
                        className="group border-heritage-border/70 hover:border-heritage-maroon/40 bg-heritage-cream flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-neutral-900"
                      >
                        {/* Image Banner */}
                        <div className="bg-heritage-cream-dark relative aspect-4/3 w-full overflow-hidden">
                          <Image
                            src={imageUrl}
                            alt={altText}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        </div>

                        {/* Content */}
                        <div className="flex flex-1 flex-col justify-between space-y-3 p-4">
                          <div className="space-y-1">
                            <h3 className="text-heritage-charcoal group-hover:text-heritage-maroon font-serif text-base font-bold transition-colors dark:text-neutral-100">
                              {sub.name}
                            </h3>
                            <p className="text-heritage-muted line-clamp-2 text-xs leading-relaxed">
                              {sub.description}
                            </p>
                          </div>

                          <div className="text-heritage-maroon inline-flex items-center gap-1 pt-1 text-xs font-semibold">
                            <span>Explore Collection</span>
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {/* Trust & Heritage Pillars */}
        <section
          aria-label="Brand Guarantees"
          className="border-heritage-border bg-heritage-cream-dark/30 rounded-3xl border p-8 sm:p-10 dark:bg-neutral-900/40"
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {CATEGORY_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div key={pillar.title} className="flex items-start gap-4">
                  <div className="border-heritage-border/80 bg-heritage-cream flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border shadow-xs dark:bg-neutral-800">
                    <Icon className="text-heritage-maroon h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-heritage-charcoal font-serif text-sm font-bold dark:text-neutral-100">
                      {pillar.title}
                    </h3>
                    <p className="text-heritage-muted text-xs leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-heritage-border/60 text-heritage-muted mt-8 flex flex-wrap items-center justify-between gap-4 border-t pt-6 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-700" />
              <span>
                FSSAI Certified • Handcrafted in Varanasi • Shipped in Heavy Break-Proof
                Packaging
              </span>
            </div>
            <Link
              href="/policies/shipping"
              className="text-heritage-maroon font-semibold hover:underline"
            >
              Shipping & Delivery Information ➔
            </Link>
          </div>
        </section>
      </Container>
    </div>
  );
}
