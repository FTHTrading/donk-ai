import Link from 'next/link';
import {
  Brain, Mic, MessageSquare, Phone, ArrowRight, Zap,
  Shield, ChevronRight, Coins, Sparkles,
  Lock, Activity, Check,
} from 'lucide-react';

// ── Feature cards ──────────────────────────────────────────────────────

const FEATURES = [
  {
    href:  '/chat',
    icon:  Brain,
    color: 'from-donk-500 to-accent-purple',
    badge: 'GPT-4o',
    title: 'AI Chat',
    desc:  'Converse with GPT-4o. Get analysis, code, creative writing, crypto guidance — in seconds.',
    tags:  ['Streaming', 'Context', 'Markdown'],
    cost:  '1 credit',
    free:  '5/day free',
  },
  {
    href:  '/voice',
    icon:  Mic,
    color: 'from-accent-cyan to-donk-500',
    badge: 'ElevenLabs',
    title: 'Voice Synthesis',
    desc:  'Turn any text into natural human-sounding audio. Choose from 50+ premium voices.',
    tags:  ['HD audio', 'Multilingual', '50+ voices'],
    cost:  '5 credits',
    free:  '1/day free',
  },
  {
    href:  '/sms',
    icon:  MessageSquare,
    color: 'from-accent-green to-accent-cyan',
    badge: 'Telnyx',
    title: 'SMS Messaging',
    desc:  'Send AI-drafted SMS to any phone number worldwide via the Telnyx network.',
    tags:  ['Global', 'Delivery receipts', 'MMS'],
    cost:  '10 credits',
    free:  null,
  },
  {
    href:  '/call',
    icon:  Phone,
    color: 'from-accent-gold to-accent-pink',
    badge: 'Telnyx',
    title: 'Voice Calls',
    desc:  'Initiate programmable voice calls to any phone number worldwide.',
    tags:  ['PSTN', '180+ countries', 'Webhooks'],
    cost:  '15 credits',
    free:  null,
  },
];

// ── Credit packs ──────────────────────────────────────────────────────

const PACKS = [
  { credits: 10,  sol: 0.1, label: 'Starter',  desc: '10 chats or 2 voice gens' },
  { credits: 50,  sol: 0.4, label: 'Pro',       desc: '50 chats or 10 voice gens', popular: true, savings: '20% off' },
  { credits: 200, sol: 1.5, label: 'Whale',     desc: '200 chats or 40 voice gens', savings: '25% off' },
];

// ── Stats ─────────────────────────────────────────────────────────────

const STATS = [
  { value: 'GPT-4o',    label: 'AI Model'     },
  { value: '50+',       label: 'Voices'        },
  { value: '180+',      label: 'Countries'     },
  { value: 'SOL',       label: 'Payment'       },
];

// ── Trust ─────────────────────────────────────────────────────────────

