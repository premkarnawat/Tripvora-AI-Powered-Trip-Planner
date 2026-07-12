import { NextResponse } from 'next/server';

// Generic fallback rate limiter that mimics a token bucket
// In a full production env, this connects to Upstash Redis
const rateLimits = new Map<string, { count: number; resetAt: number }>();

export interface RateLimitConfig {
  limit: number;
  windowSeconds: number;
}

export async function checkRateLimit(ip: string, endpoint: string, config: RateLimitConfig): Promise<{ success: boolean; headers: Headers }> {
  const now = Date.now();
  const windowSeconds = config.windowSeconds;
  const currentWindow = Math.floor(now / (windowSeconds * 1000));
  const key = `ratelimit:${ip}:${endpoint}:${currentWindow}`;

  let count = 0;
  let resetAt = (currentWindow + 1) * windowSeconds * 1000;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    try {
      // Use Upstash Redis Pipeline REST API
      const pipeline = [
        ["INCR", key],
        ["EXPIRE", key, windowSeconds + 10]
      ];

      const res = await fetch(`${url}/pipeline`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pipeline)
      });

      if (res.ok) {
        const data = await res.json();
        count = data[0].result;
      } else {
        throw new Error('Upstash REST API failed');
      }
    } catch (err) {
      console.error('Rate Limiter Redis Error:', err);
      // Fallback to in-memory if Redis fails
      count = getInMemoryCount(key, windowSeconds, now);
    }
  } else {
    // In-memory fallback if env vars missing
    count = getInMemoryCount(key, windowSeconds, now);
  }

  const remaining = Math.max(0, config.limit - count);
  const success = count <= config.limit;

  const headers = new Headers({
    'X-RateLimit-Limit': config.limit.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': resetAt.toString(),
  });

  return { success, headers };
}

function getInMemoryCount(key: string, windowSeconds: number, now: number): number {
  const windowMs = windowSeconds * 1000;
  let record = rateLimits.get(key);

  if (!record || record.resetAt < now) {
    record = { count: 1, resetAt: now + windowMs };
    rateLimits.set(key, record);
  } else {
    record.count++;
  }
  return record.count;
}

export function rateLimitResponse(headers: Headers) {
  return new NextResponse(
    JSON.stringify({ error: 'Too Many Requests', message: 'Rate limit exceeded.' }),
    { status: 429, headers }
  );
}
