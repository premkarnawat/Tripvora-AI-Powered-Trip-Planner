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

    // 2. Fetch destinations
    const { data: destinations, error: destinationsError } = await supabase
      .from('destination_cache')
      .select('*')
      .order('updated_at', { ascending: false });

    if (destinationsError) {
      console.error("Destinations Fetch Error:", destinationsError);
      return NextResponse.json({ error: 'Failed to fetch destinations' }, { status: 500 });
    }

    // Transform into the format the UI expects
    const formattedDestinations = destinations.map((d: any) => ({
      id: d.id,
      name: d.name,
      description: d.seo_description || "No description provided.",
      bestMonths: "Available Year Round", // Extracted dynamically in real AI logic
      budget: "Variable depending on trip duration", // Also dynamic in real app
      attractions: (d.popular_attractions || []).slice(0, 3).join(", ") || "No popular attractions listed",
      hotels: "Various Hotels",
      activities: (d.popular_activities || []).slice(0, 3).join(", ") || "Sightseeing",
      visibility: "Public", // Could add this to schema if needed
      image: d.images?.[0] || "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=300&auto=format&fit=crop"
    }));

    return NextResponse.json(formattedDestinations);
  } catch (error: any) {
    console.error("Destinations API Exception:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
