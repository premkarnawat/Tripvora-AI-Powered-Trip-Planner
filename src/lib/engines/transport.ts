// ─── Transport Feasibility & Route Engine ───────────────────────────
// Discovers real transport hubs, calculates routes, determines feasibility

export interface TransportRoute {
  distanceKm: number;
  durationHours: number;
  originHub: string;
  destinationHub: string;
  nearestStations: Array<{ name: string; type: string; distanceKm: number }>;
  suggestedMode: string;
  estimatedFare: number;
  journeyLegs: string[];
  nearestAirport: { name: string; distanceKm: number } | null;
  nearestRailway: { name: string; distanceKm: number } | null;
  nearestBusStand: { name: string; distanceKm: number } | null;
  feasibility: {
    byFlight: boolean;
    byTrain: boolean;
    byBus: boolean;
    byCar: boolean;
  };
}

interface TransportNode {
  name: string;
  category: string;
  distanceKm?: number;
}

// ─── Haversine (self-contained) ─────────────────────────────────────

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── Geocode origin city ────────────────────────────────────────────

async function geocodeCity(city: string): Promise<{ lat: number; lon: number } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Tripvora/1.0' },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const data: Array<{ lat: string; lon: string }> = await res.json();
    if (!data.length) return null;
    const lat = parseFloat(data[0].lat);
    const lon = parseFloat(data[0].lon);
    if (isNaN(lat) || isNaN(lon)) return null;
    return { lat, lon };
  } catch (err: unknown) {
    throw new Error(`GEOCODE_CITY_FAILED: Failed to geocode origin city "${city}" - ${err instanceof Error ? err.message : String(err)}`);
  }
}

// ─── OpenRouteService driving route ────────────────────────────────────────────

async function getOpenRouteServiceRoute(
  oLat: number, oLon: number, dLat: number, dLon: number
): Promise<{ distanceKm: number; durationHours: number } | null> {
  try {
    const apiKey = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjI2N2U1MmNlMjY2YzQyNDk4OTliYzBjNTYzM2RjMmU0IiwiaCI6Im11cm11cjY0In0=';
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${oLon},${oLat}&end=${dLon},${dLat}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.features || !data.features.length) return null;
    const summary = data.features[0].properties.summary;
    return {
      distanceKm: Math.round(summary.distance / 1000),
      durationHours: Math.round((summary.duration / 3600) * 10) / 10,
    };
  } catch (err: unknown) {
    throw new Error(`OPENROUTESERVICE_FAILED: Failed to fetch OpenRouteService route - ${err instanceof Error ? err.message : String(err)}`);
  }
}

// ─── Find nearest transport hubs ────────────────────────────────────

function findNearest(nodes: TransportNode[], category: string): { name: string; distanceKm: number } | null {
  const filtered = nodes
    .filter(n => n.category === category && n.name && n.name.length > 2)
    .sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));

  if (filtered.length === 0) return null;
  return { name: filtered[0].name, distanceKm: filtered[0].distanceKm ?? 0 };
}

// ─── Fare estimation (Indian context) ───────────────────────────────

function estimateFare(mode: string, distanceKm: number): number {
  // NOTE: These are rough formula-based estimates since real-time APIs for Indian trains/buses are not available.
  switch (mode) {
    case 'Flight':
      return Math.max(Math.min(Math.round(distanceKm * 5.5), 15000), 2500);
    case 'Train (AC)':
      return Math.max(Math.round(distanceKm * 2.5), 500);
    case 'Train':
    case 'Train (Sleeper)':
      return Math.max(Math.round(distanceKm * 1.2), 200);
    case 'Bus (AC)':
      return Math.max(Math.round(distanceKm * 2.5), 300);
    case 'Bus':
      return Math.max(Math.round(distanceKm * 1.5), 100);
    case 'Cab':
      return Math.max(Math.round(distanceKm * 12), 500);
    case 'Auto':
      return Math.max(Math.round(distanceKm * 15), 50);
    default:
      return Math.max(Math.round(distanceKm * 2), 200);
  }
}

// ─── Main Export ────────────────────────────────────────────────────

