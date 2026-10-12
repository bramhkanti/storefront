/**
 * In-memory Token Bucket rate limiter for route handlers and actions.
 *
 * Designed for single-instance or edge protection against brute-force
 * or revalidation spam. Stale keys are automatically evicted.
 */

export interface RateLimiterOptions {
  /** Maximum number of tokens a bucket can hold (burst capacity) */
  capacity: number;
  /** Number of tokens added per interval */
  refillRate: number;
  /** Refill interval in milliseconds (default: 1000ms / 1s) */
  refillIntervalMs?: number;
  /** Maximum duration an inactive key is retained before eviction (ms, default: 300,000 / 5m) */
  ttlMs?: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  limit: number;
  resetMs: number;
}

interface BucketEntry {
  tokens: number;
  lastRefill: number;
  lastAccessed: number;
}

export class TokenBucketRateLimiter {
  private readonly capacity: number;
  private readonly refillRate: number;
  private readonly refillIntervalMs: number;
  private readonly ttlMs: number;
  private readonly buckets = new Map<string, BucketEntry>();
  private lastCleanup = Date.now();

  constructor(options: RateLimiterOptions) {
    this.capacity = options.capacity;
    this.refillRate = options.refillRate;
    this.refillIntervalMs = options.refillIntervalMs ?? 1000;
    this.ttlMs = options.ttlMs ?? 5 * 60 * 1000;
  }

  /**
   * Consume a token for the given key.
   *
   * @param key Client identifier (e.g. IP address or auth token hash)
   * @param cost Number of tokens to consume (default: 1)
   */
  public consume(key: string, cost: number = 1): RateLimitResult {
    const now = Date.now();
    this.evictStaleIfNeeded(now);

    let bucket = this.buckets.get(key);

    if (!bucket) {
      bucket = {
        tokens: this.capacity,
        lastRefill: now,
        lastAccessed: now,
      };
      this.buckets.set(key, bucket);
    } else {
      // Calculate refilled tokens based on elapsed intervals
      const elapsedMs = now - bucket.lastRefill;
      if (elapsedMs >= this.refillIntervalMs) {
        const intervalsPassed = Math.floor(elapsedMs / this.refillIntervalMs);
        const tokensToAdd = intervalsPassed * this.refillRate;
        bucket.tokens = Math.min(this.capacity, bucket.tokens + tokensToAdd);
        bucket.lastRefill += intervalsPassed * this.refillIntervalMs;
      }
      bucket.lastAccessed = now;
    }

    if (bucket.tokens >= cost) {
      bucket.tokens -= cost;
      const msUntilFull =
        ((this.capacity - bucket.tokens) / this.refillRate) * this.refillIntervalMs;
      return {
        success: true,
        remaining: Math.floor(bucket.tokens),
        limit: this.capacity,
        resetMs: Math.max(0, Math.ceil(msUntilFull)),
      };
    }

    // Bucket exhausted
    const tokensNeeded = cost - bucket.tokens;
    const intervalsNeeded = Math.ceil(tokensNeeded / this.refillRate);
    const msUntilSufficient =
      intervalsNeeded * this.refillIntervalMs - (now - bucket.lastRefill);

    return {
      success: false,
      remaining: 0,
      limit: this.capacity,
      resetMs: Math.max(1000, Math.ceil(msUntilSufficient)),
    };
  }

  /**
   * Remove inactive buckets to prevent memory leakage in long-running processes.
   */
  private evictStaleIfNeeded(now: number): void {
    if (now - this.lastCleanup < this.ttlMs) {
      return;
    }

    this.lastCleanup = now;
    for (const [key, entry] of this.buckets.entries()) {
      if (now - entry.lastAccessed > this.ttlMs) {
        this.buckets.delete(key);
      }
    }
  }

  /**
   * Reset all buckets (useful for test isolation).
   */
  public clear(): void {
    this.buckets.clear();
  }
}

/**
 * Singleton rate limiter for the revalidation webhook:
 * Allows 30 requests per minute with a burst capacity of 10 tokens.
 */
export const revalidateRateLimiter = new TokenBucketRateLimiter({
  capacity: 10,
  refillRate: 1, // 1 token every 2 seconds = 30 per minute
  refillIntervalMs: 2000,
  ttlMs: 10 * 60 * 1000,
});
