'use client';

import { useEffect, useState } from 'react';

/**
 * Reads the current session from /api/auth/me.
 * status: 'loading' | 'authenticated' | 'anonymous'
 */
export default function useSession() {
  const [state, setState] = useState({ status: 'loading', user: null });

  useEffect(() => {
    let cancelled = false;
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : { authenticated: false }))
      .then((d) => {
        if (cancelled) return;
        if (d && d.authenticated && d.user) setState({ status: 'authenticated', user: d.user });
        else setState({ status: 'anonymous', user: null });
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'anonymous', user: null });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
