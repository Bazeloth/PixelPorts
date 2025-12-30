import { z } from 'zod';

// Server-only environment variables (never exposed to the browser)
export const ServerEnvSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

    // Supabase service role (secret)
    NEXT_SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'Required: NEXT_SUPABASE_SERVICE_ROLE_KEY'),

    // Google OAuth (secrets)
    SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID: z
        .string()
        .min(1, 'Required: SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID'),
    SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET: z
        .string()
        .min(1, 'Required: SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET'),
});

// Client-safe variables (must start with NEXT_PUBLIC_)
export const ClientEnvSchema = z.object({
    NEXT_PUBLIC_SITE_URL: z.string().url('NEXT_PUBLIC_SITE_URL must be a valid URL'),
    NEXT_PUBLIC_SUPABASE_URL: z.string().url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL'),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Required: NEXT_PUBLIC_SUPABASE_ANON_KEY'),

    // Analytics
    NEXT_PUBLIC_MIXPANEL_TOKEN: z.string().min(1, 'Required: NEXT_PUBLIC_MIXPANEL_TOKEN'),
    NEXT_PUBLIC_MIXPANEL_API_HOST: z
        .string()
        .url('NEXT_PUBLIC_MIXPANEL_API_HOST must be a valid URL'),

    // Observability
    NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),

    // Feature Flags
    NEXT_PUBLIC_ENABLE_FULL_SITE: z
        .boolean()
        .transform((val) => val === true)
        .default(false),
});

export type ServerEnv = z.infer<typeof ServerEnvSchema>;
export type ClientEnv = z.infer<typeof ClientEnvSchema>;
