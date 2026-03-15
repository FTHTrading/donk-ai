'use client';

import { useState, useCallback, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

/**
 * Hook to fetch and manage credit balance for the connected wallet.
 */
export function useCredits() {
  const { publicKey, connected } = useWallet();
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCredits = useCallback(async () => {
    if (!publicKey) {
      setCredits(0);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/credits?wallet=${publicKey.toBase58()}`);
      const data = await res.json() as { ok: boolean; data?: { credits: number } };
      if (data.ok && data.data) {
        setCredits(data.data.credits);
      }
    } catch {
      // silently fail — credits will show as 0
    } finally {
      setLoading(false);
    }
  }, [publicKey]);

  // Refresh on wallet connect/disconnect
  useEffect(() => {
    if (connected && publicKey) {
      fetchCredits();
    } else {
      setCredits(0);
    }
  }, [connected, publicKey, fetchCredits]);

  return { credits, loading, refresh: fetchCredits };
}
