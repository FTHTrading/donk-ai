// ─────────────────────────────────────────────────────────────────────
//  ElevenLabs Client — Text-to-Speech + Voice Management
// ─────────────────────────────────────────────────────────────────────
import type { TTSRequest, Voice } from '@/types';

const BASE_URL = 'https://api.elevenlabs.io/v1';

function getKey(): string {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Error('Missing ELEVENLABS_API_KEY environment variable');
  return key;
}

// ── Voice List ────────────────────────────────────────────────────────

export async function getVoices(): Promise<Voice[]> {
  const res = await fetch(`${BASE_URL}/voices`, {
    headers: { 'xi-api-key': getKey() },
    next: { revalidate: 300 }, // cache voice list for 5 min
  });
  if (!res.ok) throw new Error(`ElevenLabs voices error: ${res.status}`);
  const data = await res.json() as { voices: Voice[] };
  return data.voices;
}

// ── Text to Speech ────────────────────────────────────────────────────

export async function textToSpeech(req: TTSRequest): Promise<ArrayBuffer> {
  const voiceId = req.voiceId ?? process.env.ELEVENLABS_DEFAULT_VOICE_ID ?? '21m00Tcm4TlvDq8ikWAM';

  const res = await fetch(`${BASE_URL}/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': getKey(),
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg',
    },
    body: JSON.stringify({
      text: req.text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability:        req.stability        ?? 0.5,
        similarity_boost: req.similarityBoost  ?? 0.75,
        style:            req.style            ?? 0.0,
        use_speaker_boost: true,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs TTS error ${res.status}: ${err}`);
  }

  return res.arrayBuffer();
}

// ── Voice Streaming (returns ReadableStream for streaming audio) ──────

export async function streamTextToSpeech(req: TTSRequest): Promise<ReadableStream<Uint8Array>> {
  const voiceId = req.voiceId ?? process.env.ELEVENLABS_DEFAULT_VOICE_ID ?? '21m00Tcm4TlvDq8ikWAM';

  const res = await fetch(`${BASE_URL}/text-to-speech/${voiceId}/stream`, {
    method: 'POST',
    headers: {
      'xi-api-key': getKey(),
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg',
    },
    body: JSON.stringify({
      text: req.text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability:        req.stability        ?? 0.5,
        similarity_boost: req.similarityBoost  ?? 0.75,
      },
    }),
  });

  if (!res.ok || !res.body) {
    throw new Error(`ElevenLabs stream error ${res.status}`);
  }

  return res.body;
}

// ── User Info / Credits ───────────────────────────────────────────────

export async function getUserInfo() {
  const res = await fetch(`${BASE_URL}/user`, {
    headers: { 'xi-api-key': getKey() },
  });
  if (!res.ok) throw new Error(`ElevenLabs user info error: ${res.status}`);
  return res.json();
}
