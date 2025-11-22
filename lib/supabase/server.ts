'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { clientEnv } from '@/env/client';
import { env as serverEnv } from '@/env/server';

export enum StorageBucket {
    Shots = 'shots',
    Avatars = 'avatars',
}

export async function createSupabaseClient() {
    const cookieStore = await cookies();

    const supabaseUrl = clientEnv.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    return getSupabaseClient({ url: supabaseUrl, key: supabaseKey, cookieStore });
}

export async function createSupabaseAdminClient() {
    const cookieStore = await cookies();

    const supabaseUrl = clientEnv.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = serverEnv.NEXT_SUPABASE_SERVICE_ROLE_KEY;

    return getSupabaseClient({ url: supabaseUrl, key: serviceKey, cookieStore });
}

// For Next.js route handlers where you already have a NextRequest and NextResponse
// and need Supabase to mutate the response cookies (e.g., OAuth callback redirects)
export async function createSupabaseClientForRoute(request: NextRequest, response: NextResponse) {
    const supabaseUrl = clientEnv.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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
    return createServerClient(url, key, {
        cookies: {
            getAll() {
                return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        (cookieStore as any).set(name, value, options as any);
                    });
                } catch (e: any) {
                    console.error('Failed to set cookies', e);
                }
            },
        },
    });
}
