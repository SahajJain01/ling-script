import { metricsEnabled, renderMetricsResponse } from '@/lib/metrics';

// Ensure Node.js runtime (prom-client relies on Node APIs)
export const runtime = 'nodejs';

export async function GET() {
  if (!metricsEnabled) return new Response('metrics disabled', { status: 404 });
  return renderMetricsResponse();
}

