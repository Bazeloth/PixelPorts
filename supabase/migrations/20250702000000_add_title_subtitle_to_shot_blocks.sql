-- Add title and subtitle columns to shot_blocks table
ALTER TABLE "public"."shot_blocks" ADD COLUMN "title" text;
ALTER TABLE "public"."shot_blocks" ADD COLUMN "subtitle" text;