const TRUST = [
  { icon: Lock,     title: 'No Accounts',    desc: 'Connect wallet. Use features. No signup.' },
  { icon: Shield,   title: 'No Data Stored',  desc: 'Conversations processed and discarded.' },
  { icon: Activity, title: 'Rate Limited',    desc: 'Upstash Redis anti-abuse on all endpoints.' },
];

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-20">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="text-center space-y-8 pt-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-donk-500/30 bg-donk-500/10 text-donk-300 text-sm font-medium">
          <Coins className="w-3.5 h-3.5" />
          Now accepting SOL payments
        </div>

        <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-[1.05]">
          <span className="text-gradient-blue-purple">AI Tools.</span>
          <br />
          <span className="text-[#e8eaf6]">Pay with SOL.</span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-[#7b82b4] leading-relaxed">
          Chat with GPT-4o. Generate HD voice audio. Send SMS globally. Make voice calls.
          Connect your Solana wallet, buy credits, and go.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 bg-donk-500 hover:bg-donk-400 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all active:scale-95 shadow-lg hover:shadow-donk-500/30 glow-blue"
          >
            <Brain className="w-5 h-5" />
            Start Chatting
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="#pricing"
            className="inline-flex items-center gap-2 bg-[#1a1e36] border border-[#2a2d4a] hover:border-accent-gold/50 text-[#e8eaf6] font-bold px-8 py-4 rounded-2xl text-lg transition-all active:scale-95"
          >
            <Coins className="w-5 h-5 text-accent-gold" />
            View Pricing
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto pt-4">
          {STATS.map(({ label, value }) => (
            <div key={label} className="bg-[#111325] border border-[#2a2d4a] rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-gradient-blue-purple">{value}</div>
              <div className="text-xs text-[#7b82b4] mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features with Pricing ────────────────────────────────── */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-[#e8eaf6]">Four Capabilities. One Wallet.</h2>
          <p className="text-[#7b82b4]">Powered by OpenAI · ElevenLabs · Telnyx · Solana</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map(({ href, icon: Icon, color, badge, title, desc, tags, cost, free }) => (
            <Link
              key={href}
              href={href}
              className="group bg-[#111325] border border-[#2a2d4a] hover:border-donk-500/40 rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-donk-500/10 flex flex-col gap-4"
            >
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono bg-accent-gold/10 border border-accent-gold/30 text-accent-gold px-2 py-1 rounded-lg">
                    {cost}
                  </span>
                  <span className="text-xs font-mono bg-[#0a0b14] border border-[#2a2d4a] text-[#7b82b4] px-2 py-1 rounded-lg">
                    {badge}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#e8eaf6] group-hover:text-donk-300 transition-colors">{title}</h3>
                <p className="text-sm text-[#7b82b4] mt-1 leading-relaxed">{desc}</p>
              </div>
              <div className="flex items-center justify-between mt-auto">
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span key={tag} className="text-xs bg-[#1a1e36] border border-[#2a2d4a] text-[#7b82b4] px-2 py-0.5 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  {free && (
                    <span className="text-xs text-accent-green font-medium">{free}</span>
                  )}
                  <ChevronRight className="w-4 h-4 text-[#7b82b4] group-hover:text-donk-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────── */}
      <section id="pricing" className="scroll-mt-20 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent-gold/30 bg-accent-gold/10 text-accent-gold text-sm font-medium">
            <Coins className="w-3.5 h-3.5" />
            Credit Packs
          </div>
          <h2 className="text-3xl font-black text-[#e8eaf6]">Pay with SOL. Use Instantly.</h2>
          <p className="text-[#7b82b4]">Connect wallet &rarr; buy credits &rarr; use any feature. No accounts or signups.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PACKS.map(({ credits, sol, label, desc, popular, savings }) => (
            <div
              key={label}
              className={`relative bg-[#111325] border rounded-2xl p-6 space-y-4 ${
                popular
                  ? 'border-donk-500/40 shadow-lg shadow-donk-500/10 scale-[1.02]'
                  : 'border-[#2a2d4a]'
              }`}
            >
              {popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-donk-500 text-white text-xs font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Most Popular
                </span>
              )}
              <div>
                <h3 className="text-xl font-bold text-[#e8eaf6]">{label}</h3>
                <p className="text-sm text-[#7b82b4]">{desc}</p>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-gradient-blue-purple">{sol}</span>
                <span className="text-[#7b82b4]">SOL</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#e8eaf6] font-mono">{credits} credits</span>
                {savings && <span className="text-xs text-accent-green font-medium">{savings}</span>}
              </div>
              <div className="text-xs text-[#7b82b4] space-y-1">
                <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-accent-green" /> AI Chat: {Math.floor(credits / 1)} messages</div>
                <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-accent-green" /> Voice: {Math.floor(credits / 5)} generations</div>
                <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-accent-green" /> SMS: {Math.floor(credits / 10)} messages</div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-[#7b82b4]">
          Free tier: 5 chats + 1 voice gen per day · No wallet required · Upgrade anytime
        </p>
      </section>

      {/* ── How It Works ────────────────────────────────────────── */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-[#e8eaf6]">Three Steps. That&apos;s It.</h2>
          <p className="text-[#7b82b4]">No accounts. No KYC. Just connect and go.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { step: '01', title: 'Connect Wallet', desc: 'Phantom, Solflare, or any Solana wallet. One click.', icon: Zap },
            { step: '02', title: 'Buy Credits', desc: 'Pick a pack. Send SOL. Credits appear instantly.', icon: Coins },
            { step: '03', title: 'Use AI Tools', desc: 'Chat, voice, SMS, calls — credits deducted per use.', icon: Brain },
          ].map(({ step, title, desc, icon: Icon }) => (
            <div key={step} className="relative bg-[#111325] border border-[#2a2d4a] rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-donk-500/30">{step}</span>
                <Icon className="w-5 h-5 text-donk-400" />
              </div>
              <h3 className="font-bold text-lg text-[#e8eaf6]">{title}</h3>
              <p className="text-sm text-[#7b82b4] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trust ────────────────────────────────────────────────── */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-[#e8eaf6]">Trust & Security</h2>
          <p className="text-[#7b82b4]">Privacy-first. No data retention. Transparent providers.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TRUST.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-[#111325] border border-[#2a2d4a] rounded-2xl p-6 space-y-3 text-center">
              <div className="w-12 h-12 rounded-xl bg-accent-green/10 border border-accent-green/20 flex items-center justify-center mx-auto">
                <Icon className="w-6 h-6 text-accent-green" />
              </div>
              <h3 className="font-bold text-[#e8eaf6]">{title}</h3>
              <p className="text-sm text-[#7b82b4] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-donk-500/10 via-accent-purple/10 to-accent-cyan/10 border border-donk-500/20 rounded-3xl p-8 sm:p-12 text-center space-y-6">
        <h2 className="text-2xl sm:text-4xl font-black text-[#e8eaf6] max-w-2xl mx-auto leading-tight">
          Stop Paying Monthly Subscriptions.
          <br />
          <span className="text-gradient-blue-purple">Pay Per Use with SOL.</span>
        </h2>
        <p className="text-[#7b82b4] max-w-xl mx-auto">
          No recurring fees. No locked-in plans. Buy credits when you need them,
          use them when you want. Your wallet is your account.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 bg-donk-500 hover:bg-donk-400 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all active:scale-95 shadow-lg hover:shadow-donk-500/30 glow-blue"
          >
            <Brain className="w-5 h-5" />
            Start Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="https://launch.unykorn.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#1a1e36] border border-[#2a2d4a] hover:border-donk-500/50 text-[#e8eaf6] font-bold px-8 py-4 rounded-2xl text-lg transition-all active:scale-95"
          >
            <Sparkles className="w-5 h-5 text-accent-gold" />
            Launch a Token
          </a>
        </div>
      </section>

      {/* ── Ecosystem link ───────────────────────────────────────── */}
      <section className="border border-[#2a2d4a] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-donk-500 to-accent-purple flex items-center justify-center flex-shrink-0">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div className="text-center sm:text-left space-y-1 flex-1">
          <h3 className="font-bold text-[#e8eaf6]">Part of the Unykorn Ecosystem</h3>
          <p className="text-sm text-[#7b82b4]">
            Donk AI is the intelligent communication layer. Launch tokens at{' '}
            <a href="https://launch.unykorn.org" className="text-donk-400 hover:underline" target="_blank" rel="noopener noreferrer">
              launch.unykorn.org
            </a>
          </p>
        </div>
        <a
          href="https://unykorn.org"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#1a1e36] border border-[#2a2d4a] hover:border-donk-500/50 text-[#e8eaf6] font-medium px-5 py-2.5 rounded-xl transition-all active:scale-95 text-sm"
        >
          <Shield className="w-4 h-4 text-donk-400" />
          Visit Unykorn.org
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </section>
    </div>
  );
}
