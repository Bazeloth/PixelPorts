-- Add last_step field to shots table to remember the step where the user left off
-- This field will be used to restore the step when reopening a draft

-- Add the last_step integer field with default value of 0 (first step)
ALTER TABLE "public"."shots" ADD COLUMN "last_step" integer NOT NULL DEFAULT 0;

-- Add a comment to explain the purpose of this field
COMMENT ON COLUMN "public"."shots"."last_step" IS 'Stores the last step the user was on when saving a draft';