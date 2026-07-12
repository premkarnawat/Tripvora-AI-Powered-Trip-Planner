import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withSecurity } from '@/lib/security/api-wrapper';
import { z } from 'zod';

// Strip HTML tags to prevent stored XSS
function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim();
}

const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .transform(stripHtml),
  email: z
    .string()
    .email('Invalid email address')
    .max(254, 'Email must not exceed 254 characters')
    .transform((v) => v.toLowerCase().trim()),
  subject: z
    .string()
    .max(200, 'Subject must not exceed 200 characters')
    .optional()
    .transform((v) => (v ? stripHtml(v) : undefined)),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must not exceed 2000 characters')
    .transform(stripHtml),
});

const handler = async (request: Request) => {
  const body = await request.json();

  // Validate and sanitize input
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: 'Validation Error',
        details: parsed.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      },
      { status: 400 }
    );
  }

  const { name, email, subject, message } = parsed.data;

  const supabase = await createClient();

  const { error } = await supabase.from('agency_leads').insert({
    agency_id: '771e7a50-01c0-482a-a9e9-158a1bc1c2da', // Default demo agency
    destination: subject || 'General Inquiry',
    budget: 50000,
    status: 'New',
    notes: `Message from ${name} (${email}): ${message}`,
  });

  if (error) {
    // Log internally but never expose database errors to the client
    console.error('[CONTACT_INSERT_ERROR]', error.message);
    return NextResponse.json(
      { success: false, error: 'Failed to process your request. Please try again later.' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Message sent successfully!',
  });
};

export const POST = withSecurity(
  {
    rateLimit: { limit: 10, windowSeconds: 3600 },
  },
  handler
);
