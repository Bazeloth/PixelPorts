-- Add universal metadata fields to shots table
-- These fields are designed to work across different creative disciplines

-- Project Details
ALTER TABLE "public"."shots" ADD COLUMN "project_type" text; -- Personal, Client work, Concept, Study, etc.
ALTER TABLE "public"."shots" ADD COLUMN "industry" text; -- Tech, Fashion, Architecture, Editorial, etc.
ALTER TABLE "public"."shots" ADD COLUMN "project_duration" text; -- "2 weeks", "3 months", "1 day"
ALTER TABLE "public"."shots" ADD COLUMN "team_size" text; -- Solo, 2-person team, Large team
ALTER TABLE "public"."shots" ADD COLUMN "creator_role" text; -- Art Director, Lead Designer, Contributor, etc.

-- Technical Specs
ALTER TABLE "public"."shots" ADD COLUMN "software_used" text[]; -- Figma, Photoshop, Blender, Procreate, etc.
ALTER TABLE "public"."shots" ADD COLUMN "dimensions" text; -- 1920×1080, A4 Print, Mobile App, etc.
ALTER TABLE "public"."shots" ADD COLUMN "file_format" text; -- Vector, Raster, 3D Model, Prototype, etc.
ALTER TABLE "public"."shots" ADD COLUMN "color_space" text; -- RGB, CMYK, sRGB (for print vs digital)

-- Context & Process
ALTER TABLE "public"."shots" ADD COLUMN "brief" text; -- What problem were you solving?
ALTER TABLE "public"."shots" ADD COLUMN "target_audience" text; -- B2B, Gen Z, Enterprise, etc.
ALTER TABLE "public"."shots" ADD COLUMN "inspiration" text[]; -- Brutalism, Swiss Design, Nature, etc.
ALTER TABLE "public"."shots" ADD COLUMN "iterations" integer; -- How many versions/rounds of feedback

-- Rights & Usage
ALTER TABLE "public"."shots" ADD COLUMN "license_type" text; -- Personal use, Commercial, Creative Commons
ALTER TABLE "public"."shots" ADD COLUMN "client" text; -- Client/Company (if applicable and allowed to share)
ALTER TABLE "public"."shots" ADD COLUMN "status" text; -- Published, Concept, In Progress, Case Study

-- Engagement Metrics
ALTER TABLE "public"."shots" ADD COLUMN "tools_used" text[]; -- Design Systems, Custom illustrations, Stock photos
ALTER TABLE "public"."shots" ADD COLUMN "complexity" text; -- Beginner, Intermediate, Advanced
ALTER TABLE "public"."shots" ADD COLUMN "time_invested" text; -- 4 hours, 2 days, 1 month

-- Add alt text field for accessibility
ALTER TABLE "public"."shots" ADD COLUMN "alt" text;

-- Add description field for SEO
COMMENT ON TABLE "public"."shots" IS 'Creative work showcases with universal metadata fields';