'use server';

import { validateUsername } from '@/lib/validation/username';

type ActionState =
    | {
          errors: { username?: string[] };
          message: string;
      }
    | {
          success: boolean;
      }
    | null;

export async function checkUsernameAvailability(username: string) {
    const res = validateUsername(username);
    if (!res.ok) {
        return {
            available: false,
            errors: { username: [res.error] },
        };
    }

    // Check database
    const exists = false; // simulate

    return { available: !exists, error: null };
}

export async function createUser(
    _prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    const usernameInput = formData.get('username');

    const res = validateUsername(usernameInput);
    if (!res.ok) {
        return {
            errors: { username: [res.error] },
            message: 'Validation failed',
        };
    }

    // Final server-side availability check
    const availabilityCheck = await checkUsernameAvailability(res.value);
    if (!availabilityCheck.available) {
        return {
            errors: { username: ['Username is already taken'] },
            message: 'Username unavailable',
        };
    }

    try {
        // ... create user in database
        return { success: true };
    } catch (error) {
        return { errors: {}, message: 'Something went wrong' };
    }
}
