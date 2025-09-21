import { redirect } from 'next/navigation';
import { createSupabaseClient } from '@/lib/supabase/server';

export default async function OAuthCallbackPage() {
    const supabase = await createSupabaseClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
        redirect('/');
    }

    const { data: profile } = await supabase
        .from('userprofiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

    if (!profile) {
        redirect('/auth/choose-username');
    }
    redirect('/');
}
