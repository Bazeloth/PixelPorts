'use server';

import { validateUsername } from '@/lib/utils/username';
import { createSupabaseClient } from '@/lib/supabase/server';
import { logger } from '@/lib/utils/console';
import { createProfileSchema } from '@/lib/schemas/profile';
import { ZodError } from 'zod';
import { ALLOWED_AVATAR_EXTENSIONS } from '@/lib/constants/avatar';

type ActionState =
    | {
          errors: { username?: string[]; name?: string[] };
          message: string;
          values?: { name?: string; username?: string };
      }
    | {
          success: boolean;
      }
    | null;

function zodErrorToActionErrors(err: ZodError): Record<string, string[]> {
    const errors: Record<string, string[]> = {};
    for (const issue of err.issues) {
        const key = (issue.path[0] ?? 'form') as string;
        if (!errors[key]) errors[key] = [];
        errors[key].push(issue.message);
    }
    return errors;
}

export async function checkUsernameAvailability(
    username: string
): Promise<{ ok: true; available: boolean } | { ok: false; error: string }> {
    const res = validateUsername(username);
    if (!res.ok) {
        return { ok: false, error: res.error };
    }
    const normalized = res.value; // already lowercased

    const supabase = await createSupabaseClient();

    // Case-insensitive check: compare on lowercase username
    const { count, error } = await supabase
        .from('userprofiles')
        .select('*', { count: 'exact', head: true })
        .ilike('username', normalized);

    if (error) {
        logger.Error('Error checking username availability', error);
        return { ok: false, error: 'something went wrong' };
    }

    return { ok: true, available: count === 0 };
}

export async function createUserProfile(
    _prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    // Extract + normalize inputs
    const name = (formData.get('name') ?? '').toString().trim();
    const usernameInput = formData.get('username');
    let avatar_file_ext = (formData.get('avatar_file_ext') ?? '')
        .toString()
        .trim()
        .toLowerCase()
        .replace(/^\./, '');

    // Validate shape/format with shared schema
    const parsed = createProfileSchema.safeParse({
        name,
        username: typeof usernameInput === 'string' ? usernameInput : '',
        avatar_file_ext,
    });

    if (!parsed.success) {
        return {
            errors: zodErrorToActionErrors(parsed.error),
            message: 'Validation failed',
            values: { name, username: typeof usernameInput === 'string' ? usernameInput : '' },
        };
    }

    const { name: validName, username: validUsername, avatar_file_ext: validExt } = parsed.data;

    // Final server-side availability check using normalized (lowercased) username
    const availabilityCheck = await checkUsernameAvailability(validUsername);
    if (!availabilityCheck.ok) {
        return {
            errors: { username: [availabilityCheck.error] },
            message: 'Validation failed',
            values: { name: validName, username: validUsername },
        };
    }
    if (!availabilityCheck.available) {
        return {
            errors: { username: ['Username is already taken'] },
            message: 'Username unavailable',
            values: { name: validName, username: validUsername },
        };
    }

    const supabase = await createSupabaseClient();

    // Ensure we have an authenticated user to satisfy RLS policies
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        logger.Error('Unable to resolve authenticated user for profile creation', authError);
        return {
            errors: {},
            message: 'You must be signed in to create a profile.',
            values: { name: validName, username: validUsername },
        };
    }

    const row: Record<string, any> = { name: validName, username: validUsername };
    if (validExt) {
        // Only persist if in our allow-list
        if ((ALLOWED_AVATAR_EXTENSIONS as readonly string[]).includes(validExt)) {
            row.avatar_file_ext = validExt;
        }
    }

    const { error: insertError } = await supabase
        .from('userprofiles')
        .insert([{ id: user.id, ...row }]);

    if (insertError) {
        logger.Error('Unable to create profile', insertError);
        return {
            errors: {},
            message: 'Unable to create profile. Please try again later.',
            values: { name: validName, username: validUsername },
        };
    }

    return { success: true };
}
