/*
  # Update storage policies for video uploads

  1. Security Updates
    - Modify storage policies to allow public uploads
    - Enable anonymous uploads temporarily for testing
    - Add proper bucket-level policies
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to upload videos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to read videos" ON storage.objects;

-- Create more permissive policies for testing
CREATE POLICY "Allow public uploads"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'crowd-videos');

CREATE POLICY "Allow public reads"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'crowd-videos');

-- Update bucket public setting
UPDATE storage.buckets
SET public = true
WHERE id = 'crowd-videos';