import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withSecurity } from '@/lib/security/api-wrapper';
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  role: z.enum(['traveler', 'admin', 'agency_admin', 'agency_agent']).optional(),
  status: z.string().optional()
});

const updateUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email().optional(),
  name: z.string().min(2).optional(),
  role: z.enum(['traveler', 'admin', 'agency_admin', 'agency_agent']).optional(),
  status: z.string().optional()
});

export const GET = withSecurity(
  {
    requireAuth: true,
    requireRoles: ['admin', 'super_admin'],
    rateLimit: { limit: 30, windowSeconds: 60 }
  },
  async (request: Request) => {
    try {
      const supabase = await createClient();
      // Masking PII for lower-level admins (defense in depth against scraping)
      const { data: { user } } = await supabase.auth.getUser();
      const isSuperAdmin = user?.user_metadata?.role === 'super_admin';

      const { data: users, error: usersError } = await supabase
        .from('users')
        .select(`*, trips (id)`)
        .order('created_at', { ascending: false });

      if (usersError) {
        console.error("Users Fetch Error:", usersError);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
      }

      const formattedUsers = users.map((u: any) => {
        // PII Masking: Show raw data only to super_admin, otherwise mask
        const safeEmail = isSuperAdmin ? u.email : (u.email ? `${u.email.substring(0, 3)}***@${u.email.split('@')[1]}` : "N/A");
        const safePhone = isSuperAdmin ? (u.phone || "+91 9876543210") : "+91 98******10";

        return {
          id: `usr-${u.id.substring(0, 4)}`,
          real_id: u.id,
          name: u.full_name || "Unknown User",
          email: safeEmail,
          phone: safePhone,
          type: u.role === 'admin' ? "Admin" : (u.role === 'agency_admin' ? "Agency Admin" : (u.role === 'agency_agent' ? "Agency Agent" : "Regular Traveler")),
          trips: u.trips ? u.trips.length : 0,
          bookings: 2,
          status: u.status || "Active",
          joinedDate: u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : "Unknown",
          premiumPlan: "Free Tier",
          totalPaid: "₹0"
        };
      });

      return NextResponse.json(formattedUsers, {
        headers: { 'Cache-Control': 'private, max-age=30, stale-while-revalidate=60' }
      });
    } catch (error: any) {
      console.error('GET Users Error:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
);

export const POST = withSecurity(
  {
    requireAuth: true,
    requireRoles: ['admin', 'super_admin'],
    schema: userSchema,
    rateLimit: { limit: 20, windowSeconds: 60 }
  },
  async (request: Request) => {
    try {
      const supabase = await createClient();
      const body = await request.json();
      
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          email: body.email,
          full_name: body.name,
          role: body.role || 'traveler'
        })
        .select()
        .single();

      if (error) {
        console.error('POST Users Database Error:', error);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
      }
      return NextResponse.json({ user: newUser }, { status: 201 });
    } catch (error: any) {
      console.error('POST Users Error:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
);

export const PUT = withSecurity(
  {
    requireAuth: true,
    requireRoles: ['super_admin'], // Only super_admin can modify users to prevent privilege escalation
    schema: updateUserSchema,
    rateLimit: { limit: 20, windowSeconds: 60 }
  },
  async (request: Request) => {
    try {
      const supabase = await createClient();
      const body = await request.json();
      
      const { id, ...updates } = body;
      
      // Map to db column names
      const dbUpdates: any = {};
      if (updates.email) dbUpdates.email = updates.email;
      if (updates.name) dbUpdates.full_name = updates.name;
      if (updates.role) dbUpdates.role = updates.role;
      if (updates.status) dbUpdates.status = updates.status;

      const { data: updated, error } = await supabase
        .from('users')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('PUT Users Database Error:', error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
      }
      
      return NextResponse.json({ user: updated });
    } catch (error: any) {
      console.error('PUT Users Error:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
);

export const DELETE = withSecurity(
  {
    requireAuth: true,
    requireRoles: ['super_admin'], // Only super_admin can delete users
    rateLimit: { limit: 10, windowSeconds: 60 }
  },
  async (request: Request) => {
    try {
      const supabase = await createClient();
      const { searchParams } = new URL(request.url);
      const id = searchParams.get('id');
      
      if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
        return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
      }

      const { error } = await supabase.from('users').delete().eq('id', id);
      
      if (error) {
        console.error('DELETE Users Database Error:', error);
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
      }
      return NextResponse.json({ success: true });
    } catch (error: any) {
      console.error('DELETE Users Error:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
);
