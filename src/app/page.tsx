import Link from 'next/link';
import { Brain, Mic, MessageSquare, Phone, ArrowRight, Zap, Shield, Globe, ChevronRight, Lock, Activity, Cpu, Users, Building2, Megaphone, HeartPulse, Mail } from 'lucide-react';

const FEATURES = [
  {
    href:  '/chat',
    icon:  Brain,
    color: 'from-donk-500 to-accent-purple',
    badge: 'GPT-4o',
    title: 'AI Chat',
    desc:  'Converse with GPT-4o. Get analysis, code, creative writing, crypto guidance — in seconds.',
    tags:  ['Streaming', 'Context memory', 'Markdown'],
  },
  {
    href:  '/voice',
    icon:  Mic,
    color: 'from-accent-cyan to-donk-500',
    badge: 'ElevenLabs',
    title: 'Voice Synthesis',
    desc:  'Turn any text into natural human-sounding audio. Choose from dozens of premium voices.',
    tags:  ['50+ voices', 'Multilingual', 'HD audio'],
  },
  {
    href:  '/sms',
    icon:  MessageSquare,
    color: 'from-accent-green to-accent-cyan',
    badge: 'Telnyx',
    title: 'SMS Messaging',
    desc:  'Send AI-drafted SMS messages to any phone number worldwide via the Telnyx network.',
    tags:  ['Global coverage', 'Delivery receipts', 'MMS'],
  },
  {
    href:  '/call',
    icon:  Phone,
    color: 'from-accent-gold to-accent-pink',
    badge: 'Telnyx Voice',
    title: 'Voice Calls',
    desc:  'Initiate programmable voice calls. AI-scripted messages delivered over any phone network.',
    tags:  ['Programmable', 'Global PSTN', 'Webhooks'],
  },
];

const STATS = [
  { label: 'AI Models',    value: 'GPT-4o' },
  { label: 'TTS Voices',   value: '50+' },
  { label: 'SMS Countries',value: '180+' },
  { label: 'Providers',    value: '4' },
];

const STEPS = [
  {
    step:  '01',
    title: 'Choose a capability',
    desc:  'Pick from AI chat, voice synthesis, SMS, or voice calls — all accessible from the top nav.',
    icon:  Cpu,
  },
  {
    step:  '02',
    title: 'Compose your request',
    desc:  'Type a message, enter a phone number, or paste text to synthesize. AI drafting is built in.',
    icon:  Brain,
  },
  {
    step:  '03',
    title: 'Send and receive',
    desc:  'Your request is processed through enterprise APIs. Results arrive in seconds — text, audio, or delivery confirmation.',
    icon:  Zap,
  },
];

const USE_CASES = [
  {
    icon:  Building2,
    title: 'Business Operations',
    desc:  'Draft professional emails, generate reports, automate SMS campaigns, and handle customer queries with AI.',
  },
  {
    icon:  Megaphone,
    title: 'Marketing & Outreach',
    desc:  'Create voice-over content for ads, send bulk SMS notifications, and generate campaign copy at scale.',
  },
  {
    icon:  Users,
    title: 'Community Management',
    desc:  'Send alerts to token holders, automate compliance notices, and manage voice-based community updates.',
  },
  {
    icon:  HeartPulse,
    title: 'Personal Productivity',
    desc:  'Get instant AI analysis on any topic, convert notes to audio, and streamline daily communications.',
  },
];

