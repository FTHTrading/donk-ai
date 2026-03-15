import type { Metadata } from 'next';
import './globals.css';
import { DonkNav } from '@/components/layout/DonkNav';
import { WalletProvider } from '@/components/wallet/WalletProvider';

export const metadata: Metadata = {
  title: 'Donk AI — AI Chat, Voice & Comms Platform | Pay with SOL',
  description: 'Chat with GPT-4o, generate HD voice audio with ElevenLabs, send SMS globally, and initiate voice calls — all powered by SOL credits. Built by Unykorn.',
  keywords: ['Donk AI', 'Unykorn', 'AI assistant', 'voice AI', 'FTH Trading', 'GPT-4o', 'ElevenLabs', 'Telnyx', 'Solana', 'SOL credits', 'AI voice synthesis', 'crypto AI'],
  openGraph: {
    title: 'Donk AI — Intelligence, Amplified',
    description: 'AI chat, HD voice synthesis, SMS, and voice calls. Pay with SOL. No accounts required.',
    url: 'https://donk.unykorn.org',
    siteName: 'Donk AI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Donk AI by Unykorn',
    description: 'AI chat, voice synthesis, and SMS — powered by SOL credits',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://donk.unykorn.org' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[#0a0b14] text-[#e8eaf6] antialiased">
        <WalletProvider>
          <div className="relative min-h-screen">
            {/* Background grid effect */}
            <div className="fixed inset-0 bg-grid opacity-40 pointer-events-none z-0" />
            {/* Ambient glow blobs */}
            <div className="fixed top-0 left-1/4 w-96 h-96 bg-donk-600/8 rounded-full blur-3xl pointer-events-none z-0" />
            <div className="fixed top-1/3 right-1/4 w-80 h-80 bg-accent-purple/8 rounded-full blur-3xl pointer-events-none z-0" />
            {/* Content */}
            <div className="relative z-10 flex flex-col min-h-screen">
              <DonkNav />
              <main className="flex-1">{children}</main>
            <footer className="border-t border-[#2a2d4a] py-8 px-6 text-sm text-[#7b82b4]">
              <div className="max-w-7xl mx-auto space-y-6">
                {/* Top row – links */}
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                  <a href="https://unykorn.org" className="hover:text-donk-300 transition-colors" target="_blank" rel="noopener noreferrer">Unykorn.org</a>
                  <a href="https://github.com/FTHTrading/donk-ai" className="hover:text-donk-300 transition-colors" target="_blank" rel="noopener noreferrer">GitHub</a>
                  <a href="/admin" className="hover:text-donk-300 transition-colors">System Status</a>
                  <a href="mailto:kevan@unykorn.org" className="hover:text-donk-300 transition-colors">Contact</a>
                  <a href="mailto:kevan@unykorn.org?subject=Donk%20AI%20—%20Bug%20Report" className="hover:text-donk-300 transition-colors">Report an Issue</a>
                </div>

                {/* Divider */}
                <div className="border-t border-[#2a2d4a]" />

                {/* Bottom row – copyright + legal */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#5a5e7a]">
                  <span>&copy; {new Date().getFullYear()} FTH Trading &mdash; Donk AI is part of the Unykorn ecosystem.</span>
                  <span>No data is stored. No tracking cookies. Open beta.</span>
                </div>
              </div>
            </footer>
          </div>
        </div>
        </WalletProvider>
      </body>
    </html>
  );
}
