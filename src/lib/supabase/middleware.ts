import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  let user = null;

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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
      );

      const { data } = await supabase.auth.getUser();
      user = data?.user || null;
    }
  } catch (err) {
    // Graceful fallback for demo preview environments
  }

  const pathname = request.nextUrl.pathname;
  const hasAuth = !!user;

  // Protect private routes
  const protectedRoutes = ['/dashboard', '/agency', '/admin', '/saved-trips', '/settings'];
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route)) &&
                      !pathname.startsWith('/admin/login') &&
                      !pathname.startsWith('/agency/register');

  if (!hasAuth && isProtected) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url)
  }

  if (hasAuth) {
    const userRole = user?.user_metadata?.role || 'traveler';
    const isAdmin = userRole === 'admin' || userRole === 'super_admin';

    // 1. Protect Admin Panel
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
      if (!isAdmin) {
        const url = request.nextUrl.clone();
        url.pathname = '/unauthorized';
        return NextResponse.redirect(url);
      }
    }

    // 2. Protect Agency CRM
    if (pathname.startsWith('/agency') && !pathname.startsWith('/agency/register')) {
      if (userRole !== 'agency') {
        const url = request.nextUrl.clone();
        url.pathname = '/unauthorized';
        return NextResponse.redirect(url);
      }
    }

    // 3. Protect Traveler Dashboard
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/saved-trips')) {
      if (userRole === 'agency') {
        const url = request.nextUrl.clone();
        url.pathname = '/agency';
        return NextResponse.redirect(url);
      } else if (isAdmin) {
        const url = request.nextUrl.clone();
        url.pathname = '/admin';
        return NextResponse.redirect(url);
      }
    }

    // 4. Redirect auth pages to active role dashboards
    if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
      const url = request.nextUrl.clone();
      if (isAdmin) {
        url.pathname = '/admin';
      } else if (userRole === 'agency') {
        url.pathname = '/agency';
      } else {
        url.pathname = '/dashboard';
      }
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
