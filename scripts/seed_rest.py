import urllib.request
import json
import ssl

supabase_url = 'https://gbmuacxsterrofwvvfow.supabase.co/rest/v1'
anon_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdibXVhY3hzdGVycm9md3Z2Zm93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1OTU2NjQsImV4cCI6MjA5NzE3MTY2NH0.59xytlk9gb2yFQJlfCv-_gVXwc2izr3YyRadJCYCl1s'

headers = {
    'apikey': anon_key,
    'Authorization': f'Bearer {anon_key}',
    'Content-Type': 'application/json',
    'Prefer': 'resolution=merge-duplicates'
}

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def insert_data(table, data):
    print(f"Inserting into {table}...")
    url = f"{supabase_url}/{table}"
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req, context=ctx) as response:
            if response.status in (200, 201):
                print(f"Successfully inserted into {table}.")
            else:
                print(f"Failed {table}: {response.read()}")
    except urllib.error.HTTPError as e:
        print(f"HTTP Error {e.code} on {table}: {e.read().decode('utf-8')}")
    except Exception as e:
        print(f"Error on {table}: {e}")

def main():
    agencies = [
      { 'id': '771e7a50-01c0-482a-a9e9-158a1bc1c2da', 'name': 'Wanderlust Holidays', 'city': 'New Delhi, India', 'subscription_status': 'Active', 'badge_type': 'ELITE PARTNER', 'revenue': 245600, 'conversion_rate': 18.5 },
      { 'id': '22c4d621-cf5c-4389-9a25-b44c38d38cfd', 'name': 'Travelista India', 'city': 'Mumbai, India', 'subscription_status': 'Active', 'badge_type': 'GROWTH PLAN', 'revenue': 192480, 'conversion_rate': 15.2 },
      { 'id': 'c58bcbb8-8bc6-4660-ae1d-2321481d2f78', 'name': 'Elite Escapes', 'city': 'Bangalore, India', 'subscription_status': 'Pending Audit', 'badge_type': 'OVERDUE REVIEW', 'revenue': 320300, 'conversion_rate': 12.8 }
    ]
    insert_data('agencies', agencies)

    users = [
      { 'id': '1c8a169b-8bc6-4660-ae1d-2321481d2f78', 'email': 'adityaroy@gmail.com', 'full_name': 'Aditya Roy', 'role': 'traveler' },
      { 'id': '2a5c4d62-cf5c-4389-9a25-b44c38d38cfd', 'email': 'priyasen@hotmail.com', 'full_name': 'Priya Sen', 'role': 'traveler' },
      { 'id': '3b1e7a50-01c0-482a-a9e9-158a1bc1c2da', 'email': 'rverma@gmail.com', 'full_name': 'Rahul Verma', 'role': 'traveler' }
    ]
    insert_data('users', users)

    destinations = [
      { 'id': 'd1c4d621-cf5c-4389-9a25-b44c38d38cfd', 'name': 'Goa', 'seo_description': 'Pristine beaches, heritage churches, and vibrant nightlife.', 'popular_attractions': ['Calangute Beach', 'Fort Aguada', 'Dudhsagar Falls'], 'popular_activities': ['Parasailing', 'Scuba Diving', 'Casino Tours'], 'images': ['https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=300&auto=format&fit=crop'] },
      { 'id': 'd2c4d621-cf5c-4389-9a25-b44c38d38cfd', 'name': 'Kashmir', 'seo_description': 'Heaven on earth with snow-capped peaks and serene Dal Lake shikhara rides.', 'popular_attractions': ['Gulmarg Gondola', 'Shalimar Bagh', 'Pahalgam Valley'], 'popular_activities': ['Shikhara Ride', 'Skiing', 'Snowboarding'], 'images': ['https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=300&auto=format&fit=crop'] },
      { 'id': 'd3c4d621-cf5c-4389-9a25-b44c38d38cfd', 'name': 'Manali', 'seo_description': 'Adventure hub in Himachal Pradesh offering trekking, river rafting, and scenic beauty.', 'popular_attractions': ['Solang Valley', 'Rohtang Pass', 'Hadimba Temple'], 'popular_activities': ['Paragliding', 'Trekking', 'Skiing'], 'images': ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=300&auto=format&fit=crop'] }
    ]
    insert_data('destination_cache', destinations)

    userId = '1c8a169b-8bc6-4660-ae1d-2321481d2f78'
    trips = [
      { 'id': 't1c4d621-cf5c-4389-9a25-b44c38d38cfd', 'user_id': userId, 'destination': 'Goa Sunset & Beach Escape', 'adult_count': 2, 'status': 'confirmed', 'budget_tier': 'standard' },
      { 'id': 't2c4d621-cf5c-4389-9a25-b44c38d38cfd', 'user_id': userId, 'destination': 'Tokyo & Kyoto Cherry Blossoms', 'adult_count': 2, 'status': 'draft', 'budget_tier': 'luxury' }
    ]
    insert_data('trips', trips)

    customers = [
      { 'id': 'c1c4d621-cf5c-4389-9a25-b44c38d38cfd', 'agency_id': '771e7a50-01c0-482a-a9e9-158a1bc1c2da', 'name': 'Aditya Roy', 'email': 'adityaroy@gmail.com', 'phone': '+91 99887 76655', 'total_trips': 4, 'total_spent': 245000, 'status': 'VIP Customer' },
      { 'id': 'c2c4d621-cf5c-4389-9a25-b44c38d38cfd', 'agency_id': '771e7a50-01c0-482a-a9e9-158a1bc1c2da', 'name': 'Priya Sen', 'email': 'priyasen@hotmail.com', 'phone': '+91 98888 77777', 'total_trips': 1, 'total_spent': 0, 'status': 'New Lead' }
    ]
    insert_data('agency_customers', customers)

    leads = [
      { 'id': 'l1c4d621-cf5c-4389-9a25-b44c38d38cfd', 'agency_id': '771e7a50-01c0-482a-a9e9-158a1bc1c2da', 'customer_name': 'Rohan Sharma', 'customer_email': 'rohan@example.com', 'customer_phone': '+91 91234 56789', 'destination': 'Bali, Indonesia', 'budget': 180000, 'pax': '2 Adults, 1 Child', 'trip_dates': 'Next Month', 'pipeline_status': 'New Inquiries', 'source': 'Website Organic' },
      { 'id': 'l2c4d621-cf5c-4389-9a25-b44c38d38cfd', 'agency_id': '771e7a50-01c0-482a-a9e9-158a1bc1c2da', 'customer_name': 'Kavita Das', 'customer_email': 'kavita@example.com', 'customer_phone': '+91 99887 77665', 'destination': 'Maldives', 'budget': 250000, 'pax': '2 Adults', 'trip_dates': 'Oct 2026', 'pipeline_status': 'Quotation Sent', 'source': 'WhatsApp Lead' }
    ]
    insert_data('agency_leads', leads)

    bookings = [
      { 'id': 'b1c4d621-cf5c-4389-9a25-b44c38d38cfd', 'agency_id': '771e7a50-01c0-482a-a9e9-158a1bc1c2da', 'lead_id': 'l1c4d621-cf5c-4389-9a25-b44c38d38cfd', 'customer_id': 'c1c4d621-cf5c-4389-9a25-b44c38d38cfd', 'booking_reference': 'TRIP-2026-X8Y9', 'total_amount': 185000, 'payment_status': 'Partial', 'booking_status': 'Confirmed' }
    ]
    insert_data('bookings', bookings)

if __name__ == "__main__":
    main()
