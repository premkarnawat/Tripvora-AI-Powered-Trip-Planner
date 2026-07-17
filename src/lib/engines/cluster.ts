import { Place } from './places';

export interface GeoCluster {
  centroid: { lat: number; lon: number };
  places: Place[];
  totalWalkingKm: number;
  suggestedOrder: string[];
}

const TOLERANCE_RADIUS: Record<string, number> = {
  minimal: 1,
  low: 2,
  medium: 4,
  high: 8,
};

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

function computeCentroid(places: Place[]): { lat: number; lon: number } {
  if (places.length === 0) return { lat: 0, lon: 0 };
  const sumLat = places.reduce((s, p) => s + p.lat, 0);
  const sumLon = places.reduce((s, p) => s + p.lon, 0);
  return {
    lat: sumLat / places.length,
    lon: sumLon / places.length,
  };
}

function nearestNeighborOrder(places: Place[]): string[] {
  if (places.length === 0) return [];
  if (places.length === 1) return [places[0].name];

  const remaining = [...places];
  const order: Place[] = [];

  const centroid = computeCentroid(remaining);
  let closestIdx = 0;
  let closestDist = Infinity;
  for (let i = 0; i < remaining.length; i++) {
    const dist = haversineKm(centroid.lat, centroid.lon, remaining[i].lat, remaining[i].lon);
    if (dist < closestDist) {
      closestDist = dist;
      closestIdx = i;
    }
  }

  let current = remaining.splice(closestIdx, 1)[0];
  order.push(current.name);

  while (remaining.length > 0) {
    let nextIdx = 0;
    let nextDist = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const dist = haversineKm(current.lat, current.lon, remaining[i].lat, remaining[i].lon);
      if (dist < nextDist) {
        nextDist = dist;
        nextIdx = i;
      }
    }
    current = remaining.splice(nextIdx, 1)[0];
    order.push(current.name);
  }

  return order;
}

export function greedyCluster(places: Place[], maxClusters: number, maxRadiusKm: number): GeoCluster[] {
  if (places.length === 0) return [];
  if (maxClusters <= 1) {
    return [{
      centroid: computeCentroid(places),
      places,
      totalWalkingKm: 0,
      suggestedOrder: nearestNeighborOrder(places),
    }];
  }

  let remaining = [...places];
  const clusters: GeoCluster[] = [];

  while (remaining.length > 0 && clusters.length < maxClusters) {
    const seed = remaining[0];
    const clusterPlaces = [seed];
    remaining.splice(0, 1);

    for (let i = remaining.length - 1; i >= 0; i--) {
      const dist = haversineKm(seed.lat, seed.lon, remaining[i].lat, remaining[i].lon);
      if (dist <= maxRadiusKm) {
        clusterPlaces.push(remaining[i]);
        remaining.splice(i, 1);
      }
    }

    clusters.push({
      centroid: computeCentroid(clusterPlaces),
      places: clusterPlaces,
      totalWalkingKm: 0,
      suggestedOrder: nearestNeighborOrder(clusterPlaces),
    });
  }

  if (remaining.length > 0 && clusters.length > 0) {
    for (const p of remaining) {
      let closestClusterIdx = 0;
      let closestDist = Infinity;
      for (let i = 0; i < clusters.length; i++) {
        const dist = haversineKm(clusters[i].centroid.lat, clusters[i].centroid.lon, p.lat, p.lon);
        if (dist < closestDist) {
          closestDist = dist;
          closestClusterIdx = i;
        }
      }
      clusters[closestClusterIdx].places.push(p);
      clusters[closestClusterIdx].centroid = computeCentroid(clusters[closestClusterIdx].places);
      clusters[closestClusterIdx].suggestedOrder = nearestNeighborOrder(clusters[closestClusterIdx].places);
    }
  }

  return clusters;
}

export async function clusterByProximity(
  places: Place[],
  daysCount: number,
  walkTolerance: string
): Promise<GeoCluster[]> {
  const radius = TOLERANCE_RADIUS[walkTolerance] || 4;
  return greedyCluster(places, daysCount, radius * 2); // Allow 2x walk radius for a cluster
}
