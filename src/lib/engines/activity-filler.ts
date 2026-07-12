/**
 * Activity Filler Engine
 * 
 * Fills evening/night gaps in the itinerary so users never see
 * "Go back to hotel" at 6 PM. Instead, discovers markets, food streets,
 * night attractions, cafes, live shows, and viewpoints.
 */

import { Place } from './places';

export interface FillerActivity {
  title: string;
  type: 'market' | 'food_street' | 'night_attraction' | 'cafe' | 'shopping' | 'viewpoint' | 'live_show' | 'riverfront';
  time: string;
  duration: number; // minutes
  description: string;
}

// Evening/night activity categories with search keywords
const EVENING_CATEGORIES = [
  { type: 'market' as const, keywords: ['night market', 'local market', 'bazaar', 'flea market'] },
  { type: 'food_street' as const, keywords: ['food street', 'street food', 'food court', 'food hub'] },
  { type: 'night_attraction' as const, keywords: ['night view', 'fountain show', 'light show', 'laser show'] },
  { type: 'riverfront' as const, keywords: ['riverfront', 'promenade', 'marine drive', 'lakefront', 'waterfront'] },
  { type: 'shopping' as const, keywords: ['shopping mall', 'shopping complex', 'brand outlet'] },
  { type: 'cafe' as const, keywords: ['cafe', 'rooftop cafe', 'lounge', 'ice cream'] },
  { type: 'viewpoint' as const, keywords: ['sunset point', 'night viewpoint', 'observation deck'] },
  { type: 'live_show' as const, keywords: ['theatre', 'live music', 'cultural show', 'folk dance'] },
];

/**
 * Determine what time the last scheduled activity ends
 */
export function getLastActivityEndTime(dayActivities: Array<{ endTime?: string; time?: string; duration?: number }>): number {
  let latestHour = 17; // Default: 5 PM

  for (const act of dayActivities) {
    if (act.endTime) {
      const [h] = act.endTime.split(':').map(Number);
      if (h > latestHour) latestHour = h;
    } else if (act.time && act.duration) {
      const [h, m] = act.time.split(':').map(Number);
      const endHour = h + Math.floor((m + act.duration) / 60);
      if (endHour > latestHour) latestHour = endHour;
    }
  }

  return latestHour;
}

/**
 * Generate filler activities for evening/night gaps
 */
export function generateFillerActivities(
  lastActivityEndHour: number,
  interests: string[],
  travelType: string,
  pace: string
): FillerActivity[] {
  const fillers: FillerActivity[] = [];
  const dinnerHour = 20; // 8 PM target
  const maxEndHour = 22; // 10 PM latest

  // If last activity ends after 9 PM, no filler needed
  if (lastActivityEndHour >= 21) return fillers;

  // Gap analysis
  let currentHour = lastActivityEndHour;

  // Priority mapping based on interests
  const interestLower = interests.map(i => i.toLowerCase());
  const priorityTypes: FillerActivity['type'][] = [];

  if (interestLower.includes('shopping') || interestLower.includes('markets')) {
    priorityTypes.push('market', 'shopping');
  }
  if (interestLower.includes('food trails') || interestLower.includes('nightlife')) {
    priorityTypes.push('food_street', 'cafe');
  }
  if (interestLower.includes('photography') || interestLower.includes('sunset')) {
    priorityTypes.push('viewpoint', 'riverfront');
  }
  if (interestLower.includes('nightlife')) {
    priorityTypes.push('night_attraction', 'live_show');
  }

  // Default fallbacks
  if (priorityTypes.length === 0) {
    priorityTypes.push('market', 'food_street', 'riverfront', 'cafe');
  }

  // Fill the gap
  if (currentHour < 18) {
    // Pre-dinner activity (5-7 PM slot)
    const type = priorityTypes[0] || 'market';
    fillers.push({
      title: getActivityTitle(type),
      type,
      time: `${String(currentHour).padStart(2, '0')}:00`,
      duration: 90,
      description: getActivityDescription(type),
    });
    currentHour += 1.5;
  }

  // Dinner slot
  if (currentHour < dinnerHour + 1) {
    fillers.push({
      title: 'Dinner at Local Restaurant',
      type: 'food_street',
      time: `${Math.max(19, Math.round(currentHour))}:00`,
      duration: 60,
      description: 'Enjoy authentic local cuisine at a highly rated restaurant',
    });
    currentHour = Math.max(20, Math.round(currentHour) + 1);
  }

  // Post-dinner activity (only for explorer pace or nightlife interest)
  if (currentHour < maxEndHour && (pace === 'explorer' || interestLower.includes('nightlife'))) {
    const nightType = priorityTypes.find(t => ['night_attraction', 'live_show', 'cafe'].includes(t)) || 'cafe';
    fillers.push({
      title: getActivityTitle(nightType),
      type: nightType,
      time: `${Math.round(currentHour)}:00`,
      duration: 60,
      description: getActivityDescription(nightType),
    });
  }

  return fillers;
}

function getActivityTitle(type: FillerActivity['type']): string {
  const titles: Record<string, string> = {
    market: 'Explore Local Market & Bazaar',
    food_street: 'Street Food Trail',
    night_attraction: 'Evening Light & Sound Show',
    cafe: 'Relax at a Rooftop Café',
    shopping: 'Shopping at Local Mall',
    viewpoint: 'Sunset & Night Viewpoint',
    live_show: 'Live Cultural Show',
    riverfront: 'Evening Riverfront Walk',
  };
  return titles[type] || 'Evening Exploration';
}

function getActivityDescription(type: FillerActivity['type']): string {
  const descriptions: Record<string, string> = {
    market: 'Explore vibrant local bazaars for souvenirs, handicrafts, and street food',
    food_street: 'Discover the city\'s best street food and local delicacies',
    night_attraction: 'Experience the city\'s spectacular light and sound show',
    cafe: 'Unwind at a popular café with great ambiance and local beverages',
    shopping: 'Browse popular shopping destinations for local and branded products',
    viewpoint: 'Catch stunning sunset and city views from a scenic viewpoint',
    live_show: 'Enjoy an authentic cultural performance showcasing local traditions',
    riverfront: 'Stroll along the beautifully lit riverfront promenade',
  };
  return descriptions[type] || 'Enjoy the evening exploring the city';
}

/**
 * Score filler activities based on available places
 */
export function matchFillerToPlaces(
  fillers: FillerActivity[],
  availablePlaces: Place[]
): Array<FillerActivity & { matchedPlace?: Place }> {
  return fillers.map(filler => {
    const category = EVENING_CATEGORIES.find(c => c.type === filler.type);
    if (!category) return filler;

    // Find a matching place from available places
    const matchedPlace = availablePlaces.find(place => {
      const placeName = (place.name || '').toLowerCase();
      const placeCategory = (place.category || '').toLowerCase();
      return category.keywords.some(kw =>
        placeName.includes(kw) || placeCategory.includes(kw)
      );
    });

    return { ...filler, matchedPlace };
  });
}
