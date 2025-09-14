import { createSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import LoginForm from '@/app/(auth)/login/LoginForm';

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
    const supabase = await createSupabaseClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (user) {
        redirect('/');
    }

    return (
        <main className="mx-auto max-w-md p-6">
            <h1 className="mb-4 text-2xl font-semibold">Sign in</h1>
            <LoginForm />
        </main>
    );
}
