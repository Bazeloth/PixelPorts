'use client';

import { createBrowserClient } from '@supabase/ssr';
import { clientEnv } from '@/env/client';

export async function createSupabaseClient() {
    const supabaseUrl = clientEnv.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // In the browser, @supabase/ssr's createBrowserClient manages auth using localStorage.
    // Do not pass Next.js cookies API here.
    return createBrowserClient(supabaseUrl, supabaseKey);
}
