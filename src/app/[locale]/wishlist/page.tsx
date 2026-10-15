'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  LogIn,
  ChevronRight,
} from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth, useCartUi, useToast, useWishlist } from '@/lib/store';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/utils/money';

export default function WishlistPage(): React.JSX.Element {
  const { isAuthenticated, openAuthModal } = useAuth();
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addItem, isPending } = useCart();
  const { openCart } = useCartUi();
  const { addToast } = useToast();
  const [movingId, setMovingId] = React.useState<string | null>(null);

  const handleMoveToBag = async (product: (typeof wishlistItems)[0]) => {
    const primaryVariant = product.variants[0];
    if (!primaryVariant || !primaryVariant.inStock) {
      addToast({
        type: 'error',
        message: 'This delicacy is currently out of stock.',
      });
      return;
    }

    setMovingId(product.id);
    const success = await addItem(primaryVariant.id, 1);
    setMovingId(null);

    if (success) {
      removeFromWishlist(product.id);
      addToast({
        type: 'success',
        message: `Moved "${product.title}" to your bag!`,
      });
      openCart();
    } else {
      addToast({
        type: 'error',
        message: 'Could not add item to bag. Please try again.',
      });
    }
  };

  const handleRemove = (product: (typeof wishlistItems)[0]) => {
    removeFromWishlist(product.id);
    addToast({
      type: 'info',
      message: `Removed "${product.title}" from your Wishlist.`,
    });
  };

  return (
    <div className="py-8 sm:py-12">
      <Container>
        <div className="mx-auto max-w-6xl">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="text-heritage-muted mb-6 flex items-center gap-1.5 text-xs"
          >
            <Link href="/" className="hover:text-heritage-maroon transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-heritage-charcoal font-medium">Wishlist</span>
          </nav>

          {/* Page Heading */}
          <div className="border-heritage-border/80 mb-8 flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/40">
                  <Heart
                    fill="#dc2626"
                    color="#dc2626"
                    className="h-5 w-5 fill-red-600 text-red-600"
                  />
                </div>
                <div>
                  <h1 className="text-heritage-maroon font-serif text-2xl font-bold sm:text-3xl">
                    My Wishlist
                  </h1>
                  <p className="text-heritage-muted text-xs sm:text-sm">
                    {wishlistItems.length}{' '}
                    {wishlistItems.length === 1 ? 'delicacy' : 'delicacies'} saved
                  </p>
                </div>
              </div>
            </div>

            {wishlistItems.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearWishlist}
                className="text-heritage-muted self-start text-xs font-semibold hover:text-red-700 sm:self-auto"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear Wishlist</span>
              </Button>
            )}
          </div>

          {/* Guest Sign-In Banner if not authenticated */}
          {!isAuthenticated && (
            <div className="border-heritage-saffron-light bg-heritage-saffron-light/20 mb-8 flex flex-col items-start justify-between gap-4 rounded-xl border p-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="bg-heritage-saffron-dark/20 text-heritage-saffron-dark flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-heritage-charcoal text-sm font-semibold">
                    Sign in to sync your wishlist
                  </h2>
                  <p className="text-heritage-muted text-xs">
                    Verify your mobile number with OTP to access your saved delicacies
                    across devices.
                  </p>
                </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={openAuthModal}
                className="shrink-0 text-xs font-semibold"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Sign In with Mobile</span>
              </Button>
            </div>
          )}

          {/* Empty State */}
          {wishlistItems.length === 0 ? (
            <div className="border-heritage-border bg-heritage-cream rounded-2xl border p-10 text-center shadow-xs sm:p-16">
              <div className="bg-heritage-cream-dark text-heritage-muted mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                <Heart className="text-heritage-muted h-8 w-8" />
              </div>
              <h2 className="text-heritage-charcoal mt-5 font-serif text-2xl font-bold">
                Your Wishlist is Empty
              </h2>
              <p className="text-heritage-muted mx-auto mt-2.5 max-w-md text-sm leading-relaxed">
                Explore our handcrafted Banarasi pickles sun-cured in mustard oil, pure
                desi ghee sweets, and crunchy slow-roasted makhana.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/categories">
                  <Button variant="primary" size="sm" className="font-semibold">
                    Start shopping
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            /* Wishlist Products Grid */
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {wishlistItems.map((product) => {
                const primaryVariant = product.variants[0];
                const price = primaryVariant?.price;
                const inStock = primaryVariant?.inStock ?? false;
                const isCurrentlyMoving = movingId === product.id;

                return (
                  <article
                    key={product.id}
                    className="group border-heritage-border bg-heritage-cream hover:border-heritage-maroon/30 flex flex-col justify-between rounded-xl border p-5 shadow-xs transition-all hover:shadow-md"
                  >
                    <div>
                      {/* Top Bar: Veg badge + Remove button */}
                      <div className="mb-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <Badge variant="vegetarian">100% Veg</Badge>
                          {!inStock && <Badge variant="saffron">Sold Out</Badge>}
                          {inStock && product.foodAttributes.shelfLife && (
                            <span className="text-heritage-muted text-[11px]">
                              {product.foodAttributes.shelfLife}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemove(product)}
                          aria-label={`Remove ${product.title} from wishlist`}
                          title="Remove from wishlist"
                          className="text-heritage-muted rounded-full p-1.5 transition-colors hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Product Image preview if available */}
                      {product.images && product.images[0] && (
                        <Link
                          href={`/products/${product.handle}`}
                          className="bg-heritage-cream-dark/50 relative mb-3 block aspect-square w-full overflow-hidden rounded-lg"
                        >
                          <Image
                            src={product.images[0].url}
                            alt={product.images[0].altText || product.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </Link>
                      )}

                      {/* Title */}
                      <Link
                        href={`/products/${product.handle}`}
                        className="block group-hover:underline"
                      >
                        <h2 className="text-heritage-charcoal group-hover:text-heritage-maroon line-clamp-2 font-serif text-lg font-bold transition-colors">
                          {product.title}
                        </h2>
                      </Link>

                      {/* Description */}
                      <p className="text-heritage-muted mt-1.5 line-clamp-2 text-xs leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* Bottom: Price & Move to Bag CTA */}
                    <div className="border-heritage-border/60 mt-6 border-t pt-4">
                      <div className="mb-3 flex items-baseline justify-between">
                        {price && (
                          <div className="text-heritage-maroon font-serif text-lg font-extrabold">
                            {formatPrice(price.amount, price.currencyCode)}
                          </div>
                        )}
                        {primaryVariant?.title && (
                          <div className="text-heritage-muted text-[11px]">
                            Pack: {primaryVariant.title}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          disabled={!inStock || isPending || isCurrentlyMoving}
                          onClick={() => handleMoveToBag(product)}
                          className="flex-1 text-xs font-semibold"
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                          <span>
                            {isCurrentlyMoving
                              ? 'Moving...'
                              : inStock
                                ? 'Move to Bag'
                                : 'Sold Out'}
                          </span>
                        </Button>

                        <Link href={`/products/${product.handle}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs font-semibold"
                          >
                            Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
