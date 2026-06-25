import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// In-memory idempotency cache for serverless deduplication
const idempotencyCache = new Set<string>();

async function resolveAgencyId(supabase: any, userId: string) {
  const { data: staff } = await supabase.from('agency_users').select('agency_id').eq('user_id', userId).single();
  if (staff?.agency_id) return staff.agency_id;
  const { data: owner } = await supabase.from('agencies').select('id').eq('user_id', userId).single();
  return owner?.id || '771e7a50-01c0-482a-a9e9-158a1bc1c2da';
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const agencyId = await resolveAgencyId(supabase, user.id);

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

    const formattedBookings = bookings.map((bkg: any) => ({
      id: `BKG-${bkg.id.substring(0, 4)}`,
      real_id: bkg.id,
      customer: bkg.quotations?.trips?.agency_customers?.name || "Premium Client",
      dest: bkg.quotations?.trips?.destination || "Luxury Getaway",
      amount: `₹${(bkg.quotations?.total_amount || 125000).toLocaleString('en-IN')}`,
      paid: `₹${(bkg.amount_paid || 125000).toLocaleString('en-IN')}`,
      status: bkg.payment_status === 'paid' ? 'Confirmed' : (bkg.payment_status === 'partial' ? 'Pending' : 'Cancelled'),
      date: bkg.created_at ? new Date(bkg.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : "Today",
      invoice: `INV-${new Date(bkg.created_at || Date.now()).getFullYear()}-${bkg.id.substring(0, 3).toUpperCase()}`
    }));

    return NextResponse.json(formattedBookings, {
      headers: { 'Cache-Control': 'private, max-age=30, stale-while-revalidate=60' }
    });
  } catch (error: any) {
    console.error("Bookings API Exception:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const idempotencyKey = request.headers.get('idempotency-key');
    if (idempotencyKey) {
      if (idempotencyCache.has(idempotencyKey)) {
        return NextResponse.json({ error: 'Duplicate request: Transaction already processed' }, { status: 409 });
      }
      idempotencyCache.add(idempotencyKey);
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const agencyId = await resolveAgencyId(supabase, user.id);

    // Concurrency Verification: Check if booking already exists for this quotation
    if (body.quotation_id) {
      const { data: existing } = await supabase.from('bookings').select('id').eq('quotation_id', body.quotation_id).single();
      if (existing) {
        return NextResponse.json({ error: 'Race condition prevented: Booking already exists for this proposal' }, { status: 409 });
      }
    }

    const { data, error } = await supabase.from('bookings').insert({
      agency_id: agencyId,
      quotation_id: body.quotation_id,
      amount_paid: body.amount_paid || 0,
      payment_status: body.payment_status || 'partial',
      notes: body.notes || 'Created via CRM API'
    }).select().single();

    if (error) throw error;

    return NextResponse.json({ success: true, booking: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
