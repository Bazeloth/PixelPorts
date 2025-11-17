import type { SupabaseClient } from '@supabase/supabase-js';

// Keep the type surface minimal: we only need storage.getPublicUrl
export type SupabaseClientWithStorage = Pick<SupabaseClient<any, any, any, any, any>, 'storage'>;

export function getAvatarUrl(params: {
    supabase: SupabaseClientWithStorage;
    userId: string;
    avatarFileExt: string;
}): string {
    const { supabase, userId, avatarFileExt } = params;

    const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(`${userId}.${avatarFileExt}`, {});
    return data.publicUrl;
}
