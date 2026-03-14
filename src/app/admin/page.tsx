'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, CheckCircle2, XCircle, AlertCircle, Shield, ExternalLink, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ServiceStatus {
  ok: boolean;
  latencyMs?: number;
  detail?: string;
  credits?: number;
}

interface EnvCheck {
  set: boolean;
  required: boolean;
}

interface StatusPayload {
  openai:      ServiceStatus;
  elevenlabs:  ServiceStatus;
  telnyx:      ServiceStatus;
  cloudflare:  ServiceStatus;
  envChecks:   Record<string, EnvCheck>;
  timestamp:   string;
  uptime:      number;
  donkVersion: string;
}

const SERVICE_META: Record<string, { label: string; description: string; docsUrl: string; color: string }> = {
  openai: {
    label:       'OpenAI / GPT-4o',
    description: 'AI chat completions, message streaming, content generation',
    docsUrl:     'https://platform.openai.com/usage',
    color:       'text-donk-400',
  },
  elevenlabs: {
    label:       'ElevenLabs Voice',
    description: 'Text-to-speech synthesis, 50+ voices, 29 languages',
    docsUrl:     'https://elevenlabs.io/app',
    color:       'text-accent-cyan',
  },
  telnyx: {
    label:       'Telnyx Telecom',
    description: 'Global SMS delivery and outbound voice calls',
    docsUrl:     'https://portal.telnyx.com',
    color:       'text-accent-green',
  },
  cloudflare: {
    label:       'Cloudflare Edge',
    description: 'DNS, CDN, Workers, and security layer',
    docsUrl:     'https://dash.cloudflare.com',
    color:       'text-accent-gold',
  },
};

function StatusBadge({ ok, latencyMs }: { ok: boolean | undefined; latencyMs?: number }) {
  if (ok === undefined) {
    return (
      <div className="flex items-center gap-1.5 text-[#7b82b4]">
        <div className="w-2 h-2 rounded-full bg-[#7b82b4] animate-pulse" />
        <span className="text-xs">Checking…</span>
      </div>
    );
  }
  return (
    <div className={`flex items-center gap-1.5 ${ok ? 'text-accent-green' : 'text-red-400'}`}>
      <div className={`w-2 h-2 rounded-full ${ok ? 'bg-accent-green' : 'bg-red-400'}`} />
      <span className="text-xs font-medium">{ok ? 'Operational' : 'Degraded'}</span>
      {latencyMs !== undefined && (
        <span className="text-xs text-[#7b82b4]">· {latencyMs}ms</span>
      )}
    </div>
  );
}

