-- Add an auth hook to create a userprofile when a new user is created
-- This is a more reliable approach than trying to create a trigger on auth.users

-- Create a function in the auth schema that will be called by the trigger
CREATE OR REPLACE FUNCTION auth.on_auth_user_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Create a placeholder entry in userprofiles
    -- The actual profile data will be filled in by the application
    INSERT INTO public.userprofiles (id)
    VALUES (NEW.id)
    ON CONFLICT (id) DO NOTHING;

    RETURN NEW;
END;
$$;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION auth.on_auth_user_created();

-- Refresh the PostgREST schema cache to ensure the new trigger is recognized
NOTIFY pgrst, 'reload schema';
