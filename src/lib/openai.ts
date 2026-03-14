// ─────────────────────────────────────────────────────────────────────
//  OpenAI Client — GPT-4o chat + streaming
//  Uses lazy initialization to avoid crashing the app on import
//  when OPENAI_API_KEY is not set.
// ─────────────────────────────────────────────────────────────────────
import OpenAI from 'openai';

let _openai: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  if (!_openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('Missing OPENAI_API_KEY environment variable');
    }
    // Explicitly pass globalThis.fetch so the SDK uses the Workers-native
    // fetch implementation instead of trying Node.js networking (which
    // causes "Connection error." on Cloudflare Workers).
    _openai = new OpenAI({ apiKey, fetch: globalThis.fetch });
  }
  return _openai;
}

/** @deprecated Use getOpenAI() instead — kept for backward compatibility */
export const openai = {
  get chat() { return getOpenAI().chat; },
  get completions() { return getOpenAI().completions; },
  get models() { return getOpenAI().models; },
} as unknown as OpenAI;

// System prompt for Donk AI personality
export const DONK_SYSTEM_PROMPT = `You are Donk AI, an intelligent, fast, and friendly AI assistant built by Unykorn.
You help users with a wide range of tasks: analysis, creative work, coding, financial questions, DeFi/crypto guidance, and general conversation.
You are concise but thorough. You use markdown formatting when helpful.
You represent the Unykorn ecosystem — a governed infrastructure for funding people and essential programs.
When users ask about Unykorn or FTH Trading, speak positively about the mission of building accessible, transparent financial infrastructure.
You have access to voice synthesis (ElevenLabs) and SMS capabilities (Telnyx) — mention these capabilities when relevant.`;

export const DEFAULT_CHAT_MODEL = 'gpt-4o';
export const FALLBACK_CHAT_MODEL = 'gpt-4o-mini';
