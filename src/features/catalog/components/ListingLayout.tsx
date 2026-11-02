import * as React from 'react';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs, type BreadcrumbItem } from '@/components/layout/Breadcrumbs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/Accordion';
import { cn } from '@/lib/utils/cn';

export interface ListingLayoutProps {
  title: string;
  /** Trail after "Home" (Breadcrumbs adds Home itself). */
  breadcrumbs: BreadcrumbItem[];
  /** Short intro shown under the products, for shoppers who scroll and for SEO. */
  about?: string | undefined;
  faqs?: Array<{ question: string; answer: string }> | undefined;
  children: React.ReactNode;
}

/**
 * Plain product listing page: breadcrumb, title, filters + grid. Any longer
 * text sits below the products so the grid is the first thing people see.
 */
export function ListingLayout({
  title,
  breadcrumbs,
  about,
  faqs,
  children,
}: ListingLayoutProps) {
  return (
    <div className="bg-page text-fg pt-4 pb-16 sm:pt-6">
      <Container>
        <Breadcrumbs items={breadcrumbs} />

        <h1 className="text-fg mt-4 mb-6 text-2xl font-bold tracking-tight sm:mt-6 sm:mb-8 sm:text-4xl">
          {title}
        </h1>

        {children}

        {about && (
          <section aria-label={`About ${title}`} className="mt-16 max-w-3xl space-y-2">
            <h2 className="text-fg text-base font-bold">About {title}</h2>
            <p className="text-fg-muted text-sm leading-relaxed">{about}</p>
          </section>
        )}

        {faqs && faqs.length > 0 && (
          <section
            aria-labelledby="listing-faq-heading"
            className={cn(
              'bg-surface-soft grid gap-8 rounded-3xl p-5 sm:p-8 lg:grid-cols-[1fr_1.6fr] lg:gap-12 lg:p-12',
              about ? 'mt-10' : 'mt-16',
            )}
          >
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-primary text-xs font-bold tracking-[0.14em] uppercase">
                FAQs
              </p>
              <h2
                id="listing-faq-heading"
                className="text-fg mt-2 text-2xl font-bold tracking-tight sm:text-3xl"
              >
                Questions about {title}
              </h2>
              <p className="text-fg-muted mt-3 text-sm leading-relaxed">
                Can&apos;t find what you&apos;re looking for? We&apos;re happy to help.
              </p>
              <Link
                href="/contact"
                className="border-line-strong text-fg hover:border-primary hover:text-primary mt-5 inline-flex h-10 items-center gap-2 rounded-full border px-5 text-sm font-semibold transition-colors"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Contact us
              </Link>
            </div>

            <Accordion
              type="single"
              collapsible
              defaultValue="faq-0"
              className="space-y-3"
            >
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={faq.question}
                  value={`faq-${index}`}
                  className="bg-surface data-[state=open]:border-primary/40 rounded-2xl border border-transparent px-4 shadow-[0_1px_3px_rgb(36_24_20/0.06)] transition-colors sm:px-6"
                >
                  <AccordionTrigger className="text-fg hover:text-primary [&>svg]:bg-surface-soft [&>svg]:text-fg [&[data-state=open]>svg]:bg-primary [&[data-state=open]>svg]:text-on-primary gap-4 py-4 text-left text-sm font-semibold hover:no-underline sm:py-5 sm:text-base [&>svg]:h-8 [&>svg]:w-8 [&>svg]:rounded-full [&>svg]:p-2">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-fg-muted pr-10 pb-5 text-sm leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        )}
      </Container>
    </div>
  );
}
