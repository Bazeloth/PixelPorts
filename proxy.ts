import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { clientEnv } from '@/env/client';

export default async function proxy(req: NextRequest) {
    const res = NextResponse.next();

    const supabase = createServerClient(
        clientEnv.NEXT_PUBLIC_SUPABASE_URL,
        clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll: () => req.cookies.getAll(),
                setAll: (cookies) => {
                    cookies.forEach(({ name, value, options }) => {
                        res.cookies.set(name, value, options);
                    });
                },
            },
        }
    );

    try {
        await supabase.auth.getUser();
    } catch {}

    return res;
}

export const config = {
    matcher: [
        '/((?!_next|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)).*)',
    ],
};
