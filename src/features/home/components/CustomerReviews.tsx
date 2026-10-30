import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BadgeCheck } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { StarRating } from '@/components/ui/StarRating';
import type { ProductReview } from '@/lib/api/contracts/domain';

export interface CustomerReviewsProps {
  reviews: ProductReview[];
}

/**
 * Latest approved customer reviews. Hidden until the shop has some: the
 * home page never shows made-up testimonials.
 */
export function CustomerReviews({ reviews }: CustomerReviewsProps) {
  if (reviews.length === 0) return null;

  return (
    <section className="py-12 sm:py-20" aria-labelledby="customer-reviews-heading">
      <Container>
        <SectionHeading
          id="customer-reviews-heading"
          eyebrow="Customer reviews"
          title="What our customers say"
          align="center"
        />
      </Container>
      <Container className="mt-8 px-0 sm:px-6 lg:px-8">
        <ul className="flex snap-x snap-mandatory scroll-px-4 [scrollbar-width:none] gap-3 overflow-x-auto px-4 pb-2 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="bg-surface border-line flex w-[82vw] max-w-sm shrink-0 snap-start flex-col rounded-2xl border p-5 sm:w-auto sm:max-w-none sm:p-6"
            >
              <StarRating value={review.rating} size="md" />
              {review.title && (
                <p className="text-fg mt-3 text-[15px] font-semibold">{review.title}</p>
              )}
              <blockquote className="text-fg-muted mt-2 line-clamp-5 text-sm leading-relaxed">
                {review.body}
              </blockquote>
              <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                <div className="min-w-0">
                  <p className="text-fg truncate text-sm font-semibold">
                    {review.authorName}
                  </p>
                  {review.verifiedPurchase && (
                    <p className="text-success-text mt-0.5 inline-flex items-center gap-1 text-xs font-medium">
                      <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                      Verified buyer
                    </p>
                  )}
                </div>
                {review.product && (
                  <Link
                    href={`/products/${review.product.handle}`}
                    className="group flex max-w-[55%] items-center gap-2"
                  >
                    {review.product.thumbnailUrl && (
                      <span className="bg-surface-soft relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={review.product.thumbnailUrl}
                          alt=""
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </span>
                    )}
                    <span className="text-fg-muted group-hover:text-primary line-clamp-2 text-xs leading-snug font-medium">
                      {review.product.title}
                    </span>
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
