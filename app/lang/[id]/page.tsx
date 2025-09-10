import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { CSSProperties } from 'react';

export default async function LangPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (Number.isNaN(id)) notFound();

  const lang = await prisma.lang.findUnique({
    where: { id },
    select: { name: true, units: { select: { id: true, name: true }, orderBy: { id: 'asc' } } },
  });
  if (!lang) notFound();

  const getAccent = (id: number) => {
    const h = (id * 53) % 360;
    return `hsl(${h} 80% 50%)`;
  };

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
            {lang.units.map((u) => {
              const style = { '--avatar-bg': getAccent(u.id) } as CSSProperties;
              const initial = (u.name?.[0] || '?').toUpperCase();
              return (
                <Link prefetch key={u.id} className="tile" href={`/unit/${u.id}`} aria-label={`Open unit ${u.name}`} style={style}>
                  <div className="avatar" aria-hidden>{initial}</div>
                  <div>
                    <div className="tile-title">{u.name}</div>
                    <div className="tile-sub">Start lesson</div>
                  </div>
                  <div className="tile-arrow" aria-hidden>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
