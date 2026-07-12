import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? null;

  if (!code) {
    // No authorization code — redirect to login with error
    return NextResponse.redirect(
      `${origin}/login?error=missing_code`
    );
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data?.user) {
      // Exchange failed — redirect to login with generic error
      return NextResponse.redirect(
        `${origin}/login?error=auth_failed`
      );
    }

    // If a specific redirect was requested, honor it (validate it's a relative path)
    if (next && next.startsWith("/") && !next.startsWith("//")) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    // Determine role and redirect to the appropriate dashboard
    const userRole = data.user.user_metadata?.role || "traveler";

    if (userRole === "admin" || userRole === "super_admin") {
      return NextResponse.redirect(`${origin}/admin`);
    } else if (userRole === "agency") {
      return NextResponse.redirect(`${origin}/agency`);
    } else {
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  } catch {
    // Unexpected error — redirect to login with generic error
    return NextResponse.redirect(
      `${origin}/login?error=server_error`
    );
  }
}
