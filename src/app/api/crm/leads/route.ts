import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    
    // 1. Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch the user's agency ID
    const { data: agencyUser, error: agencyError } = await supabase
      .from('agency_users')
      .select('agency_id')
      .eq('user_id', user.id)
      .single();

    if (agencyError || !agencyUser?.agency_id) {
      return NextResponse.json({ error: 'User is not associated with an agency.' }, { status: 403 });
    }

    const agencyId = agencyUser.agency_id;

    // 3. Fetch leads for this agency
    const { data: leads, error: leadsError } = await supabase
      .from('agency_leads')
      .select(`
        *,
        agency_customers (
          id,
          name,
          phone,
          email
        )
      `)
      .eq('agency_id', agencyId)
      .order('created_at', { ascending: false });

    if (leadsError) {
      console.error("Leads Fetch Error:", leadsError);
      return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
    }

    // Transform into the format the UI expects, since UI currently expects mock data format
    const formattedLeads = leads.map((lead: any) => ({
      id: `L-${lead.id.substring(0, 4)}`,
      real_id: lead.id,
      name: lead.agency_customers?.name || "Unknown Customer",
      whatsapp: lead.agency_customers?.phone || "N/A",
      dest: lead.destination_name || "Unknown",
      budget: `₹${(lead.budget_target || 0).toLocaleString('en-IN')}`,
      date: lead.travel_date ? new Date(lead.travel_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : "TBD",
      pax: lead.pax_count || 1,
      source: lead.lead_source || "Manual",
      score: lead.lead_score === 100 ? "Hot" : (lead.lead_score > 50 ? "Warm" : "Cold"),
      status: lead.pipeline_status || "New",
      owner: "Assigned"
    }));

    return NextResponse.json(formattedLeads);
  } catch (error: any) {
    console.error("Leads API Exception:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
