import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  try {
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

    // IMPORTANT: calling getUser() refreshes the auth token if it's expired
    const { data: { user } } = await supabase.auth.getUser()

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
    console.error("Middleware error:", err);
    return supabaseResponse;
  }
}
