import { z } from 'zod';
import { USERNAME_CONSTRAINTS } from '@/lib/constants/username';

const userSchema = z.object({
    username: z
        .string()
        .min(USERNAME_CONSTRAINTS.minLength, 'Username must be at least 3 characters')
        .max(USERNAME_CONSTRAINTS.maxLength, 'Username must be less than 20 characters')
        .regex(USERNAME_CONSTRAINTS.pattern, 'Only letters, numbers, and underscores allowed'),
});

export function validateUsername(
    username: unknown
): { ok: true; value: string } | { ok: false; error: string } {
    const result = userSchema.pick({ username: true }).safeParse({ username });
    if (!result.success) {
        const tree = z.treeifyError(result.error);
        const msg = tree.properties?.username?.errors?.[0] || 'Invalid username';
        return { ok: false, error: msg };
    }
    return { ok: true, value: result.data.username };
}
