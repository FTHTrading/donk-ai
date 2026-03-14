// ─────────────────────────────────────────────────────────────────────
//  POST /api/call — Initiate voice call via Telnyx
//  GET  /api/call — List available numbers
// ─────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server';
import { initiateCall, listAvailableNumbers } from '@/lib/telnyx';
import { isRateLimited, getIpKey } from '@/lib/rate-limit';
import { toE164 } from '@/lib/utils';
import type { CallRequest } from '@/types';

export async function GET(req: NextRequest) {
  const areaCode = new URL(req.url).searchParams.get('areaCode') ?? undefined;
  try {
    const numbers = await listAvailableNumbers(areaCode);
    return NextResponse.json({ ok: true, data: numbers });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to list numbers';
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Calls are limited to 3/min per IP
  if (isRateLimited(getIpKey(req.headers, 'call'), { maxRequests: 3, windowMs: 60_000 })) {
    return NextResponse.json({ ok: false, error: 'Rate limit exceeded' }, { status: 429 });
  }

  let body: CallRequest;
  try {
    body = await req.json() as CallRequest;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.to) {
    return NextResponse.json({ ok: false, error: '`to` field is required' }, { status: 400 });
  }

  const to = toE164(body.to);
  if (!/^\+[1-9]\d{6,14}$/.test(to)) {
    return NextResponse.json({ ok: false, error: 'Invalid phone number format' }, { status: 400 });
  }

  try {
    const result = await initiateCall({ ...body, to });
    return NextResponse.json({ ok: true, data: result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Call failed';
    console.error('[api/call]', msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
