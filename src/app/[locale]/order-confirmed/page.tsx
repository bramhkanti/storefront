import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, MessageCircle, ShieldCheck } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SITE_CONFIG } from '@/content/site';
import { formatPrice } from '@/lib/utils/money';
import { buildMetadata } from '@/lib/seo/metadata';

interface OrderConfirmedPageProps {
  searchParams: Promise<{
    orderNumber?: string | undefined;
    name?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
    pin?: string | undefined;
    method?: string | undefined;
    total?: string | undefined;
    count?: string | undefined;
  }>;
}

export const instant = false;

export const metadata: Metadata = buildMetadata({
  title: 'Order Confirmed | Bramhkanti Heritage Foods',
  description:
    'Thank you for your order. Handcrafted heritage foods dispatched from Varanasi.',
  canonicalPath: '/order-confirmed',
  noindex: true,
});

export default async function OrderConfirmedPage({
  searchParams,
}: OrderConfirmedPageProps): Promise<React.JSX.Element> {
  const params = await searchParams;
  const orderNumber = params.orderNumber ?? 'BK-2026-CONFIRMED';
  const name = params.name ?? 'Customer';
  const city = params.city ?? 'Varanasi';
  const state = params.state ?? 'Uttar Pradesh';
  const pin = params.pin ?? '221001';
  const method = params.method === 'upi' ? 'UPI on Delivery' : 'Cash on Delivery (COD)';
  const totalAmount = Number.parseInt(params.total ?? '0', 10);
  const itemCount = Number.parseInt(params.count ?? '1', 10);

  const whatsappHref = `https://wa.me/919876543210?text=${encodeURIComponent(
    `Hello Bramhkanti, I placed order ${orderNumber}. Please share tracking updates when dispatched.`,
  )}`;

  return (
    <div className="py-12 sm:py-20">
      <Container>
        <div className="mx-auto max-w-2xl space-y-8">
          {/* Success Banner */}
          <div className="border-heritage-border bg-heritage-cream text-heritage-charcoal rounded-2xl border p-8 text-center shadow-xs sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="mt-6 inline-flex items-center gap-2">
              <Badge variant="vegetarian">100% Pure Veg Kitchen</Badge>
              <span className="text-heritage-saffron-dark text-xs font-semibold tracking-wider uppercase">
                Order Received
              </span>
            </div>

            <h1 className="text-heritage-maroon mt-3 font-serif text-3xl font-extrabold sm:text-4xl">
              Dhanyawaad, {name}!
            </h1>

            <p className="text-heritage-muted mx-auto mt-2 max-w-md text-sm leading-relaxed sm:text-base">
              Your heritage food order has been securely confirmed and queued for
              artisanal batch packing in our Varanasi culinary workshop.
            </p>

            <div className="border-heritage-border bg-heritage-cream-dark/60 mt-6 inline-flex items-center gap-2 rounded-lg border px-4 py-2">
              <span className="text-heritage-muted text-xs font-medium">
                Order Number:
              </span>
              <span className="text-heritage-maroon font-mono text-sm font-bold">
                {orderNumber}
              </span>
            </div>
          </div>

          {/* Details Card */}
          <div className="border-heritage-border bg-heritage-cream divide-heritage-border/60 divide-y rounded-2xl border p-6 shadow-xs sm:p-8">
            <div className="grid grid-cols-1 gap-4 pb-6 sm:grid-cols-2">
              <div>
                <span className="text-heritage-muted text-xs font-semibold tracking-wider uppercase">
                  Delivery Destination
                </span>
                <p className="text-heritage-charcoal mt-1 text-sm font-medium">{name}</p>
                <p className="text-heritage-muted text-xs">
                  {city}, {state} — {pin}
                </p>
              </div>

              <div>
                <span className="text-heritage-muted text-xs font-semibold tracking-wider uppercase">
                  Payment Arrangement
                </span>
                <p className="text-heritage-charcoal mt-1 text-sm font-medium">
                  {method}
                </p>
                <p className="text-heritage-maroon text-xs font-semibold">
                  Total Payable: {formatPrice(totalAmount, 'INR')} ({itemCount}{' '}
                  {itemCount === 1 ? 'item' : 'items'})
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4 pt-6">
              <h2 className="text-heritage-charcoal font-serif text-base font-bold">
                Fulfillment Timeline
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-emerald-600" />
                  <div>
                    <strong className="text-heritage-charcoal">
                      Step 1: Batch Inspection
                    </strong>
                    <p className="text-heritage-muted">
                      Hermetic seal and cold-pressed oil quality checks executed.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-amber-500" />
                  <div>
                    <strong className="text-heritage-charcoal">
                      Step 2: Express Dispatch
                    </strong>
                    <p className="text-heritage-muted">
                      Ships in insulated mailers from Varanasi within 24 hours.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="text-heritage-muted mt-0.5 h-2 w-2 rounded-full bg-gray-300" />
                  <div>
                    <strong className="text-heritage-charcoal">
                      Step 3: Doorstep Delivery
                    </strong>
                    <p className="text-heritage-muted">
                      Expected in 2 to 4 business days with live SMS tracking.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust and Actions */}
            <div className="pt-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-heritage-green inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-emerald-800"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Receive WhatsApp Dispatch Updates</span>
                </a>

                <Link href="/achar" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full justify-center gap-2 text-xs font-semibold"
                  >
                    <span>Continue Exploring Achar</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="text-heritage-muted mt-6 flex items-center justify-center gap-2 text-center text-xs">
                <ShieldCheck className="text-heritage-green h-4 w-4 shrink-0" />
                <span>{SITE_CONFIG.brand.fssaiBadgeText}</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
