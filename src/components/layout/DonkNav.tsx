'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain, Mic, MessageSquare, Phone, Zap, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ConnectWallet } from '@/components/wallet/ConnectWallet';
import { BuyCreditsModal } from '@/components/wallet/BuyCreditsModal';
import { useWallet } from '@solana/wallet-adapter-react';

const NAV_LINKS = [
  { href: '/chat',  label: 'Chat',  icon: Brain,          color: 'text-donk-400'    },
  { href: '/voice', label: 'Voice', icon: Mic,            color: 'text-accent-cyan' },
  { href: '/sms',   label: 'SMS',   icon: MessageSquare,  color: 'text-accent-green'},
  { href: '/call',  label: 'Call',  icon: Phone,          color: 'text-accent-gold' },
];

export function DonkNav() {
  const pathname = usePathname();
  const [showBuyCredits, setShowBuyCredits] = useState(false);
  const { connected } = useWallet();

  return (
    <header className="sticky top-0 z-50 glass border-b border-[#2a2d4a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-donk-500 to-accent-purple flex items-center justify-center group-hover:animate-glow transition-all">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg text-gradient-blue-purple">Donk</span>
              <span className="font-bold text-lg text-[#e8eaf6] ml-1">AI</span>
            </div>
            <span className="hidden sm:block text-xs text-[#7b82b4] border border-[#2a2d4a] rounded px-1.5 py-0.5 ml-1">
              beta
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label, icon: Icon, color }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                    active
                      ? 'bg-donk-500/15 text-donk-300 border border-donk-500/30'
                      : 'text-[#7b82b4] hover:text-[#e8eaf6] hover:bg-[#1a1e36]'
                  )}
                >
                  <Icon className={cn('w-3.5 h-3.5', active ? 'text-donk-400' : color)} />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {connected && (
              <button
                onClick={() => setShowBuyCredits(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-accent-gold/10 border border-accent-gold/30 text-accent-gold hover:bg-accent-gold/20 transition-all active:scale-95"
              >
                <Coins className="w-3.5 h-3.5" />
                Buy Credits
              </button>
            )}
            <ConnectWallet />
          </div>
        </div>

        {/* Mobile nav */}
        <div className="flex md:hidden items-center gap-1 pb-2 overflow-x-auto">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all',
                  active
                    ? 'bg-donk-500/15 text-donk-300 border border-donk-500/30'
                    : 'text-[#7b82b4] hover:text-[#e8eaf6]'
                )}
              >
                <Icon className="w-3 h-3" />
                {label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Buy Credits Modal */}
      <BuyCreditsModal open={showBuyCredits} onClose={() => setShowBuyCredits(false)} />
    </header>
  );
}
