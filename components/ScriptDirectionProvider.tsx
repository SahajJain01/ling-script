'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

interface Ctx {
  reverse: boolean;
  toggle: () => void;
  set: (value: boolean) => void;
}

const ScriptDirectionContext = createContext<Ctx | null>(null);

export function useScriptDirection() {
  const ctx = useContext(ScriptDirectionContext);
  if (!ctx) throw new Error('useScriptDirection must be used within ScriptDirectionProvider');
  return ctx;
}

export default function ScriptDirectionProvider({ children }: { children: ReactNode }) {
  const [reverse, setReverse] = useState(false);
  const toggle = useCallback(() => setReverse((r) => !r), []);
  const ctx = useMemo(() => ({ reverse, toggle, set: setReverse }), [reverse, toggle]);
  return <ScriptDirectionContext.Provider value={ctx}>{children}</ScriptDirectionContext.Provider>;
}
