import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.json();
  if (!body?.name || body.langId == null) {
    return NextResponse.json({ error: 'name and langId are required' }, { status: 400 });
  }
  const created = await prisma.unit.create({
    data: { name: String(body.name), langId: Number(body.langId) },
  });
  return NextResponse.json(created, { status: 201 });
}

