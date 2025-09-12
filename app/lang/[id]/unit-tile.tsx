'use client';

import Link from 'next/link';
import { useEffect, useState, CSSProperties } from 'react';

type Unit = { id: number; name: string };

type Progress = { current: number; total: number } | null;

export default function UnitTile({ unit }: { unit: Unit }) {
  const [progress, setProgress] = useState<Progress>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`unit-progress:${unit.id}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.current === 'number' && typeof parsed.total === 'number') {
          setProgress(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, [unit.id]);

  const getAccent = (id: number) => {
    const h = (id * 53) % 360;
    return `hsl(${h} 80% 50%)`;
  };

  const style = { '--avatar-bg': getAccent(unit.id) } as CSSProperties;
  const initial = (unit.name?.[0] || '?').toUpperCase();

  const completed = !!progress && progress.total > 0 && progress.current >= progress.total;
  const percent = progress && progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;

  return (
    <Link prefetch className="tile" href={`/unit/${unit.id}`} aria-label={`Open unit ${unit.name}`} style={style}>
      <div className="avatar" aria-hidden>{initial}</div>
      <div>
        <div className="tile-title">{unit.name}</div>
        {completed ? (
          <div className="tile-sub">Completed</div>
        ) : progress ? (
          <div className="tile-sub">
            Continue
            <div className="tile-progress" aria-hidden>
              <div className="tile-progress-inner" style={{ width: `${percent}%` }} />
            </div>
          </div>
        ) : (
          <div className="tile-sub">Start lesson</div>
        )}
      </div>
      <div className={`tile-arrow${completed ? ' tile-arrow--tick' : ''}`} aria-hidden>
        {completed ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </Link>
  );
}

