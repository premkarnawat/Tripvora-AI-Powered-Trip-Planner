import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// In-Memory Edge Rate Limiter (Token Bucket / Window Fallback for High Concurrency)
// In production with Upstash Redis, this swaps to @upstash/ratelimit
const rateLimitCache = new Map<string, { count: number; expires: number }>();

async function checkRateLimit(key: string, limit: number, windowMs: number): Promise<boolean> {
  const now = Date.now();
  let count = 0;
  
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    try {
      const windowSeconds = Math.floor(windowMs / 1000);
      const currentWindow = Math.floor(now / windowMs);
      const redisKey = `ratelimit_mw:${key}:${currentWindow}`;

      const pipeline = [
        ["INCR", redisKey],
        ["EXPIRE", redisKey, windowSeconds + 10]
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
        return count <= limit;
      }
    } catch (err) {
      console.error('Middleware Upstash Error:', err);
    }
  }

  // Fallback
  const record = rateLimitCache.get(key);
  if (!record || now > record.expires) {
    rateLimitCache.set(key, { count: 1, expires: now + windowMs });
    return true;
  }
  if (record.count >= limit) return false;
  record.count += 1;
  return true;
}

// Security headers applied to every response passing through middleware
const SECURITY_HEADERS: Record<string, string> = {
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self)',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
};

// Rate limit configurations: [pathPrefix, cacheKeyPrefix, limit, windowMs, retryAfterSec]
const RATE_LIMIT_RULES: Array<{
  match: (pathname: string) => boolean;
  prefix: string;
  limit: number;
  windowMs: number;
  retryAfter: string;
  message: string;
  methodFilter?: string;
}> = [
  {
    match: (p) => p.startsWith('/api/generate-trip'),
    prefix: 'ai',
    limit: 6,
    windowMs: 60 * 1000,
    retryAfter: '60',
    message: 'Rate limit exceeded: AI generation quota exhausted. Please try again in 60 seconds.',
  },
  {
    match: (p) => p.startsWith('/api/contact'),
    prefix: 'contact',
    limit: 10,
    windowMs: 60 * 60 * 1000,
    retryAfter: '3600',
    message: 'Rate limit exceeded: Too many inquiries. Please try again later.',
  },
  {
    match: (p) => p.startsWith('/api/edit-trip'),
    prefix: 'edit_trip',
    limit: 10,
    windowMs: 60 * 1000,
    retryAfter: '60',
    message: 'Rate limit exceeded: Too many edit requests. Please try again in 60 seconds.',
  },
  {
    match: (p) => p.startsWith('/api/trips'),
    prefix: 'trips',
    limit: 30,
    windowMs: 60 * 1000,
    retryAfter: '60',
    message: 'Rate limit exceeded: Too many trip requests. Please try again in 60 seconds.',
  },
  {
    match: (p) => p.startsWith('/api/crm'),
    prefix: 'crm',
    limit: 60,
    windowMs: 60 * 1000,
    retryAfter: '60',
    message: 'Rate limit exceeded: CRM API quota reached. Please try again in 60 seconds.',
  },
  {
    match: (p) => p.startsWith('/api/admin'),
    prefix: 'admin',
    limit: 30,
    windowMs: 60 * 1000,
    retryAfter: '60',
    message: 'Rate limit exceeded: Admin API quota reached. Please try again in 60 seconds.',
  },
  {
    match: (p) => p.startsWith('/api/images'),
    prefix: 'images',
    limit: 120,
    windowMs: 60 * 1000,
    retryAfter: '60',
    message: 'Rate limit exceeded: Image API quota reached. Please try again in 60 seconds.',
  },
];

function applySecurityHeaders(response: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
}

export async function middleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || (request as any).ip || 'anon-client';
  const pathname = request.nextUrl.pathname;

  // Generate unique request ID for tracing and incident correlation
  const requestId = crypto.randomUUID();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-request-id', requestId);

  // 1. Evaluate all rate limit rules (order matters — first match wins)
  for (const rule of RATE_LIMIT_RULES) {
    if (rule.match(pathname)) {
      const isAllowed = await checkRateLimit(`${rule.prefix}_${ip}`, rule.limit, rule.windowMs);
      if (!isAllowed) {
        const response = NextResponse.json(
          { error: rule.message },
          { status: 429, headers: { 'Retry-After': rule.retryAfter, 'x-request-id': requestId } }
        );
        return applySecurityHeaders(response);
      }
      break; // Only apply the first matching rule
    }
  }

  // 3. Execute Supabase Auth Session & Admin RBAC Guardrails
  const supabaseResponse = await updateSession(request);

  // 4. Apply security headers and request ID to the response from updateSession
  supabaseResponse.headers.set('x-request-id', requestId);
  return applySecurityHeaders(supabaseResponse);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
