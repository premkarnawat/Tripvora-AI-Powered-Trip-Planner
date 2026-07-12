import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  try {
    const pathname = request.nextUrl.pathname;
    const protectedRoutes = ['/dashboard', '/agency', '/admin', '/saved-trips', '/settings', '/trips', '/profile', '/plan'];
    
    const isProtected = protectedRoutes.some(route => pathname.startsWith(route)) &&
                        !pathname.startsWith('/admin/login') &&
                        !pathname.startsWith('/agency/register');
    
    // If not a protected route, just proceed
    if (!isProtected) {
      return supabaseResponse;
    }

    // Manual bulletproof session extraction (bypassing @supabase/ssr parsing bugs and Vercel Edge fetch bugs)
    const authCookie = request.cookies.getAll().find(c => c.name.includes('-auth-token') && !c.name.includes('-code-verifier'));
    let hasAuth = false;
    
    if (authCookie) {
      try {
        let parsed;
        try {
          parsed = JSON.parse(authCookie.value);
        } catch {
          parsed = JSON.parse(decodeURIComponent(authCookie.value));
        }
        if (parsed && parsed.access_token) {
          hasAuth = true;
        }
      } catch (e) {
        // Corrupted cookie
      }
    }

    // If trying to access a protected route without being authenticated
    if (!hasAuth) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url)
    }

    return supabaseResponse;
  } catch (err: any) {
    console.error("Middleware error:", err);
    return supabaseResponse;
  }
}
