import type { NextConfig } from "next";

const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.unsplash.com https://*.googleapis.com https://upload.wikimedia.org https://api.mapbox.com",
  "font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com",
  "connect-src 'self' https://*.supabase.co https://nominatim.openstreetmap.org https://api.open-meteo.com https://en.wikipedia.org https://generativelanguage.googleapis.com https://api.openrouteservice.org https://maps.googleapis.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ');

const nextConfig: NextConfig = {
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          { key: 'Content-Security-Policy', value: cspDirectives },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self), payment=(self)' },
        ],
      },
    ]
  },
};

export default nextConfig;
