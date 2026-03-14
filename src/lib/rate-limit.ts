// ─────────────────────────────────────────────────────────────────────
//  In-memory rate limiter — sliding window per IP
// ─────────────────────────────────────────────────────────────────────

interface Window {
  count: number;
  resetAt: number;
}

const store = new Map<string, Window>();

interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
}

/** Returns true if the key is over limit (should be blocked) */
export function isRateLimited(key: string, opts: RateLimitOptions): boolean {
  const now = Date.now();
  const window = store.get(key);

  if (!window || now > window.resetAt) {
    store.set(key, { count: 1, resetAt: now + opts.windowMs });
    return false;
  }

  window.count += 1;
  store.set(key, window);
  return window.count > opts.maxRequests;
}

export function getIpKey(headers: Headers, prefix = 'ip'): string {
  const ip =
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headers.get('x-real-ip') ??
    'unknown';
  return `${prefix}:${ip}`;
}

/** Clean up expired windows (call periodically if needed) */
export function purgeExpired(): void {
  const now = Date.now();
  for (const [key, window] of store.entries()) {
    if (now > window.resetAt) store.delete(key);
  }
}
