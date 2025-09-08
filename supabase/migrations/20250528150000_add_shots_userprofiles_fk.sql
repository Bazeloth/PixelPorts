-- Add foreign key relationship between shots.user_id and userprofiles.id
-- This will make the database schema cleaner and allow for more efficient queries

-- First, check if the constraint already exists and drop it if it does
ALTER TABLE "public"."shots" DROP CONSTRAINT IF EXISTS "shots_userprofiles_fkey";

-- Add the new foreign key constraint
ALTER TABLE "public"."shots" ADD CONSTRAINT "shots_userprofiles_fkey" 
FOREIGN KEY ("user_id") REFERENCES "public"."userprofiles"("id") 
ON DELETE CASCADE 
NOT VALID;

-- Validate the constraint
ALTER TABLE "public"."shots" VALIDATE CONSTRAINT "shots_userprofiles_fkey";

-- Note: We're keeping the existing shots_user_id_fkey constraint as well
-- This ensures data integrity with both auth.users and userprofiles tables