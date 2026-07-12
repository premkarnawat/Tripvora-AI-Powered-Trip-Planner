import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withSecurity } from '@/lib/security/api-wrapper';
import { z } from 'zod';

const schema = z.object({});

export const GET = withSecurity({
  requireRoles: ['admin', 'super_admin']
}, async (request: Request) => {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
        const { data } = await supabase.from('help_articles').select('*').eq('id', id).single();
        return NextResponse.json(data || {});
    }

    const { data } = await supabase.from('help_articles').select('*').order('created_at', { ascending: false }).limit(100);
    return NextResponse.json(data || [], { headers: { 'Cache-Control': 'private, max-age=30' } });
  } catch (err: any) { 
    return NextResponse.json({ error: err.message }, { status: 500 }); 
  }
});

export const POST = withSecurity({
  requireRoles: ['admin', 'super_admin'],
  schema: schema
}, async (request: Request) => {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const validatedData = schema.parse(body); // Zod strips unknown fields!
    
    const { data, error } = await supabase.from('help_articles').insert(validatedData).select().single();
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (err: any) { 
    return NextResponse.json({ error: err.message }, { status: 500 }); 
  }
});

export const PUT = withSecurity({
  requireRoles: ['admin', 'super_admin']
}, async (request: Request) => {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    
    const validatedUpdates = schema.parse(updates); // Zod strips unknown fields!
    
    const { data, error } = await supabase.from('help_articles').update(validatedUpdates).eq('id', id).select().single();
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (err: any) { 
    return NextResponse.json({ error: err.message }, { status: 500 }); 
  }
});

export const DELETE = withSecurity({
  requireRoles: ['admin', 'super_admin']
}, async (request: Request) => {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const { error } = await supabase.from('help_articles').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) { 
    return NextResponse.json({ error: err.message }, { status: 500 }); 
  }
});
