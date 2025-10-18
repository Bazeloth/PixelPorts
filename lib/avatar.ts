import type { SupabaseClient } from '@supabase/supabase-js';

// Keep the type surface minimal: we only need storage.getPublicUrl
export type SupabaseClientWithStorage = Pick<SupabaseClient<any, any, any, any, any>, 'storage'>;

export const FALLBACK_AVATAR_URL =
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=60';

/**
 * Build a public avatar URL using the NEXT_PUBLIC_SUPABASE_URL env var.
 * This works in both RSC/Server and Client components as it does not require
 * a Supabase client instance.
 */
export function buildAvatarUrlFromEnv(userId: string, avatarFileExt: string): string | null {
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!base) return null;
    return `${base}/storage/v1/object/public/avatars/${userId}.${avatarFileExt}`;
}

/**
 * Resolve the avatar URL from a user profile shape.
 * Priority:
 * 1) If avatarFileExt exists and a Supabase client is provided, use storage.getPublicUrl
 * 2) Else, attempt to build the URL from env
 * 3) Fallback to a neutral Unsplash portrait
 */
export function getAvatarUrl(params: {
    supabase?: SupabaseClientWithStorage | null;
    userId: string;
    avatarFileExt?: string | null;
}): string {
    const { supabase, userId, avatarFileExt } = params;

    if (avatarFileExt) {
        try {
            if (supabase?.storage) {
                const { data } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(`${userId}.${avatarFileExt}`, {});
                if (data?.publicUrl) return data.publicUrl;
            }
        } catch {
            // Ignore and try env path below
        }

        const envUrl = buildAvatarUrlFromEnv(userId, avatarFileExt);
        if (envUrl) return envUrl;
    }

    return FALLBACK_AVATAR_URL;
}
