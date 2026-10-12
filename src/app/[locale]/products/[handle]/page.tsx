import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ProductGallery } from '@/features/product/components/ProductGallery';
import { ProductDetails } from '@/features/product/components/ProductDetails';
import { AttributeRenderer } from '@/features/product/components/AttributeRenderer';
import { ProductGrid } from '@/features/product/components/ProductGrid';
import {
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
  return products.map(({ handle }) => ({ handle }));
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

  const [category, relatedProducts] = await Promise.all([
    getCategoryByHandle(product.primaryCategoryId),
    getProductsByCategory(product.primaryCategoryId, 4),
  ]);

  const filteredRelated = relatedProducts.filter((p) => p.id !== product.id).slice(0, 3);

  const productJsonLd = buildProductJsonLd(product);

  const breadcrumbs = [
    ...(category
      ? [{ name: category.name, href: `/${category.handle}` }]
      : [{ name: 'Catalog', href: '/' }]),
    { name: product.title },
  ];

  return (
    <div className="space-y-12 py-8 sm:space-y-16 sm:py-12">
      {/* Schema.org Product Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <Container className="space-y-8 sm:space-y-12">
        {/* Breadcrumb Trail */}
        <Breadcrumbs items={breadcrumbs} />

        {/* Top Product Hero (Gallery + Purchasing Details) */}
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <ProductGallery images={product.images} title={product.title} />
          <ProductDetails product={product} categoryName={category?.name} />
        </div>

        {/* Attribute & Regulatory Specification Card */}
        <div className="border-heritage-border border-t pt-8">
          <AttributeRenderer
            primaryCategory={category?.name ?? product.primaryCategoryId}
            foodAttributes={product.foodAttributes}
            categoryAttributes={product.attributes}
          />
        </div>

        {/* Related Products from the same Kitchen */}
        {filteredRelated.length > 0 && (
          <section
            aria-label="Related Heritage Products"
            className="border-heritage-border space-y-6 border-t pt-10"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-heritage-saffron-dark text-xs font-semibold tracking-wider uppercase">
                  Handcrafted from the same Kitchen
                </span>
                <h2 className="text-heritage-charcoal mt-1 font-serif text-2xl font-bold">
                  You May Also Relish
                </h2>
              </div>
            </div>

            <ProductGrid products={filteredRelated} />
          </section>
        )}
      </Container>
    </div>
  );
}
