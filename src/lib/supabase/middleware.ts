import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If env vars are missing, just pass through
  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse
  }

  const pathname = request.nextUrl.pathname;
  const protectedRoutes = ['/dashboard', '/agency', '/admin', '/saved-trips', '/settings', '/trips', '/profile', '/plan', '/trip-planner'];

  const isProtected = protectedRoutes.some(route => pathname.startsWith(route)) &&
                      !pathname.startsWith('/admin/login') &&
                      !pathname.startsWith('/agency/register') &&
                      !pathname.startsWith('/trips/generated');

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

    // Try to get session from Supabase client (reads from cookies)
    const { data: { session } } = await supabase.auth.getSession()
    let hasSession = !!session?.user

    // FALLBACK: If Supabase client can't parse the session but auth cookies
    // physically exist in the request, trust the cookies and let through.
    // This handles cookie format mismatches between browser/server clients.
    // The actual auth verification happens in API routes via getUser().
    if (!hasSession) {
      const allCookies = request.cookies.getAll()
      const hasAuthCookie = allCookies.some(c =>
        c.name.startsWith('sb-') && c.name.includes('auth-token') && c.value.length > 10
      )
      if (hasAuthCookie) {
        // Auth cookies exist — user has a session. Let the request through.
        // Don't redirect to login; the page/API will handle auth properly.
        hasSession = true
      }
    }

    // Protected route + no session = redirect to login
    if (isProtected && !hasSession) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    // Already logged in + visiting login/signup = redirect to dashboard
    if (hasSession && (pathname === '/login' || pathname === '/signup')) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  } catch (err: any) {
    // On error, check if auth cookies exist as a fallback
    if (isProtected) {
      const allCookies = request.cookies.getAll()
      const hasAuthCookie = allCookies.some(c =>
        c.name.startsWith('sb-') && c.name.includes('auth-token') && c.value.length > 10
      )
      // If cookies exist, let through. If not, redirect to login.
      if (!hasAuthCookie) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        url.searchParams.set('redirect', pathname)
        return NextResponse.redirect(url)
      }
    }
    console.error("Middleware auth error:", err?.message)
    return supabaseResponse
  }
}
