// ─────────────────────────────────────────────────────────────────────
//  GET  /api/status — Health check + real API connectivity pings
//
//  Public: returns basic health (ok, timestamp, version)
//  Authenticated: returns full provider diagnostics when
//    ?detail=true with valid admin token
// ─────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server';

interface ServiceStatus {
  ok: boolean;
  latencyMs?: number;
  detail?: string;
  credits?: number;
}

async function pingService(
  name: string,
  fn: () => Promise<{ detail?: string; credits?: number }>,
): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    const result = await fn();
    return { ok: true, latencyMs: Date.now() - start, ...result };
  } catch (err) {
    return {
      ok: false,
      latencyMs: Date.now() - start,
      detail: err instanceof Error ? err.message : `${name} unreachable`,
    };
  }
}

export async function GET(req: NextRequest) {
  // ── Determine auth level ────────────────────────────────────────
  const adminSecret = process.env.ADMIN_SECRET;
  const authHeader = req.headers.get('authorization');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const queryToken = req.nextUrl.searchParams.get('token');
  const cookieToken = req.cookies.get('admin_token')?.value;

  const isAuthenticated = adminSecret && (
    bearerToken === adminSecret ||
    queryToken === adminSecret ||
    cookieToken === adminSecret
  );

  const wantDetail = req.nextUrl.searchParams.get('detail') === 'true';

  // ── Public health check (no auth required) ──────────────────────
  if (!wantDetail || !isAuthenticated) {
    return NextResponse.json({
      ok: true,
      data: {
        status: 'operational',
        timestamp: new Date().toISOString(),
        donkVersion: '1.0.0',
      },
    }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  // ── Authenticated: full provider diagnostics ────────────────────
  const [openai, elevenlabs, telnyx, cloudflare] = await Promise.all([
    // ── OpenAI: list models (lightweight) ─────────────────────────
    pingService('openai', async () => {
      const key = process.env.OPENAI_API_KEY;
      if (!key) throw new Error('OPENAI_API_KEY not set');
      const res = await fetch('https://api.openai.com/v1/models?limit=1', {
        headers: { Authorization: `Bearer ${key}` },
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return { detail: 'GPT-4o available' };
    }),

    // ── ElevenLabs: user info + credits ───────────────────────────
    pingService('elevenlabs', async () => {
      const key = process.env.ELEVENLABS_API_KEY;
      if (!key) throw new Error('ELEVENLABS_API_KEY not set');
      const res = await fetch('https://api.elevenlabs.io/v1/user', {
        headers: { 'xi-api-key': key },
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as {
        subscription?: { character_count?: number; character_limit?: number };
      };
      return {
        detail: `${data.subscription?.character_limit?.toLocaleString() ?? '?'} char limit`,
        credits: data.subscription?.character_count,
      };
    }),

    // ── Telnyx: messaging profiles (lightweight) ──────────────────
    pingService('telnyx', async () => {
      const key = process.env.TELNYX_API_KEY;
      if (!key) throw new Error('TELNYX_API_KEY not set');
      const res = await fetch('https://api.telnyx.com/v2/messaging_profiles?page[size]=1', {
        headers: { Authorization: `Bearer ${key}`, Accept: 'application/json' },
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return { detail: `From: ${process.env.TELNYX_FROM_NUMBER ?? 'not set'}` };
    }),

    // ── Cloudflare: token verify ──────────────────────────────────
    pingService('cloudflare', async () => {
      const token = process.env.CLOUDFLARE_API_TOKEN;
      if (!token) throw new Error('CLOUDFLARE_API_TOKEN not set');
      const res = await fetch('https://api.cloudflare.com/client/v4/user/tokens/verify', {
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { result?: { status?: string } };
      return { detail: data.result?.status ?? 'verified' };
    }),
  ]);

  const envChecks = {
    OPENAI_API_KEY:               { set: !!process.env.OPENAI_API_KEY,               required: true  },
    ELEVENLABS_API_KEY:           { set: !!process.env.ELEVENLABS_API_KEY,           required: true  },
    TELNYX_API_KEY:               { set: !!process.env.TELNYX_API_KEY,               required: true  },
    TELNYX_FROM_NUMBER:           { set: !!process.env.TELNYX_FROM_NUMBER,           required: true  },
    CLOUDFLARE_API_TOKEN:         { set: !!process.env.CLOUDFLARE_API_TOKEN,         required: true  },
    CLOUDFLARE_ACCOUNT_ID:        { set: !!process.env.CLOUDFLARE_ACCOUNT_ID,        required: false },
    CLOUDFLARE_ZONE_ID:           { set: !!process.env.CLOUDFLARE_ZONE_ID,           required: false },
    TELNYX_MESSAGING_PROFILE_ID:  { set: !!process.env.TELNYX_MESSAGING_PROFILE_ID,  required: false },
  };

  return NextResponse.json({
    ok: true,
    data: {
      openai,
      elevenlabs,
      telnyx,
      cloudflare,
      envChecks,
      timestamp:   new Date().toISOString(),
      donkVersion: '1.0.0',
    },
  }, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
