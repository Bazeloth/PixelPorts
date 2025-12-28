export type EnvVar = {
    name: string;
    public?: boolean;
    requiredIn: Array<'development' | 'preview' | 'production'>;
};

// Single source of truth for runtime environment variables that should exist in Vercel
// and be validated in local/CI environments. CI-only credentials (like VERCEL_TOKEN)
// are intentionally not listed here.
export const RUNTIME_ENV_VARS: EnvVar[] = [
    // Public client-side vars
    {
        name: 'NEXT_PUBLIC_SITE_URL',
        public: true,
        requiredIn: ['development', 'preview', 'production'],
    },
    {
        name: 'NEXT_PUBLIC_SUPABASE_URL',
        public: true,
        requiredIn: ['development', 'preview', 'production'],
    },
    {
        name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        public: true,
        requiredIn: ['development', 'preview', 'production'],
    },
    {
        name: 'NEXT_PUBLIC_MIXPANEL_TOKEN',
        public: true,
        requiredIn: ['development', 'preview', 'production'],
    },
    {
        name: 'NEXT_PUBLIC_MIXPANEL_API_HOST',
        public: true,
        requiredIn: ['development', 'preview', 'production'],
    },
    // Optional public var
    {
        name: 'NEXT_PUBLIC_SENTRY_DSN',
        public: true,
        requiredIn: ['production', 'preview', 'development'],
    },

    // Server-only vars (never exposed to client)
    { name: 'NEXT_SUPABASE_SERVICE_ROLE_KEY', requiredIn: ['production'] },
    { name: 'SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID', requiredIn: ['production'] },
    { name: 'SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET', requiredIn: ['production'] },
];

// Variables used only by CI and NOT synced to Vercel
export const CI_ONLY_VARS: string[] = [
    'VERCEL_TOKEN',
    'VERCEL_PROJECT_ID',
    'VERCEL_ORG_ID',
    'SUPABASE_ACCESS_TOKEN',
];
