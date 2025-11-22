import Link from 'next/link';
import { createSupabaseClient } from '@/lib/supabase/server';
import { clientEnv } from '@/env/client';

export const dynamic = 'force-dynamic';

async function resendVerification(
    _prevState: { ok: boolean; message: string } | null,
    formData: FormData
) {
    'use server';
    const email = String(formData.get('email') ?? '').trim();
    if (!email) {
        return { ok: false, message: 'Missing email' };
    }

    const supabase = await createSupabaseClient();
    const redirectTo = `${clientEnv.NEXT_PUBLIC_SITE_URL}/auth/callback`;

    const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: { emailRedirectTo: redirectTo },
    });

    if (error) {
        return { ok: false, message: 'Could not resend email. Please try again.' };
    }
    return { ok: true, message: 'Verification email sent. Please check your inbox.' };
}

import { VerifyFormClient } from './VerifyFormClient';

export default async function VerifyPage({ searchParams }: { searchParams: { email?: string } }) {
    const email = searchParams?.email ?? '';

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-6 text-center">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Verify your email</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        We sent a verification link to{' '}
                        <span className="font-medium text-gray-900">{email || 'your email'}</span>.
                        <br />
                        Click the link in the email to activate your account.
                    </p>
                </div>

                <VerifyFormClient email={email} action={resendVerification} />

                <div className="text-sm text-gray-600">
                    <p>
                        Wrong email?{' '}
                        <Link
                            href="/signup"
                            className="text-indigo-600 hover:text-indigo-500 font-medium"
                        >
                            Start over
                        </Link>
                    </p>
                    <p className="mt-2">
                        Already verified?{' '}
                        <Link
                            href="/login"
                            className="text-indigo-600 hover:text-indigo-500 font-medium"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
