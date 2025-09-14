'use server';

import { createSupabaseClient } from '@/lib/supabase/server';

export type SignInResult = { success: true } | { success: false; error: string };

export async function signInWithPassword(formData: FormData): Promise<SignInResult> {
    const emailOrUsername = String(formData.get('identifier') ?? '').trim();
    const password = String(formData.get('password') ?? '');

    if (!emailOrUsername || !password) {
        return { success: false, error: 'Invalid username/email or password' };
    }

    const supabase = await createSupabaseClient();

    let email = emailOrUsername;
    const looksLikeEmail = !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailOrUsername);
    if (looksLikeEmail) {
        // Resolve username to email from the userprofiles table if available
        const { data: rawProfile } = await supabase
            .from('userprofiles')
            .select('email')
            .eq('username', emailOrUsername)
            .maybeSingle();
        const profile = rawProfile as unknown as { email?: string } | null;
        if (!profile?.email) {
            return { success: false, error: 'Invalid username or password' };
        }
        email = profile.email;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        return { success: false, error: 'Invalid username/email or password' };
    }

    return { success: true };
}
