'use client';

import * as React from 'react';
import { CheckCircle2, Edit3, Star, X } from 'lucide-react';
import type { ProductReviewItem } from '../data/productContent';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/lib/store';
import { cn } from '@/lib/utils/cn';

export interface ProductReviewsSectionProps {
  reviews: ProductReviewItem[];
  rating: {
    average: number;
    count: number;
    label: string;
  };
  productTitle: string;
  className?: string | undefined;
}

export function ProductReviewsSection({
  reviews: initialReviews,
  rating,
  productTitle,
  className,
}: ProductReviewsSectionProps): React.JSX.Element {
  const { addToast } = useToast();
  const [reviewsList, setReviewsList] =
    React.useState<ProductReviewItem[]>(initialReviews);
  const [isWritingReview, setIsWritingReview] = React.useState(false);
  const [showAllMobile, setShowAllMobile] = React.useState(false);

  // Write Review Form State
  const [newRating, setNewRating] = React.useState(5);
  const [newAuthor, setNewAuthor] = React.useState('');
  const [newOrderId, setNewOrderId] = React.useState('');
  const [newTitle, setNewTitle] = React.useState('');
  const [newBody, setNewBody] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const ratingBreakdown = [
    { stars: 5, percentage: 92, count: '1,140' },
    { stars: 4, percentage: 6, count: '74' },
    { stars: 3, percentage: 1, count: '12' },
    { stars: 2, percentage: 1, count: '10' },
    { stars: 1, percentage: 0, count: '4' },
  ];

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newAuthor.trim() || !newBody.trim()) {
      addToast({
        type: 'error',
        message: 'Please complete all required fields (Name and Experience).',
      });
      return;
    }

    if (!newOrderId.trim()) {
      addToast({
        type: 'error',
        message: 'Delivered Order ID is required to verify your purchase.',
      });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const createdReview: ProductReviewItem = {
        id: `rev-${Date.now()}`,
        author: newAuthor.trim(),
        location: 'Verified Buyer',
        rating: newRating,
        date: 'Just now',
        orderId: newOrderId.trim().toUpperCase(),
        title: newTitle.trim() || `${newRating}-Star Experience`,
        body: newBody.trim(),
        verifiedBuyer: true,
        helpfulCount: 1,
      };

      setReviewsList((prev) => [createdReview, ...prev]);
      setIsSubmitting(false);
      setIsWritingReview(false);
      setNewAuthor('');
      setNewOrderId('');
      setNewTitle('');
      setNewBody('');

      addToast({
        type: 'success',
        message: 'Thank you! Your verified delivered review has been posted.',
      });
    }, 500);
  };

  return (
    <section aria-labelledby="reviews-heading" className={cn('space-y-6', className)}>
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 id="reviews-heading" className="text-fg text-xl leading-snug font-bold">
          Customer Reviews
        </h2>

        {!isWritingReview && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsWritingReview(true)}
            className="border-line text-fg hover:border-line-strong hover:bg-surface-soft h-9 rounded-full text-xs font-semibold shadow-none sm:text-sm"
          >
            <Edit3 className="mr-1.5 h-3.5 w-3.5" />
            <span>Write a Review</span>
          </Button>
        )}
      </div>

      {/* Write Review Form Card */}
      {isWritingReview && (
        <form
          onSubmit={handleSubmitReview}
          className="border-line bg-surface animate-in fade-in space-y-4 rounded-2xl border p-4 duration-200 sm:p-6"
        >
          <div className="border-line flex items-center justify-between border-b pb-3">
            <div>
              <span className="text-fg block text-sm font-bold">
                Reviewing: {productTitle}
              </span>
              <span className="text-fg-muted text-xs">
                Only customers with a delivered order can submit feedback
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsWritingReview(false)}
              className="text-fg-muted hover:text-fg p-1"
              aria-label="Close review form"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Rating */}
          <div className="space-y-1">
            <label className="text-fg block text-xs font-semibold">
              Overall Rating *
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewRating(star)}
                  className="p-1 focus:outline-none"
                  aria-label={`Rate ${star} star`}
                >
                  <Star
                    className={cn(
                      'h-6 w-6 transition-colors',
                      star <= newRating ? 'fill-star text-star' : 'text-line',
                    )}
                  />
                </button>
              ))}
              <span className="text-fg ml-2 text-sm font-bold">{newRating} / 5</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label htmlFor="rev-author" className="text-fg block text-xs font-semibold">
                Your Name *
              </label>
              <input
                id="rev-author"
                type="text"
                required
                placeholder="e.g. Meera Agarwal"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                className="border-line bg-surface text-fg focus:border-primary w-full rounded-xl border px-3.5 py-2 text-sm focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="rev-order" className="text-fg block text-xs font-semibold">
                Delivered Order ID *
              </label>
              <input
                id="rev-order"
                type="text"
                required
                placeholder="e.g. BK-DEL-89241"
                value={newOrderId}
                onChange={(e) => setNewOrderId(e.target.value)}
                className="border-line bg-surface text-fg focus:border-primary w-full rounded-xl border px-3.5 py-2 font-mono text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="rev-body" className="text-fg block text-xs font-semibold">
              Detailed Experience *
            </label>
            <textarea
              id="rev-body"
              rows={3}
              required
              placeholder="Share how it tastes, flavor profile, spice aroma, or transit packaging..."
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              className="border-line bg-surface text-fg focus:border-primary w-full rounded-xl border px-3.5 py-2 text-sm focus:outline-none"
            />
          </div>

          <div className="border-line flex items-center justify-end gap-2 border-t pt-2">
            <button
              type="button"
              onClick={() => setIsWritingReview(false)}
              className="text-fg-muted hover:text-fg px-4 py-2 text-xs font-semibold"
            >
              Cancel
            </button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary-hover text-on-primary h-9 rounded-full px-5 text-xs font-bold shadow-none"
            >
              {isSubmitting ? 'Submitting...' : 'Post Verified Review'}
            </Button>
          </div>
        </form>
      )}

      {/* Main Grid: Breakdown Column (Left) + Review Cards Grid (Right on Desktop) */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left Column: Rating Score & Progress Bars */}
        <div className="border-line bg-surface space-y-3 rounded-2xl border p-5 lg:col-span-4">
          <div className="flex items-baseline gap-1.5">
            <span className="text-fg text-3xl font-extrabold sm:text-4xl">
              {rating.average.toFixed(1)}
            </span>
            <span className="text-fg-muted text-sm font-bold">/ 5</span>
          </div>

          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="fill-star text-star h-4 w-4" />
            ))}
          </div>

          <p className="text-fg-muted text-xs font-medium">1,240 verified reviews</p>

          {/* Breakdown Bars */}
          <div className="border-line space-y-1.5 border-t pt-2">
            {ratingBreakdown.map((row) => (
              <div key={row.stars} className="flex items-center gap-2 text-xs">
                <span className="text-fg-muted w-4 shrink-0 text-right font-semibold">
                  {row.stars}
                </span>
                <Star className="fill-star text-star h-2.5 w-2.5 shrink-0" />
                <div className="bg-surface-soft border-line/40 h-1.5 flex-1 overflow-hidden rounded-full border">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${row.percentage}%` }}
                  />
                </div>
                <span className="text-fg-muted w-7 shrink-0 text-right text-[11px]">
                  {row.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: 3 Side-by-Side Review Cards on Desktop, Single/Expandable on Mobile */}
        <div className="space-y-4 lg:col-span-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {reviewsList.slice(0, showAllMobile ? reviewsList.length : 3).map((rev) => (
              <article
                key={rev.id}
                className="border-line bg-surface flex flex-col justify-between space-y-3.5 rounded-2xl border p-4"
              >
                <div className="space-y-3">
                  {/* Top Header: Author Info */}
                  <div className="flex items-center gap-2.5">
                    <div className="bg-surface-soft border-line text-fg flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xs font-bold lg:h-10 lg:w-10 lg:text-sm">
                      {rev.author.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-fg text-[14px] leading-tight font-bold lg:text-[16px]">
                        {rev.author}
                      </h3>
                      <span className="text-success-text inline-flex items-center gap-1 text-[12px] font-semibold lg:text-[13px]">
                        <CheckCircle2 className="text-success h-3 w-3 shrink-0" />
                        <span>Verified Buyer</span>
                      </span>
                    </div>
                  </div>

                  {/* Star Rating: Positioned before review text */}
                  <div
                    className="flex items-center gap-0.5"
                    aria-label={`${rev.rating || 5} out of 5 stars`}
                  >
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="fill-star text-star h-3.5 w-3.5 lg:h-4 lg:w-4"
                      />
                    ))}
                  </div>

                  {/* Body Text */}
                  <p className="text-fg-muted text-[14px] leading-relaxed lg:text-[15px]">
                    {rev.body}
                  </p>
                </div>

                {/* Footer Date / Time */}
                <div className="border-line text-fg-muted border-t pt-2.5 text-[14px] lg:text-[15px]">
                  {rev.date}
                </div>
              </article>
            ))}
          </div>

          {/* Mobile "View All Reviews" Toggle */}
          <div className="block pt-1 text-center lg:hidden">
            <button
              type="button"
              onClick={() => setShowAllMobile((prev) => !prev)}
              className="text-primary text-xs font-bold hover:underline"
            >
              {showAllMobile ? 'Show Less' : 'View All Reviews →'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
