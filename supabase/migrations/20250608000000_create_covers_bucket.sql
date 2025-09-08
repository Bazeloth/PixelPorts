-- Migration: 20250608000000_create_covers_bucket.sql

-- Create the covers bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('covers', 'covers', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Comment on the bucket
COMMENT ON TABLE storage.buckets IS 'Storage buckets for user avatars, shots, and cover photos';

-- Create RLS policies for the covers bucket if they don't exist

-- Policy: Covers are publicly accessible
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Covers are publicly accessible'
  ) THEN
    CREATE POLICY "Covers are publicly accessible" ON "storage"."objects" 
    FOR SELECT USING (("bucket_id" = 'covers'::"text"));
    
    COMMENT ON POLICY "Covers are publicly accessible" ON "storage"."objects" 
    IS 'Allow public access to cover photos';
  END IF;
END $$;

-- Policy: Users can upload their own cover photos
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can upload their own covers'
  ) THEN
    CREATE POLICY "Users can upload their own covers" ON "storage"."objects"
    FOR INSERT TO "authenticated"
    WITH CHECK (
      ("bucket_id" = 'covers'::"text") AND
      ("auth"."uid"() IS NOT NULL) AND
      ("name" LIKE (("auth"."uid"())::text || '.%'))
    );
    
    COMMENT ON POLICY "Users can upload their own covers" ON "storage"."objects"
    IS 'Allows users to upload cover photos with their user ID as the filename';
  END IF;
END $$;

-- Policy: Users can delete their own cover photos
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can delete their own covers'
  ) THEN
    CREATE POLICY "Users can delete their own covers" ON "storage"."objects"
    FOR DELETE USING (
      ("bucket_id" = 'covers'::"text") AND
      ("auth"."uid"() IS NOT NULL) AND
      ("name" LIKE (("auth"."uid"())::text || '.%'))
    );
    
    COMMENT ON POLICY "Users can delete their own covers" ON "storage"."objects"
    IS 'Allows users to delete their own cover photos';
  END IF;
END $$;

-- Policy: Users can update their own cover photos
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can update their own covers'
  ) THEN
    CREATE POLICY "Users can update their own covers" ON "storage"."objects"
    FOR UPDATE USING (
      ("bucket_id" = 'covers'::"text") AND
      ("auth"."uid"() IS NOT NULL) AND
      ("name" LIKE (("auth"."uid"())::text || '.%'))
    );
    
    COMMENT ON POLICY "Users can update their own covers" ON "storage"."objects"
    IS 'Allows users to update their own cover photos';
  END IF;
END $$;

-- Policy: Admins can delete any cover photo
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Admins can delete any cover photo'
  ) THEN
    CREATE POLICY "Admins can delete any cover photo" ON "storage"."objects" 
    FOR DELETE USING (
      ("bucket_id" = 'covers'::"text") AND 
      ("auth"."uid"() IS NOT NULL) AND 
      EXISTS (
        SELECT 1 FROM public.userprofiles 
        WHERE userprofiles.id = auth.uid() AND userprofiles.is_admin = true
      )
    );
    
    COMMENT ON POLICY "Admins can delete any cover photo" ON "storage"."objects" 
    IS 'Allows administrators to delete any cover photo regardless of ownership';
  END IF;
END $$;