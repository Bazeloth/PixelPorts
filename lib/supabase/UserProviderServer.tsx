import { ReactNode } from 'react';
import { createSupabaseClient } from '@/lib/supabase/server';
import { UserProvider, User } from '@/lib/supabase/UserContext';

export default async function UserProviderServer({ children }: { children: ReactNode }) {
    const supabase = await createSupabaseClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return <UserProvider value={null}>{children}</UserProvider>;
    }

    const { data } = await supabase
        .from('userprofiles')
        .select('name, avatar_file_ext')
        .eq('id', user.id)
        .maybeSingle();

    const value: User = {
        id: user.id,
        email: user.email!,
        details: data
            ? {
                  name: data.name ?? '',
                  avatar_file_ext: data.avatar_file_ext ?? 'png',
              }
            : null,
    };

    return <UserProvider value={value}>{children}</UserProvider>;
}
