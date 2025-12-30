import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/utils/console';
import { createSupabaseClientForRoute } from '@/lib/supabase/server';
import { clientEnv } from '@/env/client';

export async function GET(request: NextRequest) {
    if (!clientEnv.NEXT_PUBLIC_ENABLE_FULL_SITE) {
        return new NextResponse('Not Found', { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') || '/';

    logger.Info('auth code', searchParams.get('code'));
    logger.Info('auth next', searchParams.get('next'));

    let response = NextResponse.redirect(new URL(next, request.url));

    // Build a server client wired to mutate response cookies via shared helper
    const supabase = await createSupabaseClientForRoute(request, response);

    // If there is a code param, exchange it for a session and set auth cookies.
    if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
            logger.Error('Error exchanging code for session', error);
        }
    }

    return response;
}
