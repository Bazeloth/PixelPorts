-- Remove the auth hook that creates a userprofile when a new user is created
-- We'll handle this in the application code instead

-- Drop the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the function
DROP FUNCTION IF EXISTS auth.on_auth_user_created();

-- Refresh the PostgREST schema cache to ensure the changes are recognized
NOTIFY pgrst, 'reload schema';