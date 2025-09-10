'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info';
type Toast = { id: number; type: ToastType; message: string; timeout?: number };

type ToastContextValue = {
  show: (message: string, type?: ToastType, timeoutMs?: number) => void;
  success: (message: string, timeoutMs?: number) => void;
  error: (message: string, timeoutMs?: number) => void;
  info: (message: string, timeoutMs?: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((message: string, type: ToastType = 'info', timeoutMs = 1800) => {
    const id = ++idRef.current;
    const toast: Toast = { id, type, message, timeout: timeoutMs };
    setToasts((prev) => [...prev, toast]);
    if (timeoutMs > 0) {
      setTimeout(() => remove(id), timeoutMs);
    }
  }, [remove]);

  const value = useMemo<ToastContextValue>(() => ({
    show,
    success: (m, t) => show(m, 'success', t),
    error: (m, t) => show(m, 'error', t),
    info: (m, t) => show(m, 'info', t),
  }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-container" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast--${t.type}`}>
            {t.type === 'success' && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {t.type === 'error' && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            <span>{t.message}</span>
            <button className="toast__close" aria-label="Dismiss" onClick={() => remove(t.id)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
