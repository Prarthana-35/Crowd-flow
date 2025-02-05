/*
  # Create tables for crowd flow monitoring

  1. New Tables
    - `videos`
      - `id` (uuid, primary key)
      - `url` (text)
      - `status` (text)
      - `created_at` (timestamp)
      - `processed_at` (timestamp)
    - `analysis_results`
      - `id` (uuid, primary key)
      - `video_id` (uuid, foreign key)
      - `crowd_density` (jsonb)
      - `hotspots` (jsonb)
      - `alerts` (jsonb)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  processed_at timestamptz
);

-- Create analysis_results table
CREATE TABLE IF NOT EXISTS analysis_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid REFERENCES videos(id),
  crowd_density jsonb,
  hotspots jsonb,
  alerts jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert videos"
  ON videos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view their videos"
  ON videos
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view analysis results"
  ON analysis_results
  FOR SELECT
  TO authenticated
  USING (true);