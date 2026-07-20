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
      // 1. Authentication
      let user = null;
      let authAttempted = false;
      const supabase = await createClient();

      if (options.requireAuth || options.requireRoles) {
        authAttempted = true;
        
        const { data, error } = await supabase.auth.getUser();
        
        if (error || !data?.user) {
          const errMsg = error?.message || "No user found in session";
          return NextResponse.json({ success: false, error: 'Unauthorized', message: `Valid session required: ${errMsg}` }, { status: 401 });
        }
        user = data.user;
      } else if (options.rateLimit) {
        // Even if auth isn't required, try to get the user for rate limiting to prevent IP rotation
        authAttempted = true;
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          user = data.user;
        }
      }

      // 2. Identity-Based Rate Limiting
      if (options.rateLimit) {
        const ip = req.headers.get('x-forwarded-for') || 'anonymous';
        // Use user.id if authenticated, otherwise fallback to IP
        const identifier = user ? `usr_${user.id}` : `ip_${ip}`;
        const url = new URL(req.url);
        const { success, headers } = await checkRateLimit(identifier, url.pathname, options.rateLimit);
        
        if (!success) {
          return rateLimitResponse(headers);
        }
      }

      // 3. Authorization (RBAC)
      if (options.requireRoles && options.requireRoles.length > 0 && user) {
        const userRole = user.user_metadata?.role || 'traveler';
        
        // Super admin overrides everything
        if (userRole !== 'super_admin' && !options.requireRoles.includes(userRole)) {
          return NextResponse.json({ success: false, error: 'Forbidden', message: 'Insufficient privileges' }, { status: 403 });
        }
      }

      // 4. Input Validation
      if (options.schema) {
        try {
          const clonedReq = req.clone();
          const body = await clonedReq.json();
          const validationResult = options.schema.safeParse(body);
          
          if (!validationResult.success) {
            return NextResponse.json({ 
              success: false, 
              error: 'Validation Error', 
              details: validationResult.error.format() 
            }, { status: 400 });
          }
        } catch (e) {
          return NextResponse.json({ success: false, error: 'Bad Request', message: 'Invalid JSON body' }, { status: 400 });
        }
      }

      // 5. Execute Handler
      return await handler(req, ctx);

    } catch (error: any) {
      console.error('API Error:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Internal Server Error',
        message: 'An unexpected error occurred'
      }, { status: 500 });
    }
  };
}
