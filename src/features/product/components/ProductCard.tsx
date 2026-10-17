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
import { Button } from '@/components/ui/Button';
import { WishlistButton } from './WishlistButton';

export interface ProductCardProps {
  product: Product;
  className?: string;
  /** Load the image eagerly for the first row above the fold. */
  priority?: boolean;
}

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

  const discount =
    cheapest?.compareAtPrice &&
    calculateDiscountPercent(cheapest.compareAtPrice.amount, cheapest.price.amount);

  const quickAdd = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

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

  return (
    <article
      className={cn(
        'group border-line bg-surface hover:border-brand-600 flex min-h-[340px] flex-col justify-between rounded-2xl border p-4 shadow-xs transition-colors duration-200 sm:p-5',
        !inStock && 'opacity-90',
        className,
      )}
    >
      {/* Product badges and wishlist */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          <span className="bg-surface-soft text-fg rounded-full px-2 py-1 text-[10px] font-semibold">
            Veg
          </span>

          {!inStock && (
            <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold text-amber-900">
              {unpriced ? 'Coming Soon' : 'Sold Out'}
            </span>
          )}

          {inStock && product.foodAttributes.shelfLife && (
            <span className="text-fg-muted text-[11px]">
              {product.foodAttributes.shelfLife}
            </span>
          )}
        </div>

        <WishlistButton product={product} size="sm" />
      </div>

      {/* Product image */}
      <Link
        href={`/products/${product.handle}`}
        aria-label={`View ${product.title}`}
        className="bg-surface-soft relative block aspect-4/5 overflow-hidden rounded-xl"
      >
        {primaryImage ? (
          <>
            <Image
              src={primaryImage.url}
              alt={primaryImage.altText || product.title}
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
          <span className="text-fg-muted absolute inset-0 flex items-center justify-center px-4 text-center text-sm">
            {product.title}
          </span>
        )}

        {/* Image badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {!inStock && (
            <span className="rounded-full bg-neutral-900/80 px-2.5 py-1 text-[11px] font-semibold text-white">
              {unpriced ? 'Coming Soon' : 'Sold Out'}
            </span>
          )}

          {inStock && discount ? (
            <span className="bg-heritage-maroon rounded-full px-2.5 py-1 text-[11px] font-semibold text-white">
              {discount}% off
            </span>
          ) : null}
        </div>
      </Link>

      {/* Product information */}
      <div className="flex flex-1 flex-col pt-4">
        <Link href={`/products/${product.handle}`} className="block">
          <h3 className="text-fg group-hover:text-primary line-clamp-2 min-h-[3.25rem] font-serif text-lg font-bold transition-colors group-hover:underline">
            {product.title}
          </h3>
        </Link>

        {product.subtitle && (
          <p className="text-fg-muted mt-1 line-clamp-1 text-xs">{product.subtitle}</p>
        )}

        <p className="text-fg-muted mt-1.5 line-clamp-2 min-h-[2.5rem] text-xs leading-relaxed">
          {product.description}
        </p>

        {/* Product tags */}
        {product.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {product.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="border-line bg-surface-soft text-fg rounded-xs border px-1.5 py-0.5 text-[10px] font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Price and purchase action */}
        <div className="border-line mt-auto flex items-center justify-between gap-3 border-t pt-4">
          <div className="min-w-0">
            {cheapest && !unpriced && (
              <>
                <div className="text-primary font-serif text-lg font-extrabold tabular-nums">
                  {hasChoice && (
                    <span className="text-fg-muted mr-1 text-xs font-normal">From</span>
                  )}
                  {formatPrice(cheapest.price.amount, cheapest.price.currencyCode)}
                </div>

                {cheapest.compareAtPrice && (
                  <div className="text-fg-muted text-xs line-through">
                    {formatPrice(
                      cheapest.compareAtPrice.amount,
                      cheapest.compareAtPrice.currencyCode,
                    )}
                  </div>
                )}

                {cheapest.title && (
                  <div className="text-fg-muted mt-0.5 line-clamp-1 text-[11px]">
                    Pack: {cheapest.title}
                  </div>
                )}
              </>
            )}

            {unpriced && (
              <span className="text-fg-muted text-sm font-semibold">Coming soon</span>
            )}
          </div>

          {inStock && hasChoice ? (
            <Link
              href={`/products/${product.handle}`}
              aria-label={`Choose a pack of ${product.title}`}
            >
              <Button
                variant="outline"
                size="sm"
                className="rounded-full px-4 text-xs font-semibold"
              >
                Select Pack
              </Button>
            </Link>
          ) : inStock ? (
            <button
              type="button"
              onClick={quickAdd}
              disabled={isPending || !cheapest}
              aria-label={`Add ${product.title} ${cheapest?.title ?? ''} to bag`}
              title="Add to bag"
              className={cn(
                'border-line hover:border-heritage-maroon hover:bg-heritage-maroon flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-50',
                justAdded &&
                  'border-emerald-600 bg-emerald-600 text-white hover:border-emerald-600 hover:bg-emerald-600',
              )}
            >
              {justAdded ? (
                <Check className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Plus className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              disabled
              className="rounded-full px-4 text-xs font-semibold"
            >
              {unpriced ? 'Coming Soon' : 'Out of Stock'}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
