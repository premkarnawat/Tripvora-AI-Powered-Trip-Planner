-- Enforce Zero Trust: Enable Row Level Security (RLS) on all sensitive tables

-- 0. Create the missing 'users' table if it doesn't exist
-- It extends the Supabase auth.users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'traveler',
  phone TEXT,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Note: Ensure trips, agencies, agency_users, and agency_vendors exist.
-- If they don't, they need CREATE TABLE statements as well.

-- 1. Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_vendors ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies if any (for clean slate)
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Users can view their own trips" ON public.trips;
DROP POLICY IF EXISTS "Users can insert their own trips" ON public.trips;
DROP POLICY IF EXISTS "Users can update their own trips" ON public.trips;

-- 3. Users Table Policies
-- Allow users to read and update ONLY their own row
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Allow new users to insert their own profile during signup
CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. Trips Table Policies
-- Allow users to manage ONLY their own trips
CREATE POLICY "Users can view their own trips" ON public.trips
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trips" ON public.trips
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trips" ON public.trips
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trips" ON public.trips
  FOR DELETE USING (auth.uid() = user_id);

-- 5. Agencies & CRM Tables
-- Agency users can only view their agency
CREATE POLICY "Agency staff can view their agency" ON public.agencies
  FOR SELECT USING (
    auth.uid() = user_id 
    OR 
    id IN (SELECT agency_id FROM public.agency_users WHERE user_id = auth.uid())
  );

CREATE POLICY "Agency staff can manage vendors" ON public.agency_vendors
  FOR ALL USING (
    agency_id IN (
      SELECT id FROM public.agencies WHERE user_id = auth.uid()
      UNION
      SELECT agency_id FROM public.agency_users WHERE user_id = auth.uid()
    )
  );
