import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(_req: Request, { params }: { params: { unitId: string } }) {
  const unitId = Number(params.unitId);
  if (Number.isNaN(unitId)) return NextResponse.json({ error: 'Invalid unitId' }, { status: 400 });
  const unit = await prisma.unit.findFirst({
    include: { prompts: { select: { content: true, answer: true }, orderBy: { id: 'asc' } } },
    where: { id: unitId },
  });
  if (!unit) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(unit.prompts);
}

