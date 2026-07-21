import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If env vars are missing, just pass through — don't block navigation
  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse
  }

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // Use getSession() for middleware route protection — it reads directly from
    // cookies without making an API roundtrip to Supabase. getUser() was causing
    // failures on Vercel Edge (API timeout/failures → redirect loop).
    //
    // NOTE: getSession() reads unverified JWT from cookies. This is fine for
    // middleware (we're only deciding whether to redirect, not making auth
    // decisions). API routes still use getUser() for proper verification.
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    const user = session?.user ?? null
    const pathname = request.nextUrl.pathname;
    const protectedRoutes = ['/dashboard', '/agency', '/admin', '/saved-trips', '/settings', '/trips', '/profile', '/plan', '/trip-planner'];
    
    const isProtected = protectedRoutes.some(route => pathname.startsWith(route)) &&
                        !pathname.startsWith('/admin/login') &&
                        !pathname.startsWith('/agency/register') &&
                        !pathname.startsWith('/trips/generated');
    
    // If trying to access a protected route without being authenticated
    if (isProtected && !user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url)
    }

    // If user is authenticated and trying to access login/signup, redirect to dashboard
    if (user && (pathname === '/login' || pathname === '/signup')) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }

    return supabaseResponse;
  } catch (err: any) {
    // On any error, DON'T block navigation — just pass through
    console.error("Middleware auth error:", err?.message);
    return supabaseResponse;
  }
}
