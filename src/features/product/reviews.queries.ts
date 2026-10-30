import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { getReviewReader } from '@/lib/api/container';
import type { ProductReview, ProductReviewPage } from '@/lib/api/contracts/domain';
import { CACHE_TAGS } from '@/lib/cache/tags';

export const REVIEWS_PAGE_SIZE = 6;

const EMPTY_PAGE: ProductReviewPage = {
  reviews: [],
  total: 0,
  summary: { average: 0, count: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
};

/** First page of a product's approved reviews. Never fails the page. */
export async function getProductReviews(productId: string): Promise<ProductReviewPage> {
  'use cache';
  cacheLife('reviews');
  cacheTag(CACHE_TAGS.reviews, CACHE_TAGS.productReviews(productId));

  try {
    return await getReviewReader().listProductReviews(productId, {
      limit: REVIEWS_PAGE_SIZE,
    });
  } catch (error) {
    console.warn('Could not load reviews', error);
    return EMPTY_PAGE;
  }
}

/** Newest well-rated reviews across the shop, for the home page. */
export async function getLatestReviews(limit = 6): Promise<ProductReview[]> {
  'use cache';
  cacheLife('reviews');
  cacheTag(CACHE_TAGS.reviews);

  try {
    return await getReviewReader().listLatestReviews(limit, 4);
  } catch (error) {
    console.warn('Could not load latest reviews', error);
    return [];
  }
}
