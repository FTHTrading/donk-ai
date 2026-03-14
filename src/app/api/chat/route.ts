// ─────────────────────────────────────────────────────────────────────
//  POST /api/chat — OpenAI GPT-4o streaming chat
//  Optionally generates ElevenLabs TTS audio for the response
// ─────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server';
import { openai, DONK_SYSTEM_PROMPT, DEFAULT_CHAT_MODEL, FALLBACK_CHAT_MODEL } from '@/lib/openai';
import { textToSpeech } from '@/lib/elevenlabs';
import { isRateLimited, getIpKey } from '@/lib/rate-limit';
import { truncateForTTS, stripMarkdown, nanoid } from '@/lib/utils';
import type { ChatRequest } from '@/types';

const MAX_RPM = parseInt(process.env.RATE_LIMIT_CHAT_RPM ?? '20', 10);

export async function POST(req: NextRequest) {
  // Rate limit per IP
  if (isRateLimited(getIpKey(req.headers, 'chat'), { maxRequests: MAX_RPM, windowMs: 60_000 })) {
    return NextResponse.json({ ok: false, error: 'Rate limit exceeded. Please wait a moment.' }, { status: 429 });
  }

  let body: ChatRequest;
  try {
    body = await req.json() as ChatRequest;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
    return NextResponse.json({ ok: false, error: 'messages array is required' }, { status: 400 });
  }

  try {
    const model = body.model ?? DEFAULT_CHAT_MODEL;

    // ── Build message array ────────────────────────────────────────────
    const messages = [
      { role: 'system' as const, content: DONK_SYSTEM_PROMPT },
      ...body.messages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ];

    // ── Call OpenAI ────────────────────────────────────────────────────
    let completion;
    try {
      completion = await openai.chat.completions.create({
        model,
        messages,
        max_tokens: 1500,
        temperature: 0.7,
      });
    } catch {
      // Fallback to mini model on rate limit / model error
      completion = await openai.chat.completions.create({
        model: FALLBACK_CHAT_MODEL,
        messages,
        max_tokens: 1500,
        temperature: 0.7,
      });
    }

    const content = completion.choices[0]?.message?.content ?? '(no response)';
    const responseId = nanoid();

    // ── Optional: Generate voice audio ─────────────────────────────────
    let audioBase64: string | undefined;

    if (body.voice) {
      try {
        const ttsText = truncateForTTS(stripMarkdown(content), 1800);
        const audioBuffer = await textToSpeech({
          text: ttsText,
          voiceId: body.voiceId,
        });
        audioBase64 = Buffer.from(audioBuffer).toString('base64');
      } catch (ttsErr) {
        console.error('[chat/tts] ElevenLabs error:', ttsErr);
        // TTS failure is non-fatal — return text-only
      }
    }

    return NextResponse.json({
      ok: true,
      data: {
        id: responseId,
        content,
        ...(audioBase64 && { audioUrl: `data:audio/mpeg;base64,${audioBase64}` }),
      },
    });

  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[api/chat]', msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
