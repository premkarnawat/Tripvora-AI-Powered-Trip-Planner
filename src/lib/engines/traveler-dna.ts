// ─── Traveler DNA Engine ────────────────────────────────────────────
// Builds a traveler profile from wizard inputs. Every recommendation
// engine uses this DNA to personalize results.

export interface TravelerDNA {
  // Core profile
  travelerType: string;
  purpose: string;
  
  // Scores (0-100)
  comfortLevel: number;
  energyLevel: number;
  spendingStyle: number;    // 0=budget, 100=luxury
  walkingTolerance: number; // 0=minimal, 100=marathon
  travelPace: number;       // 0=relaxed, 100=packed
  
  // Interest scores (0-100)
  nightlifeInterest: number;
  spiritualityScore: number;
  luxuryScore: number;
  adventureScore: number;
  photographyScore: number;
  shoppingScore: number;
  foodExplorerScore: number;
  natureScore: number;
  cultureScore: number;
  
  // Preferences
  foodPreference: 'pure_veg' | 'veg_preferred' | 'non_veg' | 'mixed';
  maxActivitiesPerDay: number;
  preferIndoor: boolean;
  
  // Persona rules
  prioritize: string[];
  avoid: string[];
}

// ─── DNA Builder ────────────────────────────────────────────────────

