// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TRIPVORA — Real Emergency Infrastructure Engine
// Uses Overpass API to find real verified emergency contacts
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface EmergencyFacility {
  name: string;
  type: 'hospital' | 'police' | 'pharmacy' | 'fire_station';
  lat: number;
  lon: number;
  phone?: string;
  distanceKm: number;
}

export interface EmergencyContacts {
  hospital: EmergencyFacility | null;
  police: EmergencyFacility | null;
  pharmacy: EmergencyFacility | null;
  fire: EmergencyFacility | null;
  helplines: {
    police: string;
    ambulance: string;
    fire: string;
    tourist: string;
  };
}

/**
 * Discovers real emergency facilities near the destination coordinates using OpenStreetMap data.
 */
export async function discoverEmergencyContacts(lat: number, lon: number): Promise<EmergencyContacts> {
  const query = `
    [out:json][timeout:15];
    (
      node["amenity"="hospital"](around:10000, ${lat}, ${lon});
      node["amenity"="police"](around:10000, ${lat}, ${lon});
      node["amenity"="pharmacy"](around:5000, ${lat}, ${lon});
      node["amenity"="fire_station"](around:10000, ${lat}, ${lon});
    );
    out body 20;
  `;

  const response = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  if (!response.ok) {
    throw new Error(`OVERPASS_API_FAILED: Failed to fetch emergency data (Status ${response.status})`);
  }

  const data = await response.json();

  if (!data || !data.elements) {
    throw new Error("OVERPASS_API_FAILED: Invalid response structure");
  }

  const facilities: EmergencyFacility[] = data.elements.map((el: any) => ({
    name: el.tags?.name || 'Local Facility',
    type: el.tags?.amenity,
    lat: el.lat,
    lon: el.lon,
    phone: el.tags?.phone || el.tags?.['contact:phone'] || undefined,
    distanceKm: calculateHaversine(lat, lon, el.lat, el.lon),
  }));

  // Find nearest of each type
  const getNearest = (type: string) => {
    const matching = facilities.filter(f => f.type === type);
    if (matching.length === 0) return null;
    return matching.sort((a, b) => a.distanceKm - b.distanceKm)[0];
  };

  // Indian helplines as default, but in a real global app this would use a country code mapping
  const helplines = {
    police: '112', // Universal emergency in India
    ambulance: '102',
    fire: '101',
    tourist: '1363', // Indian Tourist Helpline
  };

  return {
    hospital: getNearest('hospital'),
    police: getNearest('police'),
    pharmacy: getNearest('pharmacy'),
    fire: getNearest('fire_station'),
    helplines
  };
}

// Simple Haversine for local sorting
function calculateHaversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
