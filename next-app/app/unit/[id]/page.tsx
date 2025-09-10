import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import PracticeClient from './practice-client';

export default async function UnitPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (Number.isNaN(id)) notFound();

  const unit = await prisma.unit.findUnique({
    where: { id },
    include: { lang: true },
  });
  if (!unit) notFound();

  return (
    <section>
      <a href={`/lang/${unit.langId}`}>← {unit.lang.name}</a>
      <h2>Unit: {unit.name}</h2>
      <PracticeClient unitId={id} />
    </section>
  );
}
