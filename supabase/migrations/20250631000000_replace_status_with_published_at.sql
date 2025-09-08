-- Migration to replace status with published_at
-- Remove the status column from the shots table
ALTER TABLE "public"."shots" DROP COLUMN "status";

-- Add a published_at timestamp column to the shots table
ALTER TABLE "public"."shots" ADD COLUMN "published_at" timestamp with time zone;

-- Add comment to explain the change
COMMENT ON COLUMN "public"."shots"."published_at" IS 'When the shot was published. NULL means it is a draft.';