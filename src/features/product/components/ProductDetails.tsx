'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Check,
  Clock,
  Droplets,
  Flame,
  Leaf,
  Lock,
  Minus,
  Plus,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  Zap,
} from 'lucide-react';

import type { Product, ProductVariant } from '@/lib/api/contracts/domain';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import { SITE_CONFIG } from '@/content/site';
import { useCart } from '@/lib/cart';
import { useCartUi, useToast } from '@/lib/store';
import { calculateDiscountPercent, formatPrice } from '@/lib/utils/money';
import { cn } from '@/lib/utils/cn';
import { WishlistButton } from './WishlistButton';

import type { SnapshotHighlight } from '../data/productContent';

export interface ProductDetailsProps {
  product: Product;
  categoryName?: string | undefined;
  categoryHref?: string | undefined;
  highlights?: SnapshotHighlight[] | undefined;
  className?: string | undefined;
}

const LOW_STOCK = 5;
const MAX_QUANTITY = 20;

/** Convert values such as "spice_level" into "Spice level". */
function humanize(key: string): string {
  const spaced = key.replace(/[_-]+/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2');

  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase();
}

function formatValue(value: unknown): string | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (Array.isArray(value)) {
    return value.length ? value.join(', ') : null;
  }

  if (typeof value === 'object') {
    return null;
  }

  return String(value);
}

/** Estimate the pack weight in grams for the per-100g comparison. */
function parseGrams(variant?: ProductVariant): number {
  if (!variant) return 250;

  const value = `${variant.packSize || ''} ${variant.title || ''}`.toLowerCase();
  const kgMatch = value.match(/(\d+(?:\.\d+)?)\s*kg/);

  if (kgMatch?.[1]) {
    return Number.parseFloat(kgMatch[1]) * 1000;
  }

  const gramMatch = value.match(/(\d+(?:\.\d+)?)\s*g(?:rams?)?\b/);

  if (gramMatch?.[1]) {
    return Number.parseFloat(gramMatch[1]);
  }

  return 250;
}

/** Match the existing money representation used by the product UI. */
function getRupeeAmount(amount: number): number {
  return amount > 1000 ? amount / 100 : amount;
}

