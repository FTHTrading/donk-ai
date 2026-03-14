// ─────────────────────────────────────────────────────────────────────
//  POST /api/sms — Send SMS via Telnyx
// ─────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server';
import { sendSMS } from '@/lib/telnyx';
import { isRateLimited, getIpKey } from '@/lib/rate-limit';
import { toE164 } from '@/lib/utils';
import type { SMSRequest } from '@/types';

const MAX_RPM = parseInt(process.env.RATE_LIMIT_SMS_RPM ?? '5', 10);

export async function POST(req: NextRequest) {
  if (isRateLimited(getIpKey(req.headers, 'sms'), { maxRequests: MAX_RPM, windowMs: 60_000 })) {
    return NextResponse.json({ ok: false, error: 'Rate limit exceeded' }, { status: 429 });
  }

  let body: SMSRequest;
  try {
    body = await req.json() as SMSRequest;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.to || !body.message) {
    return NextResponse.json({ ok: false, error: '`to` and `message` fields are required' }, { status: 400 });
  }

  // Validate phone format
  const to = toE164(body.to);
  if (!/^\+[1-9]\d{6,14}$/.test(to)) {
    return NextResponse.json({ ok: false, error: 'Invalid phone number format' }, { status: 400 });
  }

  // Message length guard
  if (body.message.length > 1600) {
    return NextResponse.json({ ok: false, error: 'Message too long (max 1600 chars)' }, { status: 400 });
  }

  try {
    const result = await sendSMS({ ...body, to });
    return NextResponse.json({ ok: true, data: result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'SMS send failed';
    console.error('[api/sms]', msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
