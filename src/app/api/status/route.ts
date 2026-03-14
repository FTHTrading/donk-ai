// ─────────────────────────────────────────────────────────────────────
//  GET  /api/status — Health check + API status
// ─────────────────────────────────────────────────────────────────────
import { NextResponse } from 'next/server';

export async function GET() {
  const checks = {
    openai:      !!process.env.OPENAI_API_KEY,
    elevenlabs:  !!process.env.ELEVENLABS_API_KEY,
    telnyx:      !!process.env.TELNYX_API_KEY,
    cloudflare:  !!process.env.CLOUDFLARE_API_TOKEN,
    telnyxFrom:  !!process.env.TELNYX_FROM_NUMBER,
  };

  const allGreen = Object.values(checks).every(Boolean);

  return NextResponse.json({
    ok:     allGreen,
    status: allGreen ? 'operational' : 'partial',
    checks,
    app:    process.env.NEXT_PUBLIC_APP_NAME ?? 'Donk AI',
    env:    process.env.NODE_ENV,
    ts:     new Date().toISOString(),
  }, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
