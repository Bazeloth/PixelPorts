-- Update shot_blocks to align with current app model
-- 1) Drop legacy constraints and FK
ALTER TABLE public.shot_blocks DROP CONSTRAINT IF EXISTS shot_blocks_content_or_upload_check;
ALTER TABLE public.shot_blocks DROP CONSTRAINT IF EXISTS shot_blocks_type_check;
ALTER TABLE public.shot_blocks DROP CONSTRAINT IF EXISTS shot_blocks_upload_id_fkey;

-- 2) Drop obsolete column (media now lives in shot_media_sources)
ALTER TABLE public.shot_blocks DROP COLUMN IF EXISTS upload_id;

-- 3) Add align column for text-like blocks
ALTER TABLE public.shot_blocks ADD COLUMN IF NOT EXISTS align text;
ALTER TABLE public.shot_blocks
  ADD CONSTRAINT shot_blocks_align_check
  CHECK (align IS NULL OR align = ANY (ARRAY['left','center','right']::text[]));

-- 4) Add an updated type check that matches UI-supported types
ALTER TABLE public.shot_blocks
  ADD CONSTRAINT shot_blocks_type_check
  CHECK (type = ANY (ARRAY[
    'heading','paragraph','caption','quote',
    'image','carousel','grid','before-after'
  ]::text[]));

-- 5) Keep a soft invariant: ensure (shot_id, position) remains unique
-- Already present as unique constraint in earlier migrations; keep as-is.
