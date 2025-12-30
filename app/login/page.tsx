import { createSupabaseClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { logger } from '@/lib/utils/console';
import AuthPage from '@/app/auth/AuthPage';
import { clientEnv } from '@/env/client';

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
    if (!clientEnv.NEXT_PUBLIC_ENABLE_FULL_SITE) {
        notFound();
    }

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
