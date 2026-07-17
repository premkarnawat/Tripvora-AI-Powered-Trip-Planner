/**
 * Place Details API — Lazy Loading Endpoint
 * 
 * GET /api/places/[id]/details
 * 
 * Returns cached place details or fetches from Google Place Details API.
 * This endpoint implements Stage 3 of the three-tier caching strategy:
 * the user clicks a place card → frontend calls this → returns details.
 */

import { NextResponse } from 'next/server';
import { getCachedPlace, fetchPlaceDetails, getPlacePhotoUrl } from '@/lib/engines/place-cache';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: placeId } = await params;

    if (!placeId || placeId.length < 5) {
      return NextResponse.json(
        { success: false, error: 'Invalid place ID' },
        { status: 400 }
      );
    }

    // Check cache first
    const cached = getCachedPlace(placeId);
    if (cached) {
      return NextResponse.json({
        success: true,
        source: 'cache',
        details: {
          ...cached,
          // Convert photo references to URLs for the frontend
          photoUrls: cached.photos.slice(0, 3).map(ref => getPlacePhotoUrl(ref, 600)),
        },
      });
    }

    // Cache miss — fetch from Google
    const details = await fetchPlaceDetails(placeId);
    if (!details) {
      return NextResponse.json(
        { success: false, error: 'Place not found or API error' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      source: 'api',
      details: {
        ...details,
        photoUrls: details.photos.slice(0, 3).map(ref => getPlacePhotoUrl(ref, 600)),
      },
    });
  } catch (err) {
    console.error('Place details error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
