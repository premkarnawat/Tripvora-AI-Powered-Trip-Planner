-- Travixa Supabase Schema v1
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Core Enums
CREATE TYPE user_role AS ENUM ('traveler', 'agency', 'admin');
CREATE TYPE vendor_category AS ENUM ('hotels', 'activities', 'transfers', 'guides', 'meals', 'cruises', 'flights', 'insurance');
CREATE TYPE customer_ltv_tier AS ENUM ('Elite', 'High', 'Medium', 'Low');
CREATE TYPE lead_score AS ENUM ('Hot', 'Warm', 'Cold');
CREATE TYPE lead_status AS ENUM ('New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Booked', 'Lost');
CREATE TYPE trip_type AS ENUM ('user_generated', 'agency_package');
CREATE TYPE trip_status AS ENUM ('Draft', 'Saved', 'Quoted', 'Booked', 'Completed', 'Cancelled');
CREATE TYPE component_category AS ENUM ('accommodation', 'transport', 'activity', 'meal', 'flight', 'misc');
CREATE TYPE pricing_mode AS ENUM ('detail', 'total_margin', 'fixed_profit');
CREATE TYPE gst_type AS ENUM ('split', 'igst');
CREATE TYPE discount_type AS ENUM ('percentage', 'fixed');
CREATE TYPE marketplace_quality_tier AS ENUM ('Enterprise', 'Premium', 'Standard');
CREATE TYPE booking_status AS ENUM ('Pending', 'Partial', 'Confirmed', 'Cancelled');
CREATE TYPE comm_log_type AS ENUM ('WhatsApp', 'Email');
CREATE TYPE comm_log_status AS ENUM ('Sent', 'Clicked', 'Replied');

-- 1. Identity & Auth
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'traveler',
    full_name TEXT,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    preferences JSONB DEFAULT '{"destinations": [], "styles": [], "foods": []}'::jsonb,
    privacy_settings JSONB DEFAULT '{"publicProfile": false, "shareTrips": true, "personalizedAds": false}'::jsonb,
    notification_settings JSONB DEFAULT '{"emailAlerts": true, "smsAlerts": false, "whatsappAlerts": true, "aiRecommendation": true}'::jsonb,
    travel_credits NUMERIC DEFAULT 0,
    subscription_tier TEXT DEFAULT 'Free Tier',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Agency CRM
CREATE TABLE agencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    agency_name TEXT NOT NULL,
    owner_name TEXT,
    gst_number TEXT,
    pan_number TEXT,
    business_address TEXT,
    website TEXT,
    description TEXT,
    phone TEXT,
    whatsapp_number TEXT,
    business_email TEXT,
    brand_colors JSONB DEFAULT '{"primary": "#14B8A6", "secondary": "#0F172A"}'::jsonb,
    subscription_plan TEXT DEFAULT 'Free Tier',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE agency_vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    category vendor_category NOT NULL,
    name TEXT NOT NULL,
    cost_price NUMERIC DEFAULT 0,
    selling_price NUMERIC DEFAULT 0,
    rating NUMERIC DEFAULT 0,
    description TEXT,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE agency_customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT,
    whatsapp TEXT,
    city TEXT,
    ltv_tier customer_ltv_tier DEFAULT 'Medium',
    total_spend NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE agency_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES agency_customers(id) ON DELETE SET NULL,
    destination TEXT,
    budget NUMERIC,
    travel_date DATE,
    pax INTEGER,
    source TEXT,
    score lead_score DEFAULT 'Warm',
    pipeline_status lead_status DEFAULT 'New',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Communication Hub (Level 1)
