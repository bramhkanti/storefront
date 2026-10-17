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

export function ProductHeader({ className }: ProductHeaderProps): React.JSX.Element {
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
        'sticky top-0 z-40 flex h-14 w-full items-center border-b border-neutral-200 bg-white/95 px-3 backdrop-blur-md transition-colors sm:px-6 lg:hidden dark:border-neutral-800 dark:bg-[#161412]/95',
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        {/* Left: Back Icon (no circle) + "Product Details" text */}
        <button
          type="button"
          onClick={handleBack}
          aria-label="Go back to previous page"
          className="text-heritage-charcoal hover:text-heritage-maroon focus-visible:outline-heritage-maroon -ml-1 flex items-center gap-1.5 rounded-lg px-1.5 py-1 transition-colors hover:bg-black/5 focus-visible:outline-2 active:scale-95 dark:text-[#f5f0e8] dark:hover:bg-white/5"
        >
          <ChevronLeft className="h-6 w-6 stroke-[2.4]" />
          <span className="text-heritage-charcoal text-base font-bold tracking-tight sm:text-lg dark:text-[#f5f0e8]">
            Product Details
          </span>
        </button>

        {/* Right: Reusable Global Cart Button */}
        <CartButton />
      </div>
    </header>
  );
}
