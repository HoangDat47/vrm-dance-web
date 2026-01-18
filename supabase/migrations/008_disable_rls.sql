-- Drop all existing RLS policies before disabling RLS
DROP POLICY IF EXISTS "Authenticated users can insert models" ON models;
DROP POLICY IF EXISTS "Authenticated users can update models" ON models;
DROP POLICY IF EXISTS "Authenticated users can delete models" ON models;
DROP POLICY IF EXISTS "Users can update own models" ON models;
DROP POLICY IF EXISTS "Users can delete own models" ON models;
DROP POLICY IF EXISTS "Public can read models" ON models;

DROP POLICY IF EXISTS "Authenticated users can insert animations" ON animations;
DROP POLICY IF EXISTS "Authenticated users can update animations" ON animations;
DROP POLICY IF EXISTS "Authenticated users can delete animations" ON animations;
DROP POLICY IF EXISTS "Users can delete own animations" ON animations;
DROP POLICY IF EXISTS "Public can read animations" ON animations;

-- Disable RLS on tables since we use service role keys for server-side authorization
-- Authentication is handled by Clerk, authorization is checked via Supabase role checks
ALTER TABLE models DISABLE ROW LEVEL SECURITY;
ALTER TABLE animations DISABLE ROW LEVEL SECURITY;
