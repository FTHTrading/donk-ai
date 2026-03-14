// ─────────────────────────────────────────────────────────────────────
//  Donk AI — Shared TypeScript Types
// ─────────────────────────────────────────────────────────────────────

// ── Chat ─────────────────────────────────────────────────────────────

export type MessageRole = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  /** ElevenLabs audio data URL if voice was requested */
  audioUrl?: string;
}

export interface ChatRequest {
  messages: Pick<ChatMessage, 'role' | 'content'>[];
  voice?: boolean;
  voiceId?: string;
  model?: string;
}

export interface ChatResponse {
  id: string;
  content: string;
  audioUrl?: string;
}

// ── Voice / TTS ───────────────────────────────────────────────────────

export interface Voice {
  voice_id: string;
  name: string;
  category?: string;
  preview_url?: string;
  labels?: Record<string, string>;
}

export interface TTSRequest {
  text: string;
  voiceId?: string;
  stability?: number;
  similarityBoost?: number;
  style?: number;
}

// ── SMS / Telnyx ──────────────────────────────────────────────────────

export interface SMSRequest {
  to: string;
  message: string;
  mediaUrl?: string;
}

export interface SMSResponse {
  id: string;
  to: string;
  status: string;
  sentAt: string;
}

export interface CallRequest {
  to: string;
  message?: string;
  webhookUrl?: string;
}

export interface CallResponse {
  callId: string;
  to: string;
  status: string;
}

// ── Cloudflare ───────────────────────────────────────────────────────

export interface CloudflareZone {
  id: string;
  name: string;
  status: string;
  plan: { name: string };
}

export interface CloudflareDNSRecord {
  id: string;
  type: string;
  name: string;
  content: string;
  proxied: boolean;
  ttl: number;
}

// ── API Response Wrappers ─────────────────────────────────────────────

export interface ApiSuccess<T> {
  ok: true;
  data: T;
}

export interface ApiError {
  ok: false;
  error: string;
  code?: string;
}

export type ApiResult<T> = ApiSuccess<T> | ApiError;
