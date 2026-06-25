import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    
    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userData?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admins only' }, { status: 403 });
    }

    // Parallel counts
    const [
      { count: agencyCount },
      { count: userCount },
      { count: tripCount },
      { count: leadsCount }
    ] = await Promise.all([
      supabase.from('agencies').select('*', { count: 'exact', head: true }),
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('trips').select('*', { count: 'exact', head: true }),
      supabase.from('agency_leads').select('*', { count: 'exact', head: true }),
    ]);

    // Return the aggregated metrics for the admin dashboard
    return NextResponse.json({
      metrics: {
        totalRevenue: 4892400, // Still mock until stripe is integrated
        monthlyRevenue: 624800,
        activeAgencies: agencyCount || 0,
        websiteUsers: userCount || 0,
        tripsGenerated: tripCount || 0,
        qualifiedLeads: leadsCount || 0,
        marketplaceListings: 1842,
        pendingApprovals: 16
      }
    });

  } catch (error: any) {
    console.error('Error fetching admin metrics:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
