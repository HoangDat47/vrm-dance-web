-- Force fix created_by columns to TEXT type

-- Drop ALL existing policies dynamically
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'models') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON models';
    END LOOP;
    
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'animations') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON animations';
    END LOOP;
END $$;

-- Drop foreign key constraints
ALTER TABLE models DROP CONSTRAINT IF EXISTS models_created_by_fkey;
ALTER TABLE animations DROP CONSTRAINT IF EXISTS animations_created_by_fkey;

-- Change column types to text
ALTER TABLE models ALTER COLUMN created_by TYPE text USING created_by::text;
ALTER TABLE animations ALTER COLUMN created_by TYPE text USING created_by::text;

-- Re-add foreign key constraints to clerk_id
ALTER TABLE models ADD CONSTRAINT models_created_by_fkey 
  FOREIGN KEY (created_by) REFERENCES users(clerk_id) ON DELETE SET NULL;
ALTER TABLE animations ADD CONSTRAINT animations_created_by_fkey 
  FOREIGN KEY (created_by) REFERENCES users(clerk_id) ON DELETE SET NULL;

-- Re-add basic policies
CREATE POLICY "Public can read models" ON models FOR SELECT USING (true);
CREATE POLICY "Service role bypass models" ON models USING (current_setting('role') = 'service_role');
CREATE POLICY "Public can read animations" ON animations FOR SELECT USING (true);
CREATE POLICY "Service role bypass animations" ON animations USING (current_setting('role') = 'service_role');
