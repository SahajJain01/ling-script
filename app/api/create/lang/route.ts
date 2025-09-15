import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withMetrics } from '@/lib/metrics';

async function handler(req: Request) {
  const body = await req.json();
  if (!body?.name) return NextResponse.json({ error: 'name is required' }, { status: 400 });
  const created = await prisma.lang.create({ data: { name: String(body.name) } });
  return NextResponse.json(created, { status: 201 });
}

export const POST = withMetrics(handler, { route: '/api/create/lang' });