export default function AdminPage() {
  const [status, setStatus]   = useState<StatusPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastChecked, setLast] = useState<Date | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/status');
      const data = await res.json() as { ok: boolean; data?: StatusPayload };
      if (data.ok && data.data) {
        setStatus(data.data);
        setLast(new Date());
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStatus(); }, []);

  const allOk = status && ['openai', 'elevenlabs', 'telnyx', 'cloudflare'].every(
    (k) => status[k as keyof StatusPayload] && (status[k as keyof StatusPayload] as ServiceStatus).ok
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-purple to-donk-500 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#e8eaf6]">System Status</h1>
            <p className="text-[#7b82b4] text-sm">
              {status ? `v${status.donkVersion} · ${lastChecked?.toLocaleTimeString()}` : 'Checking services…'}
            </p>
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={fetchStatus} loading={loading}>
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </Button>
      </div>

      {/* Overall status banner */}
      {status && (
        <div className={`rounded-2xl border px-6 py-4 flex items-center gap-4 ${
          allOk
            ? 'bg-accent-green/5 border-accent-green/20'
            : 'bg-red-500/5 border-red-500/20'
        }`}>
          {allOk
            ? <CheckCircle2 className="w-8 h-8 text-accent-green shrink-0" />
            : <AlertCircle  className="w-8 h-8 text-red-400 shrink-0"  />}
          <div>
            <p className={`font-bold text-lg ${allOk ? 'text-accent-green' : 'text-red-400'}`}>
              {allOk ? 'All Systems Operational' : 'Some Services Degraded'}
            </p>
            <p className="text-sm text-[#7b82b4]">
              Uptime: {status.uptime}% · Last checked: {new Date(status.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Services grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(Object.keys(SERVICE_META) as Array<keyof typeof SERVICE_META>).map((key) => {
          const meta = SERVICE_META[key];
          const svc  = status?.[key as keyof StatusPayload] as ServiceStatus | undefined;

          return (
            <Card key={key}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className={meta.color}>{meta.label}</CardTitle>
                    <CardDescription className="mt-1">{meta.description}</CardDescription>
                  </div>
                  <a
                    href={meta.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#7b82b4] hover:text-[#e8eaf6] transition-colors mt-0.5"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <StatusBadge ok={svc?.ok} latencyMs={svc?.latencyMs} />

                {svc?.detail && (
                  <p className="text-xs text-[#7b82b4] bg-[#0a0b14] border border-[#2a2d4a] rounded-lg px-3 py-2 font-mono">
                    {svc.detail}
                  </p>
                )}

                {svc && !svc.ok && (
                  <div className="flex items-center gap-2 text-xs text-red-400">
                    <XCircle className="w-3.5 h-3.5" />
                    Check API key and account status
                  </div>
                )}

                {key === 'elevenlabs' && svc?.credits !== undefined && (
                  <div className="flex items-center gap-2 text-xs text-[#7b82b4] bg-accent-cyan/5 border border-accent-cyan/15 rounded-lg px-3 py-2">
                    <Database className="w-3.5 h-3.5 text-accent-cyan" />
                    {svc.credits.toLocaleString()} characters used
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Environment table */}
      <Card>
        <CardHeader>
          <CardTitle>Environment Variables</CardTitle>
          <CardDescription>Required keys — values are masked for security</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2a2d4a]">
                  <th className="text-left py-2 px-3 text-xs font-semibold text-[#7b82b4] uppercase tracking-wide">Variable</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-[#7b82b4] uppercase tracking-wide">Status</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-[#7b82b4] uppercase tracking-wide">Notes</th>
                </tr>
              </thead>
              <tbody>
                {(status?.envChecks
                  ? Object.entries(status.envChecks).map(([name, check]) => ({
                      name,
                      ok:   check.set,
                      note: check.required ? 'Required' : 'Optional',
                    }))
                  : [
                      { name: 'OPENAI_API_KEY',               ok: false, note: 'Required — GPT-4o access'             },
                      { name: 'ELEVENLABS_API_KEY',           ok: false, note: 'Required — TTS synthesis'             },
                      { name: 'TELNYX_API_KEY',               ok: false, note: 'Required — SMS & calls'               },
                      { name: 'TELNYX_FROM_NUMBER',           ok: false, note: 'Required — Telnyx number (+1XXXXXXXXXX)' },
                      { name: 'CLOUDFLARE_API_TOKEN',         ok: false, note: 'Required — DNS/zones'                 },
                      { name: 'CLOUDFLARE_ACCOUNT_ID',        ok: false, note: 'Optional — CF dashboard sidebar'      },
                      { name: 'CLOUDFLARE_ZONE_ID',           ok: false, note: 'Optional — CF zone overview'          },
                      { name: 'TELNYX_MESSAGING_PROFILE_ID', ok: false, note: 'Optional — advanced routing'           },
                    ]
                ).map((row) => (
                  <tr key={row.name} className="border-b border-[#2a2d4a]/50 hover:bg-[#111325]/50 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-xs text-donk-300">{row.name}</td>
                    <td className="py-2.5 px-3">
                      {row.ok
                        ? <span className="inline-flex items-center gap-1 text-xs text-accent-green"><CheckCircle2 className="w-3 h-3" />Set</span>
                        : <span className="inline-flex items-center gap-1 text-xs text-accent-gold"><AlertCircle className="w-3 h-3" />Missing</span>}
                    </td>
                    <td className="py-2.5 px-3 text-xs text-[#7b82b4]">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}