'use client';

import { useState } from 'react';
import { Phone, PhoneCall, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { CallResponse } from '@/types';

const USE_CASES = [
  { icon: '📊', title: 'Portfolio Alerts',    desc: 'Automated voice alerts when token prices hit thresholds' },
  { icon: '🔐', title: 'Auth Confirmations',  desc: 'Voice OTP and confirmation calls for sensitive operations' },
  { icon: '🏛️', title: 'Compliance Notices', desc: 'Automated compliance deadline reminders via phone' },
  { icon: '🚀', title: 'Launch Notifications',desc: 'Voice announcements for your community on token launch day' },
];

export default function CallPage() {
  const [to, setTo]           = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<CallResponse | null>(null);
  const [error, setError]     = useState<string | null>(null);

  const initiateCall = async () => {
    if (!to.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: to.trim() }),
      });
      const data = await res.json() as { ok: boolean; data?: CallResponse; error?: string };
      if (!data.ok) throw new Error(data.error ?? 'Call failed');
      setResult(data.data!);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Call failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-gold to-accent-pink flex items-center justify-center">
          <Phone className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-[#e8eaf6]">Voice Calls</h1>
          <p className="text-[#7b82b4] text-sm">Powered by Telnyx · programmable PSTN · worldwide</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Call composer */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Initiate Call</CardTitle>
              <CardDescription>Place a programmatic outbound call via the Telnyx network</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#7b82b4]">Destination Number</label>
                <Input
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  type="tel"
                  leftIcon={<Phone className="w-4 h-4" />}
                />
                <p className="text-xs text-[#7b82b4]">Format: +1XXXXXXXXXX · International E.164 format</p>
              </div>

              {/* Notice */}
              <div className="bg-accent-gold/5 border border-accent-gold/20 rounded-xl p-4 text-sm text-[#7b82b4]">
                <p className="font-medium text-accent-gold mb-1">⚙️ Webhook Configuration Required</p>
                <p>To deliver a voice message, configure your webhook URL at <span className="text-donk-400">telnyx.com</span> → Connections → Webhooks.
                Point to: <code className="text-xs bg-[#0a0b14] px-1 rounded">{process.env.NEXT_PUBLIC_APP_URL ?? 'https://donk.unykorn.org'}/api/telnyx/webhook</code></p>
              </div>

              {result && (
                <div className="bg-accent-green/10 border border-accent-green/30 rounded-xl px-4 py-3 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent-green shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-accent-green">Call Initiated</p>
                    <p className="text-[#7b82b4] text-xs mt-0.5">Session: {result.callId} · Status: {result.status}</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="text-sm text-red-400">
                    <p className="font-semibold">Call Failed</p>
                    <p>{error}</p>
                  </div>
                </div>
              )}

              <Button
                onClick={initiateCall}
                loading={loading}
                disabled={!to.trim() || loading}
                size="lg"
                className="w-full"
                variant="cyan"
              >
                {loading ? <><Loader2 className="w-4 h-4" /> Calling…</> : <><PhoneCall className="w-4 h-4" /> Initiate Call</>}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Use cases */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-sm font-semibold text-[#7b82b4] uppercase tracking-wide">Use Cases</h2>
          {USE_CASES.map((uc) => (
            <div key={uc.title} className="bg-[#111325] border border-[#2a2d4a] rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-xl">{uc.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-[#e8eaf6]">{uc.title}</p>
                  <p className="text-xs text-[#7b82b4] mt-0.5">{uc.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
