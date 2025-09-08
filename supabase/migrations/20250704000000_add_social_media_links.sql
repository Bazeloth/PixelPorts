-- Add social media links fields to userprofiles table for Phase 2 implementation
-- This will enhance the basic user profiles with social media integration

-- Add social media links fields
ALTER TABLE "public"."userprofiles" ADD COLUMN "twitter_url" text;
ALTER TABLE "public"."userprofiles" ADD COLUMN "instagram_url" text;
ALTER TABLE "public"."userprofiles" ADD COLUMN "linkedin_url" text;
ALTER TABLE "public"."userprofiles" ADD COLUMN "dribbble_url" text;
ALTER TABLE "public"."userprofiles" ADD COLUMN "github_url" text;

-- Add a comment to explain the purpose of these fields
COMMENT ON COLUMN "public"."userprofiles"."twitter_url" IS 'Twitter/X profile URL';
COMMENT ON COLUMN "public"."userprofiles"."instagram_url" IS 'Instagram profile URL';
COMMENT ON COLUMN "public"."userprofiles"."linkedin_url" IS 'LinkedIn profile URL';
COMMENT ON COLUMN "public"."userprofiles"."dribbble_url" IS 'Dribbble profile URL';
COMMENT ON COLUMN "public"."userprofiles"."github_url" IS 'GitHub profile URL';