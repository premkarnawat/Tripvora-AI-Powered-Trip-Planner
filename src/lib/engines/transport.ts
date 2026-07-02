// Transport discovery — OSRM routing + Nominatim geocoding
// Falls back to Haversine distance estimation if APIs are unavailable

export interface TransportRoute {
  distanceKm: number;
  durationHours: number;
  originHub: string;
  destinationHub: string;
  nearestStations: Array<{ name: string; type: string; distanceKm: number }>;
  suggestedMode: string;
  estimatedFare: number;
  journeyLegs: string[];
}

interface TransportNode {
  name: string;
  category: string;
  distanceKm?: number;
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

interface OSRMRoute {
  distance: number; // meters
  duration: number; // seconds
}

interface OSRMResponse {
  code: string;
  routes?: OSRMRoute[];
}

// --- Haversine (self-contained, no cross-file imports) ---
function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// --- Geocode origin via Nominatim ---
async function geocodeOrigin(
  city: string
): Promise<{ lat: number; lon: number } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'TripvoraApp/1.0' },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;

    const data: NominatimResult[] = await res.json();
    if (!data.length) return null;

    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}

// --- OSRM driving route ---
async function getOSRMRoute(
  originLat: number,
  originLon: number,
  destLat: number,
  destLon: number
): Promise<{ distanceKm: number; durationHours: number } | null> {
  try {
    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${originLon},${originLat};${destLon},${destLat}?overview=false`;

    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return null;

    const data: OSRMResponse = await res.json();
    if (data.code !== 'Ok' || !data.routes?.length) return null;

    const route = data.routes[0];
    return {
      distanceKm: Math.round((route.distance / 1000) * 10) / 10,
      durationHours: Math.round((route.duration / 3600) * 10) / 10,
    };
  } catch {
    return null;
  }
}

// --- Determine travel mode ---
function determineSuggestedMode(
  distanceKm: number,
  nodes: TransportNode[]
): string {
  const hasNearbyAirport = nodes.some(
    (n) =>
      n.category.toLowerCase().includes('airport') &&
      (n.distanceKm ?? Infinity) < 100
  );

  if (hasNearbyAirport && distanceKm > 600) return 'Flight';
  if (distanceKm > 800) return 'Flight';
  if (distanceKm > 200) return 'Train';
  if (distanceKm > 50) return 'Bus';
  if (distanceKm > 5) return 'Auto/Cab';
  return 'Walking';
}

// --- Estimate fare in INR ---
function estimateFare(distanceKm: number, mode: string): number {
  switch (mode) {
    case 'Flight':
      return Math.max(2500, Math.round(distanceKm * 5.5));
    case 'Train':
      return Math.max(300, Math.round(distanceKm * 1.5));
    case 'Bus':
      return Math.max(150, Math.round(distanceKm * 2));
    default:
      return Math.round(distanceKm * 15);
  }
}

// --- Find nearest stations from provided nodes ---
function findNearestStations(
  nodes: TransportNode[]
): Array<{ name: string; type: string; distanceKm: number }> {
  return nodes
    .filter((n) => n.distanceKm !== undefined)
    .sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity))
    .slice(0, 5)
    .map((n) => ({
      name: n.name,
      type: n.category,
      distanceKm: Math.round((n.distanceKm ?? 0) * 10) / 10,
    }));
}

// --- Build journey legs from real station data ---
function buildJourneyLegs(
  origin: string,
  destinationName: string,
  mode: string,
  nodes: TransportNode[]
): string[] {
  const legs: string[] = [];

  // Find relevant departure hub
  const departureHub = findHubByMode(nodes, mode, 'departure');
  const arrivalHub = findHubByMode(nodes, mode, 'arrival');

  const departName = departureHub ?? `${origin}`;
  const arriveName = arrivalHub ?? `${destinationName} Station`;

  legs.push(`Depart from ${departName}`);

  if (mode === 'Flight') {
    const originAirport = nodes.find(
      (n) =>
        n.category.toLowerCase().includes('airport') ||
        n.name.toLowerCase().includes('airport')
    );
    const airportName = originAirport?.name ?? `${origin} Airport`;
    legs.push(`Transfer to ${airportName}`);
    legs.push(`Fly to ${arriveName}`);
  } else if (mode === 'Train') {
    const station = nodes.find(
      (n) =>
        n.category.toLowerCase().includes('railway') ||
        n.category.toLowerCase().includes('train') ||
        n.name.toLowerCase().includes('railway') ||
        n.name.toLowerCase().includes('junction')
    );
    const stationName = station?.name ?? `${destinationName} Station`;
    legs.push(`Train to ${stationName}`);
  } else if (mode === 'Bus') {
    const busStop = nodes.find(
      (n) =>
        n.category.toLowerCase().includes('bus') ||
        n.name.toLowerCase().includes('bus')
    );
    const busName = busStop?.name ?? `${destinationName} Bus Stand`;
    legs.push(`Bus to ${busName}`);
  } else {
    legs.push(`${mode} to ${destinationName}`);
  }

  legs.push(`Arrive at ${destinationName}`);

  return legs;
}

function findHubByMode(
  nodes: TransportNode[],
  mode: string,
  _direction: 'departure' | 'arrival'
): string | null {
  const modeKeywords: Record<string, string[]> = {
    Flight: ['airport', 'aerodrome', 'airfield'],
    Train: ['railway', 'train', 'junction', 'rail'],
    Bus: ['bus', 'isbt', 'depot', 'stand'],
  };

  const keywords = modeKeywords[mode];
  if (!keywords) return null;

  const match = nodes.find((n) => {
    const lower = `${n.name} ${n.category}`.toLowerCase();
    return keywords.some((kw) => lower.includes(kw));
  });

  return match?.name ?? null;
}

// --- Main export ---
export async function discoverTransport(
  origin: string,
  destinationLat: number,
  destinationLon: number,
  destinationName: string,
  transportNodes: TransportNode[]
): Promise<TransportRoute> {
  try {
    // 1. Geocode origin
    const originCoords = await geocodeOrigin(origin);

    let distanceKm: number;
    let durationHours: number;

    if (originCoords) {
      // 2. Try OSRM route
      const osrm = await getOSRMRoute(
        originCoords.lat,
        originCoords.lon,
        destinationLat,
        destinationLon
      );

      if (osrm) {
        distanceKm = osrm.distanceKm;
        durationHours = osrm.durationHours;
      } else {
        // 3. Haversine fallback
        distanceKm = haversineKm(
          originCoords.lat,
          originCoords.lon,
          destinationLat,
          destinationLon
        );
        durationHours = Math.round((distanceKm / 45) * 10) / 10;
      }
    } else {
      // Cannot geocode origin — rough estimate
      distanceKm = 500;
      durationHours = 11.1;
    }

    // 4. Nearest stations
    const nearestStations = findNearestStations(transportNodes);

    // 5. Suggested mode
    const suggestedMode = determineSuggestedMode(distanceKm, transportNodes);

    // 6. Fare estimate
    const estimatedFare = estimateFare(distanceKm, suggestedMode);

    // 7. Journey legs
    const journeyLegs = buildJourneyLegs(
      origin,
      destinationName,
      suggestedMode,
      transportNodes
    );

    // Origin / destination hubs
    const originHub =
      findHubByMode(transportNodes, suggestedMode, 'departure') ?? origin;
    const destinationHub =
      findHubByMode(transportNodes, suggestedMode, 'arrival') ??
      (nearestStations.length > 0
        ? nearestStations[0].name
        : `${destinationName} Station`);

    return {
      distanceKm,
      durationHours,
      originHub,
      destinationHub,
      nearestStations,
      suggestedMode,
      estimatedFare,
      journeyLegs,
    };
  } catch {
    // 9. Sensible defaults on total failure
    return {
      distanceKm: 0,
      durationHours: 0,
      originHub: origin,
      destinationHub: `${destinationName} Station`,
      nearestStations: [],
      suggestedMode: 'Auto/Cab',
      estimatedFare: 500,
      journeyLegs: [
        `Depart from ${origin}`,
        `Arrive at ${destinationName}`,
      ],
    };
  }
}
