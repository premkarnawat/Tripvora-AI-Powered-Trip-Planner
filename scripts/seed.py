import psycopg2
import sys

def main():
    print("Connecting to Supabase for seeding...")
    try:
        conn = psycopg2.connect(
            host="db.gbmuacxsterrofwvvfow.supabase.co",
            port="5432",
            user="postgres",
            password="Tripvora.database1716#",
            database="postgres"
        )
        conn.autocommit = True
        cursor = conn.cursor()
        print("Connected successfully.")
        
        # SQL seeding script
        seed_sql = """
        -- Ensure some agencies exist
        INSERT INTO public.agencies (id, name, city, subscription_status, badge_type, revenue, conversion_rate)
        VALUES 
            ('771e7a50-01c0-482a-a9e9-158a1bc1c2da', 'Wanderlust Holidays', 'New Delhi, India', 'Active', 'ELITE PARTNER', 245600, 18.5),
            ('22c4d621-cf5c-4389-9a25-b44c38d38cfd', 'Travelista India', 'Mumbai, India', 'Active', 'GROWTH PLAN', 192480, 15.2),
            ('c58bcbb8-8bc6-4660-ae1d-2321481d2f78', 'Elite Escapes', 'Bangalore, India', 'Pending Audit', 'OVERDUE REVIEW', 320300, 12.8)
        ON CONFLICT (id) DO NOTHING;

        -- Ensure some users exist (these would normally be created by Supabase Auth, but we can insert them into public.users if it exists, or just use auth.users)
        -- Actually, the schema uses public.users for profile data. Let's insert some mock profiles.
        INSERT INTO public.users (id, email, full_name, role)
        VALUES 
            ('1c8a169b-8bc6-4660-ae1d-2321481d2f78', 'adityaroy@gmail.com', 'Aditya Roy', 'traveler'),
            ('2a5c4d62-cf5c-4389-9a25-b44c38d38cfd', 'priyasen@hotmail.com', 'Priya Sen', 'traveler'),
            ('3b1e7a50-01c0-482a-a9e9-158a1bc1c2da', 'rverma@gmail.com', 'Rahul Verma', 'traveler')
        ON CONFLICT (id) DO NOTHING;

        -- Ensure destinations exist
        INSERT INTO public.destination_cache (id, name, seo_description, popular_attractions, popular_activities, images)
        VALUES 
            ('d1c4d621-cf5c-4389-9a25-b44c38d38cfd', 'Goa', 'Pristine beaches, heritage churches, and vibrant nightlife.', ARRAY['Calangute Beach', 'Fort Aguada', 'Dudhsagar Falls'], ARRAY['Parasailing', 'Scuba Diving', 'Casino Tours'], ARRAY['https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=300&auto=format&fit=crop']),
            ('d2c4d621-cf5c-4389-9a25-b44c38d38cfd', 'Kashmir', 'Heaven on earth with snow-capped peaks and serene Dal Lake shikhara rides.', ARRAY['Gulmarg Gondola', 'Shalimar Bagh', 'Pahalgam Valley'], ARRAY['Shikhara Ride', 'Skiing', 'Snowboarding'], ARRAY['https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=300&auto=format&fit=crop']),
            ('d3c4d621-cf5c-4389-9a25-b44c38d38cfd', 'Manali', 'Adventure hub in Himachal Pradesh offering trekking, river rafting, and scenic beauty.', ARRAY['Solang Valley', 'Rohtang Pass', 'Hadimba Temple'], ARRAY['Paragliding', 'Trekking', 'Skiing'], ARRAY['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=300&auto=format&fit=crop'])
        ON CONFLICT (id) DO NOTHING;

        -- Trips (belong to users, let's just insert one for the first mock user)
        INSERT INTO public.trips (id, user_id, destination, start_date, end_date, adult_count, status, budget_tier)
        VALUES 
            ('t1c4d621-cf5c-4389-9a25-b44c38d38cfd', '1c8a169b-8bc6-4660-ae1d-2321481d2f78', 'Goa Sunset & Beach Escape', CURRENT_DATE + INTERVAL '10 days', CURRENT_DATE + INTERVAL '15 days', 2, 'confirmed', 'standard'),
            ('t2c4d621-cf5c-4389-9a25-b44c38d38cfd', '1c8a169b-8bc6-4660-ae1d-2321481d2f78', 'Tokyo & Kyoto Cherry Blossoms', NULL, NULL, 2, 'draft', 'luxury')
        ON CONFLICT (id) DO NOTHING;

        -- CRM: Agency Customers (belong to agency)
        INSERT INTO public.agency_customers (id, agency_id, name, email, phone, total_trips, total_spent, status)
        VALUES 
            ('c1c4d621-cf5c-4389-9a25-b44c38d38cfd', '771e7a50-01c0-482a-a9e9-158a1bc1c2da', 'Aditya Roy', 'adityaroy@gmail.com', '+91 99887 76655', 4, 245000, 'VIP Customer'),
            ('c2c4d621-cf5c-4389-9a25-b44c38d38cfd', '771e7a50-01c0-482a-a9e9-158a1bc1c2da', 'Priya Sen', 'priyasen@hotmail.com', '+91 98888 77777', 1, 0, 'New Lead')
        ON CONFLICT (id) DO NOTHING;

        -- CRM: Agency Leads
        INSERT INTO public.agency_leads (id, agency_id, customer_name, customer_email, customer_phone, destination, budget, pax, trip_dates, pipeline_status, source)
        VALUES 
            ('l1c4d621-cf5c-4389-9a25-b44c38d38cfd', '771e7a50-01c0-482a-a9e9-158a1bc1c2da', 'Rohan Sharma', 'rohan@example.com', '+91 91234 56789', 'Bali, Indonesia', 180000, '2 Adults, 1 Child', 'Next Month', 'New Inquiries', 'Website Organic'),
            ('l2c4d621-cf5c-4389-9a25-b44c38d38cfd', '771e7a50-01c0-482a-a9e9-158a1bc1c2da', 'Kavita Das', 'kavita@example.com', '+91 99887 77665', 'Maldives', 250000, '2 Adults', 'Oct 2026', 'Quotation Sent', 'WhatsApp Lead')
        ON CONFLICT (id) DO NOTHING;

        -- CRM: Bookings
        INSERT INTO public.bookings (id, agency_id, lead_id, customer_id, booking_reference, total_amount, payment_status, booking_status)
        VALUES 
            ('b1c4d621-cf5c-4389-9a25-b44c38d38cfd', '771e7a50-01c0-482a-a9e9-158a1bc1c2da', 'l1c4d621-cf5c-4389-9a25-b44c38d38cfd', 'c1c4d621-cf5c-4389-9a25-b44c38d38cfd', 'TRIP-2026-X8Y9', 185000, 'Partial', 'Confirmed')
        ON CONFLICT (id) DO NOTHING;

        """
        
        print("Executing seed SQL script...")
        cursor.execute(seed_sql)
        print("Seeding successful!")
        
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
