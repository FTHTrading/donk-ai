import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateEnv } from '@/lib/env-validation';

beforeEach(() => {
  vi.unstubAllEnvs();
});

describe('validateEnv', () => {
  it('reports missing required vars', () => {
    // Clear all relevant vars
    vi.stubEnv('OPENAI_API_KEY', '');
    vi.stubEnv('ADMIN_SECRET', '');

    const result = validateEnv();
    expect(result.missing.length).toBeGreaterThan(0);
    expect(result.valid).toBe(false);
  });

  it('detects placeholder values', () => {
    vi.stubEnv('OPENAI_API_KEY', 'sk-proj-...');
    vi.stubEnv('ADMIN_SECRET', 'YOUR_SECRET_HERE');

    const result = validateEnv();
    expect(result.warnings.length).toBeGreaterThan(0);
  });
});

describe('env validation summary', () => {
  it('returns a summary record', () => {
    const result = validateEnv();
    expect(typeof result.summary).toBe('object');
    expect(Object.keys(result.summary).length).toBeGreaterThan(0);
  });
});
