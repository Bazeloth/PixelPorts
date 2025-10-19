'use server';

import { redirect } from 'next/navigation';
import { createSupabaseClient } from '@/lib/supabase/server';
import { logger } from '@/lib/utils/console';
import { revalidatePath } from 'next/cache';

export async function signOutAction() {
    const supabase = await createSupabaseClient();
    try {
        await supabase.auth.signOut();
    } catch (e: any) {
        logger.Error('Could not sign out', e);
        // best-effort: ignore errors
    }

    revalidatePath('/', 'layout');

    // After signing out, redirect to the homepage.
    redirect('/');
}
