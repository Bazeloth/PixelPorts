-- Add is_curated field to shots table for Phase 2 implementation
-- This field will be used to distinguish between curated and non-curated content

-- Add the is_curated boolean field with default value of false
ALTER TABLE "public"."shots" ADD COLUMN "is_curated" boolean NOT NULL DEFAULT false;

-- Add an index to improve query performance when filtering by is_curated
CREATE INDEX idx_shots_is_curated ON public.shots USING btree (is_curated);

-- Add a comment to explain the purpose of this field
COMMENT ON COLUMN "public"."shots"."is_curated" IS 'Indicates whether the shot has been curated for featured display';