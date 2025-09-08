-- Migration: 20250607000000_fix_covers_rls_policies.sql

-- Drop the conflicting INSERT policy for the 'covers' bucket
DROP POLICY IF EXISTS "Covers bucket insert access" ON "storage"."objects";

-- Drop the existing policies that expect a folder structure
DROP POLICY IF EXISTS "Users can upload their own covers" ON "storage"."objects";
DROP POLICY IF EXISTS "Users can delete their own covers" ON "storage"."objects";
DROP POLICY IF EXISTS "Users can update their own covers" ON "storage"."objects";

-- Create new policies that use the LIKE operator instead of split_part
-- Policy for uploading cover photos
CREATE POLICY "Users can upload their own covers" ON "storage"."objects"
FOR INSERT TO "authenticated"
WITH CHECK (
    ("bucket_id" = 'covers'::"text") AND
    ("auth"."uid"() IS NOT NULL) AND
    ("name" LIKE (("auth"."uid"())::text || '.%'))
);

-- Policy for deleting cover photos
CREATE POLICY "Users can delete their own covers" ON "storage"."objects"
FOR DELETE USING (
    ("bucket_id" = 'covers'::"text") AND
    ("auth"."uid"() IS NOT NULL) AND
    ("name" LIKE (("auth"."uid"())::text || '.%'))
);

-- Policy for updating cover photos
CREATE POLICY "Users can update their own covers" ON "storage"."objects"
FOR UPDATE USING (
    ("bucket_id" = 'covers'::"text") AND
    ("auth"."uid"() IS NOT NULL) AND
    ("name" LIKE (("auth"."uid"())::text || '.%'))
);

-- Comments explaining the changes
COMMENT ON POLICY "Users can upload their own covers" ON "storage"."objects"
IS 'Allows users to upload cover photos with their user ID as the filename';

COMMENT ON POLICY "Users can delete their own covers" ON "storage"."objects"
IS 'Allows users to delete their own cover photos';

COMMENT ON POLICY "Users can update their own covers" ON "storage"."objects"
IS 'Allows users to update their own cover photos';