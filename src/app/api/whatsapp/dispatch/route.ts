import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log(`[Meta WhatsApp Queue] Dispatching template "${body.template || 'lead_followup'}" to ${body.phone || '+919876543210'}`);
    
    // In production this connects to Meta Graph API
    return NextResponse.json({ success: true, status: 'dispatched', messageId: `wamid.HBgL${Date.now()}` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
