import type { Metadata } from 'next';
import { atLeastOne, PLACEHOLDER_SLUG } from '@/lib/routing/static-params';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ProductGallery } from '@/features/product/components/ProductGallery';
import { ProductDetails } from '@/features/product/components/ProductDetails';
import { ProductGrid } from '@/features/product/components/ProductGrid';
import {
  getFeaturedProducts,
  getProductByHandle,
  getProductsByCategory,
  getTopProductHandles,
} from '@/features/product/queries';
import { getCategoryByHandle } from '@/features/catalog/queries';
import { buildProductJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';
import { isSupportedLocale } from '@/lib/i18n';

export const instant = false;

interface ProductPageProps {
  params: Promise<{ locale: string; handle: string }>;
}

export async function generateStaticParams(): Promise<Array<{ handle: string }>> {
  const products = await getTopProductHandles(50);
  return atLeastOne(
    products.map(({ handle }) => ({ handle })),
    { handle: PLACEHOLDER_SLUG },
  );
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { handle, locale } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    return {};
  }

  const primaryImage = product.images[0]?.url;

  return buildMetadata({
    title: product.seo?.title ?? `${product.title} | Bramhkanti Heritage Foods`,
    description: product.seo?.description ?? product.description,
    canonicalPath: `/products/${product.handle}`,
    ogType: 'article',
    ...(primaryImage ? { ogImage: primaryImage } : {}),
    locale: isSupportedLocale(locale) ? locale : 'en',
  });
}

export default async function ProductPage({
  params,
}: ProductPageProps): Promise<ReactNode> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  // Medusa products carry the category handle; mock fixtures use the id as handle.
  const categoryHandle = product.primaryCategoryHandle ?? product.primaryCategoryId;
  const [category, relatedProducts, featured] = await Promise.all([
    categoryHandle ? getCategoryByHandle(categoryHandle) : Promise.resolve(null),
    categoryHandle ? getProductsByCategory(categoryHandle, 8) : Promise.resolve([]),
    getFeaturedProducts(8),
  ]);

  // Same category first, then popular picks so the row is always full.
  const seen = new Set([product.id]);
  const filteredRelated = [...relatedProducts, ...featured]
    .filter((p) => (seen.has(p.id) ? false : (seen.add(p.id), true)))
    .slice(0, 4);

  const productJsonLd = buildProductJsonLd(product);

  const breadcrumbs = [
    ...(category
      ? [{ name: category.name, href: `/${category.handle}` }]
      : [{ name: 'Catalog', href: '/' }]),
    { name: product.title },
  ];

  return (
    <div className="pt-6 pb-16 sm:pt-8 sm:pb-24">
      {/* Schema.org Product Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <Container className="space-y-6 sm:space-y-8">
        {/* Breadcrumb Trail */}
        <Breadcrumbs items={breadcrumbs} />

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14">
          <ProductGallery
            images={product.images}
            title={product.title}
            className="lg:sticky lg:top-28"
          />
          <ProductDetails
            product={product}
            categoryName={category?.name}
            categoryHref={category ? `/${category.handle}` : undefined}
          />
        </div>

        {filteredRelated.length > 0 && (
          <section aria-labelledby="related-heading" className="space-y-6 pt-8 sm:pt-12">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-heritage-maroon text-xs font-semibold tracking-[0.15em] uppercase">
                  From the same kitchen
                </p>
                <h2
                  id="related-heading"
                  className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl"
                >
                  You may also like
                </h2>
              </div>
              {category && (
                <Link
                  href={`/${category.handle}`}
                  className="text-heritage-maroon hidden items-center gap-1 text-sm font-semibold hover:underline sm:inline-flex"
                >
                  Shop all {category.name} <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
            <ProductGrid products={filteredRelated} />
          </section>
        )}
      </Container>
    </div>
  );
}
