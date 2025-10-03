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
            <Box>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 items-start">
                    <FieldLabel label="Username" sublabel="A unique name for your profile." />
                    <UsernameControl />
                </div>
            </Box>
        </Container>
    );
}
