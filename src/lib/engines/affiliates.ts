// ─── Affiliate Link Engine ──────────────────────────────────────────
// Generates search-based affiliate URLs. No API keys needed.

export interface AffiliateLinks {
  hotels: { name: string; url: string }[];
  flights: { name: string; url: string }[];
  buses: { name: string; url: string }[];
  activities: { name: string; url: string }[];
}

function encodeSearch(q: string): string {
  return encodeURIComponent(q.trim());
}

function formatDate(dateStr: string): string {
  // Convert YYYY-MM-DD to format needed by booking sites
  if (!dateStr) return '';
  return dateStr.replace(/-/g, '-');
}

export function generateAffiliateLinks(input: {
  origin: string;
  destination: string;
  checkIn: string;      // YYYY-MM-DD
  checkOut: string;     // YYYY-MM-DD
  adults: number;
  children: number;
}): AffiliateLinks {
  const dest = encodeSearch(input.destination);
  const orig = encodeSearch(input.origin);
  const cin = formatDate(input.checkIn);
  const cout = formatDate(input.checkOut);
  const adults = input.adults || 2;
  const children = input.children || 0;

  return {
    hotels: [
      {
        name: 'Booking.com',
        url: `https://www.booking.com/searchresults.html?ss=${dest}&checkin=${cin}&checkout=${cout}&group_adults=${adults}&group_children=${children}&no_rooms=1`,
      },
      {
        name: 'Agoda',
        url: `https://www.agoda.com/search?city=${dest}&checkIn=${cin}&checkOut=${cout}&adults=${adults}&children=${children}&rooms=1`,
      },
      {
        name: 'Goibibo',
        url: `https://www.goibibo.com/hotels/hotels-in-${dest.toLowerCase().replace(/%20/g, '-')}/?checkin=${cin}&checkout=${cout}`,
      },
      {
        name: 'MakeMyTrip',
        url: `https://www.makemytrip.com/hotels/hotel-listing/?city=${dest}&checkin=${cin}&checkout=${cout}&roomStayQualifier=${adults}e0e`,
      },
    ],
    flights: [
      {
        name: 'Skyscanner',
        url: `https://www.skyscanner.co.in/transport/flights/${orig.toLowerCase()}/${dest.toLowerCase()}/${cin.replace(/-/g, '')}/?adults=${adults}&children=${children}`,
      },
      {
        name: 'Goibibo Flights',
        url: `https://www.goibibo.com/flights/air-${orig.toLowerCase().replace(/%20/g, '-')}-${dest.toLowerCase().replace(/%20/g, '-')}/`,
      },
      {
        name: 'MakeMyTrip Flights',
        url: `https://www.makemytrip.com/flight/search?itinerary=${orig}-${dest}-${cin.replace(/-/g, '')}&paxType=A-${adults}_C-${children}_I-0&cabinClass=E`,
      },
    ],
    buses: [
      {
        name: 'RedBus',
        url: `https://www.redbus.in/bus-tickets/${input.origin.toLowerCase().replace(/\s+/g, '-')}-to-${input.destination.toLowerCase().replace(/\s+/g, '-')}?date=${cin}`,
      },
      {
        name: 'AbhiBus',
        url: `https://www.abhibus.com/bus/${input.origin.toLowerCase().replace(/\s+/g, '-')}-to-${input.destination.toLowerCase().replace(/\s+/g, '-')}/${cin}`,
      },
    ],
    activities: [
      {
        name: 'Viator',
        url: `https://www.viator.com/searchResults/all?text=${dest}`,
      },
      {
        name: 'GetYourGuide',
        url: `https://www.getyourguide.com/s/?q=${dest}`,
      },
    ],
  };
}
