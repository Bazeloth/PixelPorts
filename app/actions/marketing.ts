'use server';

import { createSupabaseClient } from '@/lib/supabase/server';
import { logger } from '@/lib/utils/console';

export async function signupForMarketing(email: string) {
    try {
        const supabase = await createSupabaseClient();
        const { error } = await supabase.from('marketing_signups').insert([{ email }]);

        if (error) {
            if (error.code === '23505') {
                return {
                    success: true,
                    message: "You're already on the list! We'll keep you posted.",
                };
            }
            logger.Error('Error signing up for marketing', error);
            return { success: false, message: 'Could not complete signup. Please try again later.' };
        }

        return {
            success: true,
            message: "Thanks for signing up! We'll keep you posted.",
        };
    } catch (err) {
        logger.Error('Exception in signupForMarketing', err);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}
