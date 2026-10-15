'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, Plus } from 'lucide-react';
import type { Product } from '@/lib/api/contracts/domain';
import { useCart } from '@/lib/cart';
import { useCartUi, useToast } from '@/lib/store';
import { calculateDiscountPercent, formatPrice } from '@/lib/utils/money';
import { cn } from '@/lib/utils/cn';
import { WishlistButton } from './WishlistButton';

export interface ProductCardProps {
  product: Product;
  className?: string;
  /** Load the image eagerly (first row above the fold). */
  priority?: boolean;
}

export function ProductCard({ product, className, priority = false }: ProductCardProps) {
  const { addItem, isPending, lastError } = useCart();
  const { openCart } = useCartUi();
  const { addToast } = useToast();
  const [justAdded, setJustAdded] = React.useState(false);

  const buyable = product.variants.filter((v) => v.inStock);
  const cheapest = buyable[0] ?? product.variants[0];
  const inStock = buyable.length > 0;
  // No price set in the admin yet: show it as upcoming rather than "₹0".
  const unpriced = product.variants.every((v) => v.price.amount === 0);
  const hasChoice = product.variants.length > 1;
  const [primaryImage, hoverImage] = product.images;
  const discount =
    cheapest?.compareAtPrice &&
    calculateDiscountPercent(cheapest.compareAtPrice.amount, cheapest.price.amount);

  const quickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!cheapest || !inStock) return;
    const ok = await addItem(cheapest.id, 1);
    if (ok) {
      setJustAdded(true);
      openCart();
      setTimeout(() => setJustAdded(false), 1500);
    } else {
      addToast({
        type: 'error',
        message: lastError ?? 'Could not add to bag. Please try again.',
      });
    }
  };

  return (
    <article className={cn('group relative flex flex-col', className)}>
      <Link
        href={`/products/${product.handle}`}
        className="relative block aspect-4/5 overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800"
      >
        {primaryImage ? (
          <>
            <Image
              src={primaryImage.url}
              alt={primaryImage.altText}
              fill
              priority={priority}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={cn(
                'object-cover transition-all duration-500 group-hover:scale-[1.03]',
                hoverImage && 'group-hover:opacity-0',
              )}
            />
            {hoverImage && (
              <Image
                src={hoverImage.url}
                alt=""
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            )}
          </>
        ) : (
          <span className="text-heritage-muted absolute inset-0 flex items-center justify-center text-sm">
            {product.title}
          </span>
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {!inStock && (
            <span className="rounded-full bg-neutral-900/80 px-2.5 py-1 text-[11px] font-semibold text-white">
              {unpriced ? 'Coming soon' : 'Sold out'}
            </span>
          )}
          {inStock && discount ? (
            <span className="bg-heritage-maroon rounded-full px-2.5 py-1 text-[11px] font-semibold text-white">
              {discount}% off
            </span>
          ) : null}
        </div>
      </Link>

      <div className="absolute top-2.5 right-2.5">
        <WishlistButton
          product={product}
          size="sm"
          className="bg-white/90 shadow-xs backdrop-blur"
        />
      </div>

      <div className="mt-3 flex flex-1 items-start justify-between gap-3">
        <div className="min-w-0">
          <Link href={`/products/${product.handle}`}>
            <h3 className="line-clamp-2 text-sm leading-snug font-semibold text-neutral-900 group-hover:underline sm:text-[15px] dark:text-neutral-100">
              {product.title}
            </h3>
          </Link>
          {product.subtitle && (
            <p className="text-heritage-muted mt-0.5 line-clamp-1 text-xs">
              {product.subtitle}
            </p>
          )}
          {cheapest && !unpriced && (
            <p className="mt-1.5 flex items-baseline gap-1.5 text-sm">
              {hasChoice && <span className="text-heritage-muted text-xs">From</span>}
              <span className="font-semibold tabular-nums">
                {formatPrice(cheapest.price.amount, cheapest.price.currencyCode)}
              </span>
              {cheapest.compareAtPrice && (
                <span className="text-heritage-muted text-xs tabular-nums line-through">
                  {formatPrice(
                    cheapest.compareAtPrice.amount,
                    cheapest.compareAtPrice.currencyCode,
                  )}
                </span>
              )}
            </p>
          )}
        </div>

        {inStock && (
          <button
            type="button"
            onClick={quickAdd}
            disabled={isPending}
            aria-label={`Add ${product.title} ${cheapest?.title ?? ''} to bag`}
            title={hasChoice ? `Add ${cheapest?.title}` : 'Add to bag'}
            className="hover:bg-heritage-maroon hover:border-heritage-maroon flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-300 transition-colors hover:text-white disabled:opacity-50 dark:border-neutral-600"
          >
            {justAdded ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </button>
        )}
      </div>
    </article>
  );
}
