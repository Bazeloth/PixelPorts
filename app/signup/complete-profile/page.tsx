import { createSupabaseClient } from '@/lib/supabase/server';
import { logger } from '@/lib/consoleUtils';
import { redirect } from 'next/navigation';
import { FieldLabel } from '@/app/signup/complete-profile/FieldLabel';
import { Container } from '@/app/Container';
import Box from '@/app/Box';
import { UsernameControl } from '@/app/signup/complete-profile/UsernameControl';

export default async function CompleteProfilePage() {
    const supabase = await createSupabaseClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        logger.Info('User not logged in', { user });
        redirect('/');
    }

    return (
        <Container className={'py-12'}>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete your profile</h1>
                <p className="text-lg text-gray-600">
                    Help other designers and potential clients get to know you better
                </p>
            </div>
            <Box>
                <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                        Basic Information
                    </h3>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 items-start">
                        <FieldLabel label="Username" sublabel="A unique name for your profile." />
                        <UsernameControl />
                    </div>
                </div>
            </Box>
        </Container>
    );
}
