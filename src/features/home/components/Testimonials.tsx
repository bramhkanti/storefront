import * as React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { TESTIMONIALS_DATA } from '../constants';
import type { TestimonialItem } from '../types';

export interface TestimonialsProps {
  testimonials?: TestimonialItem[];
}

export function Testimonials({
  testimonials = TESTIMONIALS_DATA,
}: TestimonialsProps): React.JSX.Element {
  // Schema.org Review structured data
  const reviewJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Bramhkanti Authentic Delicacies',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: testimonials.length,
      bestRating: '5',
      worstRating: '1',
    },
    review: testimonials.map((t) => ({
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: t.rating.toString(),
        bestRating: '5',
      },
      author: {
        '@type': 'Person',
        name: t.author,
      },
      reviewBody: t.quote,
    })),
  };

  return (
    <section
      className="from-heritage-cream via-heritage-cream-dark/20 to-heritage-cream bg-gradient-to-b py-16 sm:py-24"
      aria-labelledby="testimonials-heading"
    >
      {/* Schema.org Review Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewJsonLd) }}
      />

      <Container>
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex items-center justify-center gap-2">
            <span
              className="text-heritage-border h-px w-8 bg-current"
              aria-hidden="true"
            />
            <span className="text-heritage-saffron-dark text-xs font-semibold tracking-widest uppercase">
              Loved by Thousands
            </span>
            <span
              className="text-heritage-border h-px w-8 bg-current"
              aria-hidden="true"
            />
          </div>

          <h2
            id="testimonials-heading"
            className="text-heritage-maroon mt-3 font-serif text-3xl font-extrabold tracking-tight sm:text-4xl"
          >
            Real People. Real Flavours.
          </h2>
        </div>

        {/* 3 Review Cards Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((review) => (
            <div
              key={review.id}
              className="border-heritage-border bg-heritage-cream flex flex-col justify-between rounded-2xl border p-6 shadow-xs transition-shadow hover:shadow-md sm:p-7"
            >
              {/* Star Rating */}
              <div>
                <div
                  className="flex items-center gap-1 text-amber-500"
                  aria-label={`${review.rating} out of 5 stars`}
                >
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-500"
                      aria-hidden="true"
                    />
                  ))}
                </div>

                {/* Quote Text */}
                <blockquote className="text-heritage-charcoal mt-4 text-sm leading-relaxed font-normal sm:text-base">
                  &ldquo;{review.quote}&rdquo;
                </blockquote>
              </div>

              {/* Author Info */}
              <div className="border-heritage-border/60 mt-6 flex items-center gap-3 border-t pt-4">
                <div className="border-heritage-border relative h-10 w-10 shrink-0 overflow-hidden rounded-full border">
                  <Image
                    src={review.avatarUrl}
                    alt={review.author}
                    fill
                    sizes="40px"
                    className="object-cover object-center"
                  />
                </div>
                <div>
                  <p className="text-heritage-charcoal text-xs font-bold sm:text-sm">
                    {review.author}
                  </p>
                  <p className="text-heritage-muted text-[11px]">{review.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="mt-8 flex justify-center gap-2" aria-hidden="true">
          <span className="bg-heritage-maroon h-2 w-5 rounded-full" />
          <span className="bg-heritage-border h-2 w-2 rounded-full" />
          <span className="bg-heritage-border h-2 w-2 rounded-full" />
          <span className="bg-heritage-border h-2 w-2 rounded-full" />
        </div>
      </Container>
    </section>
  );
}
