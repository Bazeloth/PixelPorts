-- Seed file for Savannah project

-- PART 1: STORAGE SETUP
-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp']),
  ('shots', 'shots', true, 52428800, ARRAY['image/png', 'image/jpeg', 'image/webp']),
  ('covers', 'covers', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- PART 2: SAMPLE DATA
-- Add sample data here if needed