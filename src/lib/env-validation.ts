// ─────────────────────────────────────────────────────────────────────
//  Environment Validation — Donk AI
//
//  Validates all required and optional env vars at import time.
//  Surfaces human-readable errors in development; fails gracefully
//  in production by logging warnings.
// ─────────────────────────────────────────────────────────────────────

interface EnvVar {
  key: string;
  required: boolean;
  serverOnly?: boolean;
  description: string;
}

const ENV_SCHEMA: EnvVar[] = [
  // Required server secrets
  { key: 'OPENAI_API_KEY',               required: true,  serverOnly: true, description: 'OpenAI API key for GPT-4o chat' },
  { key: 'ELEVENLABS_API_KEY',           required: true,  serverOnly: true, description: 'ElevenLabs API key for TTS' },
  { key: 'TELNYX_API_KEY',               required: true,  serverOnly: true, description: 'Telnyx API key for SMS/Voice' },
  { key: 'TELNYX_FROM_NUMBER',           required: true,  serverOnly: true, description: 'Telnyx outbound phone number (E.164)' },
  { key: 'CLOUDFLARE_API_TOKEN',         required: true,  serverOnly: true, description: 'Cloudflare API token' },

  // Required for full functionality
  { key: 'TELNYX_CONNECTION_ID',         required: false, serverOnly: true, description: 'Telnyx connection ID for voice calls' },
  { key: 'TELNYX_MESSAGING_PROFILE_ID',  required: false, serverOnly: true, description: 'Telnyx messaging profile ID' },
  { key: 'CLOUDFLARE_ACCOUNT_ID',        required: false, serverOnly: true, description: 'Cloudflare account ID' },
  { key: 'CLOUDFLARE_ZONE_ID',           required: false, serverOnly: true, description: 'Cloudflare zone ID' },
  { key: 'ELEVENLABS_DEFAULT_VOICE_ID',  required: false, serverOnly: true, description: 'Default ElevenLabs voice ID' },
  { key: 'ADMIN_SECRET',                 required: false, serverOnly: true, description: 'Admin route access token' },

  // Upstash Redis (production rate limiting)
  { key: 'UPSTASH_REDIS_REST_URL',       required: false, serverOnly: true, description: 'Upstash Redis REST URL for distributed rate limiting' },
  { key: 'UPSTASH_REDIS_REST_TOKEN',     required: false, serverOnly: true, description: 'Upstash Redis REST token' },

  // Public config
  { key: 'NEXT_PUBLIC_APP_NAME',         required: false, description: 'App display name' },
  { key: 'NEXT_PUBLIC_APP_URL',          required: false, description: 'Production app URL' },
  { key: 'NEXT_PUBLIC_BRAND_PARENT',     required: false, description: 'Parent brand name' },
  { key: 'NEXT_PUBLIC_BRAND_URL',        required: false, description: 'Parent brand URL' },
];

export interface EnvValidationResult {
  valid: boolean;
  missing: string[];
  warnings: string[];
  summary: Record<string, { set: boolean; required: boolean; description: string }>;
}

/**
 * Validate all environment variables against the schema.
 * Returns a result object with missing vars and warnings.
 */
export function validateEnv(): EnvValidationResult {
  const missing: string[] = [];
  const warnings: string[] = [];
  const summary: EnvValidationResult['summary'] = {};

  for (const v of ENV_SCHEMA) {
    const value = process.env[v.key];
    const isSet = !!value && value.length > 0;

    summary[v.key] = { set: isSet, required: v.required, description: v.description };

    if (v.required && !isSet) {
      missing.push(v.key);
    }

    // Warn if a secret looks like a placeholder
    if (isSet && v.serverOnly) {
      if (value.includes('YOUR_') || value.includes('...') || value === 'sk-proj-...') {
        warnings.push(`${v.key} appears to contain a placeholder value`);
      }
    }

    // Check that server-only vars don't start with NEXT_PUBLIC_
    if (v.serverOnly && v.key.startsWith('NEXT_PUBLIC_')) {
      warnings.push(`${v.key} is marked server-only but uses NEXT_PUBLIC_ prefix — it WILL be exposed to the browser`);
    }
  }

  // Paired validation
  if (process.env.UPSTASH_REDIS_REST_URL && !process.env.UPSTASH_REDIS_REST_TOKEN) {
    warnings.push('UPSTASH_REDIS_REST_URL is set but UPSTASH_REDIS_REST_TOKEN is missing');
  }
  if (!process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    warnings.push('UPSTASH_REDIS_REST_TOKEN is set but UPSTASH_REDIS_REST_URL is missing');
  }

  return {
    valid: missing.length === 0,
    missing,
    warnings,
    summary,
  };
}

/**
 * Log env validation results to console.
 * Safe for server-side only — never logs actual secret values.
 */
export function logEnvValidation(): void {
  const result = validateEnv();
  const isDev = process.env.NODE_ENV === 'development';

  if (result.missing.length > 0) {
    const msg = `[env] Missing required variables: ${result.missing.join(', ')}`;
    if (isDev) {
      console.warn(`\n⚠️  ${msg}\n   Copy .env.example to .env.local and fill in values.\n`);
    } else {
      console.error(`[CRITICAL] ${msg}`);
    }
  }

  for (const w of result.warnings) {
    console.warn(`[env] ${w}`);
  }

  if (result.valid && isDev) {
    console.log('[env] All required environment variables are set ✓');
  }
}

/**
 * Admin-safe env summary — shows which vars are set without exposing values.
 */
export function getEnvHealthSummary(): EnvValidationResult {
  return validateEnv();
}