export function buildTravelerDNA(input: {
  travelType: string;
  foodPreference: string;
  interests: string[];
  budget: number;
  duration: number;
  hotelPreference: string;
  travelers: { adults: number; children: number; seniors: number };
  travelStyle?: string;
  travelSpeed?: string;
}): TravelerDNA {
  const t = input.travelType.toLowerCase();
  const interests = input.interests.map(i => i.toLowerCase());
  const budget = input.budget;
  const perDay = budget / input.duration;
  const hasKids = input.travelers.children > 0;
  const hasSeniors = input.travelers.seniors > 0;
  const hotelPref = input.hotelPreference.toLowerCase();
  const style = (input.travelStyle || '').toLowerCase();
  const speed = (input.travelSpeed || 'balanced').toLowerCase();

  // Determine purpose
  let purpose = 'vacation';
  if (t.includes('honeymoon')) purpose = 'romantic';
  else if (t.includes('couple')) purpose = 'romantic';
  else if (t.includes('family')) purpose = 'family_vacation';
  else if (t.includes('bachelor') || t.includes('friends')) purpose = 'group_fun';
  else if (t.includes('solo')) purpose = 'self_discovery';
  else if (t.includes('corporate') || t.includes('business')) purpose = 'business';
  else if (t.includes('senior')) purpose = 'comfortable_leisure';
  if (interests.includes('pilgrimage') || interests.includes('spiritual')) purpose = 'pilgrimage';
  if (interests.includes('adventure')) purpose = 'adventure';

  // Food preference
  let foodPref: TravelerDNA['foodPreference'] = 'mixed';
  const fp = input.foodPreference.toLowerCase();
  if (fp.includes('pure') || (fp === 'veg' && !fp.includes('non'))) foodPref = 'pure_veg';
  else if (fp.includes('veg') && !fp.includes('non')) foodPref = 'veg_preferred';
  else if (fp.includes('non')) foodPref = 'non_veg';

  // Spending style based on budget and hotel preference
  let spendingStyle = 50;
  if (perDay > 15000) spendingStyle = 90;
  else if (perDay > 8000) spendingStyle = 70;
  else if (perDay > 4000) spendingStyle = 50;
  else if (perDay > 2000) spendingStyle = 30;
  else spendingStyle = 15;
  if (hotelPref.includes('luxury') || hotelPref.includes('premium')) spendingStyle = Math.min(spendingStyle + 20, 100);
  if (hotelPref.includes('budget') || hotelPref.includes('hostel')) spendingStyle = Math.max(spendingStyle - 20, 0);

  // Walking tolerance
  let walkingTolerance = 60;
  if (hasSeniors) walkingTolerance = 25;
  if (hasKids && input.travelers.children > 1) walkingTolerance = 35;
  if (style.includes('relaxed')) walkingTolerance = Math.max(walkingTolerance - 20, 10);
  if (interests.includes('trekking') || interests.includes('hiking')) walkingTolerance = 90;
  if (interests.includes('adventure')) walkingTolerance = Math.min(walkingTolerance + 15, 100);

  // Travel pace → max activities per day
  let travelPace = 50;
  let maxActivities = 8;
  if (speed.includes('relaxed') || speed.includes('slow')) { travelPace = 25; maxActivities = 5; }
  else if (speed.includes('balanced') || speed.includes('moderate')) { travelPace = 50; maxActivities = 8; }
  else if (speed.includes('packed') || speed.includes('fast') || speed.includes('explorer')) { travelPace = 80; maxActivities = 12; }
  if (hasSeniors) maxActivities = Math.min(maxActivities, 5);
  if (hasKids) maxActivities = Math.min(maxActivities, 7);

  // Interest scores
  const scoreInterest = (keys: string[]) => keys.some(k => interests.includes(k)) ? 80 : 15;

  const nightlifeInterest = (t.includes('bachelor') || t.includes('friends'))
    ? 85 : (t.includes('couple') ? 40 : scoreInterest(['nightlife', 'party', 'clubs']));
  const spiritualityScore = scoreInterest(['temples', 'pilgrimage', 'spiritual', 'religious']);
  const adventureScore = scoreInterest(['adventure', 'trekking', 'hiking', 'water sports', 'sports']);
  const photographyScore = scoreInterest(['photography', 'nature', 'scenic']);
  const shoppingScore = scoreInterest(['shopping', 'markets']);
  const foodExplorerScore = scoreInterest(['food', 'culinary', 'street food', 'food explorer']);
  const natureScore = scoreInterest(['nature', 'beaches', 'mountains', 'wildlife']);
  const cultureScore = scoreInterest(['culture', 'history', 'heritage', 'museums', 'art']);
  const luxuryScore = spendingStyle > 70 ? 80 : (interests.includes('luxury') ? 85 : 30);

  // Comfort level
  let comfortLevel = spendingStyle;
  if (hasSeniors) comfortLevel = Math.min(comfortLevel + 20, 100);

  // Energy level (inverse of age/comfort needs)
  let energyLevel = travelPace;
  if (hasSeniors) energyLevel = Math.min(energyLevel, 35);
  if (t.includes('bachelor') || t.includes('friends')) energyLevel = Math.min(energyLevel + 20, 100);

  // Persona rules
  const prioritize: string[] = [];
  const avoid: string[] = [];

  if (t.includes('couple') || t.includes('honeymoon')) {
    prioritize.push('romantic cafes', 'sunset viewpoints', 'scenic spots', 'luxury stays', 'private experiences');
    avoid.push('party districts', 'crowded tourist traps', 'noisy areas');
  } else if (t.includes('family')) {
    prioritize.push('safe areas', 'family hotels', 'kid-friendly attractions', 'parks', 'easy access');
    avoid.push('nightlife', 'bars', 'extreme activities');
  } else if (t.includes('bachelor') || t.includes('friends')) {
    prioritize.push('nightlife', 'pubs', 'adventures', 'street food tours', 'group experiences', 'offbeat spots');
    avoid.push('luxury resorts', 'quiet family spots');
  } else if (t.includes('solo')) {
    prioritize.push('safe neighborhoods', 'social cafes', 'walking tours', 'photography spots');
    avoid.push('isolated areas at night');
  } else if (t.includes('senior') || hasSeniors) {
    prioritize.push('minimal walking', 'elevator hotels', 'temples', 'gardens', 'comfortable transport');
    avoid.push('steep climbs', 'long treks', 'extreme weather exposure');
  } else if (t.includes('corporate') || t.includes('business')) {
    prioritize.push('GST hotels', 'business lounges', 'airport transfers', 'flexible timing');
    avoid.push('hostels', 'party areas');
  }

  if (purpose === 'pilgrimage') {
    prioritize.push('temples', 'ashrams', 'prayer times', 'religious rituals', 'sattvic food');
    avoid.push('nightlife', 'bars', 'non-veg restaurants');
  }

  return {
    travelerType: input.travelType,
    purpose,
    comfortLevel,
    energyLevel,
    spendingStyle,
    walkingTolerance,
    travelPace,
    nightlifeInterest,
    spiritualityScore,
    luxuryScore,
    adventureScore,
    photographyScore,
    shoppingScore,
    foodExplorerScore,
    natureScore,
    cultureScore,
    foodPreference: foodPref,
    maxActivitiesPerDay: maxActivities,
    preferIndoor: false,
    prioritize,
    avoid,
  };
}

// ─── Ranking Engines ────────────────────────────────────────────────

interface Scoreable {
  name: string;
  distanceKm?: number;
  cuisine?: string;
  category?: string;
}

/** Hotel ranking: location × 20 + budget_match × 25 + traveler_match × 25 + distance × 20 + safety × 10 */
export function rankHotels(hotels: Scoreable[], dna: TravelerDNA, budgetPerNight: number): Scoreable[] {
  return [...hotels]
    .map(h => {
      const dist = h.distanceKm ?? 5;
      const locationScore = Math.max(0, 100 - dist * 15); // closer = better, 0km = 100
      const budgetScore = 70; // can't verify actual price vs budget without live API
      let travelerMatch = 50;
      if (dna.purpose === 'romantic') travelerMatch = dist < 3 ? 85 : 40;
      if (dna.purpose === 'family_vacation') travelerMatch = 70;
      if (dna.purpose === 'business') travelerMatch = 65;
      const safetyScore = 70; // default since no real safety data
      const total = locationScore * 0.2 + budgetScore * 0.25 + travelerMatch * 0.25 + (100 - dist * 5) * 0.2 + safetyScore * 0.1;
      return { ...h, _score: total };
    })
    .sort((a, b) => (b as any)._score - (a as any)._score);
}

