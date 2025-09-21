import { createSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import SignUpForm from '@/app/(auth)/signup/SignUpForm';

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
            <h1 className="mb-4 text-2xl font-semibold">Sign up</h1>
            <SignUpForm />
        </main>
    );
}
