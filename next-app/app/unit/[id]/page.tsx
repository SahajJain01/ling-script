import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import PracticeClient from './practice-client';

export default async function UnitPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
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

