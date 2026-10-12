/**
 * Typed domain and adapter error hierarchy.
 * Never leak raw database, network, or SDK exceptions to components or callers.
 */

export class AppError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly causeDetails?: unknown;

  constructor(message: string, code = 'APP_ERROR', status = 500, causeDetails?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.status = status;
    this.causeDetails = causeDetails;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, identifier: string) {
    super(`${resource} with identifier "${identifier}" was not found.`, 'NOT_FOUND', 404);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, details);
  }
}

export class UpstreamError extends AppError {
  constructor(message: string, status = 502, details?: unknown) {
    super(message, 'UPSTREAM_ERROR', status, details);
  }
}

export class TimeoutError extends AppError {
  constructor(operation: string, timeoutMs: number) {
    super(`Operation "${operation}" timed out after ${timeoutMs}ms.`, 'TIMEOUT', 504);
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Rate limit exceeded. Please try again later.') {
    super(message, 'RATE_LIMITED', 429);
  }
}

/** Type guard to check if an unknown thrown error is an instance of AppError */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
