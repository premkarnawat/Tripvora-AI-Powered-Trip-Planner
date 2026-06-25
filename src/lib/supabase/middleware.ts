import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
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

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname;

  // Protect private routes
  const protectedRoutes = ['/dashboard', '/agency', '/admin', '/saved-trips', '/settings'];
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

  if (!user && isProtected) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url)
  }

  // Enforce Admin RBAC check
  if (user && pathname.startsWith('/admin')) {
    const userRole = user.user_metadata?.role || 'traveler';
    // Allow demo access if user metadata hasn't been explicitly assigned admin role yet, or check DB
    const isAdmin = userRole === 'admin' || userRole === 'super_admin' || user.email?.includes('admin') || user.email === 'prem@example.com';
    if (!isAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  // Redirect to dashboard if logged in and trying to access login/signup
  if (user && (pathname.startsWith('/login') || pathname.startsWith('/signup'))) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
