// ─────────────────────────────────────────────────────────────────────
//  Solana RPC Verification — Raw fetch, no SDK (CF Workers compatible)
//
//  Verifies SOL transfers on-chain without importing @solana/web3.js
//  on the server side. Uses Solana JSON-RPC directly.
// ─────────────────────────────────────────────────────────────────────

const LAMPORTS_PER_SOL = 1_000_000_000;

function getRpcUrl(): string {
  return (
    process.env.SOLANA_RPC_URL ??
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL ??
    'https://api.mainnet-beta.solana.com'
  );
}

interface TransactionMeta {
  preBalances: number[];
  postBalances: number[];
  err: unknown;
}

interface TransactionMessage {
  accountKeys: string[];
}

interface TransactionResult {
  meta: TransactionMeta;
  transaction: {
    message: TransactionMessage;
  };
  blockTime: number;
}

/**
 * Verify a SOL transfer transaction on-chain.
 *
 * Checks:
 * 1. Transaction exists and succeeded (no error)
 * 2. Treasury wallet received the expected SOL amount (± 0.001 tolerance)
 * 3. Transaction is not older than 1 hour
 *
 * @returns The sender's wallet address if valid, null if invalid.
 */
export async function verifySOLTransfer(
  signature: string,
  treasuryWallet: string,
  expectedSOL: number,
): Promise<{ valid: boolean; sender: string | null; amount: number }> {
  try {
    const res = await fetch(getRpcUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getTransaction',
        params: [
          signature,
          {
            encoding: 'json',
            maxSupportedTransactionVersion: 0,
            commitment: 'confirmed',
          },
        ],
      }),
    });

    const json = await res.json() as { result: TransactionResult | null; error?: { message: string } };

    if (json.error) {
      console.error('[solana-rpc] RPC error:', json.error.message);
      return { valid: false, sender: null, amount: 0 };
    }

    if (!json.result) {
      return { valid: false, sender: null, amount: 0 };
    }

    const { meta, transaction, blockTime } = json.result;

    // Check transaction didn't fail
    if (meta.err) {
      return { valid: false, sender: null, amount: 0 };
    }

    // Check transaction age (must be within last 1 hour)
    const txAge = Date.now() / 1000 - blockTime;
    if (txAge > 3600) {
      return { valid: false, sender: null, amount: 0 };
    }

    const accountKeys = transaction.message.accountKeys;
    const treasuryIndex = accountKeys.indexOf(treasuryWallet);

    if (treasuryIndex === -1) {
      return { valid: false, sender: null, amount: 0 };
    }

    // Calculate how much SOL the treasury received
    const preBalance = meta.preBalances[treasuryIndex];
    const postBalance = meta.postBalances[treasuryIndex];
    const receivedLamports = postBalance - preBalance;
    const receivedSOL = receivedLamports / LAMPORTS_PER_SOL;

    // Tolerance: allow ±0.001 SOL for rounding
    const expectedLamports = expectedSOL * LAMPORTS_PER_SOL;
    const toleranceLamports = 0.001 * LAMPORTS_PER_SOL;
    const valid = Math.abs(receivedLamports - expectedLamports) <= toleranceLamports;

    // Sender is the first account (fee payer)
    const sender = accountKeys[0] ?? null;

    return { valid, sender, amount: receivedSOL };
  } catch (err) {
    console.error('[solana-rpc] Verification failed:', err);
    return { valid: false, sender: null, amount: 0 };
  }
}

/**
 * Get the current SOL balance of a wallet address.
 */
export async function getSOLBalance(wallet: string): Promise<number> {
  try {
    const res = await fetch(getRpcUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getBalance',
        params: [wallet, { commitment: 'confirmed' }],
      }),
    });

    const json = await res.json() as { result: { value: number } };
    return json.result.value / LAMPORTS_PER_SOL;
  } catch {
    return 0;
  }
}
