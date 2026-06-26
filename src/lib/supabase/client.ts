import { createBrowserClient } from '@supabase/ssr'

const DEFAULT_URL = "https://gbmuacxsterrofwvvfow.supabase.co";
const DEFAULT_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdibXVhY3hzdGVycm9md3Z2Zm93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1OTU2NjQsImV4cCI6MjA5NzE3MTY2NH0.59xytlk9gb2yFQJlfCv-_gVXwc2izr3YyRadJCYCl1s";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_ANON;
  return createBrowserClient(url, anon);
}
