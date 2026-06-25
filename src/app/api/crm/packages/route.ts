import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: packages, error: packagesError } = await supabase
      .from('destination_cache')
      .select('*')
      .order('updated_at', { ascending: false });

    if (packagesError) {
      console.error("Packages Fetch Error:", packagesError);
      return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
    }

    const formattedPackages = packages.map((d: any) => ({
      id: d.id,
      title: `${d.name} Package`,
      duration: "5 Nights, 6 Days",
      destinations: d.name,
      basePrice: "₹" + (Math.floor(Math.random() * 50) + 10) + ",000",
      status: "Active",
      rating: "4.8 (120)",
      image: d.images?.[0] || "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=300&auto=format&fit=crop",
      inclusions: (d.popular_activities || []).slice(0, 3)
    }));

    return NextResponse.json(formattedPackages);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    
    // Save as destination cache item so it lists in packages
    const { data: newPkg, error } = await supabase
      .from('destination_cache')
      .insert({
        name: body.clientDetails?.destination || body.title || "Custom Package",
        slug: (body.clientDetails?.destination || "custom").toLowerCase().replace(/\s+/g, '-'),
        seo_description: body.clientDetails?.specialRequirements || "Custom Agency Package",
        popular_activities: (body.selectedComponents?.activities || []).map((a: any) => a.name || a),
        popular_attractions: []
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, package: newPkg });
  } catch (error: any) {
    console.error("Packages POST Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
