'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';

export default function TopNav() {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === '/' || pathname === '';

  const onBack = useCallback(() => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      // Fallback if user navigated directly
      router.push('/');
    }
  }, [router]);

  return (
    <header className="topbar">
      <div className="topbar__inner">
        {isHome ? (
          <div className="brand">Ling Script</div>
        ) : (
          <button className="backbtn" aria-label="Go back" onClick={onBack}>
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
        <div className="topbar__spacer" />
      </div>
    </header>
  );
}