export function ProductDetails({
  product,
  categoryName,
  categoryHref,
  className,
}: ProductDetailsProps): React.JSX.Element {
  const router = useRouter();

  const { cart, optimisticCart, addItem, updateItem, removeItem, isPending } = useCart();

  const { openCart } = useCartUi();
  const { addToast } = useToast();

  const activeCart = optimisticCart ?? cart;

  const [userOverrides, setUserOverrides] = React.useState<Record<string, number> | null>(
    null,
  );
  const [isAdding, setIsAdding] = React.useState(false);
  const [buying, setBuying] = React.useState(false);
  const [showStickyBar, setShowStickyBar] = React.useState(false);
  const [isAdded, setIsAdded] = React.useState(false);

  const ctaRef = React.useRef<HTMLDivElement | null>(null);

  const variants = product.variants ?? [];
  const firstAvailable = variants.find((variant) => variant.inStock) ?? variants[0];

  const unpriced =
    variants.length === 0 || variants.every((variant) => variant.price.amount === 0);

  const quantities = React.useMemo<Record<string, number>>(() => {
    if (userOverrides !== null) {
      return userOverrides;
    }

    const cartItems =
      activeCart?.items.filter(
        (item) =>
          variants.some((variant) => variant.id === item.variantId) && item.quantity > 0,
      ) ?? [];

    const computed: Record<string, number> = {};

    variants.forEach((variant, index) => {
      const cartItem = cartItems.find((item) => item.variantId === variant.id);

      if (cartItems.length > 0) {
        computed[variant.id] = cartItem?.quantity ?? 0;
      } else {
        computed[variant.id] = index === 0 ? 1 : 0;
      }
    });

    return computed;
  }, [userOverrides, activeCart, variants]);

  // Display the mobile purchase bar after the main CTA scrolls out of view.
  React.useEffect(() => {
    let frame = 0;

    const checkPosition = () => {
      frame = 0;

      const node = ctaRef.current;
      setShowStickyBar(node ? node.getBoundingClientRect().bottom < 120 : false);
    };

    const onScroll = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(checkPosition);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    checkPosition();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);

      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  const handleUpdateQuantity = (variant: ProductVariant, delta: number) => {
    if (!variant.inStock) return;

    setUserOverrides((previous) => {
      const current = previous ?? quantities;
      const currentQuantity = current[variant.id] ?? 0;
      const stockLimit = Math.min(variant.stockQuantity ?? MAX_QUANTITY, MAX_QUANTITY);

      const nextQuantity = Math.max(0, Math.min(stockLimit, currentQuantity + delta));

      return {
        ...current,
        [variant.id]: nextQuantity,
      };
    });
  };

  const parseVariantWeight = (variant: ProductVariant) => {
    const grams = parseGrams(variant);
    const rupees = getRupeeAmount(variant.price.amount);
    const pricePer100g = (rupees / grams) * 100;

    const baseVariant = variants[0];
    const baseGrams = parseGrams(baseVariant);
    const baseRupees = baseVariant ? getRupeeAmount(baseVariant.price.amount) : rupees;

    const basePricePer100g = (baseRupees / baseGrams) * 100;

    const savingsPercent =
      basePricePer100g > pricePer100g + 0.5
        ? Math.round(((basePricePer100g - pricePer100g) / basePricePer100g) * 100)
        : null;

    return {
      pricePer100g: pricePer100g.toFixed(1),
      savingsPercent,
    };
  };

  const getVariantBadge = (variant: ProductVariant, index: number): string | null => {
    const title = `${variant.packSize || ''} ${variant.title || ''}`.toLowerCase();

    if (title.includes('250') || index === 0) {
      return 'Best for trying';
    }

    if (title.includes('500') || index === 1) {
      return 'Family pack';
    }

    if (
      title.includes('1000') ||
      title.includes('1 kg') ||
      title.includes('1kg') ||
      index === 2
    ) {
      return 'Best value';
    }

    return null;
  };

  const { totalItems, totalPriceAmount, selectedWeightLabels, currencyCode } =
    React.useMemo(() => {
      let itemCount = 0;
      let priceTotal = 0;
      let currency = firstAvailable?.price.currencyCode ?? 'INR';
      const labels: string[] = [];

      variants.forEach((variant) => {
        const quantity = quantities[variant.id] ?? 0;

        if (quantity > 0) {
          itemCount += quantity;
          priceTotal += variant.price.amount * quantity;
          currency = variant.price.currencyCode;

          labels.push(
            `${variant.packSize || variant.title}${quantity > 1 ? ` ×${quantity}` : ''}`,
          );
        }
      });

      return {
        totalItems: itemCount,
        totalPriceAmount: priceTotal,
        selectedWeightLabels: labels.join(', '),
        currencyCode: currency,
      };
    }, [variants, quantities, firstAvailable]);

  const isAlreadyInCart = React.useMemo(() => {
    if (!activeCart || totalItems === 0) {
      return false;
    }

    const cartItems = activeCart.items.filter((item) =>
      variants.some((variant) => variant.id === item.variantId),
    );

    if (cartItems.length === 0) {
      return false;
    }

    return variants.every((variant) => {
      const cartItem = cartItems.find((item) => item.variantId === variant.id);

      return (cartItem?.quantity ?? 0) === (quantities[variant.id] ?? 0);
    });
  }, [activeCart, variants, quantities, totalItems]);

  const primaryVariant = firstAvailable;
  const discountPercent =
    primaryVariant?.compareAtPrice &&
    primaryVariant.compareAtPrice.amount > primaryVariant.price.amount
      ? calculateDiscountPercent(
          primaryVariant.compareAtPrice.amount,
          primaryVariant.price.amount,
        )
      : 0;

  const productInfo = React.useMemo(() => {
    const attributes = product.attributes ?? {};
    const food = product.foodAttributes;

    const isVeg = food?.isVegetarian ?? true;
    const shelfLife = food?.shelfLife || '12 Months';

    const rawOil =
      (attributes.oilType as string | undefined) ??
      (attributes.gheeType as string | undefined);

    let oilOrBase = 'Oil: Mustard Oil';

    if (rawOil) {
      if (/oil[\s-]*free/i.test(rawOil)) {
        oilOrBase = 'Sun-Dried / Oil-Free';
      } else if (/ghee/i.test(rawOil)) {
        oilOrBase = `Base: ${rawOil}`;
      } else {
        oilOrBase = `Oil: ${rawOil}`;
      }
    } else if (
      product.categoryIds?.includes('cat_sweets') ||
      product.primaryCategoryId === 'cat_sweets'
    ) {
      oilOrBase = 'Base: Pure Desi Ghee';
    }

    const rawSpice = attributes.spiceLevel as string | undefined;
    const isSweet =
      product.categoryIds?.includes('cat_sweets') ||
      product.primaryCategoryId === 'cat_sweets';

    return {
      isVeg,
      shelfLife: `Shelf Life: ${shelfLife}`,
      oilOrBase,
      spiceOrStyle: rawSpice
        ? `Spice Level: ${rawSpice}`
        : isSweet
          ? 'Traditional Sweet'
          : 'Artisanal Batch',
      hasSpice: Boolean(rawSpice),
    };
  }, [product]);

  const handleAddToCart = async (): Promise<boolean> => {
    if (totalItems === 0 || isPending || isAdding) {
      return false;
    }

    if (isAlreadyInCart) {
      openCart();
      return true;
    }

    setIsAdding(true);

    try {
      const currentCart = optimisticCart ?? cart;

      for (const variant of variants) {
        const targetQuantity = quantities[variant.id] ?? 0;

        const existingItem = currentCart?.items.find(
          (item) => item.variantId === variant.id,
        );

        const currentQuantity = existingItem?.quantity ?? 0;

        if (existingItem && targetQuantity === 0) {
          await removeItem(existingItem.id);
        } else if (existingItem && targetQuantity !== currentQuantity) {
          await updateItem(existingItem.id, targetQuantity);
        } else if (!existingItem && targetQuantity > 0) {
          const result = await addItem(variant.id, targetQuantity);

          if (result === false) {
            throw new Error('Could not add item to cart');
          }
        }
      }

      setUserOverrides(null);
      setIsAdded(true);

      addToast({
        type: 'success',
        message: `Updated your bag with ${totalItems} item${totalItems === 1 ? '' : 's'}`,
      });

      openCart();

      window.setTimeout(() => {
        setIsAdded(false);
      }, 2000);

      return true;
    } catch {
      addToast({
        type: 'error',
        message: 'Could not update your bag. Please try again.',
      });

      return false;
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    setBuying(true);

    try {
      const success = await handleAddToCart();

      if (success) {
        router.push('/checkout');
      }
    } finally {
      setBuying(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: product.title,
          url,
        });
        return;
      }

      await navigator.clipboard.writeText(url);

      addToast({
        type: 'success',
        message: 'Link copied',
      });
    } catch {
      // The user may dismiss the native share sheet.
    }
  };

  const food = product.foodAttributes;
  const ingredients = food?.ingredients ?? [];
  const allergens = food?.allergens ?? [];

  const details = [
    ...Object.entries(product.attributes ?? {}).map(
      ([key, value]) => [humanize(key), formatValue(value)] as const,
    ),
    ['Net weight', food?.netWeight || null] as const,
    ['Country of origin', food?.countryOfOrigin || null] as const,
  ].filter((row): row is readonly [string, string] => Boolean(row[1]));

  const hasIngredients = ingredients.length > 0 || allergens.length > 0;

  const hasStorage = Boolean(food?.storage || food?.shelfLife);

  if (variants.length === 0 || !firstAvailable) {
    return (
      <div className={cn('text-fg space-y-4', className)}>
        <h1 className="font-serif text-2xl font-bold">{product.title}</h1>
        <p className="text-fg-muted">This product isn&apos;t available right now.</p>
      </div>
    );
  }

  return (
    <div className={cn('text-fg w-full space-y-6 pt-2 pb-24 sm:pb-8 lg:pt-0', className)}>
      {/* Product heading, category, sharing and wishlist */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          {categoryName ? (
            categoryHref ? (
              <Link
                href={categoryHref}
                className="text-primary text-xs font-semibold tracking-[0.15em] uppercase hover:underline"
              >
                {categoryName}
              </Link>
            ) : (
              <span className="text-primary text-xs font-semibold tracking-[0.15em] uppercase">
                {categoryName}
              </span>
            )
          ) : (
            <span />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              aria-label="Share this product"
              className="border-line text-fg-muted hover:border-brand-600 hover:text-primary flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <WishlistButton product={product} size="md" className="shrink-0" />
          </div>
        </div>

        <h1 className="text-fg font-serif text-2xl leading-snug font-bold tracking-tight sm:text-3xl">
          {product.title}
        </h1>

        {product.subtitle && (
          <p className="text-fg-muted text-sm leading-relaxed sm:text-base">
            {product.subtitle}
          </p>
        )}

        {/* Rating display retained from the redesign. */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-0.5" aria-label="Rated 4.9 out of 5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className="fill-star text-star h-4 w-4"
                aria-hidden="true"
              />
            ))}
          </div>
          <span className="text-sm font-bold">4.9</span>
          <span className="text-fg-muted text-xs">(1,240 reviews)</span>
          <span className="bg-success-tint text-success-text inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold">
            <Check className="h-3 w-3 stroke-[3]" />
            Verified Buyers
          </span>
        </div>
      </div>

      {/* Price information uses the actual product variant prices. */}
      {unpriced ? (
        <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          Coming soon. This product will be available to order shortly.
        </p>
      ) : (
        <div className="space-y-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-primary font-serif text-3xl font-bold tracking-tight sm:text-4xl">
              {formatPrice(
                firstAvailable.price.amount,
                firstAvailable.price.currencyCode,
              )}
            </span>

            {firstAvailable.compareAtPrice &&
              firstAvailable.compareAtPrice.amount > firstAvailable.price.amount && (
                <span className="text-fg-muted text-base line-through">
                  {formatPrice(
                    firstAvailable.compareAtPrice.amount,
                    firstAvailable.compareAtPrice.currencyCode,
                  )}
                </span>
              )}

            {discountPercent > 0 && (
              <span className="bg-accent-tint text-accent-text rounded-md px-2 py-1 text-xs font-bold">
                Save {discountPercent}%
              </span>
            )}
          </div>

          <p className="text-fg-muted text-xs">
            Inclusive of all taxes · {firstAvailable.title}
          </p>
        </div>
      )}

      {/* Product specifications */}
      <div className="border-line grid grid-cols-2 gap-x-4 gap-y-3 border-y py-4 text-xs">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border p-[2px]',
              productInfo.isVeg ? 'border-emerald-600' : 'border-red-600',
            )}
            aria-label={productInfo.isVeg ? 'Vegetarian' : 'Non-vegetarian'}
          >
            <span
              className={cn(
                'h-2 w-2 rounded-full',
                productInfo.isVeg ? 'bg-emerald-600' : 'bg-red-600',
              )}
            />
          </span>
          <span className="font-medium">
            {productInfo.isVeg ? '100% Pure Vegetarian' : 'Non-vegetarian'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {productInfo.hasSpice ? (
            <Flame className="text-primary h-4 w-4 shrink-0" />
          ) : (
            <Sparkles className="text-primary h-4 w-4 shrink-0" />
          )}
          <span className="font-medium">{productInfo.spiceOrStyle}</span>
        </div>

        <div className="flex items-center gap-2">
          <Droplets className="text-primary h-4 w-4 shrink-0" />
          <span className="font-medium">{productInfo.oilOrBase}</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="text-primary h-4 w-4 shrink-0" />
          <span className="font-medium">{productInfo.shelfLife}</span>
        </div>
      </div>

      {/* Multi-pack selector */}
      {!unpriced && (
        <div className="space-y-3">
          <div>
            <h2 className="text-fg text-lg font-bold sm:text-xl">
              Choose your pack sizes
            </h2>
            <p className="text-fg-muted mt-1 text-sm">
              Mix and match pack sizes. Each size is packed separately.
            </p>
          </div>

          <div className="space-y-3">
            {variants.map((variant, index) => {
              const quantity = quantities[variant.id] ?? 0;
              const isSelected = quantity > 0;
              const badge = getVariantBadge(variant, index);
              const weightDetails = parseVariantWeight(variant);
              const stockLimit = Math.min(
                variant.stockQuantity ?? MAX_QUANTITY,
                MAX_QUANTITY,
              );

              return (
                <div
                  key={variant.id}
                  className={cn(
                    'rounded-2xl border p-3 transition-colors sm:p-4',
                    isSelected
                      ? 'border-brand-600 bg-brand-50 text-fg'
                      : 'border-line bg-surface hover:border-brand-600',
                    !variant.inStock && 'opacity-70',
                  )}
                >
                  {/* Pack size and selection */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <button
                        type="button"
                        disabled={!variant.inStock}
                        onClick={() =>
                          handleUpdateQuantity(variant, isSelected ? -quantity : 1)
                        }
                        role="checkbox"
                        aria-checked={isSelected}
                        aria-label={`Select ${variant.packSize || variant.title}`}
                        className={cn(
                          'flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors disabled:cursor-not-allowed',
                          isSelected
                            ? 'bg-brand-600 text-white'
                            : 'border-line-strong bg-surface hover:border-brand-600 border-2',
                        )}
                      >
                        {isSelected && <Check className="h-4 w-4 stroke-[3]" />}
                      </button>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="leading-tight font-bold">
                            {variant.packSize || variant.title}
                          </span>

                          {badge && (
                            <span className="bg-accent-tint/60 text-fg-muted rounded-full px-2 py-0.5 text-[10px] font-medium">
                              {badge}
                            </span>
                          )}
                        </div>

                        <p className="text-fg-muted mt-1 text-xs">
                          ₹{weightDetails.pricePer100g} per 100g
                        </p>

                        {weightDetails.savingsPercent !== null &&
                          weightDetails.savingsPercent > 0 && (
                            <p className="text-leaf-600 mt-0.5 text-xs font-bold">
                              Save {weightDetails.savingsPercent}% per 100g
                            </p>
                          )}

                        {!variant.inStock && (
                          <p className="mt-1 text-xs font-medium text-red-600">
                            Sold out
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Price and quantity controls */}
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <span className="font-bold tabular-nums">
                        {formatPrice(variant.price.amount, variant.price.currencyCode)}
                      </span>

                      {variant.inStock ? (
                        isSelected ? (
                          <div className="border-line bg-surface flex items-center gap-2 rounded-full border px-2 py-1">
                            <button
                              type="button"
                              onClick={() => handleUpdateQuantity(variant, -1)}
                              aria-label={`Decrease ${variant.title} quantity`}
                              className="text-fg hover:text-primary flex h-6 w-6 items-center justify-center"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>

                            <span
                              className="min-w-4 text-center text-sm font-bold tabular-nums"
                              aria-live="polite"
                            >
                              {quantity}
                            </span>

                            <button
                              type="button"
                              disabled={quantity >= stockLimit}
                              onClick={() => handleUpdateQuantity(variant, 1)}
                              aria-label={`Increase ${variant.title} quantity`}
                              className="text-fg hover:text-primary flex h-6 w-6 items-center justify-center disabled:opacity-30"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(variant, 1)}
                            className="border-brand-600 text-brand-600 hover:bg-brand-50 inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Add
                          </button>
                        )
                      ) : (
                        <span className="text-fg-muted text-xs">Unavailable</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Desktop cart summary and actions */}
      {!unpriced && (
        <div ref={ctaRef} className="space-y-4">
          <div className="border-line flex items-baseline justify-between gap-3 border-t pt-4">
            <div className="min-w-0">
              <p className="text-fg-muted text-xs font-medium">
                Total selected ({totalItems} {totalItems === 1 ? 'item' : 'items'})
              </p>
              <p className="mt-1 text-sm font-bold break-words">
                {totalItems > 0 ? selectedWeightLabels : 'No packs selected'}
              </p>
            </div>

            <p className="text-primary shrink-0 text-xl font-bold">
              {formatPrice(totalPriceAmount, currencyCode)}
            </p>
          </div>

          <div className="hidden space-y-3 lg:block">
            <Button
              type="button"
              onClick={handleAddToCart}
              disabled={totalItems === 0 || isPending || isAdding}
              className="w-full rounded-full"
            >
              <ShoppingBag className="h-4 w-4" />
              {isAdding
                ? 'Updating bag...'
                : isAdded
                  ? 'Added to bag'
                  : isAlreadyInCart
                    ? 'Added to cart'
                    : 'Add to bag'}
            </Button>

            <Button
              type="button"
              onClick={handleBuyNow}
              disabled={totalItems === 0 || isPending || isAdding || buying}
              className="w-full rounded-full"
            >
              {!buying && <Zap className="h-4 w-4" />}
              {buying ? 'Processing...' : 'Buy now'}
            </Button>
          </div>

          {/* Compact sticky mobile purchase bar */}
          <div
            aria-hidden={!showStickyBar}
            className={cn(
              'border-line bg-surface/95 text-fg fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] backdrop-blur-md transition-transform duration-300 lg:hidden',
              showStickyBar ? 'translate-y-0' : 'pointer-events-none translate-y-full',
            )}
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} ·{' '}
                <span className="text-primary">
                  {formatPrice(totalPriceAmount, currencyCode)}
                </span>
              </p>

              {totalItems > 0 && (
                <p className="text-fg-muted truncate text-[11px]">
                  {selectedWeightLabels}
                </p>
              )}
            </div>

            <Button
              type="button"
              onClick={handleAddToCart}
              disabled={totalItems === 0 || isPending || isAdding}
              className="shrink-0 rounded-full"
            >
              <ShoppingBag className="h-4 w-4" />
              {isAdding ? 'Updating...' : isAdded ? 'Added' : 'Add to bag'}
            </Button>
          </div>
        </div>
      )}

      {/* Delivery and checkout promises */}
      <ul className="border-line bg-line grid grid-cols-2 gap-px overflow-hidden rounded-2xl border text-sm">
        {[
          {
            icon: Leaf,
            title: 'Vegetarian options',
            text: 'Product details show ingredients',
          },
          {
            icon: ShieldCheck,
            title: 'FSSAI licensed',
            text: `Lic. ${SITE_CONFIG.brand.fssaiLicenseNumber}`,
          },
          {
            icon: Truck,
            title: 'Ships across India',
            text: 'Charges shown at checkout',
          },
          {
            icon: Lock,
            title: 'Secure checkout',
            text: 'Verified checkout and payments',
          },
        ].map(({ icon: Icon, title, text }) => (
          <li key={title} className="bg-surface flex items-start gap-3 p-3 sm:p-4">
            <Icon className="text-primary mt-0.5 h-5 w-5 shrink-0" />
            <span>
              <span className="block font-semibold">{title}</span>
              <span className="text-fg-muted mt-0.5 block text-xs">{text}</span>
            </span>
          </li>
        ))}
      </ul>

      {/* Product information accordions */}
      <Accordion
        type="multiple"
        defaultValue={['description']}
        className="divide-line border-line divide-y border-y"
      >
        {product.description && (
          <AccordionItem value="description">
            <AccordionTrigger className="text-base font-semibold">
              Description
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed whitespace-pre-line">
              {product.description}
            </AccordionContent>
          </AccordionItem>
        )}

        {hasIngredients && (
          <AccordionItem value="ingredients">
            <AccordionTrigger className="text-base font-semibold">
              Ingredients &amp; allergens
            </AccordionTrigger>
            <AccordionContent className="space-y-2 text-sm">
              {ingredients.length > 0 && <p>{ingredients.join(', ')}</p>}

              {allergens.length > 0 && (
                <p>
                  <span className="font-semibold">Contains:</span> {allergens.join(', ')}
                </p>
              )}
            </AccordionContent>
          </AccordionItem>
        )}

        {hasStorage && (
          <AccordionItem value="storage">
            <AccordionTrigger className="text-base font-semibold">
              Storage &amp; shelf life
            </AccordionTrigger>
            <AccordionContent className="space-y-2 text-sm">
              {food?.shelfLife && (
                <p>
                  <span className="font-semibold">Shelf life:</span> {food.shelfLife}
                </p>
              )}

              {food?.storage && <p>{food.storage}</p>}
            </AccordionContent>
          </AccordionItem>
        )}

        {details.length > 0 && (
          <AccordionItem value="details">
            <AccordionTrigger className="text-base font-semibold">
              Product details
            </AccordionTrigger>
            <AccordionContent>
              <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
                {details.map(([label, value]) => (
                  <React.Fragment key={label}>
                    <dt className="text-fg-muted">{label}</dt>
                    <dd className="text-fg break-words">{value}</dd>
                  </React.Fragment>
                ))}
              </dl>
            </AccordionContent>
          </AccordionItem>
        )}

        <AccordionItem value="shipping">
          <AccordionTrigger className="text-base font-semibold">
            Shipping &amp; returns
          </AccordionTrigger>
          <AccordionContent className="space-y-2 text-sm leading-relaxed">
            <p>
              We deliver across India. Delivery options and charges for your PIN code are
              shown at checkout.
            </p>

            <p>
              Read our{' '}
              <Link
                href="/policies/shipping"
                className="text-primary font-medium hover:underline"
              >
                shipping policy
              </Link>{' '}
              and{' '}
              <Link
                href="/policies/refund"
                className="text-primary font-medium hover:underline"
              >
                refund &amp; replacement policy
              </Link>
              .
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
