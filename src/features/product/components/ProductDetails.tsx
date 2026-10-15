'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Check, Minus, Plus, ShieldCheck, ShoppingBag, Truck, Zap } from 'lucide-react';
import type { Product } from '@/lib/api/contracts/domain';
import { Button } from '@/components/ui/Button';
import { SITE_CONFIG } from '@/content/site';
import { useCart } from '@/lib/cart';
import { useCartUi, useToast } from '@/lib/store';
import { calculateDiscountPercent, formatPrice } from '@/lib/utils/money';
import { cn } from '@/lib/utils/cn';
import { WishlistButton } from './WishlistButton';

export interface ProductDetailsProps {
  product: Product;
  categoryName?: string | undefined;
  className?: string | undefined;
}

const LOW_STOCK = 5;

export function ProductDetails({
  product,
  categoryName,
  className,
}: ProductDetailsProps) {
  const router = useRouter();
  const firstAvailable = product.variants.find((v) => v.inStock) ?? product.variants[0];
  const [selectedVariantId, setSelectedVariantId] = React.useState(
    firstAvailable?.id ?? '',
  );
  const [quantity, setQuantity] = React.useState(1);
  const [isAdded, setIsAdded] = React.useState(false);
  const [buying, setBuying] = React.useState(false);

  const { addItem, isPending, lastError } = useCart();
  const { openCart } = useCartUi();
  const { addToast } = useToast();

  const selected =
    product.variants.find((v) => v.id === selectedVariantId) ?? firstAvailable;
  const inStock = selected?.inStock ?? false;
  const maxQty = selected?.stockQuantity ?? 20;
  const discount =
    selected?.compareAtPrice &&
    calculateDiscountPercent(selected.compareAtPrice.amount, selected.price.amount);

  const add = async (): Promise<boolean> => {
    if (!selected || !inStock) return false;
    const ok = await addItem(selected.id, quantity);
    if (!ok) {
      addToast({
        type: 'error',
        message: lastError ?? 'Could not add to bag. Please try again.',
      });
    }
    return ok;
  };

  const handleAddToCart = async () => {
    if (await add()) {
      setIsAdded(true);
      openCart();
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  const handleBuyNow = async () => {
    setBuying(true);
    if (await add()) {
      router.push('/checkout');
    } else {
      setBuying(false);
    }
  };

  if (!selected) {
    return (
      <p className="text-heritage-muted">This product isn&apos;t available right now.</p>
    );
  }
  const unpriced = product.variants.every((v) => v.price.amount === 0);

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          {categoryName && (
            <p className="text-heritage-maroon text-xs font-semibold tracking-wider uppercase">
              {categoryName}
            </p>
          )}
          <h1 className="mt-1.5 text-2xl leading-tight font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-neutral-50">
            {product.title}
          </h1>
          {product.subtitle && (
            <p className="text-heritage-muted mt-1 text-base">{product.subtitle}</p>
          )}
        </div>
        <WishlistButton product={product} size="md" className="shrink-0" />
      </div>

      {unpriced ? (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          Coming soon. This product will be available to order shortly.
        </p>
      ) : (
        <div>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-3xl font-semibold tracking-tight tabular-nums">
              {formatPrice(selected.price.amount, selected.price.currencyCode)}
            </span>
            {selected.compareAtPrice && (
              <span className="text-heritage-muted text-lg tabular-nums line-through">
                {formatPrice(
                  selected.compareAtPrice.amount,
                  selected.compareAtPrice.currencyCode,
                )}
              </span>
            )}
            {discount ? (
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-sm font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                {discount}% off
              </span>
            ) : null}
          </div>
          <p className="text-heritage-muted mt-1 text-xs">Inclusive of all taxes</p>
        </div>
      )}

      {!unpriced && product.variants.length > 1 && (
        <fieldset>
          <legend className="mb-2.5 text-sm font-medium">
            Size:{' '}
            <span className="text-heritage-muted font-normal">{selected.title}</span>
          </legend>
          <div className="flex flex-wrap gap-2.5">
            {product.variants.map((v) => {
              const active = v.id === selected.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    setSelectedVariantId(v.id);
                    setQuantity(1);
                  }}
                  aria-pressed={active}
                  className={cn(
                    'min-w-24 rounded-xl border px-4 py-2.5 text-left transition-all',
                    active
                      ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900'
                      : 'border-neutral-200 hover:border-neutral-400 dark:border-neutral-700',
                    !v.inStock && 'opacity-50',
                  )}
                >
                  <span className="block text-sm font-semibold">{v.title}</span>
                  <span
                    className={cn(
                      'block text-xs tabular-nums',
                      active ? 'opacity-80' : 'text-heritage-muted',
                    )}
                  >
                    {v.inStock
                      ? formatPrice(v.price.amount, v.price.currencyCode)
                      : 'Sold out'}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {!unpriced && (
        <div className="text-sm">
          {inStock ? (
            selected.stockQuantity !== undefined &&
            selected.stockQuantity <= LOW_STOCK ? (
              <p className="font-medium text-amber-700">
                Only {selected.stockQuantity} left
              </p>
            ) : (
              <p className="flex items-center gap-2 font-medium text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> In stock
              </p>
            )
          ) : (
            <p className="font-medium text-neutral-500">Sold out. Back soon.</p>
          )}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        {inStock && (
          <div className="flex h-12 w-full items-center justify-between rounded-xl border border-neutral-200 px-2 sm:w-32 dark:border-neutral-700">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-neutral-100 disabled:opacity-30 dark:hover:bg-neutral-800"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="text-sm font-semibold tabular-nums" aria-live="polite">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
              disabled={quantity >= maxQty}
              className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-neutral-100 disabled:opacity-30 dark:hover:bg-neutral-800"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        )}

        {!unpriced && (
          <Button
            variant="outline"
            size="lg"
            disabled={!inStock || isPending}
            onClick={handleAddToCart}
            className="h-12 flex-1 rounded-xl"
          >
            {isAdded ? (
              <Check className="h-5 w-5" />
            ) : (
              <ShoppingBag className="h-5 w-5" />
            )}
            {isAdded ? 'Added' : inStock ? 'Add to bag' : 'Sold out'}
          </Button>
        )}
        {inStock && (
          <Button
            size="lg"
            onClick={handleBuyNow}
            isLoading={buying}
            disabled={isPending}
            className="h-12 flex-1 rounded-xl"
          >
            {!buying && <Zap className="h-4 w-4" />}
            Buy now
          </Button>
        )}
      </div>

      {product.description && (
        <div className="border-t border-neutral-200 pt-6 dark:border-neutral-800">
          <h2 className="text-sm font-semibold">About this product</h2>
          <p className="text-heritage-muted mt-2 text-sm leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>
      )}

      <ul className="grid gap-3 rounded-2xl bg-neutral-50 p-4 text-sm sm:grid-cols-2 dark:bg-neutral-800/50">
        <li className="flex items-center gap-2.5">
          <Truck className="text-heritage-muted h-4 w-4 shrink-0" />
          Delivery across India. Charges shown at checkout.
        </li>
        <li className="flex items-center gap-2.5">
          <ShieldCheck className="text-heritage-muted h-4 w-4 shrink-0" />
          {SITE_CONFIG.brand.fssaiBadgeText}
        </li>
      </ul>
    </div>
  );
}
