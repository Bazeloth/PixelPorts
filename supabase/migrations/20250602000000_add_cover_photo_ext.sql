-- Add cover_photo_ext column to userprofiles table
ALTER TABLE public.userprofiles ADD COLUMN IF NOT EXISTS cover_photo_ext TEXT;

-- Comment on the column
COMMENT ON COLUMN public.userprofiles.cover_photo_ext IS 'File extension of the user''s cover photo';