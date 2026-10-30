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
      <div className="border-line bg-surface-soft rounded-2xl border border-dashed p-12 text-center">
        <p className="text-fg-muted text-sm font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-3 xl:grid-cols-4',
        className,
      )}
    >
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} priority={index < 4} />
      ))}
    </div>
  );
}
