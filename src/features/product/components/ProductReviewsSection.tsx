'use client';

import * as React from 'react';
import {
  CheckCircle2,
  Edit3,
  Star,
  X,
} from 'lucide-react';
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
  const [reviewsList, setReviewsList] = React.useState<ProductReviewItem[]>(initialReviews);
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
        <h2 id="reviews-heading" className="text-xl font-bold text-fg leading-snug">
          Customer Reviews
        </h2>

        {!isWritingReview && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsWritingReview(true)}
            className="h-9 text-xs sm:text-sm rounded-full border-line font-semibold text-fg hover:border-line-strong hover:bg-surface-soft shadow-none"
          >
            <Edit3 className="h-3.5 w-3.5 mr-1.5" />
            <span>Write a Review</span>
          </Button>
        )}
      </div>

      {/* Write Review Form Card */}
      {isWritingReview && (
        <form
          onSubmit={handleSubmitReview}
          className="rounded-2xl border border-line bg-surface p-4 sm:p-6 space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div>
              <span className="text-sm font-bold text-fg block">
                Reviewing: {productTitle}
              </span>
              <span className="text-xs text-fg-muted">
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
            <label className="text-xs font-semibold text-fg block">Overall Rating *</label>
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
              <span className="ml-2 text-sm font-bold text-fg">{newRating} / 5</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="rev-author" className="text-xs font-semibold text-fg block">Your Name *</label>
              <input
                id="rev-author"
                type="text"
                required
                placeholder="e.g. Meera Agarwal"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                className="w-full rounded-xl border border-line bg-surface px-3.5 py-2 text-sm text-fg focus:border-primary focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="rev-order" className="text-xs font-semibold text-fg block">Delivered Order ID *</label>
              <input
                id="rev-order"
                type="text"
                required
                placeholder="e.g. BK-DEL-89241"
                value={newOrderId}
                onChange={(e) => setNewOrderId(e.target.value)}
                className="w-full rounded-xl border border-line bg-surface px-3.5 py-2 text-sm text-fg focus:border-primary focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="rev-body" className="text-xs font-semibold text-fg block">Detailed Experience *</label>
            <textarea
              id="rev-body"
              rows={3}
              required
              placeholder="Share how it tastes, flavor profile, spice aroma, or transit packaging..."
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              className="w-full rounded-xl border border-line bg-surface px-3.5 py-2 text-sm text-fg focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-line">
            <button
              type="button"
              onClick={() => setIsWritingReview(false)}
              className="px-4 py-2 text-xs font-semibold text-fg-muted hover:text-fg"
            >
              Cancel
            </button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="h-9 px-5 text-xs font-bold rounded-full bg-primary hover:bg-primary-hover text-on-primary shadow-none"
            >
              {isSubmitting ? 'Submitting...' : 'Post Verified Review'}
            </Button>
          </div>
        </form>
      )}

      {/* Main Grid: Breakdown Column (Left) + Review Cards Grid (Right on Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Rating Score & Progress Bars */}
        <div className="lg:col-span-4 rounded-2xl border border-line bg-surface p-5 space-y-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-extrabold text-fg">
              {rating.average.toFixed(1)}
            </span>
            <span className="text-sm font-bold text-fg-muted">/ 5</span>
          </div>

          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-star text-star" />
            ))}
          </div>

          <p className="text-xs text-fg-muted font-medium">
            1,240 verified reviews
          </p>

          {/* Breakdown Bars */}
          <div className="space-y-1.5 pt-2 border-t border-line">
            {ratingBreakdown.map((row) => (
              <div key={row.stars} className="flex items-center gap-2 text-xs">
                <span className="w-4 font-semibold text-fg-muted shrink-0 text-right">
                  {row.stars}
                </span>
                <Star className="h-2.5 w-2.5 fill-star text-star shrink-0" />
                <div className="flex-1 h-1.5 rounded-full bg-surface-soft overflow-hidden border border-line/40">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${row.percentage}%` }}
                  />
                </div>
                <span className="w-7 text-right text-[11px] text-fg-muted shrink-0">
                  {row.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: 3 Side-by-Side Review Cards on Desktop, Single/Expandable on Mobile */}
        <div className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reviewsList.slice(0, showAllMobile ? reviewsList.length : 3).map((rev) => (
              <article
                key={rev.id}
                className="rounded-2xl border border-line bg-surface p-4 flex flex-col justify-between space-y-3.5"
              >
                <div className="space-y-3">
                  {/* Top Header: Author Info */}
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 lg:h-10 lg:w-10 shrink-0 items-center justify-center rounded-full bg-surface-soft border border-line font-bold text-fg text-xs lg:text-sm">
                      {rev.author.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-[14px] lg:text-[16px] font-bold text-fg leading-tight">
                        {rev.author}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-[12px] lg:text-[13px] font-semibold text-success-text">
                        <CheckCircle2 className="h-3 w-3 text-success shrink-0" />
                        <span>Verified Buyer</span>
                      </span>
                    </div>
                  </div>

                  {/* Star Rating: Positioned before review text */}
                  <div className="flex items-center gap-0.5" aria-label={`${rev.rating || 5} out of 5 stars`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 lg:h-4 lg:w-4 fill-star text-star" />
                    ))}
                  </div>

                  {/* Body Text */}
                  <p className="text-[14px] lg:text-[15px] text-fg-muted leading-relaxed">
                    {rev.body}
                  </p>
                </div>

                {/* Footer Date / Time */}
                <div className="pt-2.5 border-t border-line text-[14px] lg:text-[15px] text-fg-muted">
                  {rev.date}
                </div>
              </article>
            ))}
          </div>

          {/* Mobile "View All Reviews" Toggle */}
          <div className="block lg:hidden text-center pt-1">
            <button
              type="button"
              onClick={() => setShowAllMobile((prev) => !prev)}
              className="text-xs font-bold text-primary hover:underline"
            >
              {showAllMobile ? 'Show Less' : 'View All Reviews →'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
