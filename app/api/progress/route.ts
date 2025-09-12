import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const deviceId = req.nextUrl.searchParams.get('deviceId');
  if (!deviceId) {
    return NextResponse.json({ error: 'deviceId required' }, { status: 400 });
  }
  const progress = await prisma.progress.findMany({
    where: { deviceId },
    select: { unitId: true, currentPrompt: true, completed: true },
    orderBy: { unitId: 'asc' },
  });
  return NextResponse.json(progress);
}

export async function POST(req: NextRequest) {
  const { deviceId, unitId, currentPrompt, completed } = await req.json();
  if (!deviceId || typeof unitId !== 'number') {
    return NextResponse.json({ error: 'deviceId and unitId required' }, { status: 400 });
  }
  const result = await prisma.progress.upsert({
    where: { deviceId_unitId: { deviceId, unitId } },
    update: { currentPrompt, completed },
    create: { deviceId, unitId, currentPrompt, completed },
  });
  return NextResponse.json(result);
}
