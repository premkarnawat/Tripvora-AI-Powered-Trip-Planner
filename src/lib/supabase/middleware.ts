import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  let user = null;

  let authErrorMsg = "";

  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      authErrorMsg = "missing_env_vars";
    } else {
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

      const { data, error } = await supabase.auth.getUser();
      if (error) {
        const authCookie = request.cookies.getAll().find(c => c.name.includes('-auth-token') && !c.name.includes('-code-verifier'));
        const cookiePreview = authCookie ? authCookie.value.substring(0, 15) : "none";
        authErrorMsg = "user_error_" + error.message.replace(/\s+/g, '_') + "_val_" + cookiePreview;
      } else if (data?.user) {
        user = data.user;
      } else {
        const cookieNames = request.cookies.getAll().map(c => c.name).join("-");
        authErrorMsg = `no_user_cookies_${cookieNames}`;
      }
    }
  } catch (err: any) {
    console.error("Supabase middleware error:", err);
    authErrorMsg = "catch_" + (err?.message || "unknown").replace(/\s+/g, '_');
  }

  const pathname = request.nextUrl.pathname;
  const hasAuth = !!user;

  // Protect private routes
  const protectedRoutes = ['/dashboard', '/agency', '/admin', '/saved-trips', '/settings', '/trips', '/profile', '/plan'];
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route)) &&
                      !pathname.startsWith('/admin/login') &&
                      !pathname.startsWith('/agency/register');

  if (!hasAuth && isProtected) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname);
    if (authErrorMsg) {
      url.searchParams.set('err_diag', authErrorMsg);
    }
    return NextResponse.redirect(url)
  }

  // --- ZERO TRUST GLOBAL API FIREWALL ---
  const isApiRoute = pathname.startsWith('/api/');
  const isAdminApi = pathname.startsWith('/api/admin/');
  const isCrmApi = pathname.startsWith('/api/crm/');

  if (isAdminApi || isCrmApi) {
    // 1. Block Unauthenticated API Access
    if (!hasAuth) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
    }

    const userRole = user?.user_metadata?.role || 'traveler';
    const isAdmin = userRole === 'admin' || userRole === 'super_admin';
    const isAgency = userRole === 'agency' || userRole === 'agency_admin' || userRole === 'agency_agent';

    // 2. Block Unauthorized Admin API Access
    if (isAdminApi && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // 3. Block Unauthorized CRM API Access
    if (isCrmApi && !isAgency && !isAdmin) { // Admins usually can access CRM routes too
      return NextResponse.json({ error: 'Forbidden: Agency access required' }, { status: 403 });
    }
  }
  // --- END API FIREWALL ---

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
