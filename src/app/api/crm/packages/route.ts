import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Packages are just representations of destination_cache in the agency portal
    const { data: packages, error: packagesError } = await supabase
      .from('destination_cache')
      .select('*')
      .order('updated_at', { ascending: false });

    if (packagesError) {
      console.error("Packages Fetch Error:", packagesError);
      return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
    }

    // Transform into the format the UI expects for CRM packages
    const formattedPackages = packages.map((d: any) => ({
      id: d.id,
      title: `${d.name} Package`,
      duration: "5 Nights, 6 Days", // Dynamic in real app
      destinations: d.name,
      basePrice: "₹" + (Math.floor(Math.random() * 50) + 10) + ",000",
      status: "Active",
      rating: "4.8 (120)",
      image: d.images?.[0] || "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=300&auto=format&fit=crop",
      inclusions: (d.popular_activities || []).slice(0, 3)
    }));

    return NextResponse.json(formattedPackages);
  } catch (error: any) {
    console.error("Packages API Exception:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
