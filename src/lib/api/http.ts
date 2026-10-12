import { TimeoutError, UpstreamError } from './errors';

export interface ResilientFetchOptions extends RequestInit {
  timeoutMs?: number;
  maxRetries?: number;
  initialBackoffMs?: number;
}

/**
 * Executes a resilient fetch with abort timeout and exponential backoff retry.
 * Used internally by adapters communicating with upstream HTTP services.
 */
export async function resilientFetch(
  url: string,
  options: ResilientFetchOptions = {},
): Promise<Response> {
  const {
    timeoutMs = 8000,
    maxRetries = 2,
    initialBackoffMs = 250,
    ...fetchInit
  } = options;

  let attempt = 0;

  while (attempt <= maxRetries) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...fetchInit,
        signal: controller.signal,
      });

      clearTimeout(timer);

      // Retry on transient 5xx server errors
      if (response.status >= 500 && attempt < maxRetries) {
        attempt++;
        const backoff = initialBackoffMs * Math.pow(2, attempt - 1) + Math.random() * 50;
        await new Promise((resolve) => setTimeout(resolve, backoff));
        continue;
      }

      return response;
    } catch (error: unknown) {
      clearTimeout(timer);

      const isAbort =
        (error instanceof Error && error.name === 'AbortError') ||
        (typeof error === 'object' &&
          error !== null &&
          'name' in error &&
          (error as { name: string }).name === 'AbortError');

      if (isAbort) {
        if (attempt < maxRetries) {
          attempt++;
          const backoff = initialBackoffMs * Math.pow(2, attempt - 1);
          await new Promise((resolve) => setTimeout(resolve, backoff));
          continue;
        }
        throw new TimeoutError(`GET ${url}`, timeoutMs);
      }

      if (attempt < maxRetries) {
        attempt++;
        const backoff = initialBackoffMs * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, backoff));
        continue;
      }

      throw new UpstreamError(
        `Failed network request to ${url}: ${error instanceof Error ? error.message : String(error)}`,
        502,
        error,
      );
    }
  }

  throw new UpstreamError(`Request to ${url} exhausted ${maxRetries} retries`, 502);
}
