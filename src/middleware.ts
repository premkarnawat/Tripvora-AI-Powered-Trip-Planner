import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// In-Memory Edge Rate Limiter (Token Bucket / Window Fallback for High Concurrency)
// In production with Upstash Redis, this swaps to @upstash/ratelimit
const rateLimitCache = new Map<string, { count: number; expires: number }>();

function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimitCache.get(key);

  // Clean up expired
  if (!record || now > record.expires) {
    rateLimitCache.set(key, { count: 1, expires: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count += 1;
  return true;
}

export async function middleware(request: NextRequest) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'anon-client';
  const pathname = request.nextUrl.pathname;

  // 1. Rate Limit AI Itinerary Engine (Max 6 calls per minute per IP to defend against Denial-of-Wallet)
  if (pathname.startsWith('/api/generate-trip')) {
    if (!checkRateLimit(`ai_${ip}`, 6, 60 * 1000)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded: AI generation quota exhausted. Please try again in 60 seconds.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }
  }

  // 2. Rate Limit Public Lead & Contact Form (Max 10 submissions per hour per IP)
  if (pathname.startsWith('/api/contact')) {
    if (!checkRateLimit(`contact_${ip}`, 10, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded: Too many inquiries. Please try again later.' },
        { status: 429, headers: { 'Retry-After': '3600' } }
      );
    }
  }

  // 3. Rate Limit Auth Endpoints against Brute-Force (Max 25 attempts per 5 minutes per IP)
  if (pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/forgot-password')) {
    if (request.method === 'POST' && !checkRateLimit(`auth_${ip}`, 25, 5 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Too many authentication attempts. Please wait 5 minutes.' },
        { status: 429, headers: { 'Retry-After': '300' } }
      );
    }
  }

  // Execute Supabase Auth Session & Admin RBAC Guardrails
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
