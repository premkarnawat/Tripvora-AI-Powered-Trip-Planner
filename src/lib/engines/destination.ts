// Destination Intelligence Engine - Phase 7
import { Place } from './places';

export type DestinationIntelligence = {
  iconic_places: Place[];
  family_places: Place[];
  romantic_places: Place[];
  hidden_gems: Place[];
  sunset_points: Place[];
  sunrise_points: Place[];
  foods: Place[];
  shopping: Place[];
  nightlife: Place[];
  adventure: Place[];
};

export function buildDestinationIntelligence(
  places: Place[],
  hiddenGems: Place[]
): DestinationIntelligence {
  const categories = {
    iconic_places: [] as Place[],
    family_places: [] as Place[],
    romantic_places: [] as Place[],
    hidden_gems: hiddenGems,
    sunset_points: [] as Place[],
    sunrise_points: [] as Place[],
    foods: [] as Place[],
    shopping: [] as Place[],
    nightlife: [] as Place[],
    adventure: [] as Place[]
  };

  for (const place of places) {
    const cat = (place.category || '').toLowerCase();
    const name = place.name.toLowerCase();
    
    // Iconic Places (High rating, famous)
    if (place.rating && place.rating >= 4.5 && (cat.includes('monument') || cat.includes('historic') || cat.includes('temple'))) {
      categories.iconic_places.push(place);
    }
    
    // Family Places
    if (cat.includes('park') || cat.includes('museum') || cat.includes('zoo') || cat.includes('aquarium')) {
      categories.family_places.push(place);
    }
    
    // Romantic Places
    if (cat.includes('viewpoint') || cat.includes('beach') || cat.includes('garden')) {
      categories.romantic_places.push(place);
    }
    
    // Sunset / Sunrise
    if (cat.includes('viewpoint') || name.includes('sunset') || name.includes('hill')) {
      categories.sunset_points.push(place);
      categories.sunrise_points.push(place); // Re-using viewpoints for sunrise
    }
    
    // Foods (Restaurants are passed in separately, but if POIs have food markets)
    if (cat.includes('food') || cat.includes('market') || cat.includes('restaurant')) {
      categories.foods.push(place);
    }
    
    // Shopping
    if (cat.includes('mall') || cat.includes('market') || cat.includes('shopping')) {
      categories.shopping.push(place);
    }
    
    // Nightlife
    if (cat.includes('bar') || cat.includes('club') || cat.includes('pub') || cat.includes('night')) {
      categories.nightlife.push(place);
    }
    
    // Adventure
    if (cat.includes('trek') || cat.includes('adventure') || cat.includes('water') || cat.includes('hike')) {
      categories.adventure.push(place);
    }
  }

  // Deduplicate and cap arrays to top 5
  for (const key of Object.keys(categories) as Array<keyof DestinationIntelligence>) {
    const unique = Array.from(new Map(categories[key].map(item => [item.name, item])).values());
    categories[key] = unique.slice(0, 5);
  }

  return categories;
}
