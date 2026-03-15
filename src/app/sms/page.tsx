'use client';

import { useState } from 'react';
import { MessageSquare, Send, CheckCircle2, AlertCircle, Loader2, Brain, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useWallet } from '@solana/wallet-adapter-react';
import type { SMSResponse } from '@/types';

const TEMPLATES = [
  {
    label:   '🚀 Token Launch',
    content: 'Your token has launched! 🎉 Connect your wallet at unykorn.org to view your portfolio. Powered by Donk AI.',
  },
  {
    label:   '📊 Portfolio Alert',
    content: 'Portfolio update: Your Solana tokens are up 12.4% today. Log in at donk.unykorn.org to manage authorities.',
  },
  {
    label:   '🔐 Authority Notice',
    content: 'Action required: Revoke your token mint authority to lock supply. Visit donk.unykorn.org/manage to proceed.',
  },
  {
    label:   '💧 Liquidity Alert',
    content: 'New pool detected for your token on Raydium! Add liquidity now to earn trading fees. donk.unykorn.org',
  },
  {
    label:   '🏛️ Compliance',
    content: 'Compliance reminder: Your token activity requires CBK declaration by end of month. Contact your compliance officer.',
  },
];

export default function SMSPage() {
  const [to, setTo]               = useState('');
  const [message, setMessage]     = useState('');
  const [loading, setLoading]     = useState(false);
  const [result, setResult]       = useState<SMSResponse | null>(null);
  const [error, setError]         = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt]   = useState('');
  const { publicKey } = useWallet();

  const MAX = 1600;

  const sendSMS = async () => {
    if (!to.trim() || !message.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(publicKey && { 'X-Wallet-Address': publicKey.toBase58() }),
        },
        body: JSON.stringify({ to: to.trim(), message: message.trim() }),
      });
      const data = await res.json() as { ok: boolean; data?: SMSResponse; error?: string };

      if (!data.ok) throw new Error(data.error ?? 'SMS failed');
      setResult(data.data!);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Send failed');
    } finally {
      setLoading(false);
    }
  };

  const draftWithAI = async () => {
    if (!aiPrompt.trim() || aiLoading) return;
    setAiLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Write a SHORT, professional SMS message (max 160 chars) for this purpose: ${aiPrompt}. Reply ONLY with the SMS text, no quotes, no explanation.`,
          }],
          voice: false,
        }),
      });
      const data = await res.json() as { ok: boolean; data?: { content: string }; error?: string };
      if (data.ok && data.data) setMessage(data.data.content.trim());
    } catch {
      // silent fail for AI draft
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-green to-accent-cyan flex items-center justify-center">
          <MessageSquare className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-[#e8eaf6]">SMS Messaging</h1>
          <p className="text-[#7b82b4] text-sm">Powered by Telnyx · global delivery · AI-drafted</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Composer */}
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compose Message</CardTitle>
              <CardDescription>Send SMS to any phone number worldwide</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="+1 (555) 000-0000"
                type="tel"
                leftIcon={<MessageSquare className="w-4 h-4" />}
              />

              {/* AI Draft Assistant */}
              <div className="bg-donk-500/5 border border-donk-500/20 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-donk-300">
                  <Sparkles className="w-4 h-4" />
                  AI Draft Assistant
                </div>
                <div className="flex gap-2">
                  <Input
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g. 'notify user their token launched'"
                    className="flex-1"
                  />
                  <Button
                    onClick={draftWithAI}
                    loading={aiLoading}
                    variant="secondary"
                    size="sm"
                    className="shrink-0"
                  >
                    <Brain className="w-3.5 h-3.5" />
                    Draft
                  </Button>
                </div>
              </div>

              <div>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Your message…"
                  rows={5}
                  className={message.length > MAX ? 'border-red-500/60' : ''}
                />
                <div className={`text-right text-xs mt-1 ${message.length > MAX ? 'text-red-400' : 'text-[#7b82b4]'}`}>
                  {message.length}/{MAX} · ~{Math.ceil(message.length / 160)} SMS segment{Math.ceil(message.length / 160) !== 1 ? 's' : ''}
                </div>
              </div>

              {result && (
                <div className="bg-accent-green/10 border border-accent-green/30 rounded-xl px-4 py-3 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent-green shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-accent-green">Message Sent</p>
                    <p className="text-[#7b82b4] text-xs mt-0.5">ID: {result.id} · Status: {result.status}</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="text-sm text-red-400">{error}</div>
                </div>
              )}

              <Button
                onClick={sendSMS}
                loading={loading}
                disabled={!to.trim() || !message.trim() || message.length > MAX || loading}
                size="lg"
                className="w-full"
                variant="green"
              >
                {loading ? <><Loader2 className="w-4 h-4" /> Sending…</> : <><Send className="w-4 h-4" /> Send SMS</>}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Templates */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Templates</CardTitle>
              <CardDescription>Click to load into composer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.label}
                  onClick={() => setMessage(t.content)}
                  className="w-full text-left bg-[#0a0b14] border border-[#2a2d4a] hover:border-accent-green/40 rounded-xl px-4 py-3 transition-all group"
                >
                  <p className="text-sm font-medium text-[#e8eaf6] group-hover:text-accent-green transition-colors">{t.label}</p>
                  <p className="text-xs text-[#7b82b4] mt-1 line-clamp-2">{t.content}</p>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
