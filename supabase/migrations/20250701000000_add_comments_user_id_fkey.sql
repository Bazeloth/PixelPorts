-- Migration to add foreign key constraint between comments.user_id and userprofiles.id

-- Check if the constraint already exists before adding it
DO $$
BEGIN
    -- Check if the constraint already exists
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'comments_user_id_fkey'
        AND table_name = 'comments'
        AND table_schema = 'public'
    ) THEN
        -- Add foreign key constraint if it doesn't exist
        ALTER TABLE "public"."comments"
        ADD CONSTRAINT "comments_user_id_fkey"
        FOREIGN KEY ("user_id")
        REFERENCES "public"."userprofiles" ("id")
        ON DELETE CASCADE;

        RAISE NOTICE 'Foreign key constraint comments_user_id_fkey added.';
    ELSE
        RAISE NOTICE 'Foreign key constraint comments_user_id_fkey already exists. Skipping.';
    END IF;
END
$$;
