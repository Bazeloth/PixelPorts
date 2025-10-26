'use server';

import { validateUsername } from '@/lib/utils/username';

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

    // Check database
    const exists = false; // simulate

    return { ok: true, available: !exists };
}

export async function createUser(
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

    // Early return on invalid username (this narrows the union for res afterwards)
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

    try {
        // ... create user in database, including `name` and `username`
        // e.g., await db.user.create({ data: { name, username, ... } })
        return { success: true };
    } catch (error) {
        return {
            errors: {},
            message: 'Something went wrong',
            values: { name, username },
        };
    }
}
