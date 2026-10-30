import * as React from 'react';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { Product } from '@/lib/api/contracts/domain';
import { ProductCard } from './ProductCard';

export interface ProductShowcaseProps {
  eyebrow?: string;
  title: string;
  products: Product[];
  viewAllHref?: string | undefined;
}

/**
 * A titled row of products for landing pages: a swipeable rail on phones,
 * a grid from tablets up. Renders nothing when empty.
 */
export function ProductShowcase({
  eyebrow,
  title,
  products,
  viewAllHref,
}: ProductShowcaseProps) {
  if (products.length === 0) return null;
  const headingId = `showcase-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return (
    <section className="py-10 sm:py-16" aria-labelledby={headingId}>
      <Container>
        <SectionHeading
          id={headingId}
          eyebrow={eyebrow}
          title={title}
          action={viewAllHref ? { href: viewAllHref, label: 'View all' } : undefined}
        />
      </Container>
      <Container className="mt-6 px-0 sm:mt-8 sm:px-6 lg:px-8">
        <ul className="flex snap-x snap-mandatory scroll-px-4 [scrollbar-width:none] gap-3 overflow-x-auto px-4 pb-2 sm:grid sm:grid-cols-3 sm:gap-x-5 sm:gap-y-10 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
          {products.map((product, index) => (
            <li
              key={product.id}
              className="w-[44vw] max-w-[220px] shrink-0 snap-start sm:w-auto sm:max-w-none"
            >
              <ProductCard product={product} priority={index < 2} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
