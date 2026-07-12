import psycopg2

db_url = "postgresql://postgres:Tripvora.database1716#@db.gbmuacxsterrofwvvfow.supabase.co:5432/postgres"

schema_sql = """
-- 1. Create users table
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

-- 2. Create trips table
CREATE TABLE IF NOT EXISTS public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  destination TEXT NOT NULL,
  trip_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create agencies table
CREATE TABLE IF NOT EXISTS public.agencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  subscription_tier TEXT DEFAULT 'free',
  subscription_status TEXT DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create agency_users table
CREATE TABLE IF NOT EXISTS public.agency_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'agent',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create agency_vendors table
CREATE TABLE IF NOT EXISTS public.agency_vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  cost_price NUMERIC DEFAULT 0,
  selling_price NUMERIC DEFAULT 0,
  rating NUMERIC DEFAULT 4.5,
  description TEXT,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_vendors ENABLE ROW LEVEL SECURITY;

-- 7. Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view their own trips" ON public.trips;
DROP POLICY IF EXISTS "Users can insert their own trips" ON public.trips;
DROP POLICY IF EXISTS "Users can update their own trips" ON public.trips;
DROP POLICY IF EXISTS "Users can delete their own trips" ON public.trips;
DROP POLICY IF EXISTS "Agency staff can view their agency" ON public.agencies;
DROP POLICY IF EXISTS "Agency staff can manage vendors" ON public.agency_vendors;

-- 8. Users Table Policies
CREATE POLICY "Users can view their own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own data" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- 9. Trips Table Policies
CREATE POLICY "Users can view their own trips" ON public.trips FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own trips" ON public.trips FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own trips" ON public.trips FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own trips" ON public.trips FOR DELETE USING (auth.uid() = user_id);

-- 10. Agencies & CRM Tables Policies
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
"""

def execute_schema():
    conn = None
    try:
        print("Connecting to Supabase PostgreSQL...")
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        print("Executing schema creation and RLS setup...")
        cur.execute(schema_sql)
        conn.commit()
        print("Success! Schema created and RLS enabled.")
        cur.close()
    except Exception as e:
        print(f"Error: {e}")
        if conn:
            conn.rollback()
    finally:
        if conn is not None:
            conn.close()

if __name__ == "__main__":
    execute_schema()
