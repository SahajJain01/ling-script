import pkg from '../package.json' assert { type: 'json' };
import type { Counter, Histogram, Registry } from 'prom-client';
import client from 'prom-client';

// Metrics enable flag (default true)
const METRICS_ENABLED = !['false', '0'].includes(String(process.env.METRICS_ENABLED ?? 'true').toLowerCase());

type MetricsBundle = {
  enabled: boolean;
  service: string;
  register: Registry;
  httpRequestsTotal: Counter<string>;
  httpRequestDurationSeconds: Histogram<string>;
};

declare global {
  // eslint-disable-next-line no-var
  var __METRICS__: MetricsBundle | undefined;
}

function createMetrics(): MetricsBundle {
  const service = String(process.env.APP_NAME || (pkg as any).name || 'app');

  const register = new client.Registry();
  register.setDefaultLabels({ service });

  // Default Node/process metrics
  client.collectDefaultMetrics({ register });

  const httpRequestsTotal = new client.Counter({
    name: 'http_requests_total',
    help: 'Total HTTP requests',
    labelNames: ['method', 'route', 'status', 'service'] as const,
    registers: [register],
  });

  const httpRequestDurationSeconds = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'HTTP request duration in seconds',
    labelNames: ['method', 'route', 'status', 'service'] as const,
    buckets: [
      0.005, 0.01, 0.025, 0.05, 0.1,
      0.25, 0.5, 1, 2.5, 5, 10,
    ],
    registers: [register],
  });

  return {
    enabled: true,
    service,
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

function getRouteLabel(req: Request, explicitRoute?: string): string {
  if (explicitRoute) return explicitRoute;
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

    const route = getRouteLabel(req, opts?.route);
    if (route === '/metrics') {
      return handler(req, context);
    }

    const start = process.hrtime.bigint();
    try {
      const res = await handler(req, context);
      const end = process.hrtime.bigint();
      const duration = Number(end - start) / 1e9; // seconds
      const status = String((res as any).status ?? 200);
      const method = (req.method || 'GET').toUpperCase();

      metrics.httpRequestsTotal.inc({ method, route, status, service: metrics.service });
      metrics.httpRequestDurationSeconds.observe({ method, route, status, service: metrics.service }, duration);

      return res;
    } catch (err) {
      const end = process.hrtime.bigint();
      const duration = Number(end - start) / 1e9; // seconds
      const method = (req.method || 'GET').toUpperCase();
      // Count as 500 on thrown error
      metrics.httpRequestsTotal.inc({ method, route, status: '500', service: metrics.service });
      metrics.httpRequestDurationSeconds.observe({ method, route, status: '500', service: metrics.service }, duration);
      throw err;
    }
  };
}

