import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: trip, error } = await supabase
      .from('trips')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    return NextResponse.json(trip, {
      headers: { 'Cache-Control': 'private, max-age=60, stale-while-revalidate=300' }
    });
  } catch (err: any) {
    console.error("Single trip fetch exception:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
