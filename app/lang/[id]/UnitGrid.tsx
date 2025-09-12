'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { CSSProperties } from 'react';

type Unit = { id: number; name: string };

type Progress = { unitId: number; completed: boolean };

export default function UnitGrid({ units }: { units: Unit[] }) {
  const [progress, setProgress] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const deviceId = localStorage.getItem('deviceId');
    if (!deviceId) return;
    fetch(`/api/progress?deviceId=${deviceId}`, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Progress[]) => {
        const map: Record<number, boolean> = {};
        data.forEach((p) => { map[p.unitId] = p.completed; });
        setProgress(map);
      })
      .catch(() => { /* ignore */ });
  }, []);

  const getAccent = (id: number) => `hsl(${(id * 53) % 360} 80% 50%)`;

  return (
    <div className="grid">
      {units.map((u) => {
        const style = { '--avatar-bg': getAccent(u.id) } as CSSProperties;
        const initial = (u.name?.[0] || '?').toUpperCase();
        const completed = progress[u.id];
        return (
          <Link prefetch key={u.id} className="tile" href={`/unit/${u.id}`} aria-label={`Open unit ${u.name}`} style={style}>
            <div className="avatar" aria-hidden>{initial}</div>
            <div>
              <div className="tile-title">{u.name}</div>
              <div className="tile-sub">{completed ? 'Completed' : 'Start lesson'}</div>
            </div>
            <div className="tile-arrow" aria-hidden>
              {completed ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
