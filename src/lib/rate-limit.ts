// ─────────────────────────────────────────────────────────────────────
//  Production Rate Limiter — Upstash Redis + In-Memory Fallback
//
//  Uses Upstash Redis for distributed rate limiting in production.
//  Falls back to in-memory sliding window when UPSTASH_REDIS_REST_URL
//  is not configured (local dev / CI).
// ─────────────────────────────────────────────────────────────────────
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// ── Types ─────────────────────────────────────────────────────────────

interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
}

// ── In-Memory Fallback (dev/CI only) ──────────────────────────────────

interface Window {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, Window>();

function isMemoryLimited(key: string, opts: RateLimitOptions): boolean {
  const now = Date.now();
  const window = memoryStore.get(key);

  if (!window || now > window.resetAt) {
    memoryStore.set(key, { count: 1, resetAt: now + opts.windowMs });
    return false;
  }

  window.count += 1;
  return window.count > opts.maxRequests;
}

// ── Upstash Redis Setup ───────────────────────────────────────────────

let _redis: Redis | null = null;
const _limiters = new Map<string, Ratelimit>();

function getRedis(): Redis | null {
  if (_redis) return _redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  _redis = new Redis({ url, token });
  return _redis;
}

function getUpstashLimiter(prefix: string, opts: RateLimitOptions): Ratelimit | null {
  const redis = getRedis();
  if (!redis) return null;

  const cacheKey = `${prefix}:${opts.maxRequests}:${opts.windowMs}`;
  let limiter = _limiters.get(cacheKey);
  if (!limiter) {
    const windowSec = Math.max(1, Math.ceil(opts.windowMs / 1000));
    const duration = `${windowSec} s` as Parameters<typeof Ratelimit.slidingWindow>[1];
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(opts.maxRequests, duration),
      prefix: `rl:${prefix}`,
      analytics: false,
    });
    _limiters.set(cacheKey, limiter);
  }
  return limiter;
}

// ── Public API ────────────────────────────────────────────────────────

/**
 * Returns true if the key is over limit (should be blocked).
 * Uses Upstash Redis in production, falls back to in-memory in dev.
 */
export async function isRateLimited(
  key: string,
  opts: RateLimitOptions,
): Promise<boolean> {
  const prefix = key.split(':')[0] || 'default';
  const upstash = getUpstashLimiter(prefix, opts);

  if (upstash) {
    try {
      const { success } = await upstash.limit(key);
      return !success;
    } catch (err) {
      console.warn('[rate-limit] Upstash error, falling back to memory:', err);
    }
  }

  return isMemoryLimited(key, opts);
}

/**
 * Synchronous version — in-memory only.
 * Use async isRateLimited() for production.
 * @deprecated Prefer async isRateLimited()
 */
export function isRateLimitedSync(key: string, opts: RateLimitOptions): boolean {
  return isMemoryLimited(key, opts);
}

export function getIpKey(headers: Headers, prefix = 'ip'): string {
  const ip =
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headers.get('x-real-ip') ??
    'unknown';
  return `${prefix}:${ip}`;
}

/** Clean up expired in-memory windows (dev only) */
export function purgeExpired(): void {
  const now = Date.now();
  for (const [key, window] of memoryStore.entries()) {
    if (now > window.resetAt) memoryStore.delete(key);
  }
}

/** Check whether Upstash Redis is configured */
export function isDistributedRateLimitEnabled(): boolean {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}
