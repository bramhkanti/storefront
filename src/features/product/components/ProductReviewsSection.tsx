'use client';

import * as React from 'react';
import {
  BadgeCheck,
  CheckCircle2,
  MessageSquareText,
  PenLine,
  Star,
  X,
} from 'lucide-react';

import type { ProductReview, ProductReviewPage } from '@/lib/api/contracts/domain';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';
import { useAuth } from '@/lib/store';
import { cn } from '@/lib/utils/cn';
import { loadMoreReviewsAction, submitReviewAction } from '../reviews.actions';

export interface ProductReviewsSectionProps {
  productId: string;
  productTitle: string;
  initial: ProductReviewPage;
  className?: string | undefined;
}

const RATING_WORDS = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'];
const BODY_MIN = 10;
const BODY_MAX = 2000;

const dateFormat = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

export function ProductReviewsSection({
  productId,
  productTitle,
  initial,
  className,
}: ProductReviewsSectionProps): React.JSX.Element {
  const { summary } = initial;
  const [reviews, setReviews] = React.useState<ProductReview[]>(initial.reviews);
  const [total, setTotal] = React.useState(initial.total);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [formOpen, setFormOpen] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const hasReviews = summary.count > 0;

  const loadMore = async () => {
    setLoadingMore(true);
    const result = await loadMoreReviewsAction(productId, reviews.length);
    setLoadingMore(false);
    if (result.ok) {
      const known = new Set(reviews.map((review) => review.id));
      setReviews([...reviews, ...result.data.reviews.filter((r) => !known.has(r.id))]);
      setTotal(result.data.total);
    }
  };

  const writeButton = !formOpen && !submitted && (
    <Button
      variant="outline"
      onClick={() => setFormOpen(true)}
      className="h-10 shrink-0 rounded-full px-5 text-sm font-semibold"
    >
      <PenLine className="h-4 w-4" aria-hidden="true" />
      Write a review
    </Button>
  );

  return (
    <section aria-labelledby="reviews-heading" className={cn('space-y-6', className)}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-primary text-xs font-semibold tracking-[0.14em] uppercase">
            Reviews
          </p>
          <h2
            id="reviews-heading"
            className="text-fg mt-1.5 text-2xl font-bold tracking-tight sm:text-3xl"
          >
            Customer reviews
          </h2>
        </div>
        {hasReviews && writeButton}
      </div>

      {submitted && (
        <div
          role="status"
          className="bg-success-tint text-success-text flex items-start gap-3 rounded-2xl p-4 sm:p-5"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">Thank you for your review!</p>
            <p className="mt-0.5 text-sm opacity-90">
              It will appear here after a quick check by our team.
            </p>
          </div>
        </div>
      )}

      {formOpen && (
        <ReviewForm
          productId={productId}
          productTitle={productTitle}
          onCancel={() => setFormOpen(false)}
          onSubmitted={() => {
            setFormOpen(false);
            setSubmitted(true);
          }}
        />
      )}

      {hasReviews ? (
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-10">
          {/* Summary */}
          <div className="bg-surface border-line rounded-2xl border p-5 sm:p-6 lg:sticky lg:top-28 lg:col-span-4">
            <div className="flex items-center gap-4">
              <p className="text-fg text-5xl font-bold tracking-tight tabular-nums">
                {summary.average.toFixed(1)}
              </p>
              <div>
                <StarRating value={summary.average} size="lg" />
                <p className="text-fg-muted mt-1 text-sm">
                  Based on {summary.count} {summary.count === 1 ? 'review' : 'reviews'}
                </p>
              </div>
            </div>

            <ul className="mt-5 space-y-2" aria-label="Rating breakdown">
              {([5, 4, 3, 2, 1] as const).map((star) => {
                const count = summary.distribution[star];
                const percent = summary.count
                  ? Math.round((count / summary.count) * 100)
                  : 0;
                return (
                  <li key={star} className="flex items-center gap-3 text-sm">
                    <span className="text-fg-muted flex w-7 shrink-0 items-center gap-0.5 tabular-nums">
                      {star}
                      <Star className="fill-star text-star h-3 w-3" aria-hidden="true" />
                    </span>
                    <span className="bg-surface-soft h-2 flex-1 overflow-hidden rounded-full">
                      <span
                        className="bg-star block h-full rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </span>
                    <span className="text-fg-muted w-8 shrink-0 text-right tabular-nums">
                      {count}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* List */}
          <div className="lg:col-span-8">
            <ul className="divide-line divide-y">
              {reviews.map((review) => (
                <li key={review.id} className="py-5 first:pt-0">
                  <ReviewItem review={review} />
                </li>
              ))}
            </ul>

            {reviews.length < total && (
              <div className="pt-2">
                <Button
                  variant="secondary"
                  onClick={loadMore}
                  isLoading={loadingMore}
                  className="h-10 w-full rounded-full sm:w-auto sm:px-6"
                >
                  Show more reviews
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        !formOpen &&
        !submitted && (
          <div className="bg-surface border-line flex flex-col items-center rounded-2xl border border-dashed px-6 py-10 text-center">
            <span className="bg-primary-tint text-primary flex h-12 w-12 items-center justify-center rounded-full">
              <MessageSquareText className="h-6 w-6" aria-hidden="true" />
            </span>
            <p className="text-fg mt-4 text-base font-semibold">No reviews yet</p>
            <p className="text-fg-muted mt-1 max-w-sm text-sm">
              Tried {productTitle}? Share your experience to help other customers.
            </p>
            <div className="mt-5">{writeButton}</div>
          </div>
        )
      )}
    </section>
  );
}

function ReviewItem({ review }: { review: ProductReview }) {
  return (
    <article>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <StarRating value={review.rating} size="sm" />
        {review.title && (
          <h3 className="text-fg text-[15px] font-semibold">{review.title}</h3>
        )}
      </div>
      <p className="text-fg-muted mt-2 text-sm leading-relaxed whitespace-pre-line sm:text-[15px]">
        {review.body}
      </p>
      <div className="text-fg-muted mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        <span className="text-fg font-semibold">{review.authorName}</span>
        {review.verifiedPurchase && (
          <span className="text-success-text inline-flex items-center gap-1 font-medium">
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Verified buyer
          </span>
        )}
        <time dateTime={review.createdAt}>
          {dateFormat.format(new Date(review.createdAt))}
        </time>
      </div>
    </article>
  );
}

function ReviewForm({
  productId,
  productTitle,
  onCancel,
  onSubmitted,
}: {
  productId: string;
  productTitle: string;
  onCancel: () => void;
  onSubmitted: () => void;
}) {
  const { isAuthenticated, openAuthModal, logout } = useAuth();
  const [rating, setRating] = React.useState(0);
  const [hovered, setHovered] = React.useState(0);
  const [title, setTitle] = React.useState('');
  const [body, setBody] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);

  const shown = hovered || rating;
  const bodyLength = body.trim().length;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    if (!rating) {
      setError('Choose a star rating');
      return;
    }
    if (bodyLength < BODY_MIN) {
      setError(`Write at least ${BODY_MIN} characters about the product`);
      return;
    }

    setPending(true);
    const result = await submitReviewAction({ productId, rating, title, body });
    setPending(false);

    if (result.ok) {
      onSubmitted();
      return;
    }
    if (result.unauthenticated) {
      await logout();
      openAuthModal();
    }
    setError(result.error);
  };

  return (
    <form
      onSubmit={submit}
      noValidate
      className="bg-surface border-line space-y-5 rounded-2xl border p-5 sm:p-6"
      aria-labelledby="review-form-title"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p id="review-form-title" className="text-fg text-base font-semibold">
            Review {productTitle}
          </p>
          <p className="text-fg-muted mt-0.5 text-sm">
            Reviews are checked by our team before they appear.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close review form"
          className="text-fg-muted hover:text-fg hover:bg-surface-soft -m-1 rounded-full p-2"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <fieldset>
        <legend className="text-fg text-sm font-semibold">Your rating</legend>
        <div className="mt-2 flex items-center gap-3">
          <div
            role="radiogroup"
            aria-label="Rating"
            className="flex items-center"
            onMouseLeave={() => setHovered(0)}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                role="radio"
                aria-checked={rating === star}
                aria-label={`${star} ${star === 1 ? 'star' : 'stars'}, ${RATING_WORDS[star]}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHovered(star)}
                className="rounded-md p-1 transition-transform active:scale-90"
              >
                <Star
                  aria-hidden="true"
                  className={cn(
                    'h-8 w-8 transition-colors',
                    star <= shown
                      ? 'fill-star text-star'
                      : 'fill-star-empty text-star-empty',
                  )}
                />
              </button>
            ))}
          </div>
          <span className="text-fg-muted text-sm font-medium" aria-live="polite">
            {RATING_WORDS[shown]}
          </span>
        </div>
      </fieldset>

      <div className="space-y-1.5">
        <label htmlFor="review-title" className="text-fg block text-sm font-semibold">
          Title <span className="text-fg-muted font-normal">(optional)</span>
        </label>
        <input
          id="review-title"
          type="text"
          maxLength={120}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Sum it up in a few words"
          className="border-line bg-surface text-fg placeholder:text-fg-muted/70 h-11 w-full rounded-xl border px-4 text-sm"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="review-body" className="text-fg block text-sm font-semibold">
          Your review
        </label>
        <textarea
          id="review-body"
          rows={4}
          maxLength={BODY_MAX}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="How did it taste? How was the packing and freshness?"
          className="border-line bg-surface text-fg placeholder:text-fg-muted/70 w-full rounded-xl border px-4 py-3 text-sm leading-relaxed"
        />
        <p className="text-fg-muted text-right text-xs tabular-nums">
          {bodyLength}/{BODY_MAX}
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="bg-danger-tint text-danger rounded-xl px-4 py-3 text-sm"
        >
          {error}
        </p>
      )}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          variant="ghost"
          onClick={onCancel}
          className="h-11 rounded-full px-5 text-sm font-semibold"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={pending}
          className="h-11 rounded-full px-6 text-sm font-semibold"
        >
          {isAuthenticated ? 'Submit review' : 'Log in to submit'}
        </Button>
      </div>
    </form>
  );
}
