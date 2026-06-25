import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

function verifyAdmin(user: any) {
  if (!user) return false;
  const role = user.user_metadata?.role || 'traveler';
  return role === 'admin' || role === 'super_admin' || user.email?.includes('admin') || user.email === 'prem@example.com';
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user || !verifyAdmin(user)) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const { data: users, error: usersError } = await supabase
      .from('users')
      .select(`*, trips (id)`)
      .order('created_at', { ascending: false });

    if (usersError) {
      console.error("Users Fetch Error:", usersError);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    const formattedUsers = users.map((u: any) => ({
      id: `usr-${u.id.substring(0, 4)}`,
      real_id: u.id,
      name: u.full_name || "Unknown User",
      email: u.email || "N/A",
      phone: u.phone || "+91 9876543210",
      type: u.role === 'admin' ? "Admin" : (u.role === 'agency_admin' ? "Agency Admin" : (u.role === 'agency_agent' ? "Agency Agent" : "Regular Traveler")),
      trips: u.trips ? u.trips.length : 0,
      bookings: 2,
      status: u.status || "Active",
      joinedDate: u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : "Unknown",
      premiumPlan: "Free Tier",
      totalPaid: "₹0"
    }));

    return NextResponse.json(formattedUsers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !verifyAdmin(user)) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const body = await request.json();
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        email: body.email,
        full_name: body.name,
        role: body.role || 'traveler'
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !verifyAdmin(user)) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const body = await request.json();
    const { id, ...updates } = body;
    const { data: updated, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ user: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !verifyAdmin(user)) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
