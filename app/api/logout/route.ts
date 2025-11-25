import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClientForRoute } from '@/lib/supabase/server';
import { logger } from '@/lib/utils/console';
import { revalidatePath } from 'next/cache';

export async function GET(request: NextRequest) {
    const url = new URL('/', request.url);
    const res = NextResponse.redirect(url);

    const supabase = await createSupabaseClientForRoute(request, res);
    try {
        await supabase.auth.signOut();
    } catch (e: any) {
        logger.Error('Could not sign out', e);
        // best-effort: ignore errors
    }

    // Ensure the root layout/homepage reflect the new auth state after sign out
    revalidatePath('/', 'layout');

    return res;
}

export const dynamic = 'force-dynamic';
