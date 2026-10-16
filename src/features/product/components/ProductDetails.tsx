'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Check,
  Leaf,
  Lock,
  Minus,
  Plus,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Zap,
} from 'lucide-react';
import type { Product } from '@/lib/api/contracts/domain';
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

export interface ProductDetailsProps {
  product: Product;
  categoryName?: string | undefined;
  categoryHref?: string | undefined;
  className?: string | undefined;
}

const LOW_STOCK = 5;

/** "spice_level" / "spiceLevel" → "Spice level". */
function humanize(key: string): string {
  const spaced = key.replace(/[_-]+/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase();
}

function formatValue(value: unknown): string | null {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (Array.isArray(value)) return value.length ? value.join(', ') : null;
  if (typeof value === 'object') return null;
  return String(value);
}

export function ProductDetails({
  product,
  categoryName,
  categoryHref,
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
  const [showStickyBar, setShowStickyBar] = React.useState(false);
  const ctaRef = React.useRef<HTMLDivElement | null>(null);

  const { addItem, isPending, lastError } = useCart();
  const { openCart } = useCartUi();
  const { addToast } = useToast();

  // Show the compact mobile bar once the main buttons scroll under the sticky header.
  React.useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      const node = ctaRef.current;
      setShowStickyBar(node ? node.getBoundingClientRect().bottom < 120 : false);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(check);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const selected =
    product.variants.find((v) => v.id === selectedVariantId) ?? firstAvailable;
  const inStock = selected?.inStock ?? false;
  const maxQty = Math.max(1, Math.min(selected?.stockQuantity ?? 20, 20));
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
      // Checkout asks guests to log in first, then continues.
      router.push('/checkout');
    } else {
      setBuying(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      addToast({ type: 'success', message: 'Link copied' });
    } catch {
      // Share sheet dismissed: nothing to do.
    }
  };

  if (!selected) {
    return (
      <p className="text-heritage-muted">This product isn&apos;t available right now.</p>
    );
  }
  const unpriced = product.variants.every((v) => v.price.amount === 0);
  const food = product.foodAttributes;
  const details = [
    ...Object.entries(product.attributes).map(
      ([key, value]) => [humanize(key), formatValue(value)] as const,
    ),
    ['Net weight', food.netWeight || null] as const,
    ['Country of origin', food.countryOfOrigin || null] as const,
  ].filter((row): row is readonly [string, string] => Boolean(row[1]));
  const hasIngredients = food.ingredients.length > 0 || food.allergens.length > 0;
  const hasStorage = Boolean(food.storage || food.shelfLife);

  return (
    <div className={cn('space-y-7', className)}>
      {/* Title block */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          {categoryName ? (
            categoryHref ? (
              <Link
                href={categoryHref}
                className="text-heritage-maroon text-xs font-semibold tracking-[0.15em] uppercase hover:underline"
              >
                {categoryName}
              </Link>
            ) : (
              <span className="text-heritage-maroon text-xs font-semibold tracking-[0.15em] uppercase">
                {categoryName}
              </span>
            )
          ) : (
            <span />
          )}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleShare}
              aria-label="Share this product"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition-colors hover:border-neutral-400 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <WishlistButton product={product} size="md" className="shrink-0" />
          </div>
        </div>
        <h1 className="text-3xl leading-tight font-semibold tracking-tight text-neutral-900 sm:text-4xl dark:text-neutral-50">
          {product.title}
        </h1>
        {product.subtitle && (
          <p className="text-heritage-muted text-lg">{product.subtitle}</p>
        )}
      </div>

      {/* Price */}
      {unpriced ? (
        <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          Coming soon. This product will be available to order shortly.
        </p>
      ) : (
        <div className="space-y-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-4xl font-semibold tracking-tight tabular-nums">
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
                Save {discount}%
              </span>
            ) : null}
          </div>
          <p className="text-heritage-muted text-xs">
            Inclusive of all taxes · {selected.title}
          </p>
        </div>
      )}

      {/* Size */}
      {!unpriced && product.variants.length > 1 && (
        <fieldset>
          <legend className="mb-3 text-sm font-semibold">Choose size</legend>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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
                    'relative rounded-2xl border-2 px-4 py-3 text-left transition-all',
                    active
                      ? 'border-neutral-900 bg-neutral-50 dark:border-white dark:bg-neutral-800'
                      : 'border-neutral-200 hover:border-neutral-400 dark:border-neutral-700',
                    !v.inStock && 'opacity-60',
                  )}
                >
                  {active && (
                    <span className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                  <span className="block text-base font-semibold">{v.title}</span>
                  <span className="text-heritage-muted mt-0.5 block text-sm tabular-nums">
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

      {/* Stock + actions */}
      {!unpriced && (
        <div ref={ctaRef} className="space-y-3">
          <div className="text-sm">
            {inStock ? (
              selected.stockQuantity !== undefined &&
              selected.stockQuantity <= LOW_STOCK ? (
                <p className="flex items-center gap-2 font-medium text-amber-700 dark:text-amber-400">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
                  Only {selected.stockQuantity} left, order soon
                </p>
              ) : (
                <p className="flex items-center gap-2 font-medium text-emerald-700 dark:text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> In stock, ready
                  to ship
                </p>
              )
            ) : (
              <p className="font-medium text-neutral-500">Sold out. Back soon.</p>
            )}
          </div>

          <div className="flex gap-3">
            {inStock && (
              <div className="flex h-13 w-32 shrink-0 items-center justify-between rounded-2xl border border-neutral-200 px-1.5 dark:border-neutral-700">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-neutral-100 disabled:opacity-30 dark:hover:bg-neutral-800"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-base font-semibold tabular-nums" aria-live="polite">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                  disabled={quantity >= maxQty}
                  className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-neutral-100 disabled:opacity-30 dark:hover:bg-neutral-800"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            )}
            <Button
              variant="outline"
              size="lg"
              disabled={!inStock || isPending}
              onClick={handleAddToCart}
              className="h-13 flex-1 rounded-2xl text-base"
            >
              {isAdded ? (
                <Check className="h-5 w-5" />
              ) : (
                <ShoppingBag className="h-5 w-5" />
              )}
              {isAdded ? 'Added' : inStock ? 'Add to bag' : 'Sold out'}
            </Button>
          </div>
          {inStock && (
            <Button
              size="lg"
              onClick={handleBuyNow}
              isLoading={buying}
              disabled={isPending}
              className="h-13 w-full rounded-2xl text-base"
            >
              {!buying && <Zap className="h-4 w-4" />}
              Buy now
            </Button>
          )}
        </div>
      )}

      {/* Promises */}
      <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200 text-sm dark:border-neutral-800 dark:bg-neutral-800">
        {[
          { icon: Leaf, title: '100% vegetarian', text: 'Made in a pure-veg kitchen' },
          {
            icon: ShieldCheck,
            title: 'FSSAI licensed',
            text: `Lic. ${SITE_CONFIG.brand.fssaiLicenseNumber}`,
          },
          { icon: Truck, title: 'Ships across India', text: 'Charges shown at checkout' },
          { icon: Lock, title: 'Secure checkout', text: 'OTP login, verified payments' },
        ].map(({ icon: Icon, title, text }) => (
          <li
            key={title}
            className="flex items-start gap-3 bg-white p-4 dark:bg-[#1c1917]"
          >
            <Icon className="text-heritage-maroon mt-0.5 h-5 w-5 shrink-0" />
            <span>
              <span className="block font-semibold">{title}</span>
              <span className="text-heritage-muted block text-xs">{text}</span>
            </span>
          </li>
        ))}
      </ul>

      {/* Information */}
      <Accordion
        type="multiple"
        defaultValue={['description']}
        className="divide-y divide-neutral-200 border-y border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800"
      >
        {product.description && (
          <AccordionItem value="description">
            <AccordionTrigger className="text-base font-semibold">
              Description
            </AccordionTrigger>
            <AccordionContent className="text-[15px] whitespace-pre-line">
              {product.description}
            </AccordionContent>
          </AccordionItem>
        )}
        {hasIngredients && (
          <AccordionItem value="ingredients">
            <AccordionTrigger className="text-base font-semibold">
              Ingredients &amp; allergens
            </AccordionTrigger>
            <AccordionContent className="space-y-2 text-[15px]">
              {food.ingredients.length > 0 && <p>{food.ingredients.join(', ')}</p>}
              {food.allergens.length > 0 && (
                <p>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    Contains:
                  </span>{' '}
                  {food.allergens.join(', ')}
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
            <AccordionContent className="space-y-2 text-[15px]">
              {food.shelfLife && (
                <p>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    Shelf life:
                  </span>{' '}
                  {food.shelfLife}
                </p>
              )}
              {food.storage && <p>{food.storage}</p>}
            </AccordionContent>
          </AccordionItem>
        )}
        {details.length > 0 && (
          <AccordionItem value="details">
            <AccordionTrigger className="text-base font-semibold">
              Product details
            </AccordionTrigger>
            <AccordionContent>
              <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-[15px]">
                {details.map(([label, value]) => (
                  <React.Fragment key={label}>
                    <dt className="text-neutral-500">{label}</dt>
                    <dd className="text-neutral-800 dark:text-neutral-200">{value}</dd>
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
          <AccordionContent className="space-y-2 text-[15px]">
            <p>
              We deliver across India. Delivery options and charges for your PIN code are
              shown at checkout.
            </p>
            <p>
              Read our{' '}
              <Link
                href="/policies/shipping"
                className="text-heritage-maroon font-medium hover:underline"
              >
                shipping policy
              </Link>{' '}
              and{' '}
              <Link
                href="/policies/refund"
                className="text-heritage-maroon font-medium hover:underline"
              >
                refund &amp; replacement policy
              </Link>
              .
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Compact add-to-bag bar on phones (sits above the bottom nav) */}
      {!unpriced && inStock && (
        <div
          aria-hidden={!showStickyBar}
          className={cn(
            'fixed inset-x-0 bottom-16 z-30 border-t border-neutral-200 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.2)] backdrop-blur transition-transform duration-300 lg:hidden dark:border-neutral-800 dark:bg-[#1c1917]/95',
            showStickyBar ? 'translate-y-0' : 'pointer-events-none translate-y-[200%]',
          )}
        >
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{product.title}</p>
              <p className="text-heritage-muted text-xs tabular-nums">
                {selected.title} ·{' '}
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {formatPrice(selected.price.amount, selected.price.currencyCode)}
                </span>
              </p>
            </div>
            <Button
              size="md"
              onClick={handleAddToCart}
              disabled={isPending}
              tabIndex={showStickyBar ? 0 : -1}
              className="h-11 rounded-xl px-5"
            >
              {isAdded ? (
                <Check className="h-4 w-4" />
              ) : (
                <ShoppingBag className="h-4 w-4" />
              )}
              {isAdded ? 'Added' : 'Add to bag'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
