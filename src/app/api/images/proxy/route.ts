import { NextResponse } from 'next/server';

const imageCache = new Map<string, ArrayBuffer>();
const MAX_CACHE_SIZE = 100;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ref = searchParams.get('ref');

  if (!ref) {
    return new NextResponse('Missing photo reference', { status: 400 });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return new NextResponse('Server configuration missing', { status: 500 });
  }

  const targetUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${ref}&key=${apiKey}`;

  try {
    let buffer: ArrayBuffer;
    let contentType = 'image/jpeg';
    
    if (imageCache.has(ref)) {
      buffer = imageCache.get(ref)!;
    } else {
      const res = await fetch(targetUrl);
      if (!res.ok) throw new Error('Upstream API error');
      
      buffer = await res.arrayBuffer();
      contentType = res.headers.get('content-type') || 'image/jpeg';
      
      if (imageCache.size >= MAX_CACHE_SIZE) {
        const firstKey = imageCache.keys().next().value;
        if (firstKey) imageCache.delete(firstKey);
      }
      imageCache.set(ref, buffer);
    }
    
    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=2592000, immutable', // 30 days
        'CDN-Cache-Control': 'public, max-age=2592000',
      },
    });
  } catch (error) {
    console.error('Image proxy failed:', error);
    return new NextResponse('Failed to proxy image', { status: 502 });
  }
}
