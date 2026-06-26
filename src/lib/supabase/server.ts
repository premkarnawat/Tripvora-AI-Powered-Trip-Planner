import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const DEFAULT_URL = "https://gbmuacxsterrofwvvfow.supabase.co";
const DEFAULT_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdibXVhY3hzdGVycm9md3Z2Zm93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1OTU2NjQsImV4cCI6MjA5NzE3MTY2NH0.59xytlk9gb2yFQJlfCv-_gVXwc2izr3YyRadJCYCl1s";

export async function createClient() {
  const cookieStore = await cookies()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_ANON;

  return createServerClient(url, anon, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
