-- Create animations table
CREATE TABLE animations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  path VARCHAR(500) NOT NULL,
  duration DECIMAL(10, 2),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX idx_animations_created_by ON animations(created_by);
CREATE INDEX idx_animations_created_at ON animations(created_at);

-- Enable Row Level Security
ALTER TABLE animations ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read animations
CREATE POLICY "Anyone can view animations" ON animations
  FOR SELECT
  USING (true);

-- Policy: Only authenticated users can insert
CREATE POLICY "Authenticated users can insert animations" ON animations
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Policy: Only creator or admin can update animations
CREATE POLICY "Users can update own animations" ON animations
  FOR UPDATE
  USING (
    auth.uid() = created_by OR 
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  )
  WITH CHECK (
    auth.uid() = created_by OR 
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- Policy: Only creator or admin can delete animations
CREATE POLICY "Users can delete own animations" ON animations
  FOR DELETE
  USING (
    auth.uid() = created_by OR 
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );
