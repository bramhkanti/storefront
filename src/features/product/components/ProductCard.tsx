'use client';

import * as React from 'react';
import Link from 'next/link';
import type { Product } from '@/lib/api/contracts/domain';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils/money';
import { cn } from '@/lib/utils/cn';
import { WishlistButton } from './WishlistButton';

export interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const primaryVariant = product.variants[0];
  const price = primaryVariant?.price;
  const inStock = primaryVariant?.inStock ?? false;

  return (
    <article
      className={cn(
        'group border-heritage-border bg-heritage-cream hover:border-heritage-maroon/30 flex flex-col justify-between rounded-xl border p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md',
        !inStock && 'opacity-85',
        className,
      )}
    >
      <div>
        {/* Top Badges & Wishlist */}
        <div className="mb-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <Badge variant="vegetarian">Veg</Badge>
            {!inStock && <Badge variant="saffron">Sold Out</Badge>}
            {inStock && product.foodAttributes.shelfLife && (
              <span className="text-heritage-muted text-[11px]">
                {product.foodAttributes.shelfLife}
              </span>
            )}
          </div>
          <WishlistButton product={product} size="sm" />
        </div>

        {/* Title */}
        <Link
          href={`/products/${product.handle}`}
          className="block group-hover:underline"
        >
          <h3 className="text-heritage-charcoal group-hover:text-heritage-maroon line-clamp-2 font-serif text-lg font-bold transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Short description */}
        <p className="text-heritage-muted mt-1.5 line-clamp-2 text-xs leading-relaxed">
          {product.description}
        </p>

        {/* Tags */}
        {product.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {product.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="bg-heritage-cream-dark text-heritage-charcoal rounded-xs px-1.5 py-0.5 text-[10px] font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Pricing & CTA */}
      <div className="border-heritage-border/60 mt-6 flex items-center justify-between border-t pt-4">
        <div>
          {price && (
            <div className="text-heritage-maroon font-serif text-lg font-extrabold">
              {formatPrice(price.amount, price.currencyCode)}
            </div>
          )}
          {primaryVariant?.title && (
            <div className="text-heritage-muted text-[11px]">
              Pack: {primaryVariant.title}
            </div>
          )}
        </div>

        <Link href={`/products/${product.handle}`}>
          <Button
            variant={inStock ? 'outline' : 'ghost'}
            size="sm"
            className="rounded-md text-xs font-semibold"
          >
            {inStock ? 'View Options' : 'Out of Stock'}
          </Button>
        </Link>
      </div>
    </article>
  );
}
