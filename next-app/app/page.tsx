import prisma from '@/lib/prisma';

export default async function HomePage() {
  const langs = await prisma.lang.findMany({ select: { id: true, name: true }, orderBy: { id: 'asc' } });
  return (
    <div className="container">
      <section className="section">
        <h2>Languages</h2>
        {langs.length === 0 ? (
          <p className="muted">No languages yet. Create via API.</p>
        ) : (
          <ul className="list">
            {langs.map((l) => (
              <li key={l.id}>
                <a className="list-item" href={`/lang/${l.id}`}>
                  <span><strong>{l.name}</strong></span>
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
