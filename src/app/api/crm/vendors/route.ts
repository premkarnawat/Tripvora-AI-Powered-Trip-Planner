import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

async function getAgencyForUser(supabase: any, userId: string) {
  // Try direct ownership
  const { data: agency } = await supabase
    .from('agencies')
    .select('id')
    .eq('user_id', userId)
    .single();
    
  if (agency) return agency;

  // Fallback to staff/agent lookup
  const { data: staff } = await supabase
    .from('agency_users')
    .select('agency_id')
    .eq('user_id', userId)
    .single();

  if (staff) return { id: staff.agency_id };
  
  // Return demo agency id if testing
  return { id: '771e7a50-01c0-482a-a9e9-158a1bc1c2da' };
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const agency = await getAgencyForUser(supabase, user.id);
    if (!agency) return NextResponse.json({ error: 'Agency not found' }, { status: 404 });

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    let query = supabase
      .from('agency_vendors')
      .select('*')
      .eq('agency_id', agency.id)
      .eq('status', 'Active');
      
    if (category) query = query.eq('category', category);

    const { data: vendors, error } = await query;
    if (error) throw error;

    return NextResponse.json({ vendors });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const agency = await getAgencyForUser(supabase, user.id);
    if (!agency) return NextResponse.json({ error: 'Agency not found' }, { status: 404 });

    const body = await request.json();
    const { data: vendor, error } = await supabase
      .from('agency_vendors')
      .insert({
        agency_id: agency.id,
        category: body.category,
        name: body.name,
        cost_price: body.cost_price || 0,
        selling_price: body.selling_price || 0,
        rating: body.rating || 4.5,
        description: body.description || '',
        status: 'Active'
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ vendor }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { id, ...updates } = body;
    const { data: updated, error } = await supabase
      .from('agency_vendors')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ vendor: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const { error } = await supabase.from('agency_vendors').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
