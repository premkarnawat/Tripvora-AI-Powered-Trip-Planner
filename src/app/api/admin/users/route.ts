import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    
    // 1. Get authenticated user (should verify admin status in real app)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select(`
        *,
        trips (id)
      `)
      .order('created_at', { ascending: false });

    if (usersError) {
      console.error("Users Fetch Error:", usersError);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    // Transform into the format the UI expects
    const formattedUsers = users.map((u: any) => ({
      id: `usr-${u.id.substring(0, 4)}`,
      real_id: u.id,
      name: u.full_name || "Unknown User",
      email: u.email || "N/A",
      phone: "+91 " + Math.floor(1000000000 + Math.random() * 9000000000).toString(), // Mock phone since it's not in our users table natively (or it might be via auth, but for now we mock it)
      type: u.role === 'admin' ? "Admin" : (u.role === 'agency_admin' ? "Agency Admin" : (u.role === 'agency_agent' ? "Agency Agent" : "Regular Traveler")),
      trips: u.trips ? u.trips.length : 0,
      bookings: Math.floor(Math.random() * 5), // Mock bookings count
      status: "Active", // Assuming all fetched users are active
      joinedDate: u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : "Unknown",
      premiumPlan: "Free Tier",
      totalPaid: "₹0"
    }));

    return NextResponse.json(formattedUsers);
  } catch (error: any) {
    console.error("Users API Exception:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
