-- Fix infinite recursion in RLS policies

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can read their own data" ON users;
DROP POLICY IF EXISTS "Admins can read all user data" ON users;

-- Create simpler RLS policies without recursion
-- Policy 1: Users can read their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Policy 2: Users can update their own data
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy 3: Allow inserting user record during signup
CREATE POLICY "Users can insert their own profile during signup" ON users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy 4: Authenticated users can read all profiles (for discovery)
-- Remove this if you want users to only see their own data
-- CREATE POLICY "Authenticated users can read all profiles" ON users
--   FOR SELECT
--   USING (auth.role() = 'authenticated');
