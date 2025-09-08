-- Migration to remove the github_url column from userprofiles table
-- This field is no longer needed

ALTER TABLE "public"."userprofiles" DROP COLUMN "github_url";
