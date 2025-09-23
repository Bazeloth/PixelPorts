import { createSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import SignUpForm from '@/app/signup/SignUpForm';
import OAuthButtons from '@/app/login/OAuthButtons';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function SignupPage() {
    const supabase = await createSupabaseClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (user) {
        redirect('/');
    }

    return (
        <main className="mx-auto max-w-md p-6">
            <h1 className="mb-2 text-2xl font-semibold">Create your PixelPorts account</h1>
            <p className="mb-6 text-sm text-gray-600">
                Sign up with a social account or use your email.
            </p>

            <OAuthButtons />

            <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs text-gray-500">or</span>
                <div className="h-px flex-1 bg-gray-200" />
            </div>

            <SignUpForm />
            <p className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                    href="/login"
                    className="font-medium text-black underline-offset-2 hover:underline"
                >
                    Sign in
                </Link>
            </p>
        </main>
    );
}
