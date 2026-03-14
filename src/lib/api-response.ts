// ─────────────────────────────────────────────────────────────────────
//  Structured API Response Helpers
//
//  Consistent JSON shape for all API routes:
//  Success: { ok: true,  data: T }
//  Error:   { ok: false, error: string, code?: string }
// ─────────────────────────────────────────────────────────────────────
import { NextResponse } from 'next/server';

interface ApiErrorOptions {
  status?: number;
  code?: string;
  headers?: Record<string, string>;
}

export function apiSuccess<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ ok: true, data }, { status });
}

export function apiError(message: string, opts: ApiErrorOptions = {}): NextResponse {
  const { status = 500, code, headers } = opts;
  return NextResponse.json(
    { ok: false, error: message, ...(code && { code }) },
    { status, headers },
  );
}

export function apiRateLimited(message = 'Rate limit exceeded. Please wait a moment.'): NextResponse {
  return apiError(message, { status: 429, code: 'RATE_LIMITED' });
}

export function apiBadRequest(message: string): NextResponse {
  return apiError(message, { status: 400, code: 'BAD_REQUEST' });
}

export function apiUnauthorized(message = 'Unauthorized'): NextResponse {
  return apiError(message, { status: 401, code: 'UNAUTHORIZED' });
}

export function apiServerError(err: unknown, context?: string): NextResponse {
  const message = err instanceof Error ? err.message : 'Unknown error';
  if (context) {
    console.error(`[${context}]`, message);
  }
  return apiError(message, { status: 500, code: 'INTERNAL_ERROR' });
}
