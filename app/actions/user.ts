// app/actions/user.ts
'use server';

import { userSchema } from '@/lib/validations/user';

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
    const result = userSchema.pick({ username: true }).safeParse({ username });

    if (!result.success) {
        return {
            available: false,
            error: result.error.flatten().fieldErrors.username?.[0],
        };
    }

    // Check database
    const exists = false; // simulate

    return { available: !exists, error: null };
}

export async function createUser(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const rawData = {
        username: formData.get('username'),
        // ... other fields
    };

    const result = userSchema.safeParse(rawData);

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
            message: 'Validation failed',
        };
    }

    // Final server-side availability check
    const availabilityCheck = await checkUsernameAvailability(result.data.username);
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
