DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'image_format') THEN
    CREATE TYPE image_format AS ENUM ('jpeg','png','webp','gif','avif','tiff','bmp','svg','ico');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS shot_media_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- ownership and grouping
  user_id uuid NOT NULL,
  shot_id uuid NOT NULL REFERENCES shots(id) ON DELETE CASCADE,
  block_id uuid NOT NULL REFERENCES shot_blocks(id) ON DELETE CASCADE,
  position int NOT NULL DEFAULT 0,

  -- canonical file info
  hash text NOT NULL,
  object_key text NOT NULL,
  original_width int NOT NULL,
  original_height int NOT NULL,
  original_size_bytes bigint NOT NULL,
  original_format image_format NOT NULL,
  original_ext text NOT NULL,
  original_mime text NOT NULL,

  -- derived
  aspect_ratio numeric(10,4) GENERATED ALWAYS AS (
    CASE WHEN original_height > 0 THEN round(original_width::numeric / original_height::numeric, 4) ELSE NULL END
  ) STORED,
  is_portrait boolean GENERATED ALWAYS AS (original_height > original_width) STORED,

  created_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT shot_media_sources_hash_unique_per_shot UNIQUE (shot_id, hash)
);

CREATE INDEX IF NOT EXISTS idx_shot_media_sources_user  ON shot_media_sources(user_id);
CREATE INDEX IF NOT EXISTS idx_shot_media_sources_shot  ON shot_media_sources(shot_id);
CREATE INDEX IF NOT EXISTS idx_shot_media_sources_block ON shot_media_sources(block_id);
CREATE INDEX IF NOT EXISTS idx_shot_media_sources_created ON shot_media_sources(created_at);

ALTER TABLE shot_media_sources ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='shot_media_sources' AND policyname='owner-select'
  ) THEN
    CREATE POLICY "owner-select" ON shot_media_sources
      FOR SELECT TO authenticated USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='shot_media_sources' AND policyname='owner-insert'
  ) THEN
    CREATE POLICY "owner-insert" ON shot_media_sources
      FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='shot_media_sources' AND policyname='owner-delete'
  ) THEN
    CREATE POLICY "owner-delete" ON shot_media_sources
      FOR DELETE TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;