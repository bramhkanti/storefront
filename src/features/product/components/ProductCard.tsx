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
        'group border-line bg-surface hover:border-brand-600 flex min-h-[340px] flex-col justify-between rounded-2xl border p-5 shadow-xs transition-colors duration-200',
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
              <span className="text-fg-muted text-[11px]">
                {product.foodAttributes.shelfLife}
              </span>
            )}
          </div>
          <WishlistButton product={product} size="sm" />
        </div>

        {/* Title with reserved stable line height */}
        <Link
          href={`/products/${product.handle}`}
          className="block group-hover:underline"
        >
          <h3 className="text-fg group-hover:text-primary line-clamp-2 min-h-[3.25rem] font-serif text-lg font-bold transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Short description with reserved stable line height */}
        <p className="text-fg-muted mt-1.5 line-clamp-2 min-h-[2.5rem] text-xs leading-relaxed">
          {product.description}
        </p>

        {/* Tags */}
        {product.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {product.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="bg-surface-soft border border-line text-fg rounded-xs px-1.5 py-0.5 text-[10px] font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Pricing & CTA */}
      <div className="border-line mt-6 flex items-center justify-between border-t pt-4">
        <div>
          {price && (
            <div className="text-primary font-serif text-lg font-extrabold tabular-nums">
              {formatPrice(price.amount, price.currencyCode)}
            </div>
          )}
          {primaryVariant?.title && (
            <div className="text-fg-muted text-[11px]">
              Pack: {primaryVariant.title}
            </div>
          )}
        </div>

        <Link href={`/products/${product.handle}`}>
          <Button
            variant={inStock ? 'outline' : 'ghost'}
            size="sm"
            className="rounded-full text-xs font-semibold px-4"
          >
            {inStock ? 'Select Pack' : 'Out of Stock'}
          </Button>
        </Link>
      </div>
    </article>
  );
}
