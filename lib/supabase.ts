import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { Database } from './database.types';

export async function getSupabase() {
    const cookieStore = (await cookies()) as unknown as {
        get: (name: string) => { value: string } | undefined;
        set: (args: any) => void;
    };
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase environment variables');
    }

    return createServerClient<Database>(supabaseUrl, supabaseKey, {
        cookies: {
            get(name) {
                return cookieStore.get(name)?.value;
            },
            set(name, value, options) {
                cookieStore.set({ name, value, ...options });
            },
            remove(name, options) {
                cookieStore.set({ name, value: '', ...options });
            },
        },
    });
}
