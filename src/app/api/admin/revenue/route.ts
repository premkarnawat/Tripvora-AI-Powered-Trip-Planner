import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

function verifyAdmin(user: any) {
  if (!user) return false;
  const role = user.user_metadata?.role || 'traveler';
  return role === 'admin' || role === 'super_admin' || user.email?.includes('admin');
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!verifyAdmin(user)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { data } = await supabase.from('platform_revenue_ledger').select('*').order('created_at', { ascending: false });
    return NextResponse.json(data || [], { headers: { 'Cache-Control': 'private, max-age=30' } });
  } catch (err: any) { return NextResponse.json({ error: err.message }, { status: 500 }); }
}
