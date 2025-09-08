-- Migration to update RLS policies for avatars to use simplified path format
-- This allows avatars to be stored as {userId}.{extension} without a folder structure

-- Drop existing policies for avatars
DROP POLICY IF EXISTS "Users can upload their own avatars" ON "storage"."objects";
DROP POLICY IF EXISTS "Users can update their own avatars" ON "storage"."objects";
DROP POLICY IF EXISTS "Users can delete their own avatars" ON "storage"."objects";

-- Create new policies for avatars with simplified path format
CREATE POLICY "Users can upload their own avatars" ON "storage"."objects" 
FOR INSERT WITH CHECK (
    "bucket_id" = 'avatars'::"text" 
    AND "auth"."uid"() IS NOT NULL 
    AND "name" = ("auth"."uid"() || '.' || "storage"."extension"("name"))
);

CREATE POLICY "Users can update their own avatars" ON "storage"."objects" 
FOR UPDATE USING (
     "bucket_id" = 'avatars'::"text"
     AND "auth"."uid"() IS NOT NULL
     AND "name" = ("auth"."uid"() || '.' || "storage"."extension"("name"))
 ) WITH CHECK (
     "bucket_id" = 'avatars'::"text"
     AND "auth"."uid"() IS NOT NULL
     AND "name" = ("auth"."uid"() || '.' || "storage"."extension"("name"))
 );

CREATE POLICY "Users can delete their own avatars" ON "storage"."objects" 
FOR DELETE USING (
    "bucket_id" = 'avatars'::"text" 
    AND "auth"."uid"() IS NOT NULL 
    AND "name" = ("auth"."uid"() || '.' || "storage"."extension"("name"))
);