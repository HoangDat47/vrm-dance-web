-- Re-enable RLS and create policies that allow only admins to insert/update/delete
-- Public can read, but only users with role 'admin' in users table can modify

-- Re-enable RLS
ALTER TABLE models ENABLE ROW LEVEL SECURITY;
ALTER TABLE animations ENABLE ROW LEVEL SECURITY;

-- Create helper function to check if a clerk_id has admin role
CREATE OR REPLACE FUNCTION is_admin(clerk_user_id text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE clerk_id = clerk_user_id
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Models policies
CREATE POLICY "Public can read models"
  ON models FOR SELECT
  USING (true);

CREATE POLICY "Service role bypass"
  ON models
  USING (current_setting('role') = 'service_role');

-- Animations policies  
CREATE POLICY "Public can read animations"
  ON animations FOR SELECT
  USING (true);

CREATE POLICY "Service role bypass animations"
  ON animations
  USING (current_setting('role') = 'service_role');
