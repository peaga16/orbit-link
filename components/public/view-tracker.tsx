'use client';

import { useEffect } from 'react';

export function ViewTracker({ workspaceId }: { workspaceId: string }) {
  useEffect(() => {
    const key = `orbit:view:${workspaceId}`;
    if (window.sessionStorage.getItem(key)) return;
    window.sessionStorage.setItem(key, '1');

    fetch(`/api/public/view/${workspaceId}`, {
      method: 'POST',
      keepalive: true,
      headers: { 'content-type': 'application/json' },
      body: '{}',
    }).catch(() => null);
  }, [workspaceId]);

  return null;
}
