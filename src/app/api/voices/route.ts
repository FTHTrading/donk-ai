// ─────────────────────────────────────────────────────────────────────
//  GET  /api/voices — List available ElevenLabs voices
// ─────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server';
import { getVoices, getUserInfo } from '@/lib/elevenlabs';

export async function GET(_req: NextRequest) {
  try {
    const [voices, userInfo] = await Promise.all([
      getVoices(),
      getUserInfo().catch(() => null),
    ]);

    return NextResponse.json({
      ok: true,
      data: {
        voices,
        credits: userInfo?.subscription?.character_count ?? null,
        creditsLimit: userInfo?.subscription?.character_limit ?? null,
      },
    }, {
      headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch voices';
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
