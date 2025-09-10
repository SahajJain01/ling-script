import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function LangPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (Number.isNaN(id)) notFound();

  const lang = await prisma.lang.findUnique({
    where: { id },
    select: { name: true, units: { select: { id: true, name: true }, orderBy: { id: 'asc' } } },
  });
  if (!lang) notFound();

  return (
    <div className="container">
      <section className="section">
        <h2>{lang.name}</h2>
        <h3 style={{ marginTop: 8 }}>Units</h3>
        {lang.units.length === 0 ? (
          <p className="muted">No units yet.</p>
        ) : (
          <ul className="list">
            {lang.units.map((u) => (
              <li key={u.id}>
                <a className="list-item" href={`/unit/${u.id}`}>
                  <span><strong>{u.name}</strong></span>
                  <span className="meta">›</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
