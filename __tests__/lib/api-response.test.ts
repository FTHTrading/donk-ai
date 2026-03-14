import { describe, it, expect } from 'vitest';
import { apiSuccess, apiError, apiRateLimited, apiBadRequest, apiUnauthorized, apiServerError } from '@/lib/api-response';

describe('apiSuccess', () => {
  it('returns ok:true with data', async () => {
    const response = apiSuccess({ message: 'hello' });
    const body = await response.json();
    expect(body.ok).toBe(true);
    expect(body.data.message).toBe('hello');
    expect(response.status).toBe(200);
  });

  it('supports custom status code', async () => {
    const response = apiSuccess({ id: 1 }, 201);
    expect(response.status).toBe(201);
  });
});

describe('apiError', () => {
  it('returns ok:false with error message and code', async () => {
    const response = apiError('Something broke', { status: 500, code: 'ERR_TEST' });
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.error).toBe('Something broke');
    expect(body.code).toBe('ERR_TEST');
    expect(response.status).toBe(500);
  });
});

describe('apiRateLimited', () => {
  it('returns 429', async () => {
    const response = apiRateLimited();
    expect(response.status).toBe(429);
    const body = await response.json();
    expect(body.ok).toBe(false);
  });
});

describe('apiBadRequest', () => {
  it('returns 400', async () => {
    const response = apiBadRequest('Missing field');
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Missing field');
  });
});

describe('apiUnauthorized', () => {
  it('returns 401', async () => {
    const response = apiUnauthorized();
    expect(response.status).toBe(401);
  });
});

describe('apiServerError', () => {
  it('returns 500 with generic message', async () => {
    const response = apiServerError(new Error('test error'));
    expect(response.status).toBe(500);
  });
});
