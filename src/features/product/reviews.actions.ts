'use server';

import { getReviewReader, getReviewService } from '@/lib/api/container';
import type { ProductReview } from '@/lib/api/contracts/domain';
import { UserFacingError } from '@/lib/api/errors';
import { getCustomerToken } from '@/lib/auth/session';

export type ReviewActionResult<T = undefined> =
  { ok: true; data: T } | { ok: false; error: string; unauthenticated?: boolean };

const MIN_BODY = 10;
const MAX_BODY = 2000;
const MAX_TITLE = 120;

/** Submits a review for moderation. Requires a logged-in customer. */
export async function submitReviewAction(input: {
  productId: string;
  rating: number;
  title?: string;
  body: string;
}): Promise<ReviewActionResult<{ verifiedPurchase: boolean }>> {
  const token = await getCustomerToken();
  if (!token) {
    return { ok: false, error: 'Please log in to write a review', unauthenticated: true };
  }

  const rating = Math.round(Number(input.rating));
  const body = input.body.trim();
  const title = input.title?.trim().slice(0, MAX_TITLE);
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return { ok: false, error: 'Choose a rating from 1 to 5 stars' };
  }
  if (body.length < MIN_BODY) {
    return { ok: false, error: `Write at least ${MIN_BODY} characters` };
  }
  if (body.length > MAX_BODY) {
    return { ok: false, error: `Keep it under ${MAX_BODY} characters` };
  }

  try {
    const result = await getReviewService().submitReview(token, {
      productId: input.productId,
      rating,
      body,
      title: title || undefined,
    });
    return { ok: true, data: { verifiedPurchase: result.verifiedPurchase } };
  } catch (error) {
    if (error instanceof UserFacingError) {
      return error.status === 401
        ? { ok: false, error: 'Please log in again to continue', unauthenticated: true }
        : { ok: false, error: error.message };
    }
    console.error('Could not submit review', error);
    return { ok: false, error: 'Could not submit your review. Please try again.' };
  }
}

/** Loads more approved reviews ("Show more reviews"). */
export async function loadMoreReviewsAction(
  productId: string,
  offset: number,
): Promise<ReviewActionResult<{ reviews: ProductReview[]; total: number }>> {
  try {
    const page = await getReviewReader().listProductReviews(productId, {
      limit: 6,
      offset: Math.max(0, Math.floor(offset)),
    });
    return { ok: true, data: { reviews: page.reviews, total: page.total } };
  } catch {
    return { ok: false, error: 'Could not load more reviews' };
  }
}
