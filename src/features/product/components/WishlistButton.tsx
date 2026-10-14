'use client';

import * as React from 'react';
import { Heart } from 'lucide-react';
import type { Product } from '@/lib/api/contracts/domain';
import { useAuth, useToast, useWishlist } from '@/lib/store';
import { cn } from '@/lib/utils/cn';

export interface WishlistButtonProps {
  product: Product;
  variant?: 'icon' | 'button';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

export function WishlistButton({
  product,
  variant = 'icon',
  size = 'md',
  className,
  showText = false,
}: WishlistButtonProps): React.JSX.Element {
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

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const buttonSizeClasses = {
    sm: 'h-8 px-2.5 text-xs',
    md: 'h-11 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
  };

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={handleToggle}
        aria-label={
          isFavorited
            ? `Remove ${product.title} from wishlist`
            : `Add ${product.title} to wishlist`
        }
        aria-pressed={isFavorited}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg border font-semibold transition-all active:scale-95 focus-visible:outline-2 focus-visible:outline-heritage-maroon',
          isFavorited
            ? 'border-red-300 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-400 dark:bg-red-950/40 dark:border-red-900 dark:text-red-400'
            : 'border-heritage-border bg-heritage-cream text-heritage-charcoal hover:bg-heritage-cream-dark hover:border-heritage-maroon/40',
          buttonSizeClasses[size],
          className,
        )}
      >
        <Heart
          fill={isFavorited ? '#dc2626' : 'none'}
          color={isFavorited ? '#dc2626' : 'currentColor'}
          className={cn(
            iconSizes[size],
            'transition-transform duration-200',
            isFavorited ? 'fill-red-600 text-red-600 scale-110' : 'text-heritage-muted',
          )}
          aria-hidden="true"
        />
        <span>{isFavorited ? 'In Wishlist' : 'Add to Wishlist'}</span>
      </button>
    );
  }

  const iconDimensions = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
    lg: 'h-10 w-10',
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={
        isFavorited
          ? `Remove ${product.title} from wishlist`
          : `Add ${product.title} to wishlist`
      }
      aria-pressed={isFavorited}
      title={isFavorited ? 'In Wishlist' : 'Add to Wishlist'}
      className={cn(
        'group/wish relative inline-flex items-center justify-center rounded-full transition-all active:scale-90 focus-visible:outline-2 focus-visible:outline-heritage-maroon',
        isFavorited
          ? 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/50 dark:border-red-800 hover:bg-red-100 shadow-xs'
          : 'bg-heritage-cream/90 text-heritage-muted hover:bg-heritage-cream-dark hover:text-red-600 border border-heritage-border/70 shadow-2xs',
        iconDimensions[size],
        className,
      )}
    >
      <Heart
        fill={isFavorited ? '#dc2626' : 'none'}
        color={isFavorited ? '#dc2626' : 'currentColor'}
        className={cn(
          iconSizes[size],
          'transition-transform duration-200 group-hover/wish:scale-110',
          isFavorited ? 'fill-red-600 text-red-600' : 'text-heritage-muted',
        )}
        aria-hidden="true"
      />
      {showText && (
        <span className="sr-only">
          {isFavorited ? 'In Wishlist' : 'Add to Wishlist'}
        </span>
      )}
    </button>
  );
}
