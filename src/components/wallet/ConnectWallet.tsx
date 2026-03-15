'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Wallet, LogOut, Coins } from 'lucide-react';
import { useCredits } from '@/hooks/useCredits';

export function ConnectWallet() {
  const { publicKey, disconnect, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const { credits, loading } = useCredits();

  if (!connected || !publicKey) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-donk-500 hover:bg-donk-400 text-white transition-all active:scale-95"
      >
        <Wallet className="w-3.5 h-3.5" />
        Connect
      </button>
    );
  }

  const shortAddr = `${publicKey.toBase58().slice(0, 4)}…${publicKey.toBase58().slice(-4)}`;

  return (
    <div className="flex items-center gap-2">
      {/* Credits badge */}
      <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-accent-gold/10 border border-accent-gold/30 text-accent-gold text-xs font-mono">
        <Coins className="w-3 h-3" />
        {loading ? '…' : credits}
      </div>

      {/* Wallet address */}
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1a1e36] border border-[#2a2d4a] text-[#e8eaf6] text-xs font-mono">
        <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
        {shortAddr}
      </div>

      {/* Disconnect */}
      <button
        onClick={() => disconnect()}
        className="p-1.5 rounded-lg text-[#7b82b4] hover:text-red-400 hover:bg-red-500/10 transition-all"
        title="Disconnect wallet"
      >
        <LogOut className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
