-- Migration to add cover_photo_updated_at column to userprofiles table
-- This field will be used for cache busting in cover photo URLs instead of the general updated_at field

ALTER TABLE "public"."userprofiles" ADD COLUMN "cover_photo_updated_at" timestamp with time zone;

-- Add a comment to explain the purpose of the field
COMMENT ON COLUMN "public"."userprofiles"."cover_photo_updated_at" IS 'Timestamp of when the cover photo was last updated, used for cache busting in cover photo URLs';