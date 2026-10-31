'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, Plus, Star } from 'lucide-react';

import type { Product } from '@/lib/api/contracts/domain';
import { useCart } from '@/lib/cart';
import { useCartUi, useToast } from '@/lib/store';
import { calculateDiscountPercent, formatPrice } from '@/lib/utils/money';
import { cn } from '@/lib/utils/cn';
import { VegMark } from '@/components/ui/VegMark';
import { WishlistButton } from './WishlistButton';

export interface ProductCardProps {
  product: Product;
  className?: string;
  /** Load the image eagerly for the first row above the fold. */
  priority?: boolean;
}

const IMAGE_SIZES = '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw';

export function ProductCard({
  product,
  className,
  priority = false,
}: ProductCardProps): React.JSX.Element {
  const { addItem, isPending, lastError } = useCart();
  const { openCart } = useCartUi();
  const { addToast } = useToast();

  const [justAdded, setJustAdded] = React.useState(false);

  const buyable = product.variants.filter((variant) => variant.inStock);
  const cheapest = buyable[0] ?? product.variants[0];
  const inStock = buyable.length > 0;

  // Show unpriced products as upcoming instead of displaying ₹0.
  const unpriced = product.variants.every((variant) => variant.price.amount === 0);

  const hasChoice = product.variants.length > 1;
  const [primaryImage, hoverImage] = product.images;
  const href = `/products/${product.handle}`;

  const discount =
    cheapest?.compareAtPrice &&
    calculateDiscountPercent(cheapest.compareAtPrice.amount, cheapest.price.amount);

  const quickAdd = async () => {
    if (!cheapest || !inStock || isPending) {
      return;
    }

    const success = await addItem(cheapest.id, 1);

    if (success) {
      setJustAdded(true);
      openCart();

      setTimeout(() => {
        setJustAdded(false);
      }, 1500);
    } else {
      addToast({
        type: 'error',
        message: lastError ?? 'Could not add to bag. Please try again.',
      });
    }
  };

  const actionClass =
    'flex h-10 w-full items-center justify-center gap-1.5 rounded-full text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2';

  return (
    <article
      className={cn('group relative flex h-full min-h-[340px] flex-col', className)}
    >
      {/* Image */}
      <div className="bg-surface-soft relative aspect-square overflow-hidden rounded-2xl">
        <Link href={href} aria-label={product.title} className="absolute inset-0">
          {primaryImage ? (
            <>
              <Image
                src={primaryImage.url}
                alt={primaryImage.altText || product.title}
                fill
                priority={priority}
                sizes={IMAGE_SIZES}
                className={cn(
                  'object-cover transition duration-500 ease-out group-hover:scale-[1.04]',
                  hoverImage && 'group-hover:opacity-0',
                  !inStock && 'opacity-70',
                )}
              />
              {hoverImage && (
                <Image
                  src={hoverImage.url}
                  alt=""
                  fill
                  sizes={IMAGE_SIZES}
                  className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
              )}
            </>
          ) : (
            <span className="text-fg-muted absolute inset-0 flex items-center justify-center px-4 text-center text-sm">
              {product.title}
            </span>
          )}
        </Link>

        {/* Badges */}
        <div className="pointer-events-none absolute top-2.5 left-2.5 flex flex-col items-start gap-1.5">
          {!inStock ? (
            <span className="rounded-full bg-neutral-900/80 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
              {unpriced ? 'Coming soon' : 'Sold out'}
            </span>
          ) : discount ? (
            <span className="bg-primary text-on-primary rounded-full px-2.5 py-1 text-[11px] font-semibold">
              {discount}% off
            </span>
          ) : null}
        </div>

        <WishlistButton
          product={product}
          size="sm"
          className="absolute top-2 right-2 h-8 w-8 border-0 bg-white/90 shadow-sm backdrop-blur-sm"
        />
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col pt-3">
        <div className="flex items-start gap-1.5">
          {product.foodAttributes.isVegetarian && <VegMark className="mt-[3px]" />}
          <h3 className="text-fg line-clamp-2 text-sm leading-snug font-semibold sm:text-[15px]">
            <Link href={href} className="hover:text-primary transition-colors">
              {product.title}
            </Link>
          </h3>
        </div>

        {product.subtitle && (
          <p className="text-fg-muted mt-0.5 line-clamp-1 text-xs">{product.subtitle}</p>
        )}

        {product.rating && product.rating.count > 0 && (
          <p className="text-fg mt-1.5 flex items-center gap-1 text-xs">
            <Star className="fill-star text-star h-3.5 w-3.5" aria-hidden="true" />
            <span className="font-semibold tabular-nums">
              {product.rating.average.toFixed(1)}
            </span>
            <span className="text-fg-muted tabular-nums">
              ({product.rating.count}
              <span className="sr-only"> reviews</span>)
            </span>
          </p>
        )}

        {/* Price */}
        <div className="mt-auto pt-2.5">
          {cheapest && !unpriced ? (
            <p className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
              {hasChoice && <span className="text-fg-muted text-xs">From</span>}
              <span className="text-fg text-base font-bold tabular-nums">
                {formatPrice(cheapest.price.amount, cheapest.price.currencyCode)}
              </span>
              {cheapest.compareAtPrice && (
                <span className="text-fg-muted text-xs tabular-nums line-through">
                  {formatPrice(
                    cheapest.compareAtPrice.amount,
                    cheapest.compareAtPrice.currencyCode,
                  )}
                </span>
              )}
              {cheapest.title && (
                <span className="text-fg-muted w-full truncate text-[11px]">
                  {cheapest.title}
                </span>
              )}
            </p>
          ) : (
            <p className="text-fg-muted text-sm font-medium">Coming soon</p>
          )}

          {/* Action */}
          <div className="mt-2.5">
            {inStock && hasChoice ? (
              <Link
                href={href}
                aria-label={`Choose a pack of ${product.title}`}
                className={cn(
                  actionClass,
                  'border-line text-fg hover:border-primary hover:text-primary border',
                )}
              >
                Choose pack
              </Link>
            ) : inStock ? (
              <button
                type="button"
                onClick={quickAdd}
                disabled={isPending || !cheapest}
                aria-label={`Add ${product.title} ${cheapest?.title ?? ''} to bag`}
                className={cn(
                  actionClass,
                  'bg-primary-tint text-primary hover:bg-primary hover:text-on-primary disabled:cursor-not-allowed disabled:opacity-60',
                  justAdded && 'bg-success hover:bg-success text-white hover:text-white',
                )}
              >
                {justAdded ? (
                  <>
                    <Check className="h-4 w-4" aria-hidden="true" /> Added
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" aria-hidden="true" /> Add to bag
                  </>
                )}
              </button>
            ) : (
              <span
                className={cn(
                  actionClass,
                  'bg-surface-soft text-fg-muted cursor-default',
                )}
              >
                {unpriced ? 'Coming soon' : 'Out of stock'}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
