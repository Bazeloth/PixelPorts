import { Container } from '@/app/Container';
import Box from '@/app/Box';
import CompleteProfileClient from './CompleteProfileClient';
import { getUserAndProfile } from '@/lib/supabase/getUserAndProfile';
import { redirect } from 'next/navigation';

function suggestUsernameFrom(seed: string) {
    const base = (seed.split('@')[0] || seed)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    return base || 'user';
}

export default async function CompleteProfilePage({
    searchParams,
}: {
    searchParams: { next?: string };
}) {
    const user = await getUserAndProfile();
    if (!user) {
        redirect('/signin');
    } else if (user.profile) {
        const next = searchParams.next || '/';
        redirect(next);
    }

    const fullName = (user.metadata?.full_name ?? user.metadata?.name ?? '').trim();
    const email = user?.email || '';
    const suggestedUsername = suggestUsernameFrom(fullName || email);
    const googlePictureUrl = user?.metadata?.picture || '';

    return (
        <Container className="py-12">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete your profile</h1>
                <p className="text-lg text-gray-600">
                    Help other designers and potential clients get to know you better
                </p>
            </div>
            <Box>
                <CompleteProfileClient
                    defaultFullName={fullName}
                    defaultUsername={suggestedUsername}
                    googlePictureUrl={googlePictureUrl}
                />
            </Box>
        </Container>
    );
}
