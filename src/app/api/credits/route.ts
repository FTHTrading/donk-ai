// ─────────────────────────────────────────────────────────────────────
//  GET  /api/credits?wallet=<address>  — Get credit balance
//  POST /api/credits                    — Verify TX + add credits
// ─────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server';
import {
  getCredits,
  addCredits,
  isTransactionProcessed,
  markTransactionProcessed,
  CREDIT_PACKS,
  TREASURY_WALLET,
} from '@/lib/credits';
import { verifySOLTransfer } from '@/lib/solana-rpc';
import { isRateLimited, getIpKey } from '@/lib/rate-limit';

// GET — Check credit balance
export async function GET(req: NextRequest) {
  const wallet = new URL(req.url).searchParams.get('wallet');
  if (!wallet || wallet.length < 32) {
    return NextResponse.json({ ok: false, error: 'Invalid wallet address' }, { status: 400 });
  }

  const credits = await getCredits(wallet);
  return NextResponse.json({ ok: true, data: { wallet, credits } });
}

// POST — Verify payment + grant credits
export async function POST(req: NextRequest) {
  // Rate limit: 10 verifications per minute per IP
  if (await isRateLimited(getIpKey(req.headers, 'credits'), { maxRequests: 10, windowMs: 60_000 })) {
    return NextResponse.json({ ok: false, error: 'Rate limit exceeded' }, { status: 429 });
  }

  let body: { signature: string; packId: string; wallet: string };
  try {
    body = await req.json() as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const { signature, packId, wallet } = body;

  // Validate inputs
  if (!signature || typeof signature !== 'string' || signature.length < 60) {
    return NextResponse.json({ ok: false, error: 'Invalid transaction signature' }, { status: 400 });
  }

  if (!wallet || typeof wallet !== 'string' || wallet.length < 32) {
    return NextResponse.json({ ok: false, error: 'Invalid wallet address' }, { status: 400 });
  }

  const pack = CREDIT_PACKS.find((p) => p.id === packId);
  if (!pack) {
    return NextResponse.json({ ok: false, error: 'Invalid credit pack' }, { status: 400 });
  }

  // Check if TX already processed (prevent double-credits)
  if (await isTransactionProcessed(signature)) {
    return NextResponse.json({ ok: false, error: 'Transaction already processed' }, { status: 409 });
  }

  // Verify on-chain
  const verification = await verifySOLTransfer(signature, TREASURY_WALLET, pack.solCost);

  if (!verification.valid) {
    return NextResponse.json(
      { ok: false, error: 'Transaction verification failed. Ensure you sent the correct amount to the treasury wallet.' },
      { status: 400 },
    );
  }

  // Verify sender matches claimed wallet
  if (verification.sender !== wallet) {
    return NextResponse.json(
      { ok: false, error: 'Transaction sender does not match your wallet' },
      { status: 400 },
    );
  }

  // Grant credits
  const newBalance = await addCredits(wallet, pack.credits);
  await markTransactionProcessed(signature, wallet, pack.credits);

  return NextResponse.json({
    ok: true,
    data: {
      wallet,
      credits: newBalance,
      added: pack.credits,
      pack: pack.label,
      signature,
    },
  });
}
