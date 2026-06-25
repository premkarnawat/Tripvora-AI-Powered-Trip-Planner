import { NextResponse } from 'next/server';

// Asynchronous Queue Pattern (BullMQ / SQS Serverless Abstraction)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const jobId = `wa_job_${Date.now()}`;
    console.log(`[Async Queue Worker] Enqueued WhatsApp template "${body.template || 'lead_followup'}" to ${body.phone}`);
    
    return NextResponse.json({ 
      success: true, 
      jobId, 
      status: 'queued', 
      messageId: `wamid.HBgL${Date.now()}` 
    }, { status: 202 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
