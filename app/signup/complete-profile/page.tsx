import { createSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Container } from '@/app/Container';
import Box from '@/app/Box';
import CompleteProfileClient from './CompleteProfileClient';

export default async function CompleteProfilePage() {
    const supabase = await createSupabaseClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/');
    }

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
