'use server';

import { redirect } from 'next/navigation';
import { createSupabaseClient } from '@/lib/supabase/server';

export async function signOutAction() {
    const supabase = await createSupabaseClient();
    try {
        await supabase.auth.signOut();
    } catch {
        // best-effort: ignore errors
    }
    // After signing out, redirect to the homepage.
    redirect('/');
}
