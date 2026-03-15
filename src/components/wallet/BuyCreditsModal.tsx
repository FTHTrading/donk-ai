'use client';

import { useState, useCallback } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { SystemProgram, PublicKey, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Coins, Zap, X, Loader2, Check, AlertTriangle, Sparkles } from 'lucide-react';
import { CREDIT_PACKS, CREDIT_COSTS, TREASURY_WALLET } from '@/lib/credits';
import type { CreditPack } from '@/lib/credits';
import { useCredits } from '@/hooks/useCredits';

interface Props {
  open: boolean;
  onClose: () => void;
}

type PurchaseState = 'idle' | 'signing' | 'verifying' | 'success' | 'error';

export function BuyCreditsModal({ open, onClose }: Props) {
  const { publicKey, sendTransaction, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const { connection } = useConnection();
  const { refresh } = useCredits();

  const [selectedPack, setSelectedPack] = useState<CreditPack>(CREDIT_PACKS[1]); // Default to Pro
  const [state, setState] = useState<PurchaseState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [txSig, setTxSig] = useState<string | null>(null);

  const handlePurchase = useCallback(async () => {
    if (!publicKey || !connected) {
      setVisible(true);
      return;
    }

    setState('signing');
    setError(null);

    try {
      // Create SOL transfer transaction
      const treasuryPubkey = new PublicKey(TREASURY_WALLET);
      const lamports = Math.round(selectedPack.solCost * LAMPORTS_PER_SOL);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: treasuryPubkey,
          lamports,
        }),
      );

      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash('confirmed');
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Send transaction (wallet popup)
      const signature = await sendTransaction(transaction, connection);
      setTxSig(signature);

      // Wait for confirmation
      setState('verifying');
      await connection.confirmTransaction(signature, 'confirmed');

      // Verify on our backend + grant credits
      const res = await fetch('/api/credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signature,
          packId: selectedPack.id,
          wallet: publicKey.toBase58(),
        }),
      });

      const data = await res.json() as { ok: boolean; error?: string; data?: { credits: number; added: number } };

      if (!data.ok) {
        throw new Error(data.error ?? 'Verification failed');
      }

      setState('success');
      refresh(); // Refresh credit balance in nav

      // Auto-close after 3s on success
      setTimeout(() => {
        onClose();
        setState('idle');
        setTxSig(null);
      }, 3000);
    } catch (err) {
      setState('error');
      setError(err instanceof Error ? err.message : 'Purchase failed');
    }
  }, [publicKey, connected, selectedPack, connection, sendTransaction, setVisible, refresh, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className="relative bg-[#0f1029] border border-[#2a2d4a] rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2a2d4a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-gold to-accent-gold/60 flex items-center justify-center">
              <Coins className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-[#e8eaf6]">Buy Credits</h2>
              <p className="text-xs text-[#7b82b4]">Pay with SOL · Instant delivery</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#1a1e36] text-[#7b82b4] hover:text-[#e8eaf6] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Credit Packs */}
        <div className="p-6 space-y-4">
          <div className="grid gap-3">
            {CREDIT_PACKS.map((pack) => (
              <button
                key={pack.id}
                onClick={() => { setSelectedPack(pack); setState('idle'); setError(null); }}
                className={`relative flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  selectedPack.id === pack.id
                    ? 'bg-donk-500/10 border-donk-500/40 shadow-lg shadow-donk-500/10'
                    : 'bg-[#111325] border-[#2a2d4a] hover:border-[#3a3d5a]'
                }`}
              >
                {pack.popular && (
                  <span className="absolute -top-2 right-3 px-2 py-0.5 rounded-full bg-donk-500 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    Popular
                  </span>
                )}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    selectedPack.id === pack.id
                      ? 'bg-donk-500/20 border border-donk-500/40'
                      : 'bg-[#1a1e36] border border-[#2a2d4a]'
                  }`}>
                    <Zap className={`w-5 h-5 ${selectedPack.id === pack.id ? 'text-donk-400' : 'text-[#7b82b4]'}`} />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-[#e8eaf6]">{pack.label}</div>
                    <div className="text-xs text-[#7b82b4]">{pack.credits} credits</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[#e8eaf6]">{pack.solCost} SOL</div>
                  {pack.savings && (
                    <div className="text-xs text-accent-green font-medium">{pack.savings}</div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* What credits buy */}
          <div className="bg-[#111325] border border-[#2a2d4a] rounded-xl p-4 space-y-2">
            <p className="text-xs font-medium text-[#7b82b4] uppercase tracking-wider">Credit costs</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(CREDIT_COSTS).map(([feature, cost]) => (
                <div key={feature} className="flex items-center justify-between bg-[#0a0b14] rounded-lg px-3 py-2">
                  <span className="text-[#e8eaf6] capitalize">{feature}</span>
                  <span className="text-donk-400 font-mono">{cost} cr</span>
                </div>
              ))}
            </div>
          </div>

          {/* Purchase button */}
          {state === 'success' ? (
            <div className="flex items-center justify-center gap-2 py-4 text-accent-green font-medium">
              <Check className="w-5 h-5" />
              Credits added! Refreshing…
            </div>
          ) : state === 'error' ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 py-3 px-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {error}
              </div>
              <button
                onClick={() => { setState('idle'); setError(null); }}
                className="w-full py-3 rounded-xl bg-[#1a1e36] border border-[#2a2d4a] text-[#e8eaf6] font-medium hover:bg-[#222548] transition-all"
              >
                Try Again
              </button>
            </div>
          ) : (
            <button
              onClick={handlePurchase}
              disabled={state !== 'idle'}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-donk-500 to-accent-purple text-white font-bold text-lg transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-donk-500/20"
            >
              {state === 'signing' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Confirm in Wallet…
                </>
              ) : state === 'verifying' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying on-chain…
                </>
              ) : !connected ? (
                <>
                  Connect Wallet to Buy
                </>
              ) : (
                <>
                  <Coins className="w-5 h-5" />
                  Buy {selectedPack.credits} Credits for {selectedPack.solCost} SOL
                </>
              )}
            </button>
          )}

          {txSig && (
            <p className="text-center text-xs text-[#7b82b4]">
              TX:{' '}
              <a
                href={`https://solscan.io/tx/${txSig}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-donk-400 hover:underline font-mono"
              >
                {txSig.slice(0, 8)}…{txSig.slice(-8)}
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
