import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import PracticeClient from './practice-client';

export default async function UnitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (Number.isNaN(id)) notFound();

  const unit = await prisma.unit.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!unit) notFound();

  return (
    <PracticeClient unitId={id} />
  );
}

