-- ============================================
-- CREATE KV STORE TABLE FOR CIELO OS
-- ============================================
-- This SQL creates the missing kv_store_6023d608 table
-- Run this in your Supabase SQL Editor
-- ============================================

-- Create the KV store table
CREATE TABLE IF NOT EXISTS public.kv_store_6023d608 (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_kv_store_6023d608_key ON public.kv_store_6023d608(key);

-- Enable Row Level Security (optional, but recommended)
ALTER TABLE public.kv_store_6023d608 ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role full access
CREATE POLICY IF NOT EXISTS "Service role has full access to kv_store_6023d608" 
ON public.kv_store_6023d608
FOR ALL 
USING (auth.jwt()->>'role' = 'service_role');

-- Create policy to allow authenticated users to read
CREATE POLICY IF NOT EXISTS "Authenticated users can read kv_store_6023d608" 
ON public.kv_store_6023d608
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Grant permissions to service role (for backend operations)
GRANT ALL ON public.kv_store_6023d608 TO service_role;

-- Grant read permissions to authenticated users
GRANT SELECT ON public.kv_store_6023d608 TO authenticated;

-- Grant all permissions to postgres (superuser)
GRANT ALL ON public.kv_store_6023d608 TO postgres;

-- Optional: Insert a test record to verify table works
INSERT INTO public.kv_store_6023d608 (key, value) 
VALUES ('_table_created', '{"created_at": "' || NOW()::TEXT || '", "version": "1.0"}'::JSONB)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Verify table was created
SELECT 
    tablename,
    schemaname,
    tableowner
FROM pg_tables 
WHERE tablename = 'kv_store_6023d608';

-- Display success message
DO $$
BEGIN
    RAISE NOTICE 'Table kv_store_6023d608 created successfully!';
    RAISE NOTICE 'You can now refresh your CIELO OS dashboard.';
END $$;
