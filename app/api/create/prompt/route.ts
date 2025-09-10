import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.json();
  if (!body?.content || !body?.answer || body.unitId == null) {
    return NextResponse.json({ error: 'unitId, content, answer are required' }, { status: 400 });
  }
  const created = await prisma.prompt.create({
    data: {
      unitId: Number(body.unitId),
      content: String(body.content),
      answer: String(body.answer),
    },
  });
  return NextResponse.json(created, { status: 201 });
}

