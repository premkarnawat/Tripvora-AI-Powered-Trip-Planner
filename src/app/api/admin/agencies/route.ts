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

    // 3. Fetch agencies
    const { data: agencies, error: agenciesError } = await supabase
      .from('agencies')
      .select('*')
      .order('created_at', { ascending: false });

    if (agenciesError) {
      console.error("Agencies Fetch Error:", agenciesError);
      return NextResponse.json({ error: 'Failed to fetch agencies' }, { status: 500 });
    }

    // Transform into the format the UI expects
    const formattedAgencies = agencies.map((agency: any) => {
      // Mock some aggregation data since we don't have a complex join for revenue/leads yet
      const badgeType = agency.subscription_tier === 'premium' ? "ELITE PARTNER" : 
                        agency.subscription_tier === 'growth' ? "GROWTH PLAN" : "BASE PLAN";
      const badgeColor = agency.subscription_tier === 'premium' ? "bg-[#0EA5A4]/10 text-[#0EA5A4] border-[#0EA5A4]/25" : 
                         "bg-teal-500/10 text-teal-600 border-teal-500/25";
                         
      return {
        id: agency.id,
        name: agency.name,
        city: agency.address || "Unknown Location",
        plan: agency.subscription_tier || "free",
        badgeType,
        badgeColor,
        revenue: `₹${(Math.floor(Math.random() * 500000)).toLocaleString('en-IN')}`, // Mock aggregation for now
        conversion: `${(Math.random() * 20).toFixed(1)}%`,
        leads: Math.floor(Math.random() * 500),
        bookings: Math.floor(Math.random() * 100),
        whatsappConnected: true,
        subscriptionStatus: agency.subscription_status || "Active",
        staffAvatars: [
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop"
        ],
        avatarPlaceholder: agency.name.substring(0, 2).toUpperCase()
      };
    });

    return NextResponse.json(formattedAgencies);
  } catch (error: any) {
    console.error("Agencies API Exception:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
