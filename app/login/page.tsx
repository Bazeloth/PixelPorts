import { createSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { logger } from '@/lib/consoleUtils';
import AuthPage from '@/app/auth/AuthPage';

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
    const supabase = await createSupabaseClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (user) {
        logger.Info('User already logged in', { user });
        redirect('/');
    }

    return <AuthPage mode="signin" />;
}
