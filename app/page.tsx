import prisma from '@/lib/prisma';
import Link from 'next/link';
import type { CSSProperties } from 'react';

export default async function HomePage() {
  const langs = await prisma.lang.findMany({ select: { id: true, name: true }, orderBy: { id: 'asc' } });
  const getAccent = (id: number) => {
    const h = (id * 37) % 360;
    return `hsl(${h} 80% 50%)`;
  };
  return (
    <div className="container">
      <section className="hero">
        <h1>Choose a language</h1>
        <p>Friendly practice, anywhere.</p>
      </section>
      <section className="section">
        {langs.length === 0 ? (
          <p className="muted">No languages yet. Create via API.</p>
        ) : (
          <div className="grid">
            {langs.map((l) => {
              const style = { '--avatar-bg': getAccent(l.id) } as CSSProperties;
              const initial = (l.name?.[0] || '?').toUpperCase();
              return (
                <Link prefetch key={l.id} className="tile" href={`/lang/${l.id}`} aria-label={`Open ${l.name}`} style={style}>
                  <div className="avatar" aria-hidden>{initial}</div>
                  <div>
                    <div className="tile-title">{l.name}</div>
                    <div className="tile-sub">Tap to view units</div>
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
