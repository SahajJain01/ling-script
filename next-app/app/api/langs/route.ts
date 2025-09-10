import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const langs = await prisma.lang.findMany({ select: { id: true, name: true }, orderBy: { id: 'asc' } });
  return NextResponse.json(langs);
}

