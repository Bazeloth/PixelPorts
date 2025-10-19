import { z } from 'zod';

const userSchema = z.object({
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username must be less than 20 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores allowed'),
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

export function initialsFromName(name: string | null | undefined): string {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase();
}
