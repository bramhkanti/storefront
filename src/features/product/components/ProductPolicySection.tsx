'use client';

import * as React from 'react';
import { RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import type { EnrichedProductContent } from '../data/productContent';
import { cn } from '@/lib/utils/cn';

export interface ProductPolicySectionProps {
  shippingHighlights: EnrichedProductContent['shippingHighlights'];
  className?: string | undefined;
}

export function ProductPolicySection({
  shippingHighlights,
  className,
}: ProductPolicySectionProps): React.JSX.Element {
  const policies = [
    {
      icon: Truck,
      title: '24-Hour Pan-India Dispatch',
      desc: shippingHighlights.dispatchTime,
    },
    {
      icon: ShieldCheck,
      title: 'Zero-Breakage Glass Guarantee',
      desc: shippingHighlights.packagingStandard,
    },
    {
      icon: RotateCcw,
      title: 'Instant Replacement Assurance',
      desc: shippingHighlights.transitAssurance,
    },
  ];

  return (
    <section aria-labelledby="policy-heading" className={cn('space-y-4', className)}>
      <div>
        <h2
          id="policy-heading"
          className="text-[20px] leading-snug font-semibold text-neutral-900"
        >
          Delivery, Packaging & Replacement Policy
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {policies.map((policy, idx) => {
          const Icon = policy.icon;
          return (
            <div
              key={idx}
              className="space-y-2.5 rounded-2xl border border-neutral-200 bg-white p-4 transition-colors hover:border-neutral-300"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-800">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-sm leading-tight font-semibold text-neutral-900">
                  {policy.title}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-neutral-600">{policy.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2.5 rounded-2xl border border-neutral-200 bg-neutral-50/60 p-3.5 text-xs text-neutral-600">
        <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
        <span>
          All orders include live WhatsApp & SMS tracking. Instant free doorstep
          replacement guaranteed if transit delay or damage occurs.
        </span>
      </div>
    </section>
  );
}
