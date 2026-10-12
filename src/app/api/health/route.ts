import { NextResponse } from 'next/server';
import { serverEnv } from '@/lib/env';

interface HealthCheckResponse {
  status: 'healthy' | 'degraded';
  version: string;
  uptimeSeconds: number;
  timestamp: string;
  adapter: 'mock' | 'medusa';
  upstream: {
    status: 'ok' | 'degraded' | 'skipped';
    latencyMs?: number;
    error?: string;
  };
}

/**
 * GET /api/health
 *
 * Operational health check probe for load balancers and container orchestrators.
 * Checks internal service state and upstream Medusa reachability if configured.
 */
export async function GET(): Promise<NextResponse<HealthCheckResponse>> {
  const startTime = Date.now();
  const uptimeSeconds = Math.floor(process.uptime());
  const version = serverEnv.BUILD_VERSION ?? '0.1.0';
  const adapter = serverEnv.API_ADAPTER;

  let upstreamStatus: 'ok' | 'degraded' | 'skipped' = 'skipped';
  let upstreamLatency: number | undefined;
  let upstreamError: string | undefined;

  if (adapter === 'medusa' && serverEnv.API_BASE_URL) {
    try {
      const pingStart = Date.now();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch(`${serverEnv.API_BASE_URL}/health`, {
        signal: controller.signal,
        cache: 'no-store',
      });
      clearTimeout(timeoutId);

      upstreamLatency = Date.now() - pingStart;

      if (res.ok) {
        upstreamStatus = 'ok';
      } else {
        upstreamStatus = 'degraded';
        upstreamError = `Upstream returned status ${res.status}`;
      }
    } catch (err) {
      upstreamStatus = 'degraded';
      upstreamError =
        err instanceof Error ? err.message : 'Failed to reach upstream Medusa server';
    }
  } else {
    // Mock adapter is purely in-memory and always healthy
    upstreamStatus = 'ok';
    upstreamLatency = 0;
  }

  const isHealthy = upstreamStatus !== 'degraded';

  const body: HealthCheckResponse = {
    status: isHealthy ? 'healthy' : 'degraded',
    version,
    uptimeSeconds,
    timestamp: new Date().toISOString(),
    adapter,
    upstream: {
      status: upstreamStatus,
      ...(upstreamLatency !== undefined ? { latencyMs: upstreamLatency } : {}),
      ...(upstreamError !== undefined ? { error: upstreamError } : {}),
    },
  };

  return NextResponse.json(body, {
    status: isHealthy ? 200 : 503,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'X-Response-Time': `${Date.now() - startTime}ms`,
    },
  });
}
