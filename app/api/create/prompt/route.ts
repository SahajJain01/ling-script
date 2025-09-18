import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withMetrics } from '@/lib/metrics';

async function handler(req: Request) {
  const body = await req.json();
  if (!body?.content || !body?.answer || body.unitId == null) {
    return NextResponse.json({ error: 'unitId, content, answer are required' }, { status: 400 });
  }
  const notes = body.notes == null ? null : String(body.notes);
  const created = await prisma.prompt.create({
    data: {
      unitId: Number(body.unitId),
      content: String(body.content),
      answer: String(body.answer),
      notes,
    },
  });
  return NextResponse.json(created, { status: 201 });
}

export const POST = withMetrics(handler, { route: '/api/create/prompt' });



