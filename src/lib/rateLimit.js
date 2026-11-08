/**
 * Small in-memory sliding-window rate limiter. Good enough for one Node process
 * (this app runs as a single server). Buckets live on globalThis so Next.js
 * hot reloads in dev don't reset them.
 */
const buckets = globalThis.__rwRateBuckets || (globalThis.__rwRateBuckets = new Map());

/**
 * Records a hit for `key` and reports whether it is over `max` hits in `windowMs`.
 * Returns { ok, retryAfter } where retryAfter is in seconds.
 */
export function hit(key, max, windowMs) {
  const now = Date.now();
  const recent = (buckets.get(key) || []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    buckets.set(key, recent);
    return { ok: false, retryAfter: Math.max(1, Math.ceil((recent[0] + windowMs - now) / 1000)) };
  }
  recent.push(now);
  buckets.set(key, recent);
  if (buckets.size > 20000) prune(now);
  return { ok: true, retryAfter: 0 };
}

function prune(now) {
  for (const [k, list] of buckets) {
    if (!list.length || now - list[list.length - 1] > 24 * 60 * 60 * 1000) buckets.delete(k);
  }
}

/** Best-effort client IP from proxy headers. */
export function clientIp(request) {
  return (
    (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'local'
  );
}
