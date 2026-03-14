// ─────────────────────────────────────────────────────────────────────
//  Telnyx Client — SMS, Voice Calls, Number Management
// ─────────────────────────────────────────────────────────────────────
import type { SMSRequest, SMSResponse, CallRequest, CallResponse } from '@/types';

const BASE_URL = 'https://api.telnyx.com/v2';

function getHeaders() {
  const key = process.env.TELNYX_API_KEY;
  if (!key) throw new Error('Missing TELNYX_API_KEY environment variable');
  return {
    'Authorization': `Bearer ${key}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
}

function getFromNumber(): string {
  const num = process.env.TELNYX_FROM_NUMBER;
  if (!num) throw new Error('Missing TELNYX_FROM_NUMBER environment variable');
  return num;
}

// ── SMS ────────────────────────────────────────────────────────────────

export async function sendSMS(req: SMSRequest): Promise<SMSResponse> {
  const body: Record<string, unknown> = {
    from: getFromNumber(),
    to:   req.to,
    text: req.message,
  };

  const profileId = process.env.TELNYX_MESSAGING_PROFILE_ID;
  if (profileId) body.messaging_profile_id = profileId;
  if (req.mediaUrl) body.media_urls = [req.mediaUrl];

  const res = await fetch(`${BASE_URL}/messages`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ errors: [{ detail: res.statusText }] })) as { errors?: { detail: string }[] };
    const detail = err.errors?.[0]?.detail ?? 'Unknown error';
    throw new Error(`Telnyx SMS error ${res.status}: ${detail}`);
  }

  const data = await res.json() as { data: { id: string; to: { phone_number: string; status: string }[]; sent_at: string } };
  return {
    id:     data.data.id,
    to:     data.data.to[0]?.phone_number ?? req.to,
    status: data.data.to[0]?.status ?? 'sent',
    sentAt: data.data.sent_at,
  };
}

// ── Voice Calls ────────────────────────────────────────────────────────

export async function initiateCall(req: CallRequest): Promise<CallResponse> {
  const res = await fetch(`${BASE_URL}/calls`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      connection_id: process.env.TELNYX_CONNECTION_ID ?? '',
      to:            req.to,
      from:          getFromNumber(),
      webhook_url:   req.webhookUrl ?? `${process.env.NEXT_PUBLIC_APP_URL}/api/telnyx/webhook`,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { errors?: { detail: string }[] };
    const detail = err.errors?.[0]?.detail ?? 'Unknown error';
    throw new Error(`Telnyx call error ${res.status}: ${detail}`);
  }

  const data = await res.json() as { data: { call_session_id: string; to: string; state: string } };
  return {
    callId: data.data.call_session_id,
    to:     data.data.to,
    status: data.data.state,
  };
}

// ── Available Numbers ──────────────────────────────────────────────────

export async function listAvailableNumbers(areaCode?: string) {
  const params = new URLSearchParams({ country_code: 'US', limit: '10' });
  if (areaCode) params.set('area_code', areaCode);

  const res = await fetch(`${BASE_URL}/available_phone_numbers?${params.toString()}`, {
    headers: getHeaders(),
  });

  if (!res.ok) throw new Error(`Telnyx numbers error: ${res.status}`);

  const data = await res.json() as { data: { phone_number: string; monthly_cost: { amount: string } }[] };
  return data.data;
}

// ── Message Status ─────────────────────────────────────────────────────

export async function getMessageStatus(messageId: string) {
  const res = await fetch(`${BASE_URL}/messages/${messageId}`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error(`Telnyx message lookup error: ${res.status}`);
  return res.json();
}
