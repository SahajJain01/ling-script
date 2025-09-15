import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withMetrics } from '@/lib/metrics';

async function handler() {
  const langs = await prisma.lang.findMany({ select: { id: true, name: true }, orderBy: { id: 'asc' } });
  return NextResponse.json(langs);
}

export const GET = withMetrics(handler, { route: '/api/langs' });

