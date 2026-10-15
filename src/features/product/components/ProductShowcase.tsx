import * as React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import type { Product } from '@/lib/api/contracts/domain';
import { ProductGrid } from './ProductGrid';

export interface ProductShowcaseProps {
  eyebrow?: string;
  title: string;
  products: Product[];
  viewAllHref?: string | undefined;
}

/** A titled row of products for landing pages. Renders nothing when empty. */
export function ProductShowcase({
  eyebrow,
  title,
  products,
  viewAllHref,
}: ProductShowcaseProps) {
  if (products.length === 0) return null;
  return (
    <section className="py-12 sm:py-16" aria-label={title}>
      <Container>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            {eyebrow && (
              <p className="text-heritage-maroon text-xs font-semibold tracking-widest uppercase">
                {eyebrow}
              </p>
            )}
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              {title}
            </h2>
          </div>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="hover:text-heritage-maroon inline-flex shrink-0 items-center gap-1.5 text-sm font-medium"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
        <ProductGrid products={products} />
      </Container>
    </section>
  );
}
