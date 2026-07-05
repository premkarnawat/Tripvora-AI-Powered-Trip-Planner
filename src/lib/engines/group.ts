// Group Engine - Phase 16
export type GroupDemographics = {
  boys: number;
  girls: number;
  children: number;
  total_travelers: number;
};

export type GroupAllocation = {
  boys_rooms: number;
  girls_rooms: number;
  family_rooms: number;
  total_rooms: number;
  expense_split: boolean;
  per_person_cost: number;
};

export function buildGroupAllocation(
  demographics: GroupDemographics,
  totalBudget: number,
  tripType: string
): GroupAllocation {
  // Assume a standard room sleeps 2 adults or 2 adults + 1 child.
  // We allocate rooms separately by gender unless it's a family/couple.
  let boys_rooms = 0;
  let girls_rooms = 0;
  let family_rooms = 0;
  
  const type = tripType.toLowerCase();
  
  if (type === 'couple' || type === 'romantic') {
    family_rooms = 1;
  } else if (type === 'family') {
    // Families usually share rooms, 1 room per 3 people
    family_rooms = Math.ceil((demographics.boys + demographics.girls + demographics.children) / 3);
  } else {
    // Friends, bachelor, corporate, solo -> split by gender
    boys_rooms = Math.ceil(demographics.boys / 2);
    girls_rooms = Math.ceil(demographics.girls / 2);
  }
  
  const total_rooms = boys_rooms + girls_rooms + family_rooms;
  const expense_split = (type === 'friends' || type === 'bachelor' || type === 'corporate');
  
  // Per person calculation excludes children from splitting the core hotel/travel costs equally if it's a family
  let split_count = demographics.total_travelers;
  if (type === 'family' && demographics.children > 0 && split_count > demographics.children) {
    split_count = demographics.total_travelers - (demographics.children * 0.5); // Children count as half expense
  }
  
  const per_person_cost = Math.floor(totalBudget / Math.max(1, split_count));
  
  return {
    boys_rooms,
    girls_rooms,
    family_rooms,
    total_rooms: Math.max(1, total_rooms),
    expense_split,
    per_person_cost
  };
}
