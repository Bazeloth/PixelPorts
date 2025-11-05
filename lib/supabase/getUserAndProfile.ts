import { createSupabaseClient } from '@/lib/supabase/server';

export type User = {
    id: string;
    email: string;
    profile: {
        name: string | null;
        avatar_file_ext: string | null;
        username: string | null;
    } | null;
};

export const getUserAndProfile = async (): Promise<User | null> => {
    const supabase = await createSupabaseClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
        .from('userprofiles')
        .select('name, avatar_file_ext, username')
        .eq('id', user.id)
        .maybeSingle();

    return {
        id: user.id,
        email: user.email!,
        profile: data
            ? {
                  name: data.name ?? null,
                  avatar_file_ext: data.avatar_file_ext ?? null,
                  username: data.username ?? null,
              }
            : null,
    };
};
