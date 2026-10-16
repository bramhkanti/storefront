'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import type { Product } from '@/lib/api/contracts/domain';
import { CartButton } from '@/components/layout/CartButton';
import { cn } from '@/lib/utils/cn';

export interface ProductHeaderProps {
  product: Product;
  categoryName?: string | undefined;
  className?: string | undefined;
}

export function ProductHeader({
  className,
}: ProductHeaderProps): React.JSX.Element {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <header
      id="product-sticky-header"
      className={cn(
        'sticky top-0 z-40 w-full h-14 bg-white/95 backdrop-blur-md border-b border-neutral-200 px-3 sm:px-6 transition-colors dark:bg-[#161412]/95 dark:border-neutral-800 flex items-center lg:hidden',
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        {/* Left: Back Icon (no circle) + "Product Details" text */}
        <button
          type="button"
          onClick={handleBack}
          aria-label="Go back to previous page"
          className="flex items-center gap-1.5 -ml-1 py-1 px-1.5 text-heritage-charcoal transition-colors hover:text-heritage-maroon active:scale-95 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 dark:text-[#f5f0e8] focus-visible:outline-2 focus-visible:outline-heritage-maroon"
        >
          <ChevronLeft className="h-6 w-6 stroke-[2.4]" />
          <span className="text-base sm:text-lg font-bold tracking-tight text-heritage-charcoal dark:text-[#f5f0e8]">
            Product Details
          </span>
        </button>

        {/* Right: Reusable Global Cart Button */}
        <CartButton />
      </div>
    </header>
  );
}
