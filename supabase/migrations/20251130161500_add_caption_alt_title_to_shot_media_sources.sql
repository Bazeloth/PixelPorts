-- Add per-image caption/alt/title to shot_media_sources
ALTER TABLE public.shot_media_sources
  ADD COLUMN IF NOT EXISTS caption text,
  ADD COLUMN IF NOT EXISTS alt text,
  ADD COLUMN IF NOT EXISTS title text;
