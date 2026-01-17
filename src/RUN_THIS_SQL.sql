-- ============================================
-- QUICK FIX FOR CIELO OS - RUN THIS NOW
-- ============================================
-- Copy this entire file and paste into:
-- Supabase Dashboard → SQL Editor → New query
-- Then click "Run" button
-- ============================================

-- Step 1: Create the missing KV store table
CREATE TABLE IF NOT EXISTS public.kv_store_6023d608 (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);

-- Step 2: Grant necessary permissions
GRANT ALL ON public.kv_store_6023d608 TO postgres;
GRANT ALL ON public.kv_store_6023d608 TO service_role;
GRANT ALL ON public.kv_store_6023d608 TO authenticated;
GRANT ALL ON public.kv_store_6023d608 TO anon;

-- Step 3: Create index for better performance
CREATE INDEX IF NOT EXISTS idx_kv_store_6023d608_key 
ON public.kv_store_6023d608(key);

-- Step 4: Insert test record to verify it works
INSERT INTO public.kv_store_6023d608 (key, value) 
VALUES ('_table_created', '{"timestamp": "' || NOW()::TEXT || '", "status": "ready"}'::JSONB)
ON CONFLICT (key) DO UPDATE 
SET value = EXCLUDED.value;

-- Step 5: Verify table was created successfully
SELECT 
    'SUCCESS: Table created!' as message,
    COUNT(*) as row_count,
    MAX(key) as sample_key
FROM public.kv_store_6023d608;

-- ============================================
-- After running this SQL:
-- 1. Wait 10-15 seconds (for schema cache)
-- 2. Go back to CIELO OS dashboard
-- 3. Press Ctrl+Shift+R (hard refresh)
-- 4. Everything should work! ✅
-- ============================================