const TRUST_ITEMS = [
  {
    icon:  Lock,
    title: 'Secure by Default',
    desc:  'All API keys are server-side only. Admin routes require authentication. Security headers on every response.',
  },
  {
    icon:  Activity,
    title: 'Rate-Limited APIs',
    desc:  'Distributed rate limiting via Upstash Redis. Every public endpoint is throttled to prevent abuse.',
  },
  {
    icon:  Shield,
    title: 'Privacy-First',
    desc:  'No conversation data is stored. No tracking cookies. No accounts required. Messages are processed and discarded.',
  },
];

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-24">

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="text-center space-y-8 pt-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-donk-500/30 bg-donk-500/10 text-donk-300 text-sm font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-donk-400 animate-pulse" />
          Part of the Unykorn ecosystem
        </div>

        <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-[1.05]">
          <span className="text-gradient-blue-purple">Donk AI</span>
          <br />
          <span className="text-[#e8eaf6]">Intelligence, Amplified</span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-[#7b82b4] leading-relaxed">
          Chat with GPT-4o. Hear your answers spoken aloud in a human voice.
          Send AI-drafted SMS globally. Initiate voice calls. All from one platform.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 bg-donk-500 hover:bg-donk-400 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all active:scale-95 shadow-lg hover:shadow-donk-500/30 glow-blue"
          >
            <Brain className="w-5 h-5" />
            Start Chatting
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/voice"
            className="inline-flex items-center gap-2 bg-[#1a1e36] border border-[#2a2d4a] hover:border-accent-cyan/50 text-[#e8eaf6] font-bold px-8 py-4 rounded-2xl text-lg transition-all active:scale-95"
          >
            <Mic className="w-5 h-5 text-accent-cyan" />
            Try Voice
          </Link>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto pt-4">
          {STATS.map(({ label, value }) => (
            <div key={label} className="bg-[#111325] border border-[#2a2d4a] rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-gradient-blue-purple">{value}</div>
              <div className="text-xs text-[#7b82b4] mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature Cards ────────────────────────────────────────────── */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-[#e8eaf6]">Four Powerful Capabilities</h2>
          <p className="text-[#7b82b4]">Powered by OpenAI · ElevenLabs · Telnyx · Cloudflare</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map(({ href, icon: Icon, color, badge, title, desc, tags }) => (
            <Link
              key={href}
              href={href}
              className="group bg-[#111325] border border-[#2a2d4a] hover:border-donk-500/40 rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-donk-500/10 flex flex-col gap-4"
            >
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-mono bg-[#0a0b14] border border-[#2a2d4a] text-[#7b82b4] px-2 py-1 rounded-lg">
                  {badge}
                </span>
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
                <ChevronRight className="w-4 h-4 text-[#7b82b4] group-hover:text-donk-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────── */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-[#e8eaf6]">How It Works</h2>
          <p className="text-[#7b82b4]">Three steps. No account required. Results in seconds.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {STEPS.map(({ step, title, desc, icon: Icon }) => (
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

      {/* ── Use Cases ────────────────────────────────────────────────── */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-[#e8eaf6]">Built For</h2>
          <p className="text-[#7b82b4]">Teams, operators, and individuals who need AI-powered communication.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {USE_CASES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-[#111325] border border-[#2a2d4a] rounded-2xl p-6 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-donk-500/10 border border-donk-500/20 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-donk-400" />
              </div>
              <div>
                <h3 className="font-bold text-[#e8eaf6]">{title}</h3>
                <p className="text-sm text-[#7b82b4] mt-1 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trust & Security ─────────────────────────────────────────── */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-[#e8eaf6]">Trust & Security</h2>
          <p className="text-[#7b82b4]">Enterprise-grade infrastructure. No data retention. Transparent providers.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TRUST_ITEMS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-[#111325] border border-[#2a2d4a] rounded-2xl p-6 space-y-3 text-center">
              <div className="w-12 h-12 rounded-xl bg-accent-green/10 border border-accent-green/20 flex items-center justify-center mx-auto">
                <Icon className="w-6 h-6 text-accent-green" />
              </div>
              <h3 className="font-bold text-[#e8eaf6]">{title}</h3>
              <p className="text-sm text-[#7b82b4] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-green/10 border border-accent-green/20 text-accent-green text-sm">
            <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
            All systems operational
          </div>
        </div>
      </section>

      {/* ── Beta CTA ─────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-donk-500/10 via-accent-purple/10 to-accent-cyan/10 border border-donk-500/20 rounded-3xl p-8 sm:p-12 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent-gold/30 bg-accent-gold/10 text-accent-gold text-sm font-medium">
          <Zap className="w-3.5 h-3.5" />
          Early Access
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-[#e8eaf6] max-w-2xl mx-auto leading-tight">
          Try Donk AI Today
        </h2>
        <p className="text-[#7b82b4] max-w-xl mx-auto">
          Donk AI is currently in open beta. All four capabilities are live and operational.
          Start using them now — no account or payment required.
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
          <a
            href="mailto:kevan@unykorn.org?subject=Donk%20AI%20—%20Demo%20Request"
            className="inline-flex items-center gap-2 bg-[#1a1e36] border border-[#2a2d4a] hover:border-donk-500/50 text-[#e8eaf6] font-bold px-8 py-4 rounded-2xl text-lg transition-all active:scale-95"
          >
            <Mail className="w-5 h-5 text-donk-400" />
            Request a Demo
          </a>
        </div>
      </section>

      {/* ── Unykorn ──────────────────────────────────────────────────── */}
      <section className="border border-[#2a2d4a] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-donk-500 to-accent-purple flex items-center justify-center flex-shrink-0">
          <Globe className="w-6 h-6 text-white" />
        </div>
        <div className="text-center sm:text-left space-y-1 flex-1">
          <h3 className="font-bold text-[#e8eaf6]">Part of the Unykorn Ecosystem</h3>
          <p className="text-sm text-[#7b82b4]">
            Donk AI is the intelligent communication layer built by FTH Trading for the Unykorn platform.
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
