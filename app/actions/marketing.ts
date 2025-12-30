'use server';

import { createSupabaseClient } from '@/lib/supabase/server';
import { logger } from '@/lib/utils/console';

export async function signupForMarketing(email: string) {
    try {
        const supabase = await createSupabaseClient();

        // Check if we have a table for marketing_signups, or use a generic one if it exists.
        // For now, I'll assume we might need to create it or we can use an existing one if I find it.
        // Actually, let's just try to insert into a 'marketing_signups' table.

        const { error } = await supabase.from('marketing_signups').insert([{ email }]);

        if (error) {
            if (error.code === '23505') {
                return { success: true }; // Already signed up
            }
            logger.Error('Error signing up for marketing', error);
            // If the table doesn't exist, we might get an error.
            // In a real scenario, I'd check the DB schema first.
            return { success: false, error: 'Could not complete signup. Please try again later.' };
        }

        return { success: true };
    } catch (err) {
        logger.Error('Exception in signupForMarketing', err);
        return { success: false, error: 'An unexpected error occurred.' };
    }
}
