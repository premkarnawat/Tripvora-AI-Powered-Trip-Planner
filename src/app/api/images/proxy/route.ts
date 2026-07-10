import { NextResponse } from 'next/server';

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
    const res = await fetch(targetUrl);
    if (!res.ok) throw new Error('Upstream API error');

    // Return the raw image buffer proxied from Google
    const buffer = await res.arrayBuffer();
    
    // Default to jpeg but in a real app you might sniff the content type
    const headers = new Headers();
    headers.set('Content-Type', res.headers.get('content-type') || 'image/jpeg');
    headers.set('Cache-Control', 'public, max-age=31536000, immutable'); // Cache for 1 year

    return new NextResponse(buffer, {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Image proxy failed:', error);
    return new NextResponse('Failed to proxy image', { status: 502 });
  }
}
