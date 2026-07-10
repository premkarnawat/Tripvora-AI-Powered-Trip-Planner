import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

function verifyAdmin(user: any) {
  if (!user) return false;
  const role = user.user_metadata?.role || 'traveler';
  return role === 'admin' || role === 'super_admin';
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user || !verifyAdmin(user)) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const { data: destinations, error: destinationsError } = await supabase
      .from('destination_cache')
      .select('*')
      .order('updated_at', { ascending: false });

    if (destinationsError) {
      console.error("Destinations Fetch Error:", destinationsError);
      return NextResponse.json({ error: 'Failed to fetch destinations' }, { status: 500 });
    }

    const formattedDestinations = destinations.map((d: any) => ({
      id: d.id,
      name: d.name,
      description: d.seo_description || "No description provided.",
      bestMonths: "Available Year Round",
      budget: "Variable depending on trip duration",
      attractions: (d.popular_attractions || []).slice(0, 3).join(", ") || "No popular attractions listed",
      hotels: "Various Hotels",
      activities: (d.popular_activities || []).slice(0, 3).join(", ") || "Sightseeing",
      visibility: "Public",
      image: d.images?.[0] || "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=300&auto=format&fit=crop"
    }));

    return NextResponse.json(formattedDestinations);
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
    const { data: newDest, error } = await supabase
      .from('destination_cache')
      .insert({
        name: body.name,
        slug: body.name.toLowerCase().replace(/\s+/g, '-'),
        seo_description: body.description,
        popular_attractions: body.attractions ? body.attractions.split(',') : [],
        popular_activities: body.activities ? body.activities.split(',') : []
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ destination: newDest }, { status: 201 });
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
      .from('destination_cache')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ destination: updated });
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

    const { error } = await supabase.from('destination_cache').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
