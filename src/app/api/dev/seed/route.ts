import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // 1. Agencies
    const agencies = [
      { id: '771e7a50-01c0-482a-a9e9-158a1bc1c2da', name: 'Wanderlust Holidays', city: 'New Delhi, India', subscription_status: 'Active', badge_type: 'ELITE PARTNER', revenue: 245600, conversion_rate: 18.5 },
      { id: '22c4d621-cf5c-4389-9a25-b44c38d38cfd', name: 'Travelista India', city: 'Mumbai, India', subscription_status: 'Active', badge_type: 'GROWTH PLAN', revenue: 192480, conversion_rate: 15.2 },
      { id: 'c58bcbb8-8bc6-4660-ae1d-2321481d2f78', name: 'Elite Escapes', city: 'Bangalore, India', subscription_status: 'Pending Audit', badge_type: 'OVERDUE REVIEW', revenue: 320300, conversion_rate: 12.8 }
    ];
    await supabase.from('agencies').upsert(agencies);

    // 2. Users
    const users = [
      { id: '1c8a169b-8bc6-4660-ae1d-2321481d2f78', email: 'adityaroy@gmail.com', full_name: 'Aditya Roy', role: 'traveler' },
      { id: '2a5c4d62-cf5c-4389-9a25-b44c38d38cfd', email: 'priyasen@hotmail.com', full_name: 'Priya Sen', role: 'traveler' },
      { id: '3b1e7a50-01c0-482a-a9e9-158a1bc1c2da', email: 'rverma@gmail.com', full_name: 'Rahul Verma', role: 'traveler' }
    ];
    await supabase.from('users').upsert(users);

    // 3. Destinations
    const destinations = [
      { id: 'd1c4d621-cf5c-4389-9a25-b44c38d38cfd', name: 'Goa', seo_description: 'Pristine beaches, heritage churches, and vibrant nightlife.', popular_attractions: ['Calangute Beach', 'Fort Aguada', 'Dudhsagar Falls'], popular_activities: ['Parasailing', 'Scuba Diving', 'Casino Tours'], images: ['https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=300&auto=format&fit=crop'] },
      { id: 'd2c4d621-cf5c-4389-9a25-b44c38d38cfd', name: 'Kashmir', seo_description: 'Heaven on earth with snow-capped peaks and serene Dal Lake shikhara rides.', popular_attractions: ['Gulmarg Gondola', 'Shalimar Bagh', 'Pahalgam Valley'], popular_activities: ['Shikhara Ride', 'Skiing', 'Snowboarding'], images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=300&auto=format&fit=crop'] },
      { id: 'd3c4d621-cf5c-4389-9a25-b44c38d38cfd', name: 'Manali', seo_description: 'Adventure hub in Himachal Pradesh offering trekking, river rafting, and scenic beauty.', popular_attractions: ['Solang Valley', 'Rohtang Pass', 'Hadimba Temple'], popular_activities: ['Paragliding', 'Trekking', 'Skiing'], images: ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=300&auto=format&fit=crop'] }
    ];
    await supabase.from('destination_cache').upsert(destinations);

    // 4. Trips
    // For trips, we need the authenticated user's ID to bypass RLS, or we use a known ID if RLS allows it.
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData?.user?.id || '1c8a169b-8bc6-4660-ae1d-2321481d2f78';
    
    const trips = [
      { id: 't1c4d621-cf5c-4389-9a25-b44c38d38cfd', user_id: userId, destination: 'Goa Sunset & Beach Escape', start_date: new Date(Date.now() + 864000000).toISOString(), end_date: new Date(Date.now() + 1296000000).toISOString(), adult_count: 2, status: 'confirmed', budget_tier: 'standard' },
      { id: 't2c4d621-cf5c-4389-9a25-b44c38d38cfd', user_id: userId, destination: 'Tokyo & Kyoto Cherry Blossoms', adult_count: 2, status: 'draft', budget_tier: 'luxury' }
    ];
    await supabase.from('trips').upsert(trips);

    // 5. Agency Customers
    const customers = [
      { id: 'c1c4d621-cf5c-4389-9a25-b44c38d38cfd', agency_id: '771e7a50-01c0-482a-a9e9-158a1bc1c2da', name: 'Aditya Roy', email: 'adityaroy@gmail.com', phone: '+91 99887 76655', total_trips: 4, total_spent: 245000, status: 'VIP Customer' },
      { id: 'c2c4d621-cf5c-4389-9a25-b44c38d38cfd', agency_id: '771e7a50-01c0-482a-a9e9-158a1bc1c2da', name: 'Priya Sen', email: 'priyasen@hotmail.com', phone: '+91 98888 77777', total_trips: 1, total_spent: 0, status: 'New Lead' }
    ];
    await supabase.from('agency_customers').upsert(customers);

    // 6. Agency Leads
    const leads = [
      { id: 'l1c4d621-cf5c-4389-9a25-b44c38d38cfd', agency_id: '771e7a50-01c0-482a-a9e9-158a1bc1c2da', customer_name: 'Rohan Sharma', customer_email: 'rohan@example.com', customer_phone: '+91 91234 56789', destination: 'Bali, Indonesia', budget: 180000, pax: '2 Adults, 1 Child', trip_dates: 'Next Month', pipeline_status: 'New Inquiries', source: 'Website Organic' },
      { id: 'l2c4d621-cf5c-4389-9a25-b44c38d38cfd', agency_id: '771e7a50-01c0-482a-a9e9-158a1bc1c2da', customer_name: 'Kavita Das', customer_email: 'kavita@example.com', customer_phone: '+91 99887 77665', destination: 'Maldives', budget: 250000, pax: '2 Adults', trip_dates: 'Oct 2026', pipeline_status: 'Quotation Sent', source: 'WhatsApp Lead' }
    ];
    await supabase.from('agency_leads').upsert(leads);

    // 7. Bookings
    const bookings = [
      { id: 'b1c4d621-cf5c-4389-9a25-b44c38d38cfd', agency_id: '771e7a50-01c0-482a-a9e9-158a1bc1c2da', lead_id: 'l1c4d621-cf5c-4389-9a25-b44c38d38cfd', customer_id: 'c1c4d621-cf5c-4389-9a25-b44c38d38cfd', booking_reference: 'TRIP-2026-X8Y9', total_amount: 185000, payment_status: 'Partial', booking_status: 'Confirmed' }
    ];
    await supabase.from('bookings').upsert(bookings);

    // 8. Agency Vendors
    const vendors = [
      { id: 'v1c4d621-cf5c-4389-9a25-b44c38d38cfd', agency_id: '771e7a50-01c0-482a-a9e9-158a1bc1c2da', category: 'hotel', name: 'Grand Hyatt Bali (Nusa Dua)', cost_price: 12000, selling_price: 15000, rating: 4.8, description: 'Premium beachfront resort.', status: 'Active' },
      { id: 'v2c4d621-cf5c-4389-9a25-b44c38d38cfd', agency_id: '771e7a50-01c0-482a-a9e9-158a1bc1c2da', category: 'hotel', name: 'W Bali Seminyak', cost_price: 24000, selling_price: 28000, rating: 4.9, description: 'Vibrant beachside luxury.', status: 'Active' },
      { id: 'v3c4d621-cf5c-4389-9a25-b44c38d38cfd', agency_id: '771e7a50-01c0-482a-a9e9-158a1bc1c2da', category: 'activity', name: 'Private Uluwatu Sunset Tour', cost_price: 4500, selling_price: 5500, rating: 4.7, description: 'VIP seats included.', status: 'Active' }
    ];
    await supabase.from('agency_vendors').upsert(vendors);

    return NextResponse.json({ success: true, message: "Database seeded successfully!" });
  } catch (error: any) {
    console.error("Seeding Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