CREATE TABLE whatsapp_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    template_body TEXT NOT NULL,
    variables_mapping JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE email_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    template_body TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE communication_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES agency_leads(id) ON DELETE SET NULL,
    log_type comm_log_type NOT NULL,
    template_used TEXT,
    status comm_log_status DEFAULT 'Sent',
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Itinerary & Package Engine
CREATE TABLE trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type trip_type DEFAULT 'user_generated',
    title TEXT NOT NULL,
    destination TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    duration_nights INTEGER,
    date_flexibility_type TEXT,
    demographics JSONB,
    target_budget NUMERIC,
    travel_styles TEXT[],
    status trip_status DEFAULT 'Draft',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE trip_components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    category component_category NOT NULL,
    vendor_id UUID REFERENCES agency_vendors(id) ON DELETE SET NULL,
    day_number INTEGER,
    time TEXT,
    title TEXT NOT NULL,
    description TEXT,
    internal_cost NUMERIC DEFAULT 0,
    selling_price NUMERIC DEFAULT 0,
    qty INTEGER DEFAULT 1,
    is_ai_generated BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE quotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES agency_leads(id) ON DELETE SET NULL,
    quote_number TEXT UNIQUE NOT NULL,
    issue_date DATE DEFAULT CURRENT_DATE,
    valid_till DATE,
    pricing_metadata JSONB,
    total_amount NUMERIC DEFAULT 0,
    pdf_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Bookings
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    agency_id UUID REFERENCES agencies(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES agency_customers(id) ON DELETE SET NULL,
    invoice_number TEXT UNIQUE NOT NULL,
    total_amount NUMERIC DEFAULT 0,
    amount_paid NUMERIC DEFAULT 0,
    status booking_status DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Marketplace
CREATE TABLE marketplace_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    traveler_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    destination TEXT NOT NULL,
    budget NUMERIC,
    pax INTEGER,
    travel_date DATE,
    quality_tier marketplace_quality_tier DEFAULT 'Standard',
    credit_cost INTEGER DEFAULT 10,
    status TEXT DEFAULT 'Open',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. AI & Travel Intelligence OS Caching (Permanent Reusable Intelligence)
CREATE TABLE destination_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_name TEXT UNIQUE NOT NULL,
    overview TEXT,
    tags TEXT[],
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ai_generation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prompt_hash TEXT UNIQUE NOT NULL,
    prompt_text TEXT NOT NULL,
    response_json JSONB NOT NULL,
    token_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE destination_intelligence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_name TEXT UNIQUE NOT NULL,
    overview TEXT,
    popular_attractions JSONB DEFAULT '[]'::jsonb,
    historical_sites JSONB DEFAULT '[]'::jsonb,
    adventure_activities JSONB DEFAULT '[]'::jsonb,
    nature JSONB DEFAULT '[]'::jsonb,
    shopping JSONB DEFAULT '[]'::jsonb,
    nightlife JSONB DEFAULT '[]'::jsonb,
    family_places JSONB DEFAULT '[]'::jsonb,
    hidden_gems JSONB DEFAULT '[]'::jsonb,
    photography_spots JSONB DEFAULT '[]'::jsonb,
    best_season TEXT,
    local_customs TEXT,
    safety_notes TEXT,
    travel_tips TEXT,
    average_costs JSONB DEFAULT '{}'::jsonb,
    recommended_trip_duration INTEGER DEFAULT 4,
    emergency_info JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE weather_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_name TEXT UNIQUE NOT NULL,
    current_weather JSONB DEFAULT '{}'::jsonb,
    hourly_forecast JSONB DEFAULT '[]'::jsonb,
    daily_forecast JSONB DEFAULT '[]'::jsonb,
    rain_probability NUMERIC DEFAULT 10,
    temperature NUMERIC DEFAULT 27,
    wind NUMERIC DEFAULT 12,
    humidity NUMERIC DEFAULT 65,
    uv_index NUMERIC DEFAULT 6,
    sunrise TEXT DEFAULT '06:00 AM',
    sunset TEXT DEFAULT '06:30 PM',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE restaurant_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_name TEXT NOT NULL,
    name TEXT NOT NULL,
    cuisine TEXT,
    is_veg BOOLEAN DEFAULT false,
    is_non_veg BOOLEAN DEFAULT true,
    is_jain_friendly BOOLEAN DEFAULT false,
    is_vegan BOOLEAN DEFAULT false,
    is_family_friendly BOOLEAN DEFAULT true,
    price_range TEXT DEFAULT '₹₹₹',
    speciality TEXT,
    must_try_dish TEXT,
    opening_hours TEXT DEFAULT '11:00 AM - 11:00 PM',
    distance TEXT DEFAULT 'Central',
    meal_type TEXT DEFAULT 'Dinner',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(destination_name, name)
);

CREATE TABLE food_intelligence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_name TEXT UNIQUE NOT NULL,
    local_specialities TEXT[] DEFAULT '{}',
    must_try_foods TEXT[] DEFAULT '{}',
    best_veg_options TEXT[] DEFAULT '{}',
    best_non_veg_options TEXT[] DEFAULT '{}',
    budget_food TEXT[] DEFAULT '{}',
    premium_restaurants TEXT[] DEFAULT '{}',
    street_food TEXT[] DEFAULT '{}',
    desserts TEXT[] DEFAULT '{}',
    traditional_cuisine TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE attraction_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_name TEXT NOT NULL,
    name TEXT NOT NULL,
    category TEXT,
    opening_hours TEXT DEFAULT '09:00 AM - 06:00 PM',
    approx_visit_duration TEXT DEFAULT '2 Hours',
    best_visiting_time TEXT DEFAULT 'Morning',
    photography_score NUMERIC DEFAULT 4.8,
    is_family_friendly BOOLEAN DEFAULT true,
    adventure_level TEXT DEFAULT 'Moderate',
    crowd_level TEXT DEFAULT 'Medium',
    entry_fee NUMERIC DEFAULT 500,
    coordinates JSONB DEFAULT '{"lat": 0, "lng": 0}'::jsonb,
    distance TEXT DEFAULT '10km',
    travel_time TEXT DEFAULT '25 mins',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(destination_name, name)
);

CREATE TABLE emergency_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_name TEXT UNIQUE NOT NULL,
    hospitals JSONB DEFAULT '[]'::jsonb,
    police JSONB DEFAULT '[]'::jsonb,
    atm JSONB DEFAULT '[]'::jsonb,
    fuel_stations JSONB DEFAULT '[]'::jsonb,
    pharmacies JSONB DEFAULT '[]'::jsonb,
    tourist_help JSONB DEFAULT '[]'::jsonb,
    embassy JSONB DEFAULT '[]'::jsonb,
    emergency_numbers JSONB DEFAULT '{"police": "112", "ambulance": "102"}'::jsonb,
    nearest_medical_facilities JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE destination_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE destination_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE attraction_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_cache ENABLE ROW LEVEL SECURITY;
