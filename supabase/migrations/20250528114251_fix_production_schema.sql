-- Enable RLS on shot_blocks (if it's disabled in production)
alter table "public"."shot_blocks" enable row level security;

-- Drop existing policies first (to avoid conflicts)
DROP POLICY IF EXISTS "Authenticated users can delete shot_blocks" ON "public"."shot_blocks";
DROP POLICY IF EXISTS "Authenticated users can insert shot_blocks" ON "public"."shot_blocks";
DROP POLICY IF EXISTS "Authenticated users can update shot_blocks" ON "public"."shot_blocks";
DROP POLICY IF EXISTS "Shot blocks are publicly viewable" ON "public"."shot_blocks";

-- Create the 4 policies
create policy "Authenticated users can delete shot_blocks"
on "public"."shot_blocks"
as permissive
for delete
to authenticated
using (true);

create policy "Authenticated users can insert shot_blocks"
on "public"."shot_blocks"
as permissive
for insert
to authenticated
with check (true);

create policy "Authenticated users can update shot_blocks"
on "public"."shot_blocks"
as permissive
for update
                      to authenticated
                      using (true);

create policy "Shot blocks are publicly viewable"
on "public"."shot_blocks"
as permissive
for select
               to authenticated, anon
               using (true);

-- Fix shot_uploads table
alter table "public"."shot_uploads" add column if not exists "file_ext" text;
alter table "public"."shot_uploads" alter column "file_size" set default 0;

-- Drop columns that shouldn't exist
alter table "public"."shot_uploads" drop column if exists "file_name";
alter table "public"."shot_uploads" drop column if exists "user_id";

-- Drop the constraint if it exists
alter table "public"."shot_uploads" drop constraint if exists "shot_uploads_user_id_fkey";