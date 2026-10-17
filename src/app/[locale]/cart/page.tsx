import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { CartView } from '@/features/cart';

// Per-shopper data (cookies): render on every request.
export const instant = false;

// export const metadata: Metadata = {
//   title: 'Your bag',
//   description: 'Review your items and check out.',
//   robots: { index: false, follow: false },
// };
import { Button } from '@/components/ui/Button';
import { getCart } from '@/lib/cart/queries';
import { formatPrice } from '@/lib/utils/money';
import { buildMetadata } from '@/lib/seo/metadata';
import { SITE_CONFIG } from '@/content/site';

export const metadata: Metadata = buildMetadata({
  title: 'Shopping Bag',
  description: 'Review your items and proceed to checkout.',
  canonicalPath: '/cart',
  noindex: true,
});

export default function CartPage(): React.JSX.Element {
  return (
    <div className="bg-neutral-50 py-8 sm:py-12 dark:bg-[#12100e]">
      <Container>
        <h1 className="mb-6 text-2xl font-semibold tracking-tight sm:mb-8 sm:text-3xl">
          Your bag
        </h1>
        <CartView />
      </Container>
    </div>
  );
}
