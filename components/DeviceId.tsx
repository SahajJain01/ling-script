'use client';

import { useEffect } from 'react';

export default function DeviceId() {
  useEffect(() => {
    const key = 'deviceId';
    const getCookie = () => document.cookie.split('; ').find((r) => r.startsWith(key + '='))?.split('=')[1];
    let id = getCookie() || localStorage.getItem(key);
    if (!id) {
      id = crypto.randomUUID();
    }
    document.cookie = `${key}=${id}; path=/; max-age=${60 * 60 * 24 * 365 * 10}`;
    try {
      localStorage.setItem(key, id);
    } catch {
      /* ignore */
    }
  }, []);
  return null;
}
