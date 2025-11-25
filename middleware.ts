import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { clientEnv } from '@/env/client';

export async function middleware(req: NextRequest) {
    // Prepare a response that Supabase can attach cookie mutations to
    const res = NextResponse.next();

    const supabaseUrl = clientEnv.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
            getAll() {
                return req.cookies.getAll();
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value, options }) => {
                    res.cookies.set(name, value, options);
                });
            },
        },
    });

    try {
        // Trigger a lightweight auth check which will refresh tokens if needed
        await supabase.auth.getUser();
    } catch {
        // Ignore transient errors; RSCs can still read existing cookies
    }

    return res;
}

// Run on all routes except Next.js internals and common static asset paths
export const config = {
    matcher: [
        '/((?!_next|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)).*)',
    ],
};
