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

const BADGES = [
  '#1 Bestseller',
  'Customer Favorite',
  'Most Loved',
  'Kitchen Special',
];

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
      className="p-1 rounded-full text-fg-muted hover:text-red-500 transition-colors focus:outline-none"
      aria-label={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
    >
      <Heart
        className={cn(
          'h-4 w-4 transition-colors',
          isFavorited ? 'fill-red-500 text-red-500' : 'text-neutral-500 hover:text-red-500',
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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-line pb-3.5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 border border-brand-600/30 px-2.5 py-0.5 text-[11px] font-bold text-brand-700">
              <Flame className="h-3 w-3 fill-primary text-primary" />
              <span>Bramhkanti Classics</span>
            </span>
            <span className="text-fg-muted text-xs font-medium">
              Top Ranked Recipes
            </span>
          </div>
          <h2
            id="category-bestsellers-heading"
            className="text-fg font-sans text-xl sm:text-2xl font-bold tracking-tight"
          >
            Best Sellers in {categoryName}
          </h2>
          <p className="text-fg-muted text-xs sm:text-sm mt-0.5">
            Our most cherished {categoryName.toLowerCase()} recipes, trusted and ordered repeatedly by 15,000+ homes
          </p>
        </div>
        <div className="text-xs font-semibold text-fg-muted shrink-0">
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
              className="group rounded-2xl border border-line bg-surface hover:border-brand-600 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md"
            >
              <div>
                {/* Image Banner */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-surface-soft">
                  <Link href={`/products/${product.handle}`} className="block h-full w-full">
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
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 text-white px-2.5 py-0.5 text-[11px] font-bold shadow-xs">
                      <Star className="h-3 w-3 fill-white text-white" />
                      <span>{badgeLabel}</span>
                    </span>
                  </div>

                  {/* Wishlist Button */}
                  <div className="absolute top-2.5 right-2.5 z-10 bg-surface/90 backdrop-blur-xs rounded-full p-1 border border-line/60 shadow-xs">
                    <BestSellerWishlistBtn product={product} />
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 space-y-2.5">
                  {/* Dietary & Rating Row */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] border border-emerald-600 p-[1.5px]"
                        title="100% Pure Vegetarian"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      </div>
                      <span className="text-[11px] font-semibold text-fg-muted">
                        {shelfLife}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-3 w-3 fill-star text-star"
                          />
                        ))}
                      </div>
                      <span className="text-[11px] font-bold text-fg">4.9</span>
                    </div>
                  </div>

                  {/* Title */}
                  <Link
                    href={`/products/${product.handle}`}
                    className="block group-hover:text-primary transition-colors"
                  >
                    <h3 className="font-sans text-base font-bold text-fg leading-snug line-clamp-2 min-h-[2.75rem]">
                      {product.title}
                    </h3>
                  </Link>

                  {/* Description Snippet */}
                  <p className="text-xs text-fg-muted line-clamp-2 leading-relaxed min-h-[2rem]">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Pricing & CTA Footer */}
              <div className="px-4 pb-4 pt-2.5 border-t border-line/60 flex items-center justify-between gap-2 mt-auto">
                <div>
                  {price && (
                    <div className="text-primary font-sans text-base font-extrabold tabular-nums leading-none">
                      {formatPrice(price.amount, price.currencyCode)}
                    </div>
                  )}
                  {primaryVariant?.title && (
                    <div className="text-fg-muted text-[11px] mt-1 font-medium leading-none">
                      {primaryVariant.packSize || primaryVariant.title}
                    </div>
                  )}
                </div>

                <Link
                  href={`/products/${product.handle}`}
                  className="inline-flex items-center justify-center rounded-full border border-primary text-primary hover:bg-brand-50 px-3.5 py-1.5 text-xs font-bold transition-all active:scale-95"
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
