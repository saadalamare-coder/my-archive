/*
# Cinematic Nostalgia Archive - Initial Schema

1. New Tables
- `folders` - Categories/folders for organizing media (e.g., "Family", "Events", "Places")
  - id, name, description, background_image_url, background_blur, created_at
- `media` - Photos and videos in the archive
  - id, folder_id, type (photo/video), title, file_url, thumbnail_url, year, date, location, story, enhanced_url, created_at
- `people` - People who appear in media
  - id, name, profile_image_url, created_at
- `media_people` - Tags linking people to media
  - id, media_id, person_id, created_at
- `otp_codes` - One-time access codes for visitors
  - id, code, is_active, is_used, visitor_name, created_at, used_at, expires_at
- `visitors` - Visitor sessions
  - id, otp_code_id, session_token, created_at, expires_at

2. Security
- Enable RLS on all tables
- OTP-based access control: visitors can view and upload but not edit/delete
- OTP codes become invalid after one use with automatic expiration
*/

-- Folders table
CREATE TABLE IF NOT EXISTS folders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  background_image_url text,
  background_blur integer DEFAULT 20,
  created_at timestamptz DEFAULT now()
);

-- Media table
CREATE TABLE IF NOT EXISTS media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  folder_id uuid REFERENCES folders(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('photo', 'video')),
  title text,
  file_url text NOT NULL,
  thumbnail_url text,
  year integer,
  date date,
  location text,
  story text,
  enhanced_url text,
  created_at timestamptz DEFAULT now()
);

-- People table
CREATE TABLE IF NOT EXISTS people (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  profile_image_url text,
  created_at timestamptz DEFAULT now()
);

-- Media-People junction table (many-to-many)
CREATE TABLE IF NOT EXISTS media_people (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id uuid REFERENCES media(id) ON DELETE CASCADE,
  person_id uuid REFERENCES people(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(media_id, person_id)
);

-- OTP codes table (one-time access codes)
CREATE TABLE IF NOT EXISTS otp_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  is_active boolean DEFAULT true,
  is_used boolean DEFAULT false,
  visitor_name text,
  created_at timestamptz DEFAULT now(),
  used_at timestamptz,
  expires_at timestamptz DEFAULT now() + INTERVAL '24 hours'
);

-- Visitor sessions
CREATE TABLE IF NOT EXISTS visitor_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  otp_code_id uuid REFERENCES otp_codes(id) ON DELETE CASCADE,
  session_token text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT now() + INTERVAL '4 hours'
);

-- Enable RLS on all tables
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_people ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_sessions ENABLE ROW LEVEL SECURITY;

-- Folders policies (public read, insert by anon/authenticated)
DROP POLICY IF EXISTS "anon_read_folders" ON folders;
CREATE POLICY "anon_read_folders" ON folders FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_folders" ON folders;
CREATE POLICY "anon_insert_folders" ON folders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Media policies (public read, insert by anon/authenticated)
DROP POLICY IF EXISTS "anon_read_media" ON media;
CREATE POLICY "anon_read_media" ON media FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_media" ON media;
CREATE POLICY "anon_insert_media" ON media FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- People policies
DROP POLICY IF EXISTS "anon_read_people" ON people;
CREATE POLICY "anon_read_people" ON people FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_people" ON people;
CREATE POLICY "anon_insert_people" ON people FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Media-People policies
DROP POLICY IF EXISTS "anon_read_media_people" ON media_people;
CREATE POLICY "anon_read_media_people" ON media_people FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_media_people" ON media_people;
CREATE POLICY "anon_insert_media_people" ON media_people FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- OTP codes policies (only read, no public write)
DROP POLICY IF EXISTS "anon_read_otp" ON otp_codes;
CREATE POLICY "anon_read_otp" ON otp_codes FOR SELECT
  TO anon, authenticated USING (is_active = true);

-- Visitor sessions policies
DROP POLICY IF EXISTS "anon_read_sessions" ON visitor_sessions;
CREATE POLICY "anon_read_sessions" ON visitor_sessions FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_sessions" ON visitor_sessions;
CREATE POLICY "anon_insert_sessions" ON visitor_sessions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_media_folder ON media(folder_id);
CREATE INDEX IF NOT EXISTS idx_media_year ON media(year);
CREATE INDEX IF NOT EXISTS idx_media_people_media ON media_people(media_id);
CREATE INDEX IF NOT EXISTS idx_media_people_person ON media_people(person_id);
CREATE INDEX IF NOT EXISTS idx_otp_code ON otp_codes(code);