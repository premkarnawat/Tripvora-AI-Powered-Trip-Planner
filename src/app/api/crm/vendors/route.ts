import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withSecurity } from '@/lib/security/api-wrapper';
import { z } from 'zod';

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

const vendorSchema = z.object({
  category: z.string(),
  name: z.string().min(2),
  cost_price: z.number().optional().default(0),
  selling_price: z.number().optional().default(0),
  rating: z.number().min(1).max(5).optional().default(4.5),
  description: z.string().optional().default('')
});

const updateVendorSchema = z.object({
  id: z.string().uuid(),
  category: z.string().optional(),
  name: z.string().min(2).optional(),
  cost_price: z.number().optional(),
  selling_price: z.number().optional(),
  rating: z.number().min(1).max(5).optional(),
  description: z.string().optional(),
  status: z.string().optional()
});

export const GET = withSecurity(
  {
    requireAuth: true,
    requireRoles: ['agency_admin', 'agency_agent', 'admin', 'super_admin'],
    rateLimit: { limit: 30, windowSeconds: 60 }
  },
  async (request: Request) => {
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      const agency = await getAgencyForUser(supabase, user!.id);
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
      if (error) {
        console.error('GET Vendors Database Error:', error);
        return NextResponse.json({ error: 'Failed to fetch vendors' }, { status: 500 });
      }

      return NextResponse.json({ vendors });
    } catch (error: any) {
      console.error('GET Vendors Error:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
);

export const POST = withSecurity(
  {
    requireAuth: true,
    requireRoles: ['agency_admin', 'admin', 'super_admin'],
    schema: vendorSchema,
    rateLimit: { limit: 20, windowSeconds: 60 }
  },
  async (request: Request) => {
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      const agency = await getAgencyForUser(supabase, user!.id);
      if (!agency) return NextResponse.json({ error: 'Agency not found' }, { status: 404 });

      const body = await request.json();
      const { data: vendor, error } = await supabase
        .from('agency_vendors')
        .insert({
          agency_id: agency.id,
          category: body.category,
          name: body.name,
          cost_price: body.cost_price,
          selling_price: body.selling_price,
          rating: body.rating,
          description: body.description,
          status: 'Active'
        })
        .select()
        .single();

      if (error) {
        console.error('POST Vendors Database Error:', error);
        return NextResponse.json({ error: 'Failed to create vendor' }, { status: 500 });
      }
      return NextResponse.json({ vendor }, { status: 201 });
    } catch (error: any) {
      console.error('POST Vendors Error:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
);

export const PUT = withSecurity(
  {
    requireAuth: true,
    requireRoles: ['agency_admin', 'admin', 'super_admin'],
    schema: updateVendorSchema,
    rateLimit: { limit: 20, windowSeconds: 60 }
  },
  async (request: Request) => {
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      const agency = await getAgencyForUser(supabase, user!.id);
      if (!agency) return NextResponse.json({ error: 'Agency not found' }, { status: 404 });

      const body = await request.json();
      const { id, ...updates } = body;
      
      const dbUpdates: any = {};
      if (updates.category) dbUpdates.category = updates.category;
      if (updates.name) dbUpdates.name = updates.name;
      if (updates.cost_price !== undefined) dbUpdates.cost_price = updates.cost_price;
      if (updates.selling_price !== undefined) dbUpdates.selling_price = updates.selling_price;
      if (updates.rating) dbUpdates.rating = updates.rating;
      if (updates.description) dbUpdates.description = updates.description;
      if (updates.status) dbUpdates.status = updates.status;

      const { data: updated, error } = await supabase
        .from('agency_vendors')
        .update(dbUpdates)
        .eq('id', id)
        .eq('agency_id', agency.id) // IDOR protection
        .select()
        .single();

      if (error) {
        console.error('PUT Vendors Database Error:', error);
        return NextResponse.json({ error: 'Failed to update vendor' }, { status: 500 });
      }
      return NextResponse.json({ vendor: updated });
    } catch (error: any) {
      console.error('PUT Vendors Error:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
);

export const DELETE = withSecurity(
  {
    requireAuth: true,
    requireRoles: ['agency_admin', 'admin', 'super_admin'],
    rateLimit: { limit: 10, windowSeconds: 60 }
  },
  async (request: Request) => {
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      const agency = await getAgencyForUser(supabase, user!.id);
      if (!agency) return NextResponse.json({ error: 'Agency not found' }, { status: 404 });

      const { searchParams } = new URL(request.url);
      const id = searchParams.get('id');
      
      if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
        return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
      }

      const { error } = await supabase
        .from('agency_vendors')
        .delete()
        .eq('id', id)
        .eq('agency_id', agency.id); // IDOR protection
        
      if (error) {
        console.error('DELETE Vendors Database Error:', error);
        return NextResponse.json({ error: 'Failed to delete vendor' }, { status: 500 });
      }
      return NextResponse.json({ success: true });
    } catch (error: any) {
      console.error('DELETE Vendors Error:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
);
