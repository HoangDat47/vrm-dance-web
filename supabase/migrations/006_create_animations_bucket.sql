-- Create storage bucket for animations
INSERT INTO storage.buckets (id, name, public)
VALUES ('animations', 'animations', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy for animations
CREATE POLICY "Anyone can read animations"
ON storage.objects FOR SELECT
USING (bucket_id = 'animations');

CREATE POLICY "Authenticated users can upload animations"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'animations'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can delete own animations"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'animations'
  AND auth.uid() = owner
);
