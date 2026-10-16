'use client';

import * as React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/Accordion';
import type { ProductFaqItem } from '../data/productContent';
import { cn } from '@/lib/utils/cn';

export interface ProductFaqProps {
  faqs: ProductFaqItem[];
  title?: string | undefined;
  className?: string | undefined;
}

export function ProductFaq({
  faqs,
  title = 'Frequently Asked Questions',
  className,
}: ProductFaqProps): React.JSX.Element {
  if (!faqs || faqs.length === 0) return <></>;

  return (
    <section aria-labelledby="faq-heading" className={cn('space-y-4', className)}>
      {title && (
        <h2 id="faq-heading" className="text-xl font-bold text-fg leading-snug">
          {title}
        </h2>
      )}

      <div className="rounded-2xl border border-line bg-surface px-5 py-2 divide-y divide-line">
        <Accordion type="single" collapsible defaultValue="faq-0">
          {faqs.map((faq, idx) => (
            <AccordionItem
              key={faq.question}
              value={`faq-${idx}`}
              className="border-none py-1"
            >
              <AccordionTrigger className="w-full py-3.5 text-left text-sm font-semibold text-fg hover:text-primary transition-colors [&>svg]:text-fg-muted [&[data-state=open]>svg]:text-primary">
                <span>{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="pb-3 text-sm text-fg-muted leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
