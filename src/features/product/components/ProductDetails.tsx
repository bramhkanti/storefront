'use client';

import * as React from 'react';
import { Check, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import type { Product, ProductVariant } from '@/lib/api/contracts/domain';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils/money';
import { SITE_CONFIG } from '@/content/site';
import { useCart } from '@/lib/cart';
import { useCartUi, useToast } from '@/lib/store';
import { WishlistButton } from './WishlistButton';
import { cn } from '@/lib/utils/cn';

export interface ProductDetailsProps {
  product: Product;
  categoryName?: string | undefined;
  className?: string | undefined;
}

export function ProductDetails({
  product,
  categoryName,
  className,
}: ProductDetailsProps) {
  const [selectedVariantId, setSelectedVariantId] = React.useState<string>(
    product.variants[0]?.id ?? '',
  );
  const [quantity, setQuantity] = React.useState(1);
  const [isAdded, setIsAdded] = React.useState(false);

  const { addItem, isPending } = useCart();
  const { openCart } = useCartUi();
  const { addToast } = useToast();

  const selectedVariant: ProductVariant =
    product.variants.find((v) => v.id === selectedVariantId) ?? product.variants[0]!;

  const inStock = selectedVariant?.inStock ?? false;
  const price = selectedVariant?.price;

  const handleAddToCart = async () => {
    if (!inStock || isPending) return;
    const success = await addItem(selectedVariantId, quantity);
    if (success) {
      setIsAdded(true);
      addToast({
        type: 'success',
        message: `Added ${product.title} (${selectedVariant.title}) to your bag`,
      });
      openCart();
      setTimeout(() => setIsAdded(false), 2000);
    } else {
      addToast({
        type: 'error',
        message: 'Could not add item to bag. Please try again.',
      });
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Category & Veg indicator & Wishlist */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="vegetarian">100% Pure Veg</Badge>
          <span className="text-heritage-saffron-dark text-xs font-semibold tracking-wider uppercase">
            {categoryName ?? 'Heritage Collection'}
          </span>
        </div>
        <WishlistButton product={product} size="md" />
      </div>

      {/* Product Title */}
      <h1 className="text-heritage-maroon font-serif text-2xl leading-tight font-extrabold tracking-tight sm:text-4xl">
        {product.title}
      </h1>

      {/* Price Block */}
      {price && (
        <div className="flex items-baseline gap-3">
          <span className="text-heritage-maroon font-serif text-3xl font-black">
            {formatPrice(price.amount, price.currencyCode)}
          </span>
          <span className="text-heritage-muted text-xs">
            (Inclusive of all statutory taxes)
          </span>
        </div>
      )}

      {/* Description */}
      <p className="text-heritage-muted text-sm leading-relaxed sm:text-base">
        {product.description}
      </p>

      {/* Pack Size / Variant Selector */}
      {product.variants.length > 0 && (
        <div className="space-y-2.5 pt-2">
          <label className="text-heritage-charcoal block text-xs font-semibold tracking-wider uppercase">
            Select Pack Size:
          </label>
          <div className="flex flex-wrap gap-2.5">
            {product.variants.map((v) => {
              const isSelected = v.id === selectedVariantId;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVariantId(v.id)}
                  className={cn(
                    'rounded-lg border px-3.5 py-2 text-left text-xs font-medium transition-all',
                    isSelected
                      ? 'border-heritage-maroon bg-heritage-cream-dark text-heritage-maroon ring-heritage-maroon/20 font-semibold ring-2'
                      : 'border-heritage-border bg-heritage-cream text-heritage-charcoal hover:border-heritage-muted',
                    !v.inStock && 'opacity-60',
                  )}
                >
                  <div>{v.title}</div>
                  <div className="text-heritage-muted mt-0.5 text-[10px] font-normal">
                    {formatPrice(v.price.amount, v.price.currencyCode)}
                    {!v.inStock && ' (Sold Out)'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Stock Status Notification */}
      <div className="pt-1">
        {inStock ? (
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-800">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-600" />
            <span>In Stock • Dispatched in 24 hours from Varanasi</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs font-medium text-amber-800">
            <span className="h-2 w-2 rounded-full bg-amber-600" />
            <span>Currently Sold Out. Next sun-cured harvest batch arriving soon.</span>
          </div>
        )}
      </div>

      {/* Add To Cart & Quantity Controls */}
      <div className="flex flex-col items-stretch gap-3 pt-2 sm:flex-row sm:items-center">
        {inStock && (
          <div className="border-heritage-border bg-heritage-cream inline-flex h-11 w-32 items-center justify-between rounded-lg border px-3">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="text-heritage-charcoal p-1 text-base font-bold disabled:opacity-30"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="text-heritage-charcoal text-sm font-semibold">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="text-heritage-charcoal p-1 text-base font-bold"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        )}

        <Button
          type="button"
          size="lg"
          disabled={!inStock || isPending}
          onClick={handleAddToCart}
          className="h-11 flex-1 rounded-lg font-semibold shadow-md"
        >
          {isAdded ? (
            <>
              <Check className="h-5 w-5 text-white" />
              <span>Added to Bag</span>
            </>
          ) : inStock ? (
            <>
              <ShoppingBag className="h-5 w-5" />
              <span>Add to Bag</span>
            </>
          ) : (
            <span>Sold Out</span>
          )}
        </Button>

        <WishlistButton
          product={product}
          variant="button"
          size="md"
          className="h-11 px-4 sm:w-auto shrink-0"
        />
      </div>

      {/* Trust & Guarantee Markers */}
      <div className="border-heritage-border bg-heritage-cream-dark/30 text-heritage-muted space-y-2.5 rounded-xl border p-4 pt-4 text-xs">
        <div className="flex items-center gap-2">
          <Truck className="text-heritage-saffron-dark h-4 w-4 shrink-0" />
          <span>Pan-India express delivery • Free on orders above ₹499</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-heritage-green h-4 w-4 shrink-0" />
          <span>{SITE_CONFIG.brand.fssaiBadgeText}</span>
        </div>
      </div>
    </div>
  );
}
