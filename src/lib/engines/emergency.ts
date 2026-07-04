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

  const endpoints = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://lz4.overpass-api.de/api/interpreter"
  ];

  let data = null;

  for (const OVERPASS_URL of endpoints) {
    try {
      console.log("OVERPASS_REQUEST: Initiating");
      console.log("OVERPASS_URL:", OVERPASS_URL);
      console.log("OVERPASS_QUERY:", query);
      
      const response = await fetch(OVERPASS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `data=${encodeURIComponent(query)}`
      });
      
      console.log("OVERPASS_STATUS:", response.status);
      
      if (response.ok) {
        data = await response.json();
        console.log("OVERPASS_RESPONSE: Success, elements:", data?.elements?.length);
        if (data && data.elements) break;
      } else {
        console.error("OVERPASS_ERROR: API returned status", response.status);
      }
    } catch (e) {
      console.error("OVERPASS_ERROR: Exception during fetch", e);
    }
  }

  const helplines = {
    police: '112',
    ambulance: '102',
    fire: '101',
    tourist: '1363',
  };

  if (!data || !data.elements) {
    console.error("OVERPASS_API_FAILED: All emergency endpoints failed or returned invalid data.");
    return {
      hospital: null,
      police: null,
      pharmacy: null,
      fire: null,
      helplines
    };
  }

  const facilities: EmergencyFacility[] = data.elements.map((el: any) => ({
    name: el.tags?.name || 'Local Facility',
    type: el.tags?.amenity,
    lat: el.lat,
    lon: el.lon,
    phone: el.tags?.phone || el.tags?.['contact:phone'] || undefined,
    distanceKm: calculateHaversine(lat, lon, el.lat, el.lon),
  }));

  const getNearest = (type: string) => {
    const matching = facilities.filter(f => f.type === type);
    if (matching.length === 0) return null;
    return matching.sort((a, b) => a.distanceKm - b.distanceKm)[0];
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
