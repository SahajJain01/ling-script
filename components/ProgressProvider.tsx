'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

type Progress = { current: number; total: number } | null;

type Ctx = {
  value: Progress;
  set: (current: number, total: number) => void;
  clear: () => void;
};

const ProgressContext = createContext<Ctx | null>(null);

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}

export default function ProgressProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState<Progress>(null);

  const set = useCallback((current: number, total: number) => {
    if (!total || total <= 0 || current <= 0) {
      setValue(null);
    } else {
      setValue({ current: Math.min(current, total), total });
    }
  }, []);

  const clear = useCallback(() => setValue(null), []);

  const ctx = useMemo<Ctx>(() => ({ value, set, clear }), [clear, set, value]);

  return (
    <ProgressContext.Provider value={ctx}>{children}</ProgressContext.Provider>
  );
}

