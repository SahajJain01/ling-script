import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(_req: Request, context: { params: Promise<{ langId: string }> }) {
  const { langId: langIdParam } = await context.params;
  const langId = Number(langIdParam);
  if (Number.isNaN(langId)) return NextResponse.json({ error: 'Invalid langId' }, { status: 400 });
  const data = await prisma.lang.findFirst({
    select: {
      name: true,
      units: { select: { id: true, name: true }, orderBy: { id: 'asc' } },
    },
    where: { id: langId },
  });
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(data);
}

