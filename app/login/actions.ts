'use server';

import { createSupabaseClient } from '@/lib/supabase/server';
import { isValidEmail } from '@/lib/utils/email';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export type SignInResult = { success: true } | { success: false; error: string };

export async function signInWithPassword(formData: FormData): Promise<SignInResult> {
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');

    if (!email || !isValidEmail(email) || !password) {
        return {
            success: false,
            error: 'Invalid email or password',
        };
    }

    const supabase = await createSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        return {
            success: false,
            error: 'Invalid email or password',
        };
    }

    // Ensure the app reflects the new auth state immediately
    revalidatePath('/', 'layout');

    // Full redirect to refresh server components like Header
    redirect('/');
}

export type FieldErrors = Partial<Record<'email' | 'password' | 'confirm', string>>;

export type SignUpResult =
    | { success: true; needsVerification?: boolean; email: string; next?: string }
    | { success: false; error: string; fieldErrors?: FieldErrors };

export async function signUpWithEmail(formData: FormData): Promise<SignUpResult> {
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');
    const confirm = String(formData.get('confirm') ?? '');

    const fieldErrors: FieldErrors = {};

    if (!email || !isValidEmail(email)) {
        fieldErrors.email = 'Please enter a valid email address';
    }
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

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
    });

    if (signUpError) {
        const message = normalizeSupabaseSignUpError(signUpError.message);
        return {
            success: false,
            error: message,
        };
    }

    const needsVerification = !!signUpData.user && !signUpData.session;
    const next = !needsVerification ? '/signup/complete-profile' : undefined;
    return {
        success: true,
        needsVerification,
        email,
        next,
    };
}

function normalizeSupabaseSignUpError(msg: string) {
    // Tidy common Supabase messages into user-friendly text
    if (/email/i.test(msg) && /exists|taken|already/i.test(msg)) {
        return 'That email is already registered';
    }
    if (/password/i.test(msg)) {
        return 'Your password does not meet requirements';
    }
    return 'Sign up failed. Please try again.';
}

export type OAuthProvider = 'google';

export async function signInWithOAuth(provider: OAuthProvider) {
    const supabase = await createSupabaseClient();
    const next = '/signup/complete-profile';
    const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=${encodeURIComponent(next)}`;

    // Using supabase-js on the server to start the OAuth flow.
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: { redirectTo },
    });

    if (error) {
        return { success: false as const, error: error.message };
    }
    return { success: true as const, url: data?.url };
}
