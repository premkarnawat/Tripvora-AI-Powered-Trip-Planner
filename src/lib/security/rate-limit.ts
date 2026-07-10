import { NextResponse } from 'next/server';

// Generic fallback rate limiter that mimics a token bucket
// In a full production env, this connects to Upstash Redis
const rateLimits = new Map<string, { count: number; resetAt: number }>();

export interface RateLimitConfig {
  limit: number;
  windowSeconds: number;
}

export function checkRateLimit(ip: string, endpoint: string, config: RateLimitConfig): { success: boolean; headers: Headers } {
  const key = `${ip}:${endpoint}`;
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;

  let record = rateLimits.get(key);

  if (!record || record.resetAt < now) {
    record = { count: 1, resetAt: now + windowMs };
    rateLimits.set(key, record);
  } else {
    record.count++;
  }

  const remaining = Math.max(0, config.limit - record.count);
  const success = record.count <= config.limit;

  const headers = new Headers({
    'X-RateLimit-Limit': config.limit.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': record.resetAt.toString(),
  });

  return { success, headers };
}

export function rateLimitResponse(headers: Headers) {
  return new NextResponse(
    JSON.stringify({ error: 'Too Many Requests', message: 'Rate limit exceeded.' }),
    { status: 429, headers }
  );
}
