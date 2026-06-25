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

    // 3. Fetch bookings for this agency
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select(`
        *,
        quotations (
          total_amount,
          trips (
            destination,
            agency_customers (
              name
            )
          )
        )
      `)
      .eq('agency_id', agencyId)
      .order('created_at', { ascending: false });

    if (bookingsError) {
      console.error("Bookings Fetch Error:", bookingsError);
      return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
    }

    // Transform into the format the UI expects
    const formattedBookings = bookings.map((bkg: any) => ({
      id: `BKG-${bkg.id.substring(0, 4)}`,
      real_id: bkg.id,
      customer: bkg.quotations?.trips?.agency_customers?.name || "Unknown Customer",
      dest: bkg.quotations?.trips?.destination || "Unknown Destination",
      amount: `₹${(bkg.quotations?.total_amount || 0).toLocaleString('en-IN')}`,
      paid: `₹${(bkg.amount_paid || 0).toLocaleString('en-IN')}`,
      status: bkg.payment_status === 'paid' ? 'Confirmed' : (bkg.payment_status === 'partial' ? 'Pending' : 'Cancelled'),
      date: bkg.created_at ? new Date(bkg.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : "Unknown",
      invoice: `INV-${new Date(bkg.created_at || Date.now()).getFullYear()}-${bkg.id.substring(0, 3).toUpperCase()}`
    }));

    return NextResponse.json(formattedBookings);
  } catch (error: any) {
    console.error("Bookings API Exception:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
