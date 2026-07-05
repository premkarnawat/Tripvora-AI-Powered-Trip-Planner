// Hidden Gem Engine - Phase 17
import { Place } from './places';

export type HiddenGem = Place & {
  uniqueness_score: number;
  popularity_score: number;
  hidden_gem_score: number;
};

export function discoverHiddenGems(places: Place[]): HiddenGem[] {
  const gems: HiddenGem[] = [];
  
  for (const p of places) {
    // In a real OS connected to Google Places, popularity is derived from rating total count.
    // We simulate this since we are restricted to basic API objects.
    const popularity_score = (p.rating || 4.0) * 10; 
    
    let uniqueness = 50;
    
    // Evaluate uniqueness based on category
    const cat = (p.category || '').toLowerCase();
    if (cat.includes('hidden') || cat.includes('cliff') || cat.includes('village') || cat.includes('cave')) {
      uniqueness = 95;
    } else if (cat.includes('viewpoint') || cat.includes('nature') || cat.includes('waterfall')) {
      uniqueness = 80;
    } else if (cat.includes('temple') || cat.includes('fort') || cat.includes('beach')) {
      uniqueness = 40; // Famous places aren't hidden gems
    }
    
    // Formula from Phase 17: (100 - popularity) + uniqueness
    // Normalizing it to a 0-100 scale:
    const base_pop = Math.min(100, Math.max(0, popularity_score));
    const hidden_gem_score = Math.floor(((100 - base_pop) + uniqueness) / 2);
    
    // Show only if score > 85
    if (hidden_gem_score > 85) {
      gems.push({
        ...p,
        uniqueness_score: uniqueness,
        popularity_score: base_pop,
        hidden_gem_score
      });
    }
  }
  
  // Sort by highest hidden gem score
  return gems.sort((a, b) => b.hidden_gem_score - a.hidden_gem_score);
}
