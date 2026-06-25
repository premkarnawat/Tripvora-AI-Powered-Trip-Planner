import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    
    // 1. Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch the user's agency ID
    const { data: agencyUser, error: agencyError } = await supabase
      .from('agency_users')
      .select('agency_id')
      .eq('user_id', user.id)
      .single();

    if (agencyError || !agencyUser?.agency_id) {
      return NextResponse.json({ error: 'User is not associated with an agency.' }, { status: 403 });
    }

    const agencyId = agencyUser.agency_id;

    // 3. Fetch customers for this agency
    const { data: customers, error: customersError } = await supabase
      .from('agency_customers')
      .select('*')
      .eq('agency_id', agencyId)
      .order('created_at', { ascending: false });

    if (customersError) {
      console.error("Customers Fetch Error:", customersError);
      return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
    }

    // Transform into the format the UI expects
    const formattedCustomers = customers.map((cust: any) => ({
      id: `C-${cust.id.substring(0, 4)}`,
      real_id: cust.id,
      name: cust.name,
      whatsapp: cust.phone || "N/A",
      email: cust.email || "N/A",
      city: cust.city || "Unknown",
      since: cust.created_at ? new Date(cust.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : "Unknown",
      spend: `₹${(cust.total_spend || 0).toLocaleString('en-IN')}`,
      trips: cust.total_trips || 0,
      ltv: cust.lifetime_value_tier || "Medium",
      lastTrip: cust.last_trip_id ? "View Trips" : "None"
    }));

    return NextResponse.json(formattedCustomers);
  } catch (error: any) {
    console.error("Customers API Exception:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
