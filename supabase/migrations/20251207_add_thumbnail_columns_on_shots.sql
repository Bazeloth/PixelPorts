-- Minimal columns to persist thumbnail metadata; public URL is derived from path convention
ALTER TABLE public.shots
  ADD COLUMN IF NOT EXISTS thumbnail_hash text,
  ADD COLUMN IF NOT EXISTS thumbnail_ext text,
  ADD COLUMN IF NOT EXISTS thumbnail_width int,
  ADD COLUMN IF NOT EXISTS thumbnail_height int,
  ADD COLUMN IF NOT EXISTS thumbnail_format text,
  ADD COLUMN IF NOT EXISTS thumbnail_mime text,
  ADD COLUMN IF NOT EXISTS thumbnail_updated_at timestamptz;
