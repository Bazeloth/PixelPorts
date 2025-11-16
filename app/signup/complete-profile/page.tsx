import { createSupabaseClient } from '@/lib/supabase/server';
import { Container } from '@/app/Container';
import Box from '@/app/Box';
import CompleteProfileClient from './CompleteProfileClient';

function suggestUsernameFrom(seed: string) {
    const base = (seed.split('@')[0] || seed)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    return base || 'user';
}

export default async function CompleteProfilePage() {
    const supabase = await createSupabaseClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const fullName = (user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? '').trim();
    const email = user?.email || '';
    const suggestedUsername = suggestUsernameFrom(fullName || email);
    const googlePictureUrl = user?.user_metadata?.picture || '';

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
