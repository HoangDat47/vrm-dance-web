-- Create models table
CREATE TABLE models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  path VARCHAR(500) NOT NULL,
  avatar VARCHAR(500),
  rotation DECIMAL(10, 2) DEFAULT 0,
  scale DECIMAL(10, 2) DEFAULT 1.25,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX idx_models_created_by ON models(created_by);
CREATE INDEX idx_models_created_at ON models(created_at);

-- Enable Row Level Security
ALTER TABLE models ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read models
CREATE POLICY "Anyone can view models" ON models
  FOR SELECT
  USING (true);

-- Policy: Only authenticated users can insert
CREATE POLICY "Authenticated users can insert models" ON models
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Policy: Only creator or admin can update models
CREATE POLICY "Users can update own models" ON models
  FOR UPDATE
  USING (
    auth.uid() = created_by OR 
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  )
  WITH CHECK (
    auth.uid() = created_by OR 
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- Policy: Only creator or admin can delete models
CREATE POLICY "Users can delete own models" ON models
  FOR DELETE
  USING (
    auth.uid() = created_by OR 
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- Create storage bucket for VRM files
INSERT INTO storage.buckets (id, name, public)
VALUES ('vrm-models', 'vrm-models', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy for VRM models
CREATE POLICY "Anyone can read VRM models"
ON storage.objects FOR SELECT
USING (bucket_id = 'vrm-models');

CREATE POLICY "Authenticated users can upload VRM models"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'vrm-models' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can delete own VRM models"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'vrm-models'
  AND auth.uid() = owner
);

-- Storage policy for avatars
CREATE POLICY "Anyone can read avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can delete own avatars"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars'
  AND auth.uid() = owner
);
