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
  emptyMessage = 'No authentic heritage products match the selected filters.',
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
      className={cn('grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3', className)}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
