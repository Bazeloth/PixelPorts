'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
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
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options)
                    );
                } catch {
                    // can be safely ignored
                }
            },
        },
    });
}
