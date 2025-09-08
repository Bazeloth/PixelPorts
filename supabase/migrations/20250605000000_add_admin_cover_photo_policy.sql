-- Migration: 20250605000000_add_admin_cover_photo_policy.sql

-- Add policy for admins to delete any cover photo
CREATE POLICY "Admins can delete any cover photo" ON "storage"."objects" 
FOR DELETE USING (
  ("bucket_id" = 'covers'::"text") AND 
  ("auth"."uid"() IS NOT NULL) AND 
  EXISTS (
    SELECT 1 FROM public.userprofiles 
    WHERE userprofiles.id = auth.uid() AND userprofiles.is_admin = true
  )
);

-- Add comment explaining the policy
COMMENT ON POLICY "Admins can delete any cover photo" ON "storage"."objects" 
IS 'Allows administrators to delete any cover photo regardless of ownership';