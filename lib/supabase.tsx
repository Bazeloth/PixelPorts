import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const isProduction = process.env.NODE_ENV === 'production';

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
}

// Create the Supabase client with conditional headers
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
    auth: { persistSession: true },
    global: {
        headers: isProduction ? { 'x-supabase-custom-domain': 'api.pixelports.com' } : undefined,
    },
});
