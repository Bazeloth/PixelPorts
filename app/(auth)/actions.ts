'use server';
import { redirect } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';

export async function signInWithPassword(formData: FormData) {
    const emailOrUsername = String(formData.get('identifier') ?? '').trim();
    const password = String(formData.get('password') ?? '');

    if (!emailOrUsername || !password) {
        throw new Error('Missing credentials');
    }

    const supabase = await getSupabase();

    // If your auth is configured for email login only, treat identifier as email.
    // If you support username login, you need to resolve username -> email first.
    // Here we try email first; if it doesn't look like an email, try resolving username to email.
    let email = emailOrUsername;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailOrUsername)) {
        // Resolve username to email from your userprofiles table if available
        const { data: rawProfile } = await supabase
            .from('userprofiles')
            .select('email')
            .eq('username', emailOrUsername)
            .maybeSingle();
        const profile = rawProfile as unknown as { email?: string } | null;
        if (!profile?.email) {
            throw new Error('Invalid username or password');
        }
        email = profile.email;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        throw new Error(error.message);
    }

    // Cookies are set by @supabase/ssr; redirect to home
    redirect('/');
}

export async function signOut() {
    const supabase = await getSupabase();
    await supabase.auth.signOut();
    redirect('/');
}
