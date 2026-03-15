// ─────────────────────────────────────────────────────────────────────
//  Credit System — SOL-gated usage tracking via Upstash Redis
//
//  Pricing:
//    1 credit = 0.01 SOL
//    Chat:  1 credit   (0.01 SOL)
//    Voice: 5 credits  (0.05 SOL)
//    SMS:  10 credits  (0.10 SOL)
//    Call: 15 credits  (0.15 SOL)
//
//  Credit Packs:
//    10 credits  → 0.1  SOL
//    50 credits  → 0.4  SOL  (20% savings)
//    200 credits → 1.5  SOL  (25% savings)
// ─────────────────────────────────────────────────────────────────────
import { Redis } from '@upstash/redis';

// ── Credit costs per feature ──────────────────────────────────────────

export const CREDIT_COSTS = {
  chat:  1,
  voice: 5,
  sms:   10,
  call:  15,
} as const;

export type CreditFeature = keyof typeof CREDIT_COSTS;

// ── Credit packs for purchase ─────────────────────────────────────────

export interface CreditPack {
  id: string;
  credits: number;
  solCost: number;
  label: string;
  savings?: string;
  popular?: boolean;
}

export const CREDIT_PACKS: CreditPack[] = [
  { id: 'starter',  credits: 10,  solCost: 0.1, label: 'Starter',    },
  { id: 'pro',      credits: 50,  solCost: 0.4, label: 'Pro',        savings: '20% off', popular: true },
  { id: 'whale',    credits: 200, solCost: 1.5, label: 'Whale',      savings: '25% off' },
];

// ── Free tier limits (per IP per day) ─────────────────────────────────

export const FREE_TIER = {
  chat:  5,   // 5 free chats per day
  voice: 1,   // 1 free voice gen per day
  sms:   0,   // no free SMS
  call:  0,   // no free calls
} as const;

// ── Redis client (reuse existing Upstash config) ──────────────────────

let _redis: Redis | null = null;

function getRedis(): Redis | null {
  if (_redis) return _redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  _redis = new Redis({ url, token });
  return _redis;
}

// ── Credit Operations ─────────────────────────────────────────────────

const CREDIT_KEY = (wallet: string) => `credits:${wallet.toLowerCase()}`;
const TX_KEY = (sig: string) => `tx:${sig}`;

/**
 * Get credit balance for a wallet address.
 */
export async function getCredits(wallet: string): Promise<number> {
  const redis = getRedis();
  if (!redis) return 0;
  const val = await redis.get<number>(CREDIT_KEY(wallet));
  return val ?? 0;
}

/**
 * Add credits to a wallet. Returns new balance.
 */
export async function addCredits(wallet: string, amount: number): Promise<number> {
  const redis = getRedis();
  if (!redis) throw new Error('Redis not configured');
  const newBalance = await redis.incrby(CREDIT_KEY(wallet), amount);
  return newBalance;
}

/**
 * Deduct credits from a wallet. Returns false if insufficient credits.
 */
export async function deductCredits(wallet: string, amount: number): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return false;

  // Atomic check-and-deduct via Lua script
  const script = `
    local key = KEYS[1]
    local cost = tonumber(ARGV[1])
    local balance = tonumber(redis.call('GET', key) or '0')
    if balance >= cost then
      redis.call('DECRBY', key, cost)
      return 1
    end
    return 0
  `;

  const result = await redis.eval(script, [CREDIT_KEY(wallet)], [amount]);
  return result === 1;
}

/**
 * Check if a transaction signature has already been processed.
 */
export async function isTransactionProcessed(signature: string): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return false;
  const exists = await redis.exists(TX_KEY(signature));
  return exists === 1;
}

/**
 * Mark a transaction signature as processed (with 30-day TTL).
 */
export async function markTransactionProcessed(
  signature: string,
  wallet: string,
  credits: number,
): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  await redis.set(TX_KEY(signature), JSON.stringify({ wallet, credits, at: Date.now() }), {
    ex: 60 * 60 * 24 * 30, // 30 days
  });
}

// ── Free Tier Tracking ────────────────────────────────────────────────

const FREE_KEY = (ip: string, feature: string) => {
  const day = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return `free:${feature}:${ip}:${day}`;
};

/**
 * Check and increment free-tier usage. Returns true if still within limits.
 */
export async function checkFreeTier(
  ip: string,
  feature: CreditFeature,
): Promise<boolean> {
  const limit = FREE_TIER[feature];
  if (limit <= 0) return false;

  const redis = getRedis();
  if (!redis) {
    // No Redis = dev mode, allow free usage
    return true;
  }

  const key = FREE_KEY(ip, feature);
  const count = await redis.incr(key);

  // Set expiry on first use (24h)
  if (count === 1) {
    await redis.expire(key, 60 * 60 * 24);
  }

  return count <= limit;
}

/**
 * Get remaining free-tier uses for a feature.
 */
export async function getFreeTierRemaining(
  ip: string,
  feature: CreditFeature,
): Promise<number> {
  const limit = FREE_TIER[feature];
  if (limit <= 0) return 0;

  const redis = getRedis();
  if (!redis) return limit;

  const key = FREE_KEY(ip, feature);
  const used = await redis.get<number>(key) ?? 0;
  return Math.max(0, limit - used);
}

/**
 * Treasury wallet that receives SOL payments.
 */
export const TREASURY_WALLET = process.env.NEXT_PUBLIC_TREASURY_WALLET ?? '2TQj18rWG3hMmJFT2YDdQMkNyPh7F6UxUYQFQEgZCm1N';
