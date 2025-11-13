import { createSupabaseClient } from '@/lib/supabase/server';
import { Container } from '@/app/Container';
import Box from '@/app/Box';
import CompleteProfileClient from './CompleteProfileClient';

export default async function CompleteProfilePage() {
    // Allow access to this page whether logged in or not, as header behavior is needed for logged-out users
    // If logged out, the form will not be actionable, but the user can choose to cancel via the header.
    await createSupabaseClient();

    return (
        <Container className="py-12">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete your profile</h1>
                <p className="text-lg text-gray-600">
                    Help other designers and potential clients get to know you better
                </p>
            </div>
            <Box>
                <CompleteProfileClient />
            </Box>
        </Container>
    );
}
