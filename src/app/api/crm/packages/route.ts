import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: agency } = await supabase
      .from('agencies')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!agency) return NextResponse.json({ error: 'Agency not found' }, { status: 404 });

    const body = await request.json();
    
    // 1. Create Trip
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .insert({
        owner_id: user.id,
        type: 'agency_package',
        title: body.title,
        destination: body.destination,
        start_date: body.start_date,
        end_date: body.end_date,
        duration_nights: body.nights,
        target_budget: body.budget,
        status: 'Quoted'
      })
      .select()
      .single();

    if (tripError) throw tripError;

    // 2. Create Trip Components (if provided)
    if (body.components && body.components.length > 0) {
      const componentsToInsert = body.components.map((comp: any) => ({
        trip_id: trip.id,
        category: comp.category, // hotels, activities, transfers
        vendor_id: comp.vendor_id || null,
        title: comp.title,
        description: comp.description || '',
        internal_cost: comp.cost || 0,
        selling_price: comp.selling_price || 0,
        qty: comp.qty || 1,
        is_ai_generated: comp.is_ai_generated || false
      }));

      const { error: compError } = await supabase
        .from('trip_components')
        .insert(componentsToInsert);

      if (compError) throw compError;
    }

    // 3. Create Quotation Record
    const { data: quotation, error: quoteError } = await supabase
      .from('quotations')
      .insert({
        trip_id: trip.id,
        lead_id: body.lead_id || null, // Optional
        quote_number: `QT-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
        issue_date: new Date().toISOString(),
        valid_till: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        total_amount: body.total_amount || 0,
        pricing_metadata: body.pricing_metadata || {}
      })
      .select()
      .single();

    if (quoteError) throw quoteError;

    return NextResponse.json({ trip, quotation }, { status: 201 });

  } catch (error: any) {
    console.error('Error saving package:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
