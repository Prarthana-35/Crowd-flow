/*
  # Create storage bucket for video uploads

  1. New Storage
    - Create 'crowd-videos' bucket for storing uploaded videos
  
  2. Security
    - Enable public access for authenticated users
*/

-- Create the storage bucket for videos
INSERT INTO storage.buckets (id, name)
VALUES ('crowd-videos', 'crowd-videos')
ON CONFLICT DO NOTHING;

-- Set up storage policy for authenticated users
CREATE POLICY "Allow authenticated users to upload videos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'crowd-videos' AND
  auth.role() = 'authenticated'
);

-- Allow authenticated users to read their uploaded videos
CREATE POLICY "Allow authenticated users to read videos"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'crowd-videos');