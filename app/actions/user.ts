'use server';

import { validateUsername } from '@/lib/utils/username';
import { createSupabaseClient } from '@/lib/supabase/server';
import { logger } from '@/lib/utils/console';

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

export async function checkUsernameAvailability(
    username: string
): Promise<{ ok: true; available: boolean } | { ok: false; error: string }> {
    const res = validateUsername(username);
    if (!res.ok) {
        return { ok: false, error: res.error };
    }

    const supabase = await createSupabaseClient();

    // Check database
    const { count, error } = await supabase
        .from('userprofiles')
        .select('*', { count: 'exact', head: true })
        .eq('username', username);

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
    // Extract
    const rawName = formData.get('name');
    const usernameInput = formData.get('username');

    // Normalize + basic validations for name
    const name = typeof rawName === 'string' ? rawName.trim() : '';
    const nameErrors: string[] = [];
    if (!name) nameErrors.push('Full name is required');
    if (name && (name.length < 1 || name.length > 60)) {
        nameErrors.push('Full name must be between 1 and 60 characters');
    }

    // Validate username with existing util
    const res = validateUsername(usernameInput);

    // Early return on invalid username
    if (!res.ok) {
        return {
            errors: {
                ...(nameErrors.length ? { name: nameErrors } : {}),
                username: [res.error],
            },
            message: 'Validation failed',
            values: {
                name,
                username: typeof usernameInput === 'string' ? usernameInput : '',
            },
        };
    }

    const username = res.value;

    if (nameErrors.length) {
        return {
            errors: { name: nameErrors },
            message: 'Validation failed',
            values: { name, username },
        };
    }

    // Final server-side availability check using normalized username
    const availabilityCheck = await checkUsernameAvailability(username);
    if (!availabilityCheck.ok) {
        return {
            errors: { username: [availabilityCheck.error] },
            message: 'Validation failed',
            values: { name, username },
        };
    }
    if (!availabilityCheck.available) {
        return {
            errors: { username: ['Username is already taken'] },
            message: 'Username unavailable',
            values: { name, username },
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
            values: { name, username },
        };
    }

    // Read and validate avatar file extension from formData
    let avatarFileExt =
        typeof formData.get('avatar_file_ext') === 'string'
            ? String(formData.get('avatar_file_ext'))
            : '';

    // Normalize: lowercase and strip a leading dot if present
    avatarFileExt = avatarFileExt.trim().toLowerCase().replace(/^\./, '');

    // Allow-list of supported extensions (kept in sync with client)
    const allowedAvatarExt = new Set(['png', 'jpg', 'jpeg', 'webp']);

    // If invalid, drop the value (do not store untrusted data)
    if (avatarFileExt && !allowedAvatarExt.has(avatarFileExt)) {
        logger.Warn?.(
            'Dropping unsupported avatar_file_ext provided by client:',
            avatarFileExt
        );
        avatarFileExt = '';
    }

    const row: Record<string, any> = { name, username };
    if (avatarFileExt) {
        row.avatar_file_ext = avatarFileExt;
    }

    const { error: insertError } = await supabase
        .from('userprofiles')
        .insert([{ id: user.id, ...row }]);

    if (insertError) {
        logger.Error('Unable to create profile', insertError);
        return {
            errors: {},
            message: 'Unable to create profile. Please try again later.',
            values: { name, username },
        };
    }

    return { success: true };
}
