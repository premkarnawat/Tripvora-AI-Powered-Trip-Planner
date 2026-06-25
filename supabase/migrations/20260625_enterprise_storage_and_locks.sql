-- Travixa Enterprise Storage Buckets & Distributed Locking SQL Migration
-- Created: June 25, 2026

-- 1. Initialize Storage Buckets for Traveler, Agency, and Admin Ecosystems
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('agency-logos', 'agency-logos', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp']),
  ('itinerary-pdfs', 'itinerary-pdfs', true, 52428800, ARRAY['application/pdf']),
  ('kyc-documents', 'kyc-documents', false, 20971520, ARRAY['application/pdf', 'image/jpeg', 'image/png']),
  ('cms-media', 'cms-media', true, 104857600, ARRAY['image/jpeg', 'image/png', 'video/mp4', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Storage Row-Level Security (RLS) Policies
-- Allow public read access to public buckets
CREATE POLICY "Public Read Avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Public Read Agency Logos" ON storage.objects FOR SELECT USING (bucket_id = 'agency-logos');
CREATE POLICY "Public Read Itineraries" ON storage.objects FOR SELECT USING (bucket_id = 'itinerary-pdfs');
CREATE POLICY "Public Read CMS Media" ON storage.objects FOR SELECT USING (bucket_id = 'cms-media');

-- Allow authenticated users (travelers, agency owners, admins) to upload to buckets
CREATE POLICY "Auth Upload Avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
CREATE POLICY "Auth Upload Agency Logos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'agency-logos' AND auth.role() = 'authenticated');
CREATE POLICY "Auth Upload Itineraries" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'itinerary-pdfs' AND auth.role() = 'authenticated');
CREATE POLICY "Auth Upload KYC" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'kyc-documents' AND auth.role() = 'authenticated');
CREATE POLICY "Auth Upload CMS" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cms-media' AND auth.role() = 'authenticated');

-- Allow users to update and delete their own uploaded objects
CREATE POLICY "Auth Modify Own Objects" ON storage.objects FOR UPDATE USING (auth.uid() = owner);
CREATE POLICY "Auth Delete Own Objects" ON storage.objects FOR DELETE USING (auth.uid() = owner);

-- 3. Distributed In-Flight Deduplication Locks Table (For Multi-Instance Serverless Stampede Defense)
CREATE TABLE IF NOT EXISTS public.ai_generation_locks (
  prompt_hash TEXT PRIMARY KEY,
  locked_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '45 seconds')
);

CREATE INDEX IF NOT EXISTS idx_ai_locks_expires ON public.ai_generation_locks(expires_at);

-- Auto-cleanup expired locks function
CREATE OR REPLACE FUNCTION public.cleanup_expired_ai_locks() RETURNS void AS $$
BEGIN
  DELETE FROM public.ai_generation_locks WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
