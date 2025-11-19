import { z } from 'zod';
import { usernameSchema } from '@/lib/schemas/profile';

export function validateUsername(
    username: unknown
): { ok: true; value: string } | { ok: false; error: string } {
    const result = usernameSchema.safeParse(String(username ?? ''));
    if (!result.success) {
        const tree = z.treeifyError(result.error);
        const msg = tree.errors?.[0] || 'Invalid username';
        return { ok: false, error: msg };
    }
    // usernameSchema lowercases the value
    return { ok: true, value: result.data };
}
