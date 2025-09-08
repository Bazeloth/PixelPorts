-- Migration to remove the avatar_url column from userprofiles table
-- This field is no longer needed as we generate avatar URLs dynamically

ALTER TABLE "public"."userprofiles" DROP COLUMN "avatar_url";