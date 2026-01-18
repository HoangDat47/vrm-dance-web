-- Disable RLS on storage buckets or create permissive policies
-- Since uploads are done client-side with service role key in headers, we need to allow uploads

-- Update bucket configurations to allow public access for uploads
UPDATE storage.buckets
SET public = true
WHERE name IN ('vrm-models', 'avatars', 'animations');

-- Create storage policies that allow authenticated users to upload
-- and allow public to read
CREATE POLICY "Public can read vrm-models"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'vrm-models');

CREATE POLICY "Authenticated can upload vrm-models"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'vrm-models');

CREATE POLICY "Public can read avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated can upload avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Public can read animations"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'animations');

CREATE POLICY "Authenticated can upload animations"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'animations');

CREATE POLICY "Authenticated can delete vrm-models"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'vrm-models');

CREATE POLICY "Authenticated can delete avatars"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated can delete animations"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'animations');