export async function discoverTransport(
  origin: string,
  destinationLat: number,
  destinationLon: number,
  destinationName: string,
  transportNodes: TransportNode[]
): Promise<TransportRoute> {
  // Defaults
  const defaults: TransportRoute = {
    distanceKm: 0,
    durationHours: 0,
    originHub: origin,
    destinationHub: destinationName,
    nearestStations: [],
    suggestedMode: 'Bus',
    estimatedFare: 0,
    journeyLegs: [origin, destinationName],
    nearestAirport: null,
    nearestRailway: null,
    nearestBusStand: null,
    feasibility: { byFlight: false, byTrain: false, byBus: true, byCar: true },
  };

  try {
    // 1. Find nearest transport hubs
    const nearestAirport = findNearest(transportNodes, 'airport');
    const nearestRailway = findNearest(transportNodes, 'station');
    const nearestBusStand = findNearest(transportNodes, 'bus_stand');

    defaults.nearestAirport = nearestAirport;
    defaults.nearestRailway = nearestRailway;
    defaults.nearestBusStand = nearestBusStand;

    // Build all stations list
    defaults.nearestStations = transportNodes
      .filter(n => n.name && n.name.length > 2)
      .slice(0, 10)
      .map(n => ({ name: n.name, type: n.category, distanceKm: n.distanceKm ?? 0 }));

    // 2. Geocode origin
    const originGeo = await geocodeCity(origin);
    let distanceKm = 0;
    let durationHours = 0;

    if (originGeo) {
      // 3. Get OpenRouteService driving route
      const osrm = await getOpenRouteServiceRoute(originGeo.lat, originGeo.lon, destinationLat, destinationLon);
      if (osrm) {
        distanceKm = osrm.distanceKm;
        durationHours = osrm.durationHours;
      } else {
        // Fallback to Haversine
        distanceKm = Math.round(haversineKm(originGeo.lat, originGeo.lon, destinationLat, destinationLon));
        durationHours = Math.round((distanceKm / 45) * 10) / 10; // ~45 km/h average
      }
    }

    defaults.distanceKm = distanceKm;
    defaults.durationHours = durationHours;

    // 4. Determine feasibility
    const feasibility = {
      byFlight: nearestAirport !== null && nearestAirport.distanceKm < 150,
      byTrain: nearestRailway !== null && nearestRailway.distanceKm < 100,
      byBus: true,
      byCar: true,
    };
    defaults.feasibility = feasibility;

    // 5. Smart mode selection
    let suggestedMode = 'Bus';
    if (distanceKm > 800 && feasibility.byFlight) {
      suggestedMode = 'Flight';
    } else if (distanceKm > 600 && feasibility.byFlight) {
      suggestedMode = 'Flight'; // prefer flight for 600+ if available
    } else if (distanceKm > 200 && feasibility.byTrain) {
      suggestedMode = 'Train';
    } else if (distanceKm > 200) {
      suggestedMode = 'Bus (AC)';
    } else if (distanceKm > 50 && feasibility.byTrain) {
      suggestedMode = 'Train';
    } else if (distanceKm > 50) {
      suggestedMode = 'Bus';
    } else if (distanceKm > 5) {
      suggestedMode = 'Cab';
    } else {
      suggestedMode = 'Auto';
    }

    defaults.suggestedMode = suggestedMode;
    defaults.estimatedFare = estimateFare(suggestedMode, distanceKm);

    // 6. Determine destination hub (real name)
    let destHub = destinationName;
    if (suggestedMode === 'Flight' && nearestAirport) {
      destHub = nearestAirport.name;
    } else if ((suggestedMode === 'Train' || suggestedMode === 'Train (AC)') && nearestRailway) {
      destHub = nearestRailway.name;
    } else if ((suggestedMode === 'Bus' || suggestedMode === 'Bus (AC)') && nearestBusStand) {
      destHub = nearestBusStand.name;
    } else if (nearestRailway) {
      destHub = nearestRailway.name;
    } else if (nearestBusStand) {
      destHub = nearestBusStand.name;
    }
    defaults.destinationHub = destHub;
    defaults.originHub = origin;

    // 7. Build journey legs with REAL names
    const legs: string[] = [origin];

    if (suggestedMode === 'Flight' && nearestAirport) {
      legs.push(`Flight to ${nearestAirport.name} (~${Math.round(distanceKm * 0.7)}km, ${Math.max(1, Math.round(durationHours * 0.3))}h)`);
      legs.push(nearestAirport.name);
      if (nearestAirport.distanceKm > 10) {
        legs.push(`Local transport to ${destinationName} (${nearestAirport.distanceKm.toFixed(0)}km)`);
      }
    } else if (suggestedMode.includes('Train') && nearestRailway) {
      const trainDuration = Math.round(durationHours * 0.8);
      legs.push(`${suggestedMode} to ${nearestRailway.name} (~${distanceKm}km, ${trainDuration}h)`);
      legs.push(nearestRailway.name);
      if (nearestRailway.distanceKm > 3) {
        const lastMile = nearestBusStand
          ? `Local bus to ${nearestBusStand.name} (${nearestRailway.distanceKm.toFixed(0)}km)`
          : `Auto/cab to ${destinationName} (${nearestRailway.distanceKm.toFixed(0)}km)`;
        legs.push(lastMile);
      }
    } else if (suggestedMode.includes('Bus') && nearestBusStand) {
      legs.push(`${suggestedMode} to ${nearestBusStand.name} (~${distanceKm}km, ${Math.round(durationHours)}h)`);
      legs.push(nearestBusStand.name);
    } else if (suggestedMode === 'Cab') {
      legs.push(`Cab to ${destinationName} (~${distanceKm}km, ${Math.round(durationHours)}h)`);
    } else {
      legs.push(`${suggestedMode} to ${destinationName}`);
    }

    legs.push(destinationName);
    // De-duplicate consecutive identical entries
    defaults.journeyLegs = legs.filter((leg, i) => i === 0 || leg !== legs[i - 1]);

    return defaults;
  } catch (err: unknown) {
    throw new Error(`TRANSPORT_DISCOVERY_FAILED: ${err instanceof Error ? err.message : String(err)}`);
  }
}
