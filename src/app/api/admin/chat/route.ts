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

    const { data } = await supabase.from('internal_chat_messages').select('*').order('created_at', { ascending: false }).limit(100);
    return NextResponse.json(data || [], { headers: { 'Cache-Control': 'private, max-age=15' } });
  } catch (err: any) { return NextResponse.json({ error: err.message }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!verifyAdmin(user)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    const { data } = await supabase.from('internal_chat_messages').insert(body).select().single();
    return NextResponse.json({ success: true, data });
  } catch (err: any) { return NextResponse.json({ error: err.message }, { status: 500 }); }
}
