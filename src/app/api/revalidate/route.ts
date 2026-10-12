import { timingSafeEqual } from 'node:crypto';
import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { serverEnv } from '@/lib/env';
import { revalidateRateLimiter } from '@/lib/security/rate-limiter';

/**
 * Zod schema for incoming revalidation webhook requests.
 */
const RevalidatePayloadSchema = z
  .object({
    tags: z.array(z.string().min(1, 'Tag cannot be empty')).optional(),
    tag: z.string().min(1, 'Tag cannot be empty').optional(),
    profile: z.string().min(1).default('max'),
  })
  .refine((data) => data.tags !== undefined || data.tag !== undefined, {
    message: 'Either "tags" array or "tag" string must be provided.',
  });

/**
 * Timing-safe secret comparison to prevent timing attacks.
 */
function verifySecret(provided: string | null, expected: string | undefined): boolean {
  if (!provided || typeof provided !== 'string' || !expected) {
    return false;
  }

  const providedBuffer = Buffer.from(provided, 'utf-8');
  const expectedBuffer = Buffer.from(expected, 'utf-8');

  if (providedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(providedBuffer, expectedBuffer);
}

/**
 * Extract auth token from Authorization header or custom header.
 */
function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }

  const customHeader = request.headers.get('x-revalidate-secret');
  if (customHeader) {
    return customHeader.trim();
  }

  return null;
}

/**
 * Extract client identifier for rate limiting.
 */
function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const firstIp = forwarded.split(',')[0];
    if (firstIp) return firstIp.trim();
  }

  return request.headers.get('cf-connecting-ip') ?? 'unknown-client';
}

/**
 * POST /api/revalidate
 *
 * Secure, rate-limited on-demand cache revalidation endpoint for
 * Medusa webhooks and administrative catalog syncs.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  // 1. Authenticate secret
  const token = extractToken(request);
  if (!verifySecret(token, serverEnv.REVALIDATE_SECRET)) {
    return NextResponse.json(
      { error: 'Unauthorized: invalid or missing revalidation secret.' },
      { status: 401 },
    );
  }

  // 2. Enforce rate limiting
  const clientId = getClientIdentifier(request);
  const rateLimit = revalidateRateLimiter.consume(clientId);
  if (!rateLimit.success) {
    return NextResponse.json(
      {
        error: 'Too Many Requests: rate limit exceeded for revalidation.',
        retryAfterSeconds: Math.ceil(rateLimit.resetMs / 1000),
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil(rateLimit.resetMs / 1000)),
        },
      },
    );
  }

  // 3. Parse and validate JSON body
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Bad Request: request body must be valid JSON.' },
      { status: 400 },
    );
  }

  const validation = RevalidatePayloadSchema.safeParse(rawBody);
  if (!validation.success) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        details: validation.error.format(),
      },
      { status: 400 },
    );
  }

  const { tags, tag, profile } = validation.data;
  const tagsToInvalidate = new Set<string>();

  if (tags) {
    for (const t of tags) {
      tagsToInvalidate.add(t);
    }
  }

  if (tag) {
    tagsToInvalidate.add(tag);
  }

  // 4. Invalidate each tag using Next.js 16 revalidateTag(tag, profile)
  const invalidated = Array.from(tagsToInvalidate);
  for (const t of invalidated) {
    revalidateTag(t, profile);
  }

  return NextResponse.json(
    {
      success: true,
      revalidated: invalidated,
      count: invalidated.length,
      profile,
      timestamp: new Date().toISOString(),
    },
    { status: 200 },
  );
}
