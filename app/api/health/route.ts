import { NextResponse } from 'next/server';
import { withMetrics } from '@/lib/metrics';

async function handler() {
  return NextResponse.json({ status: 'ok', time: new Date().toISOString() });
}

export const GET = withMetrics(handler, { route: '/api/health' });

