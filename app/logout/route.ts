'use server';

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClientForRoute } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { logger } from '@/lib/utils/console';

export async function GET(request: NextRequest) {
    // Redirect to home (or wherever) after sign-out
    let response = NextResponse.redirect(new URL('/', request.url));

    try {
        logger.Info('Signing out via GET /logout');
        const supabase = await createSupabaseClientForRoute(request, response);
        await supabase.auth.signOut();
    } catch (e: any) {
        logger.Error('Could not sign out via GET /logout', e);
    }

    // Revalidate the root layout so header reflects auth change
    revalidatePath('/', 'layout');

    // Return the same response we mutated so Set-Cookie headers are applied
    return response;
}
