'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

export enum StorageBucket {
    Shots = 'shots',
    Avatars = 'avatars',
}

export async function createSupabaseClient() {
    const cookieStore = await cookies();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase environment variables');
    }

    return getSupabaseClient({ url: supabaseUrl, key: supabaseKey, cookieStore });
}

export async function createSupabaseAdminClient() {
    const cookieStore = await cookies();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
        throw new Error('Missing Supabase admin environment variables');
    }

    return getSupabaseClient({ url: supabaseUrl, key: serviceKey, cookieStore });
}

// For Next.js route handlers where you already have a NextRequest and NextResponse
// and need Supabase to mutate the response cookies (e.g., OAuth callback redirects)
export async function createSupabaseClientForRoute(request: NextRequest, response: NextResponse) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase environment variables');
    }

    return createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value, options }) => {
                    response.cookies.set(name, value, options);
                });
            },
        },
    });
}

function getSupabaseClient({
    url,
    key,
    cookieStore,
}: {
    url: string;
    key: string;
    cookieStore: ReadonlyRequestCookies;
}) {
    // In Server Components, cookies() is read-only and cannot be mutated.
    // In Server Actions, cookies() is mutable. Detect capability at runtime and no-op otherwise.
    const canMutateCookies = (cookieStore as any) && typeof (cookieStore as any).set === 'function';

    return createServerClient(url, key, {
        cookies: {
            getAll() {
                return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
                if (!canMutateCookies) return; // Avoid Next.js "Cookies can only be modified..." error in RSC
                cookiesToSet.forEach(({ name, value, options }) => {
                    (cookieStore as any).set(name, value, options as any);
                });
            },
        },
    });
}
