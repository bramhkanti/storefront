import * as React from 'react';
import type { Product } from '@/lib/api/contracts/domain';
import { ProductCard } from './ProductCard';
import { cn } from '@/lib/utils/cn';

export interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
  className?: string;
}

export function ProductGrid({
  products,
  emptyMessage = 'No products match these filters yet.',
  className,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-300 p-12 text-center dark:border-neutral-700">
        <p className="text-heritage-muted text-sm font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4',
        className,
      )}
    >
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} priority={index < 4} />
      ))}
    </div>
  );
}
