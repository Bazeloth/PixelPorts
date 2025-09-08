-- Update RLS policies for storage buckets to allow public access

-- 1. Update RLS policy for shots bucket to allow public access
-- Drop the existing policy that restricts access to authenticated users
DROP POLICY IF EXISTS "Only authenticated users can view shots" ON "storage"."objects";

-- Create a new policy that allows public access to shots
CREATE POLICY "Shots are publicly accessible" ON "storage"."objects" FOR SELECT USING (("bucket_id" = 'shots'::"text"));

-- Comment explaining the change
COMMENT ON POLICY "Shots are publicly accessible" ON "storage"."objects" IS 'Allow non-authenticated users to view shots for public profile access';

-- 2. RLS Policies for the 'covers' bucket
-- Policy: Covers are publicly accessible (similar to avatars)
CREATE POLICY "Covers are publicly accessible" ON "storage"."objects" FOR SELECT USING (("bucket_id" = 'covers'::"text"));

-- Policy: Covers bucket insert access for authenticated users
CREATE POLICY "Covers bucket insert access" ON "storage"."objects" FOR INSERT TO "authenticated" WITH CHECK ((("bucket_id" = 'covers'::"text") AND ("owner" = "auth"."uid"())));

-- Policy: Users can delete their own cover photos
CREATE POLICY "Users can delete their own covers" ON "storage"."objects" FOR DELETE USING ((("bucket_id" = 'covers'::"text") AND ("auth"."uid"() IS NOT NULL) AND (("storage"."foldername"("name"))[1] = ("auth"."uid"())::"text")));

-- Policy: Users can update their own cover photos
CREATE POLICY "Users can update their own covers" ON "storage"."objects" FOR UPDATE USING ((("bucket_id" = 'covers'::"text") AND ("auth"."uid"() IS NOT NULL) AND (("storage"."foldername"("name"))[1] = ("auth"."uid"())::"text")));

-- Policy: Users can upload their own cover photos
CREATE POLICY "Users can upload their own covers" ON "storage"."objects" FOR INSERT WITH CHECK ((("bucket_id" = 'covers'::"text") AND ("auth"."uid"() IS NOT NULL) AND (("storage"."foldername"("name"))[1] = ("auth"."uid"())::"text")));