import 'server-only';

import { createSupabaseClient } from '@/lib/supabase/server';
import { formatJoinRelative, pickGradientFromId } from '@/lib/utils/date';
import { initialsFromName } from '@/lib/utils/username';
import type { RecentlyJoinedUser } from '@/app/types';

/**
 * Loads the most recently joined users and maps them to UIUser.
 * Server-only. Shared by both the Server Component and the API route to avoid duplication.
 */
export async function loadRecentlyJoined(limit = 6): Promise<RecentlyJoinedUser[]> {
    const supabase = await createSupabaseClient();

    // Current user (if any)
    const { data: auth } = await supabase.auth.getUser();
    const me = auth?.user?.id ?? null;

    // Fetch recently joined profiles
    const { data, error } = await supabase
        .from('userprofiles')
        .select('id, name, username, created_at')
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        throw new Error(error.message || 'Failed to load recently joined');
    }

    // If authenticated, get the set of users I already follow
    const followedIds = new Set<string>();
    if (me) {
        try {
            const { data: f } = await supabase
                .from('follows')
                .select('following_id')
                .eq('follower_id', me);
            f?.forEach((row: { following_id: string }) => followedIds.add(row.following_id));
        } catch {
            // Best-effort: if this fails due to RLS or other reasons, we just omit isFollowing
        }
    }

    type Row = {
        id: string;
        name: string | null;
        username: string | null;
        created_at: string;
    };

    return (data ?? []).map((p: Row) => ({
        id: p.id,
        name: p.name ?? 'Unknown',
        username: p.username ?? 'unknown',
        joinedLabel: formatJoinRelative(p.created_at),
        initials: initialsFromName(p.name ?? p.username ?? ''),
        gradient: pickGradientFromId(p.id),
        isFollowing: me ? followedIds.has(p.id) : false,
    }));
}
