// ─── Geo-Cluster Engine ─────────────────────────────────────────────
// Groups attractions by proximity for day planning using greedy clustering

export interface GeoCluster {
  centroid: { lat: number; lon: number };
  places: Place[];
  totalWalkingKm: number;
  suggestedOrder: string[];
}

import { Place } from './places';

// ─── Walking tolerance radius mapping ───────────────────────────────

const TOLERANCE_RADIUS: Record<string, number> = {
  minimal: 1,
  low: 2,
  medium: 4,
  high: 8,
};

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

// ─── Compute centroid of a set of places ────────────────────────────

function computeCentroid(places: Place[]): { lat: number; lon: number } {
  if (places.length === 0) return { lat: 0, lon: 0 };
  const sumLat = places.reduce((s, p) => s + p.lat, 0);
  const sumLon = places.reduce((s, p) => s + p.lon, 0);
  return {
    lat: sumLat / places.length,
    lon: sumLon / places.length,
  };
}

// ─── Nearest-neighbor TSP for visit order ───────────────────────────

function nearestNeighborOrder(places: Place[]): string[] {
  if (places.length === 0) return [];
  if (places.length === 1) return [places[0].name];

  const remaining = [...places];
  const order: Place[] = [];

  // Start from the place closest to the centroid
  const centroid = computeCentroid(remaining);
  let closestIdx = 0;
  let closestDist = Infinity;
  for (let i = 0; i < remaining.length; i++) {
    const d = haversineKm(centroid.lat, centroid.lon, remaining[i].lat, remaining[i].lon);
    if (d < closestDist) {
      closestDist = d;
      closestIdx = i;
    }
  }

  order.push(remaining.splice(closestIdx, 1)[0]);

  while (remaining.length > 0) {
    const current = order[order.length - 1];
    let nearestIdx = 0;
    let nearestDist = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const d = haversineKm(current.lat, current.lon, remaining[i].lat, remaining[i].lon);
      if (d < nearestDist) {
        nearestDist = d;
        nearestIdx = i;
      }
    }

    order.push(remaining.splice(nearestIdx, 1)[0]);
  }

  return order.map(p => p.name);
}

// ─── Calculate total walking distance along ordered route ───────────

function totalWalkingDistance(places: Place[], order: string[]): number {
  if (order.length <= 1) return 0;

  const nameToPlace = new Map<string, Place>();
  for (const p of places) {
    nameToPlace.set(p.name, p);
  }

  let total = 0;
  for (let i = 0; i < order.length - 1; i++) {
    const a = nameToPlace.get(order[i]);
    const b = nameToPlace.get(order[i + 1]);
    if (a && b) {
      total += haversineKm(a.lat, a.lon, b.lat, b.lon);
    }
  }

  return Math.round(total * 100) / 100;
}

// ─── Greedy k-means-like clustering ─────────────────────────────────

