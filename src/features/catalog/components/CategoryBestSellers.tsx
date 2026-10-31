'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Flame, Heart, Star } from 'lucide-react';
import type { Product } from '@/lib/api/contracts/domain';
import { formatPrice } from '@/lib/utils/money';
import { useAuth, useToast, useWishlist } from '@/lib/store';
import { cn } from '@/lib/utils/cn';

export interface CategoryBestSellersProps {
  categoryName: string;
  categoryHandle: string;
  products: Product[];
  className?: string | undefined;
}

const BADGES = ['#1 Bestseller', 'Customer Favorite', 'Most Loved', 'Kitchen Special'];

function BestSellerWishlistBtn({ product }: { product: Product }) {
  const { isAuthenticated, openAuthModal } = useAuth();
  const { wishlistItems, toggleWishlist, setPendingWishlistProduct } = useWishlist();
  const { addToast } = useToast();

  const isFavorited = React.useMemo(() => {
    return wishlistItems.some(
      (item) => item.id === product.id || item.handle === product.handle,
    );
  }, [wishlistItems, product.id, product.handle]);

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      setPendingWishlistProduct(product);
      openAuthModal();
      addToast({
        type: 'info',
        message: 'Please sign in with your mobile number to save items to your Wishlist.',
      });
      return;
    }

    const newlyAdded = toggleWishlist(product);
    if (newlyAdded) {
      addToast({
        type: 'success',
        message: `Added "${product.title}" to your Wishlist!`,
      });
    } else {
      addToast({
        type: 'info',
        message: `Removed "${product.title}" from your Wishlist.`,
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="text-fg-muted rounded-full p-1 transition-colors hover:text-red-500 focus:outline-none"
      aria-label={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
    >
      <Heart
        className={cn(
          'h-4 w-4 transition-colors',
          isFavorited
            ? 'fill-red-500 text-red-500'
            : 'text-neutral-500 hover:text-red-500',
        )}
      />
    </button>
  );
}

export function CategoryBestSellers({
  categoryName,
  products,
  className,
}: CategoryBestSellersProps): React.JSX.Element | null {
  if (!products || products.length === 0) {
    return null;
  }

  // Showcase up to 4 top bestsellers
  const bestSellers = products.slice(0, 4);

  return (
    <section
      aria-labelledby="category-bestsellers-heading"
      className={cn('space-y-5 pt-2', className)}
    >
      {/* Section Header */}
      <div className="border-line flex flex-col justify-between gap-2 border-b pb-3.5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="bg-brand-50 border-brand-600/30 text-brand-700 inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold">
              <Flame className="fill-primary text-primary h-3 w-3" />
              <span>Bramhkanti Classics</span>
            </span>
            <span className="text-fg-muted text-xs font-medium">Top Ranked Recipes</span>
          </div>
          <h2
            id="category-bestsellers-heading"
            className="text-fg font-sans text-xl font-bold tracking-tight sm:text-2xl"
          >
            Best Sellers in {categoryName}
          </h2>
          <p className="text-fg-muted mt-0.5 text-xs sm:text-sm">
            Our most cherished {categoryName.toLowerCase()} recipes, trusted and ordered
            repeatedly by 15,000+ homes
          </p>
        </div>
        <div className="text-fg-muted shrink-0 text-xs font-semibold">
          Showing {bestSellers.length} Top Favorites
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {bestSellers.map((product, idx) => {
          const primaryVariant = product.variants[0];
          const price = primaryVariant?.price;
          const imageUrl =
            product.images[0]?.url ||
            'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80';
          const altText = product.images[0]?.altText || product.title;
          const badgeLabel = BADGES[idx] || 'Customer Choice';
          const shelfLife = product.foodAttributes?.shelfLife || '12 Months';

          return (
            <article
              key={product.id}
              className="group border-line bg-surface hover:border-brand-600 flex flex-col justify-between overflow-hidden rounded-2xl border shadow-xs transition-all duration-300 hover:shadow-md"
            >
              <div>
                {/* Image Banner */}
                <div className="bg-surface-soft relative aspect-4/3 w-full overflow-hidden">
                  <Link
                    href={`/products/${product.handle}`}
                    className="block h-full w-full"
                  >
                    <Image
                      src={imageUrl}
                      alt={altText}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>

                  {/* Bestseller Badge */}
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-xs">
                      <Star className="h-3 w-3 fill-white text-white" />
                      <span>{badgeLabel}</span>
                    </span>
                  </div>

                  {/* Wishlist Button */}
                  <div className="bg-surface/90 border-line/60 absolute top-2.5 right-2.5 z-10 rounded-full border p-1 shadow-xs backdrop-blur-xs">
                    <BestSellerWishlistBtn product={product} />
                  </div>
                </div>

                {/* Card Content */}
                <div className="space-y-2.5 p-4">
                  {/* Dietary & Rating Row */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] border border-emerald-600 p-[1.5px]"
                        title="100% Pure Vegetarian"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      </div>
                      <span className="text-fg-muted text-[11px] font-semibold">
                        {shelfLife}
                      </span>
                    </div>

                    {product.rating && product.rating.count > 0 && (
                      <div className="flex items-center gap-1">
                        <Star
                          className="fill-star text-star h-3 w-3"
                          aria-hidden="true"
                        />
                        <span className="text-fg text-[11px] font-bold">
                          {product.rating.average.toFixed(1)}
                        </span>
                        <span className="text-fg-muted text-[11px]">
                          ({product.rating.count})
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <Link
                    href={`/products/${product.handle}`}
                    className="group-hover:text-primary block transition-colors"
                  >
                    <h3 className="text-fg line-clamp-2 min-h-[2.75rem] font-sans text-base leading-snug font-bold">
                      {product.title}
                    </h3>
                  </Link>

                  {/* Description Snippet */}
                  <p className="text-fg-muted line-clamp-2 min-h-[2rem] text-xs leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Pricing & CTA Footer */}
              <div className="border-line/60 mt-auto flex items-center justify-between gap-2 border-t px-4 pt-2.5 pb-4">
                <div>
                  {price && (
                    <div className="text-primary font-sans text-base leading-none font-extrabold tabular-nums">
                      {formatPrice(price.amount, price.currencyCode)}
                    </div>
                  )}
                  {primaryVariant?.title && (
                    <div className="text-fg-muted mt-1 text-[11px] leading-none font-medium">
                      {primaryVariant.packSize || primaryVariant.title}
                    </div>
                  )}
                </div>

                <Link
                  href={`/products/${product.handle}`}
                  className="border-primary text-primary hover:bg-brand-50 inline-flex items-center justify-center rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all active:scale-95"
                >
                  Select Pack
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
