import type { Counter, Histogram, Registry } from 'prom-client';
import client from 'prom-client';

// Metrics enable flag (default true)
const METRICS_ENABLED = !['false', '0'].includes(String(process.env.METRICS_ENABLED ?? 'true').toLowerCase());

type MetricsBundle = {
  enabled: boolean;
  register: Registry;
  httpRequestsTotal: Counter<string>;
  httpRequestDurationSeconds: Histogram<string>;
};

declare global {
  // eslint-disable-next-line no-var
  var __METRICS__: MetricsBundle | undefined;
}

function createMetrics(): MetricsBundle {
  const register = new client.Registry();

  // Default Node/process metrics
  client.collectDefaultMetrics({ register });

  const httpRequestsTotal = new client.Counter({
    name: 'http_requests_total',
    help: 'Total HTTP requests',
    labelNames: ['method', 'path', 'status'] as const,
    registers: [register],
  });

  const httpRequestDurationSeconds = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'HTTP request duration in seconds',
    labelNames: ['method', 'path', 'status'] as const,
    buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
    registers: [register],
  });

  return {
    enabled: true,
    register,
    httpRequestsTotal,
    httpRequestDurationSeconds,
  } satisfies MetricsBundle;
}

// Singleton exposed via global to avoid duplicate registrations on hot reload
const metrics: MetricsBundle | undefined = METRICS_ENABLED
  ? (globalThis.__METRICS__ ?? (globalThis.__METRICS__ = createMetrics()))
  : undefined;

export const metricsEnabled = METRICS_ENABLED;

export function getRegistry(): Registry | undefined {
  return metrics?.register;
}

export async function renderMetricsResponse(): Promise<Response> {
  if (!METRICS_ENABLED || !metrics) {
    return new Response('metrics disabled', { status: 404 });
  }
  const body = await metrics.register.metrics();
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': metrics.register.contentType,
      'Cache-Control': 'no-store',
    },
  });
}

function getPathLabel(req: Request, explicitPath?: string): string {
  if (explicitPath) return explicitPath;
  try {
    const u = new URL(req.url);
    return u.pathname || '/';
  } catch {
    return '/';
  }
}

export function withMetrics<Ctx = any>(
  handler: (req: Request, context: Ctx) => Promise<Response> | Response,
  opts?: { route?: string }
) {
  return async (req: Request, context: Ctx): Promise<Response> => {
    // Short-circuit when disabled
    if (!METRICS_ENABLED || !metrics) return handler(req, context);

    const path = getPathLabel(req, opts?.route);
    if (path === '/metrics') {
      return handler(req, context);
    }

    const start = process.hrtime.bigint();
    try {
      const res = await handler(req, context);
      const end = process.hrtime.bigint();
      const duration = Number(end - start) / 1e9; // seconds
      const status = String((res as any).status ?? 200);
      const method = (req.method || 'GET').toUpperCase();

      metrics.httpRequestsTotal.inc({ method, path, status });
      metrics.httpRequestDurationSeconds.observe({ method, path, status }, duration);

      return res;
    } catch (err) {
      const end = process.hrtime.bigint();
      const duration = Number(end - start) / 1e9; // seconds
      const method = (req.method || 'GET').toUpperCase();
      // Count as 500 on thrown error
      metrics.httpRequestsTotal.inc({ method, path, status: '500' });
      metrics.httpRequestDurationSeconds.observe({ method, path, status: '500' }, duration);
      throw err;
    }
  };
}

