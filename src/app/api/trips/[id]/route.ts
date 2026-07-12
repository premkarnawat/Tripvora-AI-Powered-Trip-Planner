import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withSecurity } from '@/lib/security/api-wrapper';

const handler = async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  // Validate ID format — must be a valid UUID to prevent injection
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!id || !uuidRegex.test(id)) {
    return NextResponse.json(
      { success: false, error: 'Invalid trip identifier' },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  // Authentication is enforced by withSecurity wrapper (requireAuth: true)
  // Fetch authenticated user for authorization (IDOR protection)
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const { data: trip, error } = await supabase
    .from('trips')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !trip) {
    // Intentionally vague — do not reveal whether the ID exists
    return NextResponse.json(
      { success: false, error: 'Trip not found or access denied' },
      { status: 404 }
    );
  }

  // Authorization: verify the trip belongs to the requesting user (IDOR protection)
  if (trip.user_id !== user.id) {
    // Return 404 instead of 403 to prevent enumeration
    return NextResponse.json(
      { success: false, error: 'Trip not found or access denied' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: trip }, {
    headers: { 'Cache-Control': 'private, no-store, max-age=0' }
  });
};

export const GET = withSecurity(
  {
    requireAuth: true,
    rateLimit: { limit: 30, windowSeconds: 60 },
  },
  handler
);
