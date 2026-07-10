import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { checkRateLimit, rateLimitResponse, RateLimitConfig } from './rate-limit';

export type ApiHandler = (req: Request, ctx: any) => Promise<NextResponse>;

export interface WrapperOptions {
  requireAuth?: boolean;
  requireRoles?: string[];
  schema?: z.ZodType<any, any, any>;
  rateLimit?: RateLimitConfig;
}

export function withSecurity(options: WrapperOptions, handler: ApiHandler): ApiHandler {
  return async (req: Request, ctx: any) => {
    try {
      // 1. Rate Limiting
      if (options.rateLimit) {
        const ip = req.headers.get('x-forwarded-for') || 'anonymous';
        const url = new URL(req.url);
        const { success, headers } = checkRateLimit(ip, url.pathname, options.rateLimit);
        
        if (!success) {
          return rateLimitResponse(headers);
        }
      }

      // 2. Authentication
      let user = null;
      if (options.requireAuth || options.requireRoles) {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.getUser();
        
        if (error || !data?.user) {
          return NextResponse.json({ success: false, error: 'Unauthorized', message: 'Valid session required' }, { status: 401 });
        }
        user = data.user;

        // 3. Authorization (RBAC)
        if (options.requireRoles && options.requireRoles.length > 0) {
          const userRole = user.user_metadata?.role || 'traveler';
          
          // Super admin overrides everything
          if (userRole !== 'super_admin' && !options.requireRoles.includes(userRole)) {
            return NextResponse.json({ success: false, error: 'Forbidden', message: 'Insufficient privileges' }, { status: 403 });
          }
        }
      }

      // 4. Input Validation
      if (options.schema && req.method !== 'GET' && req.method !== 'DELETE') {
        try {
          const clonedReq = req.clone();
          const body = await clonedReq.json();
          options.schema.parse(body);
        } catch (validationError: any) {
          return NextResponse.json({ 
            success: false, 
            error: 'Validation Error', 
            details: validationError.errors 
          }, { status: 400 });
        }
      }

      // 5. Execute Handler
      return await handler(req, ctx);

    } catch (error: any) {
      console.error('[API_ERROR]', error);
      return NextResponse.json(
        { success: false, error: 'Internal Server Error', message: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred' },
        { status: 500 }
      );
    }
  };
}