/** Restaurant ranking: distance × 20 + traveler_match × 25 + food_match × 30 + authenticity × 15 + popularity × 10 */
export function rankRestaurants(restaurants: Scoreable[], dna: TravelerDNA): Scoreable[] {
  return [...restaurants]
    .map(r => {
      const dist = r.distanceKm ?? 5;
      const distanceScore = Math.max(0, 100 - dist * 15);
      
      // Food match — critical for pure veg users
      let foodMatch = 50;
      const cuisine = (r.cuisine || '').toLowerCase();
      if (dna.foodPreference === 'pure_veg') {
        if (cuisine.includes('veg') && !cuisine.includes('non')) foodMatch = 100;
        else if (cuisine.includes('indian') || cuisine.includes('south indian') || cuisine.includes('thali')) foodMatch = 70;
        else if (cuisine.includes('non') || cuisine.includes('meat') || cuisine.includes('seafood') || cuisine.includes('chicken')) foodMatch = 0;
        else foodMatch = 40; // unknown — might be ok
      } else if (dna.foodPreference === 'non_veg') {
        if (cuisine.includes('non') || cuisine.includes('meat') || cuisine.includes('seafood')) foodMatch = 90;
        else foodMatch = 50;
      }
      
      let travelerMatch = 50;
      if (dna.purpose === 'romantic' && dist < 2) travelerMatch = 80;
      if (dna.purpose === 'group_fun') travelerMatch = 65;
      
      const authenticityScore = cuisine.length > 0 ? 70 : 40; // has cuisine info = more authentic
      const popularityScore = 60; // default
      
      const total = distanceScore * 0.2 + travelerMatch * 0.25 + foodMatch * 0.3 + authenticityScore * 0.15 + popularityScore * 0.1;
      return { ...r, _score: total };
    })
    .sort((a, b) => (b as any)._score - (a as any)._score);
}

/** Attraction ranking: distance × 15 + traveler_match × 25 + weather × 10 + popularity × 20 + persona × 30 */
export function rankAttractions(
  attractions: Scoreable[],
  dna: TravelerDNA,
  weather: { temperature: number; rainProbability: number } | null
): Scoreable[] {
  return [...attractions]
    .map(a => {
      const dist = a.distanceKm ?? 5;
      const distanceScore = Math.max(0, 100 - dist * 8);
      
      // Weather score
      let weatherScore = 70;
      if (weather) {
        const isOutdoor = !['museum', 'temple', 'gallery', 'mall'].some(k => a.name.toLowerCase().includes(k));
        if (isOutdoor && weather.rainProbability > 60) weatherScore = 30;
        if (isOutdoor && weather.temperature > 40) weatherScore = 35;
        if (!isOutdoor && weather.rainProbability > 60) weatherScore = 90; // indoor is better in rain
      }
      
      // Persona match
      let personaScore = 50;
      const name = a.name.toLowerCase();
      
      // Boost based on DNA priorities
      for (const p of dna.prioritize) {
        if (name.includes(p.toLowerCase().split(' ')[0])) personaScore = 90;
      }
      // Penalize based on DNA avoid list
      for (const av of dna.avoid) {
        if (name.includes(av.toLowerCase().split(' ')[0])) personaScore = 10;
      }
      
      // Specific persona boosts
      if (dna.spiritualityScore > 60 && (name.includes('temple') || name.includes('mandir') || name.includes('church') || name.includes('mosque'))) personaScore = 95;
      if (dna.adventureScore > 60 && (name.includes('fort') || name.includes('trek') || name.includes('peak') || name.includes('waterfall'))) personaScore = 90;
      if (dna.natureScore > 60 && (name.includes('beach') || name.includes('lake') || name.includes('garden') || name.includes('park') || name.includes('point'))) personaScore = 85;
      if (dna.shoppingScore > 60 && (name.includes('market') || name.includes('bazaar') || name.includes('mall'))) personaScore = 85;
      if (dna.nightlifeInterest < 30 && (name.includes('pub') || name.includes('bar') || name.includes('club'))) personaScore = 10;
      
      const popularityScore = dist < 5 ? 75 : 50;
      
      const total = distanceScore * 0.15 + personaScore * 0.30 + weatherScore * 0.10 + popularityScore * 0.20 + 50 * 0.25;
      return { ...a, _score: total };
    })
    .sort((a, b) => (b as any)._score - (a as any)._score);
}
