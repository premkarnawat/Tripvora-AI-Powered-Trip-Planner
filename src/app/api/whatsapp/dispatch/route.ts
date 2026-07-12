import { NextResponse } from 'next/server';
import { withSecurity } from '@/lib/security/api-wrapper';

// Asynchronous Queue Pattern (BullMQ / SQS Serverless Abstraction)
// Returns 501 until the WhatsApp Business API integration is deployed
const handler = async (request: Request) => {
  return NextResponse.json(
    {
      success: false,
      error: 'Not Implemented',
      message: 'WhatsApp dispatch service is not yet available. This feature is under development.',
    },
    { status: 501 }
  );
};

export const POST = withSecurity(
  {
    requireAuth: true,
    rateLimit: { limit: 10, windowSeconds: 60 },
  },
  handler
);
