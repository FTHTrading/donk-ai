import type { Metadata } from 'next';
import './globals.css';
import { DonkNav } from '@/components/layout/DonkNav';

export const metadata: Metadata = {
  title: 'Donk AI — Intelligent Voice, Chat & Comms by Unykorn',
  description: 'Donk AI is the AI-powered assistant layer of the Unykorn ecosystem. Chat with GPT-4o, hear responses in your voice, send SMS, and automate comms — all from one platform.',
  keywords: ['Donk AI', 'Unykorn', 'AI assistant', 'voice AI', 'FTH Trading', 'GPT-4', 'ElevenLabs', 'Telnyx'],
  openGraph: {
    title: 'Donk AI',
    description: 'Intelligent Voice, Chat & Comms Platform',
    url: 'https://donk.unykorn.org',
    siteName: 'Donk AI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Donk AI by Unykorn',
    description: 'AI chat, voice synthesis, and SMS — in one platform',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[#0a0b14] text-[#e8eaf6] antialiased">
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
            <footer className="border-t border-[#2a2d4a] py-6 px-6 text-center text-sm text-[#7b82b4]">
              <span>Donk AI is part of the&nbsp;</span>
              <a href="https://unykorn.org" className="text-donk-400 hover:text-donk-300 font-medium" target="_blank" rel="noopener noreferrer">
                Unykorn
              </a>
              <span>&nbsp;ecosystem &mdash; Built by&nbsp;</span>
              <a href="https://github.com/FTHTrading" className="text-donk-400 hover:text-donk-300 font-medium" target="_blank" rel="noopener noreferrer">
                FTH Trading
              </a>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
