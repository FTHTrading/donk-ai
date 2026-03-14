// ─────────────────────────────────────────────────────────────────────
//  Cloudflare API Client — Workers, DNS, Pages, Analytics
// ─────────────────────────────────────────────────────────────────────
import type { CloudflareZone, CloudflareDNSRecord } from '@/types';

const BASE_URL = 'https://api.cloudflare.com/client/v4';

function getHeaders() {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  if (!token) throw new Error('Missing CLOUDFLARE_API_TOKEN environment variable');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

function getAccountId(): string {
  const id = process.env.CLOUDFLARE_ACCOUNT_ID;
  if (!id) throw new Error('Missing CLOUDFLARE_ACCOUNT_ID environment variable');
  return id;
}

function getZoneId(): string {
  const id = process.env.CLOUDFLARE_ZONE_ID;
  if (!id) throw new Error('Missing CLOUDFLARE_ZONE_ID environment variable');
  return id;
}

// ── Zones ─────────────────────────────────────────────────────────────

export async function listZones(): Promise<CloudflareZone[]> {
  const res = await fetch(`${BASE_URL}/zones`, { headers: getHeaders() });
  if (!res.ok) throw new Error(`Cloudflare zones error: ${res.status}`);
  const data = await res.json() as { result: CloudflareZone[] };
  return data.result;
}

export async function getZone(zoneId?: string): Promise<CloudflareZone> {
  const id = zoneId ?? getZoneId();
  const res = await fetch(`${BASE_URL}/zones/${id}`, { headers: getHeaders() });
  if (!res.ok) throw new Error(`Cloudflare zone error: ${res.status}`);
  const data = await res.json() as { result: CloudflareZone };
  return data.result;
}

// ── DNS Records ───────────────────────────────────────────────────────

export async function listDNSRecords(zoneId?: string): Promise<CloudflareDNSRecord[]> {
  const id = zoneId ?? getZoneId();
  const res = await fetch(`${BASE_URL}/zones/${id}/dns_records`, { headers: getHeaders() });
  if (!res.ok) throw new Error(`Cloudflare DNS error: ${res.status}`);
  const data = await res.json() as { result: CloudflareDNSRecord[] };
  return data.result;
}

export async function createDNSRecord(
  record: Omit<CloudflareDNSRecord, 'id'>,
  zoneId?: string
): Promise<CloudflareDNSRecord> {
  const id = zoneId ?? getZoneId();
  const res = await fetch(`${BASE_URL}/zones/${id}/dns_records`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(record),
  });
  if (!res.ok) throw new Error(`Cloudflare DNS create error: ${res.status}`);
  const data = await res.json() as { result: CloudflareDNSRecord };
  return data.result;
}

// ── Analytics ─────────────────────────────────────────────────────────

export async function getZoneAnalyticsSummary(since = '-10080') {
  const id = getZoneId();
  const res = await fetch(
    `${BASE_URL}/zones/${id}/analytics/dashboard?since=${since}`,
    { headers: getHeaders() }
  );
  if (!res.ok) throw new Error(`Cloudflare analytics error: ${res.status}`);
  const data = await res.json() as { result: { totals: Record<string, unknown> } };
  return data.result;
}

// ── Workers ───────────────────────────────────────────────────────────

export async function listWorkers() {
  const accountId = getAccountId();
  const res = await fetch(`${BASE_URL}/accounts/${accountId}/workers/scripts`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error(`Cloudflare workers error: ${res.status}`);
  const data = await res.json() as { result: { id: string; etag: string; created_on: string }[] };
  return data.result;
}

// ── Token verify ─────────────────────────────────────────────────────

export async function verifyToken(): Promise<{ id: string; status: string }> {
  const res = await fetch(`${BASE_URL}/user/tokens/verify`, { headers: getHeaders() });
  if (!res.ok) throw new Error(`Cloudflare token verify error: ${res.status}`);
  const data = await res.json() as { result: { id: string; status: string } };
  return data.result;
}
