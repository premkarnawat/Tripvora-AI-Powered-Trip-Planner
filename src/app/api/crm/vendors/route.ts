import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get agency id for this user
    const { data: agency } = await supabase
      .from('agencies')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!agency) {
      return NextResponse.json({ error: 'Agency not found' }, { status: 404 });
    }

    // Fetch vendors
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    let query = supabase
      .from('agency_vendors')
      .select('*')
      .eq('agency_id', agency.id)
      .eq('status', 'Active');
      
    if (category) {
      query = query.eq('category', category);
    }

    const { data: vendors, error } = await query;

    if (error) throw error;

    return NextResponse.json({ vendors });
  } catch (error: any) {
    console.error('Error fetching vendors:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: agency } = await supabase
      .from('agencies')
      .select('id')
      .eq('user_id', user.id)
      .single();

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
        rating: body.rating || 0,
        description: body.description || '',
        status: 'Active'
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ vendor }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating vendor:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
