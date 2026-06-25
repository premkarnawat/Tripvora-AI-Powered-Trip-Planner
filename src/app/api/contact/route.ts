import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { error } = await supabase
      .from('agency_leads')
      .insert({
        agency_id: '771e7a50-01c0-482a-a9e9-158a1bc1c2da', // Default demo agency
        destination: body.subject || 'General Inquiry',
        budget: 50000,
        status: 'New',
        notes: `Message from ${body.name} (${body.email}): ${body.message}`
      });

    if (error) console.warn("Contact DB insert warning:", error.message);

    return NextResponse.json({ success: true, message: "Message sent successfully!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
