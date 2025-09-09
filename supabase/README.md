# Supabase Local Development

This directory contains configuration files and scripts for Supabase local development.

## Directory Structure

- `migrations/`: SQL migration files that define the database schema
- `seed.sql`: Sample data for local development
- `config.toml`: Supabase configuration file
- `functions/`: Edge functions (if any)

## Local Development Setup

### Starting Supabase Locally

```bash
supabase start
```

This command starts a local Supabase instance with PostgreSQL, PostgREST, GoTrue (auth), Storage, and other Supabase services.

### Setting Up the Local Development Environment

To completely set up your local development environment:

```bash
supabase db reset
```

This command:

1. Resets the local database
2. Applies all migrations in the `migrations/` directory
3. Runs the `seed.sql` file to populate the database with sample data and set up storage buckets and policies

The `seed.sql` file is structured in two parts:

- **PART 1: STORAGE SETUP** - Creates storage buckets and sets up RLS policies
- **PART 2: SAMPLE DATA** - Populates the database with sample data

### Accessing Local Supabase

- **Supabase Studio**: http://localhost:54323
    - Login with email: `supabase@example.com`
    - Password: `password`

- **Database**:
    - Host: `localhost`
    - Port: `54322`
    - User: `postgres`
    - Password: `postgres`
    - Database: `postgres`

## Sample Data

The `seed.sql` file includes:

- Admin user with email `admin@example.com`
- Regular user with email `user@example.com`

You can sign in to the application using these credentials (no password required in local development).

## Storage Buckets

The application uses two storage buckets:

1. `avatars`: For user profile pictures
    - Publicly accessible (anyone can view avatars)
    - Only authenticated users can upload/update/delete their own avatars

2. `shots`: For shot images
    - Only authenticated users can view shots
    - Only authenticated users can upload/update/delete their own shots

The storage setup is now integrated into the `seed.sql` file, which automatically creates these buckets and sets up the appropriate RLS policies when you run `supabase db reset`.

### Storage Policies

The storage policies enforce the following rules:

#### Avatars Bucket

- **Read**: Public access (anyone can view avatars)
- **Create**: Authenticated users can upload to their own user folder
- **Update/Delete**: Users can only update/delete their own avatars

#### Shots Bucket

- **Read**: Only authenticated users can view shots
- **Create**: Authenticated users can upload to their own user folder
- **Update/Delete**: Users can only update/delete their own shots

These policies ensure that users can only manage their own content while allowing appropriate access to others.

## Generating TypeScript Types

After making changes to the database schema, you can generate updated TypeScript types using the Supabase CLI:

```bash
supabase gen types typescript --linked > src/lib/database.types.ts
```

This will update the `src/lib/database.types.ts` file with the latest database schema.
