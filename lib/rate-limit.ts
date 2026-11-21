// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
// Simple in-memory fixed-window rate limiter.
// For multiple servers, replace with Redis/Upstash so limits are shared.

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  if (buckets.size > 10_000) {
    for (const [k, b] of buckets) if (b.resetAt < now) buckets.delete(k);
  }
  const b = buckets.get(key);
  if (!b || b.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }
  b.count++;
  const ok = b.count <= limit;
  return { ok, remaining: Math.max(0, limit - b.count), retryAfter: ok ? 0 : Math.ceil((b.resetAt - now) / 1000) };
}

export function resetRateLimit(key: string) {
  buckets.delete(key);
}
