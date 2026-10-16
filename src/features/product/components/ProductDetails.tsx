'use client';

import * as React from 'react';
import {
  Check,
  Clock,
  Droplets,
  Flame,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Star,
} from 'lucide-react';
import type { Product, ProductVariant } from '@/lib/api/contracts/domain';
import { formatPrice } from '@/lib/utils/money';
import { useCart } from '@/lib/cart';
import { useCartUi, useToast } from '@/lib/store';
import { cn } from '@/lib/utils/cn';

import type { SnapshotHighlight } from '../data/productContent';

export interface ProductDetailsProps {
  product: Product;
  categoryName?: string | undefined;
  highlights?: SnapshotHighlight[] | undefined;
  className?: string | undefined;
}

export function ProductDetails({
  product,
  className,
}: ProductDetailsProps): React.JSX.Element {
  const { cart, optimisticCart, addItem, updateItem, removeItem, isPending } = useCart();
  const { openCart } = useCartUi();
  const { addToast } = useToast();
  const activeCart = optimisticCart ?? cart;

  // Local user overrides: null when deriving directly from activeCart, or object when user modifies
  const [userOverrides, setUserOverrides] = React.useState<Record<string, number> | null>(null);

  // Derive quantities: uses userOverrides if modified by user, otherwise mirrors active cart
  const quantities = React.useMemo<Record<string, number>>(() => {
    if (userOverrides !== null) {
      return userOverrides;
    }

    const itemsInCart = activeCart?.items.filter((item) =>
      product.variants.some((v) => v.id === item.variantId && item.quantity > 0),
    ) ?? [];

    const computed: Record<string, number> = {};
    if (itemsInCart.length > 0) {
      product.variants.forEach((v) => {
        const found = itemsInCart.find((i) => i.variantId === v.id);
        computed[v.id] = found ? found.quantity : 0;
      });
    } else {
      product.variants.forEach((v, index) => {
        computed[v.id] = index === 0 ? 1 : 0;
      });
    }
    return computed;
  }, [userOverrides, activeCart, product.variants]);

  const [isAdding, setIsAdding] = React.useState(false);

  // Gram parser for per-unit calculations & savings
  const parseGrams = (v?: ProductVariant) => {
    if (!v) return 250;
    const s = `${v.packSize || ''} ${v.title || ''}`.toLowerCase();
    const kgMatch = s.match(/(\d+(?:\.\d+)?)\s*kg/);
    if (kgMatch && kgMatch[1]) return parseFloat(kgMatch[1]) * 1000;
    const gMatch = s.match(/(\d+)\s*g/);
    if (gMatch && gMatch[1]) return parseInt(gMatch[1], 10);
    return 250;
  };

  const baseVariant = product.variants[0];
  const baseGrams = parseGrams(baseVariant);
  const baseRupees = baseVariant
    ? baseVariant.price.amount > 1000
      ? baseVariant.price.amount / 100
      : baseVariant.price.amount
    : 249;
  const basePricePer100g = (baseRupees / baseGrams) * 100;

  const getVariantWeightDetails = (v: ProductVariant) => {
    const grams = parseGrams(v);
    const rupeeAmount = v.price.amount > 1000 ? v.price.amount / 100 : v.price.amount;
    const per100g = (rupeeAmount / grams) * 100;
    let savingsPercent: number | null = null;
    if (basePricePer100g > per100g + 0.5) {
      savingsPercent = Math.round(((basePricePer100g - per100g) / basePricePer100g) * 100);
    }
    return {
      pricePer100g: per100g.toFixed(1),
      savingsPercent,
    };
  };

  // Variant badges based on pack size or index
  const getVariantBadge = (v: ProductVariant, index: number) => {
    const title = `${v.packSize || ''} ${v.title || ''}`.toLowerCase();
    if (title.includes('250') || index === 0) return 'Best for trying';
    if (title.includes('500') || index === 1) return 'Family pack';
    if (title.includes('1') || title.includes('1000') || index === 2) return 'Best value';
    return null;
  };

  const handleUpdateQuantity = (variantId: string, delta: number) => {
    setUserOverrides((prev) => {
      const base = prev ?? quantities;
      const current = base[variantId] ?? 0;
      const next = Math.max(0, current + delta);
      return { ...base, [variantId]: next };
    });
  };

  // Calculate selected items & total pricing
  const { totalItems, totalPriceAmount, selectedWeightLabels, currencyCode } = React.useMemo(() => {
    let items = 0;
    let priceSum = 0;
    const weights: string[] = [];
    let curr = 'INR';

    product.variants.forEach((v) => {
      const q = quantities[v.id] ?? 0;
      if (q > 0) {
        items += q;
        priceSum += v.price.amount * q;
        curr = v.price.currencyCode;
        weights.push(`${v.packSize || v.title}${q > 1 ? ` x${q}` : ''}`);
      }
    });

    return {
      totalItems: items,
      totalPriceAmount: priceSum,
      selectedWeightLabels: weights.join(', '),
      currencyCode: curr,
    };
  }, [product.variants, quantities]);

  // Check if current page quantities exactly match what is in the cart
  const isAlreadyInCart = React.useMemo(() => {
    if (!activeCart) return false;
    const itemsInCart = activeCart.items.filter((item) =>
      product.variants.some((v) => v.id === item.variantId && item.quantity > 0),
    );
    if (itemsInCart.length === 0 || totalItems === 0) return false;

    return product.variants.every((v) => {
      const inCart = itemsInCart.find((i) => i.variantId === v.id);
      const cartQty = inCart ? inCart.quantity : 0;
      const pageQty = quantities[v.id] ?? 0;
      return cartQty === pageQty;
    });
  }, [product.variants, quantities, activeCart, totalItems]);

  // Main displayed variant (first selected, or fallback to first)
  const primaryVariant = product.variants[0]!;
  const compareAtPrice = primaryVariant.compareAtPrice;
  const regularPrice = primaryVariant.price;
  const discountPercent = React.useMemo(() => {
    if (!regularPrice || !compareAtPrice || compareAtPrice.amount <= regularPrice.amount) return 17;
    const diff = compareAtPrice.amount - regularPrice.amount;
    return Math.round((diff / compareAtPrice.amount) * 100);
  }, [regularPrice, compareAtPrice]);

  // Dynamic Product Specifications (replaces duplicate trust badges)
  const productInfo = React.useMemo(() => {
    const isVeg = product.foodAttributes?.isVegetarian ?? true;
    const shelfLife = product.foodAttributes?.shelfLife || '12 Months';

    // Oil or cooking medium / base fat
    const rawOil =
      (product.attributes?.oilType as string | undefined) ??
      (product.attributes?.gheeType as string | undefined);
    let oilDisplay = 'Oil: Mustard Oil';
    if (rawOil) {
      if (rawOil.toLowerCase().includes('oil free') || rawOil.toLowerCase().includes('oil-free')) {
        oilDisplay = 'Sun-Dried / Oil-Free';
      } else if (rawOil.toLowerCase().includes('ghee')) {
        oilDisplay = `Base: ${rawOil}`;
      } else if (rawOil.toLowerCase().includes('oil')) {
        oilDisplay = `Oil: ${rawOil}`;
      } else {
        oilDisplay = `Oil: ${rawOil}`;
      }
    } else if (
      product.categoryIds?.includes('cat_sweets') ||
      product.primaryCategoryId === 'cat_sweets'
    ) {
      oilDisplay = 'Base: Pure Desi Ghee';
    }

    // Spice or culinary character
    const rawSpice = product.attributes?.spiceLevel as string | undefined;
    const hasSpice = Boolean(rawSpice);
    const spiceDisplay = rawSpice
      ? `Spice Level: ${rawSpice}`
      : product.categoryIds?.includes('cat_sweets') ||
        product.primaryCategoryId === 'cat_sweets'
      ? 'Traditional Sweet'
      : 'Artisanal Batch';

    return {
      isVeg,
      shelfLife: `Shelf Life: ${shelfLife}`,
      oilOrBase: oilDisplay,
      spiceOrStyle: spiceDisplay,
      hasSpice,
    };
  }, [product]);

  const handleAddToCart = async () => {
    if (totalItems === 0 || isPending || isAdding) return;

    // If already in cart with exact quantities, open cart drawer directly
    if (isAlreadyInCart) {
      openCart();
      return;
    }

    setIsAdding(true);

    try {
      const currentCart = optimisticCart ?? cart;
      let hasChanges = false;

      // Reconcile each variant with line items in cart
      for (const v of product.variants) {
        const targetQty = quantities[v.id] ?? 0;
        const existingLineItem = currentCart?.items.find((item) => item.variantId === v.id);
        const currentQtyInCart = existingLineItem ? existingLineItem.quantity : 0;

        if (existingLineItem) {
          if (targetQty === 0) {
            await removeItem(existingLineItem.id);
            hasChanges = true;
          } else if (targetQty !== currentQtyInCart) {
            await updateItem(existingLineItem.id, targetQty);
            hasChanges = true;
          }
        } else if (targetQty > 0) {
          await addItem(v.id, targetQty);
          hasChanges = true;
        }
      }

      setUserOverrides(null);

      addToast({
        type: 'success',
        message: hasChanges
          ? `Updated your bag with ${totalItems} item${totalItems > 1 ? 's' : ''}`
          : `Items are in your bag`,
      });
      openCart();
    } catch {
      addToast({
        type: 'error',
        message: 'Could not update your bag. Please try again.',
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div
      className={cn(
        'w-full space-y-5 px-3 sm:px-0 pt-2 lg:pt-0 pb-6 text-fg',
        className,
      )}
    >
      {/* 1. Product Title */}
      <div className="space-y-1.5">
        <h1 className="text-fg font-sans text-2xl sm:text-3xl font-bold tracking-tight leading-snug">
          {product.title}
        </h1>

        {/* Rating */}
        <div className="flex items-center gap-2 flex-wrap pt-0.5">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="h-4 w-4 fill-star text-star"
                aria-hidden="true"
              />
            ))}
          </div>
          <span className="font-bold text-sm text-fg">4.9</span>
          <span className="text-xs text-fg-muted font-normal">(1,240 reviews)</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-success-tint px-2.5 py-0.5 text-[11px] font-semibold text-success-text">
            <Check className="h-3 w-3 stroke-[3]" />
            Verified Buyers
          </span>
        </div>
      </div>

      {/* 2. Artisanal Subtitle Narrative */}
      <p className="text-fg-muted text-sm leading-relaxed">
        Authentic North Indian recipe with hand-crushed spices and cold-pressed mustard oil. A perfect blend of tradition and taste.
      </p>

      {/* 3. Pricing Display Row */}
      <div className="flex items-center gap-3 pt-0.5">
        <span className="text-primary text-3xl font-bold tracking-tight">
          ₹249
        </span>
        <span className="text-fg-muted/60 text-base line-through font-normal">
          ₹299
        </span>
        <span className="rounded-md bg-accent-tint px-2 py-0.5 text-xs font-bold text-accent-text">
          {discountPercent}% OFF
        </span>
      </div>

      {/* 4. Product Info Specifications (replaces duplicate trust badges) */}
      <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 border-y border-line py-3 text-xs text-fg">
        <div className="flex items-center gap-2">
          {/* Vegetarian Green Dot Indicator */}
          <div
            className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] border border-emerald-600 p-[1.5px]"
            title="100% Pure Vegetarian"
            aria-label="100% Pure Vegetarian"
          >
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
          </div>
          <span className="font-medium text-fg">100% Pure Vegetarian</span>
        </div>

        <div className="flex items-center gap-2">
          {productInfo.hasSpice ? (
            <Flame className="h-4 w-4 text-primary shrink-0" />
          ) : (
            <Sparkles className="h-4 w-4 text-primary shrink-0" />
          )}
          <span className="font-medium text-fg">{productInfo.spiceOrStyle}</span>
        </div>

        <div className="flex items-center gap-2">
          <Droplets className="h-4 w-4 text-primary shrink-0" />
          <span className="font-medium text-fg">{productInfo.oilOrBase}</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary shrink-0" />
          <span className="font-medium text-fg">{productInfo.shelfLife}</span>
        </div>
      </div>

      {/* 5. Choose Pack Size Section */}
      <div className="space-y-3 pt-1">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-fg">Choose your pack sizes</h2>
          <p className="text-sm text-fg-muted mt-1">
            Mix & match: select one or more sizes. Each size is packed separately.
          </p>
        </div>

        {/* Stacked Variant Cards */}
        <div className="space-y-3">
          {product.variants.map((variant, index) => {
            const qty = quantities[variant.id] ?? 0;
            const isSelected = qty > 0;
            const badge = getVariantBadge(variant, index);
            const weightDetails = getVariantWeightDetails(variant);

            return (
              <div
                key={variant.id}
                onClick={() => {
                  if (!isSelected) {
                    handleUpdateQuantity(variant.id, 1);
                  }
                }}
                className={cn(
                  'relative rounded-2xl transition-all cursor-pointer',
                  'p-3 sm:p-4',
                  isSelected
                    ? 'border border-brand-600 bg-brand-50 text-fg'
                    : 'border border-line bg-surface hover:border-line-strong text-fg',
                )}
              >
                {/* =========================================================
                    DESKTOP VIEW (sm+): Horizontal 1-Row Layout (matches media_1792140706907.png)
                   ========================================================= */}
                <div className="hidden sm:flex items-center justify-between w-full gap-4">
                  {/* Left: Checkbox + Weight/Badge + Unit rate */}
                  <div className="flex items-center gap-3.5">
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isSelected) {
                          handleUpdateQuantity(variant.id, -qty);
                        } else {
                          handleUpdateQuantity(variant.id, 1);
                        }
                      }}
                      role="checkbox"
                      aria-checked={isSelected}
                      className={cn(
                        'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg transition-all focus:outline-none',
                        isSelected
                          ? 'bg-brand-600 text-white'
                          : 'border-2 border-line-strong bg-surface hover:border-brand-600',
                      )}
                      aria-label={`Select ${variant.packSize || variant.title}`}
                    >
                      {isSelected && <Check className="h-4 w-4 stroke-[3]" />}
                    </button>

                    <div className="flex flex-col justify-center">
                      <div className="flex items-center">
                        <span className="text-lg font-extrabold text-fg leading-none tracking-tight">
                          {variant.packSize || variant.title}
                        </span>
                        {badge && (
                          <span className="ml-2.5 rounded-full bg-accent-tint/50 px-2.5 py-0.5 text-xs font-medium text-fg-muted">
                            {badge}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-fg-muted mt-1 font-normal leading-none">
                        ₹{weightDetails.pricePer100g} per 100g
                      </span>
                    </div>
                  </div>

                  {/* Right: Price + Savings & Action (Stepper or + Add) */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="flex flex-col items-end text-right justify-center">
                      <span className="text-lg font-extrabold text-fg leading-none tracking-tight">
                        {formatPrice(variant.price.amount, variant.price.currencyCode)}
                      </span>
                      {weightDetails.savingsPercent && weightDetails.savingsPercent > 0 && (
                        <span className="text-xs font-bold text-leaf-600 mt-1 leading-none">
                          Save {weightDetails.savingsPercent}%
                        </span>
                      )}
                    </div>

                    {/* Stepper or + Add Button */}
                    {isSelected ? (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center justify-between rounded-full border border-neutral-300 bg-surface px-2.5 py-1 min-w-[104px]"
                      >
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(variant.id, -1)}
                          className="flex h-6 w-6 items-center justify-center text-fg hover:text-brand-600 active:scale-90 transition-transform"
                          aria-label={`Decrease ${variant.packSize || variant.title} quantity`}
                        >
                          <Minus className="h-3.5 w-3.5 stroke-[2.5]" />
                        </button>
                        <span className="min-w-5 text-center text-sm font-bold text-fg select-none">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(variant.id, 1)}
                          className="flex h-6 w-6 items-center justify-center text-fg hover:text-brand-600 active:scale-90 transition-transform"
                          aria-label={`Increase ${variant.packSize || variant.title} quantity`}
                        >
                          <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateQuantity(variant.id, 1);
                        }}
                        className="flex items-center justify-center gap-1 rounded-full border border-brand-600 text-brand-600 hover:bg-brand-50 px-4 py-1.5 text-sm font-bold min-w-[104px] transition-all active:scale-95"
                        aria-label={`Add ${variant.packSize || variant.title}`}
                      >
                        <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* =========================================================
                    MOBILE VIEW (<sm): 2-Row Stacked Layout (matches media_1792141292144.png)
                   ========================================================= */}
                <div className="flex sm:hidden flex-col justify-between w-full gap-2">
                  {/* Row 1: Checkbox + Weight/Badge on Left | Price on Right */}
                  <div className="flex items-center justify-between gap-2 w-full">
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isSelected) {
                            handleUpdateQuantity(variant.id, -qty);
                          } else {
                            handleUpdateQuantity(variant.id, 1);
                          }
                        }}
                        role="checkbox"
                        aria-checked={isSelected}
                        className={cn(
                          'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg transition-all focus:outline-none',
                          isSelected
                            ? 'bg-brand-600 text-white'
                            : 'border-2 border-line-strong bg-surface hover:border-brand-600',
                        )}
                        aria-label={`Select ${variant.packSize || variant.title}`}
                      >
                        {isSelected && <Check className="h-4 w-4 stroke-[3]" />}
                      </button>

                      <div className="flex items-center gap-2">
                        <span className="text-base font-extrabold text-fg leading-none tracking-tight">
                          {variant.packSize || variant.title}
                        </span>
                        {badge && (
                          <span className="rounded-full bg-accent-tint/50 px-2.5 py-0.5 text-[11px] font-medium text-fg-muted">
                            {badge}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-extrabold text-fg leading-none tracking-tight">
                        {formatPrice(variant.price.amount, variant.price.currencyCode)}
                      </span>
                    </div>
                  </div>

                  {/* Row 2: Rate & Savings on Left (indented under weight) | Stepper or + Add on Right */}
                  <div className="flex items-end justify-between gap-2 w-full pl-[34px]">
                    <div className="flex flex-col justify-end">
                      <span className="text-xs text-fg-muted font-normal leading-tight">
                        ₹{weightDetails.pricePer100g} per 100g
                      </span>
                      {weightDetails.savingsPercent && weightDetails.savingsPercent > 0 && (
                        <span className="text-xs font-bold text-leaf-600 mt-0.5 leading-tight">
                          Save {weightDetails.savingsPercent}%
                        </span>
                      )}
                    </div>

                    <div className="shrink-0">
                      {isSelected ? (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center justify-between rounded-full border border-neutral-300 bg-surface px-2.5 py-1 min-w-[96px]"
                        >
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(variant.id, -1)}
                            className="flex h-6 w-6 items-center justify-center text-fg hover:text-brand-600 active:scale-90 transition-transform"
                            aria-label={`Decrease ${variant.packSize || variant.title} quantity`}
                          >
                            <Minus className="h-3.5 w-3.5 stroke-[2.5]" />
                          </button>
                          <span className="min-w-5 text-center text-sm font-bold text-fg select-none">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(variant.id, 1)}
                            className="flex h-6 w-6 items-center justify-center text-fg hover:text-brand-600 active:scale-90 transition-transform"
                            aria-label={`Increase ${variant.packSize || variant.title} quantity`}
                          >
                            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateQuantity(variant.id, 1);
                          }}
                          className="flex items-center justify-center gap-1 rounded-full border border-brand-600 text-brand-600 hover:bg-brand-50 px-4 py-1.5 text-sm font-bold min-w-[96px] transition-all active:scale-95"
                          aria-label={`Add ${variant.packSize || variant.title}`}
                        >
                          <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                          <span>Add</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Total Selected Summary Bar & CTA Button (Desktop Only) */}
      <div className="hidden lg:block space-y-3 pt-2">
        <div className="flex items-baseline justify-between border-t border-line pt-3">
          <div>
            <span className="text-xs font-medium text-fg-muted">
              Total Selected ({totalItems} {totalItems === 1 ? 'item' : 'items'})
            </span>
            <div className="text-sm font-bold text-fg">
              {totalItems > 0 ? selectedWeightLabels : 'None selected'}
            </div>
          </div>

          <div className="text-xl font-bold text-primary">
            {formatPrice(totalPriceAmount, currencyCode)}
          </div>
        </div>

        {/* In-Page Add to Cart Button (matches mockup) */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={totalItems === 0 || isPending || isAdding}
          className="w-full flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary-hover text-on-primary py-3.5 px-6 font-bold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-sm active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingBag className="h-4 w-4" />
          <span>
            {isAdding
              ? 'Updating Cart...'
              : isAlreadyInCart
              ? 'ADDED TO CART'
              : 'ADD TO CART'}
          </span>
        </button>
      </div>

      {/* Mobile Fixed Sticky Bottom Bar (Single mobile Add to Cart, synced with pack selector) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-line bg-surface/95 backdrop-blur-md px-4 py-3 lg:hidden flex items-center justify-between shadow-[0_-4px_16px_rgba(0,0,0,0.06)] text-fg">
        <div>
          <div className="flex items-center text-sm font-bold text-fg">
            <span>{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
            <span className="mx-1.5">•</span>
            <span className="text-primary">{formatPrice(totalPriceAmount, currencyCode)}</span>
          </div>
          {totalItems > 0 && (
            <div className="text-[11px] text-fg-muted font-medium truncate max-w-[190px]">
              {selectedWeightLabels}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={totalItems === 0 || isPending || isAdding}
          className="flex items-center gap-2 rounded-full bg-primary hover:bg-primary-hover text-on-primary px-6 py-2.5 text-xs font-bold tracking-wider uppercase transition-colors shadow-sm active:scale-[0.99] disabled:opacity-50"
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          <span>
            {isAdding
              ? 'Updating...'
              : isAlreadyInCart
              ? 'ADDED TO CART'
              : 'ADD TO CART'}
          </span>
        </button>
      </div>
    </div>
  );
}
