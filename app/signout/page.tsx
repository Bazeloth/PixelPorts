import { createSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function SignOutPage() {
    const supabase = await createSupabaseClient();

    // Best-effort sign out. Even if it fails, redirect to home to avoid trapping the user.
    try {
        await supabase.auth.signOut();
    } catch {
        // ignore
    }

    redirect('/');
}
