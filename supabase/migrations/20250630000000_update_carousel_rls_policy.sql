-- Drop the existing RLS policy that only allows authenticated users to select
DROP POLICY IF EXISTS "Authenticated users can select shot_carousel_uploads" ON shot_carousel_uploads;

-- Create a new RLS policy that allows both authenticated and anonymous users to select
CREATE POLICY "Anyone can select shot_carousel_uploads"
ON shot_carousel_uploads
FOR SELECT
TO authenticated, anon
USING (true);