export function greedyCluster(places: Place[], maxClusters: number, maxRadiusKm: number): Place[][] {
  if (places.length === 0) return [];
  if (places.length === 1) return [[places[0]]];

  // Initialize centroids using farthest-first traversal for better spread
  const centroids: { lat: number; lon: number }[] = [];
  const assigned: number[] = new Array(places.length).fill(-1);

  // First centroid: overall centroid of all places
  const globalCentroid = computeCentroid(places);

  // Pick the place closest to global centroid as first seed
  let firstIdx = 0;
  let firstDist = Infinity;
  for (let i = 0; i < places.length; i++) {
    const d = haversineKm(globalCentroid.lat, globalCentroid.lon, places[i].lat, places[i].lon);
    if (d < firstDist) {
      firstDist = d;
      firstIdx = i;
    }
  }
  centroids.push({ lat: places[firstIdx].lat, lon: places[firstIdx].lon });

  // Pick remaining seeds by farthest-first from existing centroids
  const k = Math.min(maxClusters, places.length);
  while (centroids.length < k) {
    let farthestIdx = -1;
    let farthestMinDist = -1;

    for (let i = 0; i < places.length; i++) {
      // Find minimum distance from this place to any existing centroid
      let minDist = Infinity;
      for (const c of centroids) {
        const d = haversineKm(c.lat, c.lon, places[i].lat, places[i].lon);
        if (d < minDist) minDist = d;
      }
      if (minDist > farthestMinDist) {
        farthestMinDist = minDist;
        farthestIdx = i;
      }
    }

    if (farthestIdx >= 0) {
      centroids.push({ lat: places[farthestIdx].lat, lon: places[farthestIdx].lon });
    } else {
      break;
    }
  }

  // Iterative assignment and centroid update (k-means style, max 20 iterations)
  for (let iter = 0; iter < 20; iter++) {
    let changed = false;

    // Assignment step: assign each place to nearest centroid within radius
    for (let i = 0; i < places.length; i++) {
      let bestCluster = 0;
      let bestDist = Infinity;

      for (let c = 0; c < centroids.length; c++) {
        const d = haversineKm(centroids[c].lat, centroids[c].lon, places[i].lat, places[i].lon);
        if (d < bestDist) {
          bestDist = d;
          bestCluster = c;
        }
      }

      if (assigned[i] !== bestCluster) {
        assigned[i] = bestCluster;
        changed = true;
      }
    }

    if (!changed) break;

    // Update step: recompute centroids
    for (let c = 0; c < centroids.length; c++) {
      const members = places.filter((_, i) => assigned[i] === c);
      if (members.length > 0) {
        const newCentroid = computeCentroid(members);
        centroids[c] = newCentroid;
      }
    }
  }

  // Split clusters that exceed max radius
  const clusters: Place[][] = [];
  for (let c = 0; c < centroids.length; c++) {
    const members = places.filter((_, i) => assigned[i] === c);
    if (members.length === 0) continue;

    // Check if any member exceeds max radius from centroid
    const withinRadius: Place[] = [];
    const overflow: Place[] = [];

    for (const m of members) {
      const d = haversineKm(centroids[c].lat, centroids[c].lon, m.lat, m.lon);
      if (d <= maxRadiusKm) {
        withinRadius.push(m);
      } else {
        overflow.push(m);
      }
    }

    if (withinRadius.length > 0) clusters.push(withinRadius);
    // Assign overflow places to nearest existing cluster or create new one
    for (const p of overflow) {
      let placed = false;
      for (const existing of clusters) {
        const ec = computeCentroid(existing);
        if (haversineKm(ec.lat, ec.lon, p.lat, p.lon) <= maxRadiusKm) {
          existing.push(p);
          placed = true;
          break;
        }
      }
      if (!placed) {
        clusters.push([p]);
      }
    }
  }

  return clusters;
}

// ─── Main Export ────────────────────────────────────────────────────

export function clusterByProximity(
  places: Place[],
  maxClusters: number,
  walkingTolerance: 'minimal' | 'low' | 'medium' | 'high'
): GeoCluster[] {
  if (places.length === 0) return [];

  const maxRadiusKm = TOLERANCE_RADIUS[walkingTolerance] ?? TOLERANCE_RADIUS.medium;
  const effectiveMaxClusters = Math.max(1, Math.min(maxClusters, places.length));

  // Deduplicate places by name
  const seen = new Set<string>();
  const uniquePlaces: Place[] = [];
  for (const p of places) {
    const key = p.name.toLowerCase().trim();
    if (!seen.has(key)) {
      seen.add(key);
      uniquePlaces.push(p);
    }
  }

  // Run greedy clustering
  const rawClusters = greedyCluster(uniquePlaces, effectiveMaxClusters, maxRadiusKm);

  // Build GeoCluster results
  const results: GeoCluster[] = rawClusters.map(members => {
    const centroid = computeCentroid(members);
    const suggestedOrder = nearestNeighborOrder(members);
    const walkingKm = totalWalkingDistance(members, suggestedOrder);

    return {
      centroid,
      places: members,
      totalWalkingKm: walkingKm,
      suggestedOrder,
    };
  });

  // Sort by cluster size (biggest first)
  results.sort((a, b) => b.places.length - a.places.length);

  return results;
}
