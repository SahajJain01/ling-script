import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { unitId: string } }) {
  const deviceId = req.nextUrl.searchParams.get('deviceId');
  const unitId = Number(params.unitId);
  if (!deviceId || Number.isNaN(unitId)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const progress = await prisma.progress.findUnique({
    where: { deviceId_unitId: { deviceId, unitId } },
  });
  if (!progress) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(progress);
}
