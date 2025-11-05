import { NextResponse } from 'next/server';
import { createSupabaseClient } from '@/lib/supabase/server';
import { logger } from '@/lib/utils/console';
import { revalidatePath } from 'next/cache';

export async function GET(request: Request) {
    const supabase = await createSupabaseClient();
    try {
        await supabase.auth.signOut();
    } catch (e: any) {
        logger.Error('Could not sign out', e);
        // best-effort: ignore errors
    }

    // Ensure the root layout/homepage reflect the new auth state after sign out
    revalidatePath('/', 'layout');

    const url = new URL('/', request.url);
    return NextResponse.redirect(url);
}

export const dynamic = 'force-dynamic';
