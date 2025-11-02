'use server';

import { createSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { logger } from '@/lib/utils/console';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
    const supabase = await createSupabaseClient();
    try {
        logger.Info('Signing out via GET /logout');
        await supabase.auth.signOut();
    } catch (e: any) {
        logger.Error('Could not sign out via GET /logout', e);
    }

    // Revalidate the root layout so header reflects auth change
    revalidatePath('/', 'layout');

    // Build an absolute URL for redirect
    const origin = (() => {
        if (request.url) {
            return new URL(request.url).origin;
        }

        return process.env.NEXT_PUBLIC_SITE_URL!;
    })();

    return redirect(origin);
}
