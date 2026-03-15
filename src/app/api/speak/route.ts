// ─────────────────────────────────────────────────────────────────────
//  POST /api/speak — ElevenLabs TTS audio generation
// ─────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server';
import { textToSpeech } from '@/lib/elevenlabs';
import { isRateLimited, getIpKey } from '@/lib/rate-limit';
import { truncateForTTS, stripMarkdown } from '@/lib/utils';
import { checkFeatureAccess } from '@/lib/auth-guard';
import type { TTSRequest } from '@/types';

const MAX_RPM = parseInt(process.env.RATE_LIMIT_TTS_RPM ?? '10', 10);

export async function POST(req: NextRequest) {
  if (await isRateLimited(getIpKey(req.headers, 'tts'), { maxRequests: MAX_RPM, windowMs: 60_000 })) {
    return NextResponse.json({ ok: false, error: 'Rate limit exceeded' }, { status: 429 });
  }

  // Credit / free-tier check (voice = 5 credits)
  const auth = await checkFeatureAccess(req, 'voice');
  if (!auth.allowed) return auth.response!;

  let body: TTSRequest;
  try {
    body = await req.json() as TTSRequest;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.text || typeof body.text !== 'string') {
    return NextResponse.json({ ok: false, error: '`text` field is required' }, { status: 400 });
  }

  const cleanText = truncateForTTS(stripMarkdown(body.text), 2000);

  try {
    const audioBuffer = await textToSpeech({ ...body, text: cleanText });

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type':  'audio/mpeg',
        'Cache-Control': 'no-store',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'TTS failed';
    console.error('[api/speak]', msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
