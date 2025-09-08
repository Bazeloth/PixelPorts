-- 1. Modify the type check constraint to allow 'carousel' type
ALTER TABLE shot_blocks DROP CONSTRAINT shot_blocks_type_check;
ALTER TABLE shot_blocks ADD CONSTRAINT shot_blocks_type_check 
CHECK (type = ANY (ARRAY['image'::text, 'text'::text, 'carousel'::text]));

-- 2. Modify the content/upload constraint to handle carousel blocks
ALTER TABLE shot_blocks DROP CONSTRAINT shot_blocks_content_or_upload_check;
ALTER TABLE shot_blocks ADD CONSTRAINT shot_blocks_content_or_upload_check
CHECK (
  ((type = 'text'::text) AND (content IS NOT NULL) AND (upload_id IS NULL)) OR
  ((type = 'image'::text) AND (upload_id IS NOT NULL) AND (content IS NULL)) OR
  ((type = 'carousel'::text) AND (content IS NULL) AND (upload_id IS NULL))
);

-- 3. Create a junction table for carousel images
CREATE TABLE shot_carousel_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shot_block_id UUID NOT NULL,
  upload_id UUID NOT NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  FOREIGN KEY (shot_block_id) REFERENCES shot_blocks(id) ON DELETE CASCADE,
  FOREIGN KEY (upload_id) REFERENCES shot_uploads(id) ON DELETE CASCADE,
  UNIQUE (shot_block_id, position)
);

-- 4. Add RLS policies for the new table
ALTER TABLE shot_carousel_uploads ENABLE ROW LEVEL SECURITY;

-- 5. Grant permissions to the new table
GRANT ALL ON TABLE shot_carousel_uploads TO authenticated;
GRANT ALL ON TABLE shot_carousel_uploads TO service_role;

-- 6. Create RLS policies for the new table
CREATE POLICY "Authenticated users can select shot_carousel_uploads"
ON shot_carousel_uploads
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert shot_carousel_uploads"
ON shot_carousel_uploads
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update shot_carousel_uploads"
ON shot_carousel_uploads
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete shot_carousel_uploads"
ON shot_carousel_uploads
FOR DELETE
TO authenticated
USING (true);