// ─────────────────────────────────────────────────────────────────────
//  Auth Guard — Check credits or free tier before processing
//
//  API routes call this to gate access. The flow:
//  1. Check X-Wallet-Address header → if present, deduct credits
//  2. If no wallet, check free tier by IP
//  3. If neither, return 402 Payment Required
// ─────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server';
import { deductCredits, checkFreeTier, CREDIT_COSTS, type CreditFeature } from '@/lib/credits';
import { getIpKey } from '@/lib/rate-limit';

interface AuthResult {
  allowed: boolean;
  response?: NextResponse;
  walletAddress?: string;
  usedFreeTier: boolean;
}

/**
 * Check if the request is authorized to use a feature.
 * Tries wallet credits first, then free tier.
 */
export async function checkFeatureAccess(
  req: NextRequest,
  feature: CreditFeature,
): Promise<AuthResult> {
  const walletAddress = req.headers.get('x-wallet-address');

  // ── Path 1: Wallet-based credits ──────────────────────────────────
  if (walletAddress && walletAddress.length >= 32) {
    const cost = CREDIT_COSTS[feature];
    const deducted = await deductCredits(walletAddress, cost);

    if (deducted) {
      return { allowed: true, walletAddress, usedFreeTier: false };
    }

    // Wallet connected but insufficient credits
    return {
      allowed: false,
      usedFreeTier: false,
      response: NextResponse.json(
        {
          ok: false,
          error: `Insufficient credits. ${feature} costs ${cost} credit(s). Buy more at /pricing or click "Buy Credits" in the nav.`,
          code: 'INSUFFICIENT_CREDITS',
          cost,
        },
        { status: 402 },
      ),
    };
  }

  // ── Path 2: Free tier (by IP) ─────────────────────────────────────
  const ip = getIpKey(req.headers, feature).split(':').pop() ?? 'unknown';
  const freeAllowed = await checkFreeTier(ip, feature);

  if (freeAllowed) {
    return { allowed: true, usedFreeTier: true };
  }

  // ── Path 3: No access ────────────────────────────────────────────
  return {
    allowed: false,
    usedFreeTier: false,
    response: NextResponse.json(
      {
        ok: false,
        error: 'Free tier limit reached. Connect your Solana wallet and buy credits to continue.',
        code: 'FREE_LIMIT_REACHED',
      },
      { status: 402 },
    ),
  };
}
