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
    const looksLikeEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailOrUsername);
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

export type FieldErrors = Partial<Record<'email' | 'username' | 'password' | 'confirm', string>>;

export type SignUpResult =
    | { success: true; needsVerification?: boolean; email?: string }
    | {
          success: false;
          error: string;
          fieldErrors?: FieldErrors;
      };

export async function signUpWithEmail(formData: FormData): Promise<SignUpResult> {
    const email = String(formData.get('email') ?? '').trim();
    const username = String(formData.get('username') ?? '').trim();
    const password = String(formData.get('password') ?? '');
    const confirm = String(formData.get('confirm') ?? '');

    const fieldErrors: FieldErrors = {};

    // Basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        fieldErrors.email = 'Please enter a valid email address';
    }
    if (!username || !/^([a-z0-9_.\-]){3,20}$/i.test(username)) {
        fieldErrors.username = 'Username must be 3–20 chars (letters, numbers, _.-)';
    }
    // Password policy: 8+ chars incl. a number
    if (!password || password.length < 8 || !/\d/.test(password)) {
        fieldErrors.password = 'Password must be at least 8 characters and include a number';
    }
    if (confirm !== password) {
        fieldErrors.confirm = 'Passwords do not match';
    }
    if (Object.keys(fieldErrors).length > 0) {
        return { success: false, error: 'Please fix the errors below', fieldErrors };
    }

    const supabase = await createSupabaseClient();

    // Check username uniqueness up front
    const { data: existing } = await supabase
        .from('userprofiles')
        .select('id')
        .eq('username', username)
        .maybeSingle();
    if (existing) {
        return {
            success: false,
            error: 'Username is already taken',
            fieldErrors: { username: 'This username is unavailable' },
        };
    }

    // Create auth user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            // If you have email confirmations on, this link is used by Supabase in the verification email
            emailRedirectTo: process.env.NEXT_PUBLIC_SITE_URL
                ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
                : undefined,
            data: { username }, // store in user_metadata too (nice to have)
        },
    });

    if (signUpError) {
        const message = normalizeSupabaseSignUpError(signUpError.message);
        return { success: false, error: message };
    }

    const user = signUpData.user;
    if (user?.id) {
        const { error: profileError } = await supabase.from('userprofiles').insert({
            id: user.id,
            username,
            email,
        });
        if (profileError) {
            // If race or constraint error, surface username conflict nicely
            const isUsernameConflict = /duplicate key|unique constraint|username/i.test(
                profileError.message
            );
            return {
                success: false,
                error: isUsernameConflict
                    ? 'Username is already taken'
                    : 'Could not create your profile. Please try again.',
                fieldErrors: isUsernameConflict
                    ? { username: 'This username is unavailable' }
                    : undefined,
            };
        }
    }

    const needsVerification = !!user && !signUpData.session; // if email confirmation is required
    return { success: true, needsVerification, email };
}

function normalizeSupabaseSignUpError(msg: string) {
    // Tidy common Supabase messages into user-friendly text
    if (/email/i.test(msg) && /exists|taken|already/i.test(msg))
        return 'That email is already registered';
    if (/password/i.test(msg)) return 'Your password does not meet requirements';
    return 'Sign up failed. Please try again.';
}
