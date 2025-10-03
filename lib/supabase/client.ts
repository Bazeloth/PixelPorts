'use client';

import { createBrowserClient } from '@supabase/ssr';

export async function createSupabaseClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase environment variables');
    }

    // In the browser, @supabase/ssr's createBrowserClient manages auth using localStorage.
    // Do not pass Next.js cookies API here.
    return createBrowserClient(supabaseUrl, supabaseKey);
}
