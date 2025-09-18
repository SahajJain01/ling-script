import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withMetrics } from '@/lib/metrics';

async function handler(_req: Request, context: { params: Promise<{ unitId: string }> }) {
  const { unitId: unitIdParam } = await context.params;
  const unitId = Number(unitIdParam);
  if (Number.isNaN(unitId)) return NextResponse.json({ error: 'Invalid unitId' }, { status: 400 });
  const unit = await prisma.unit.findFirst({
    include: { prompts: { select: { content: true, answer: true, notes: true }, orderBy: { id: 'asc' } } },
    where: { id: unitId },
  });
  if (!unit) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(unit.prompts);
}

export const GET = withMetrics(handler, { route: '/api/prompts/[unitId]' });


