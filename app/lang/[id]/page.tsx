import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

import UnitTile from './unit-tile';

export const dynamic = 'force-dynamic';

export default async function LangPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (Number.isNaN(id)) notFound();

  const lang = await prisma.lang.findUnique({
    where: { id },
    select: { name: true, units: { select: { id: true, name: true }, orderBy: { id: 'asc' } } },
  });
  if (!lang) notFound();

  return (
    <div className="container">
      <section className="hero">
        <h1>{lang.name}</h1>
        <p>Select a unit to start practicing</p>
      </section>
      <section className="section">
        {lang.units.length === 0 ? (
          <p className="muted">No units yet.</p>
        ) : (
          <div className="grid">
            {lang.units.map((u) => (
              <UnitTile key={u.id} unit={u} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
