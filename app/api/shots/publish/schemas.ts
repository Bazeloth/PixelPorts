import { z } from 'zod';
import { AppError } from '@/lib/http/responses';

export const MetaSchema = z.object({
    shotId: z.string().uuid().optional(),
    title: z.string().min(1),
    category: z.string().optional(),
    description: z.string().optional(),
    blocks: z
        .array(
            z.object({
                id: z.string().min(1),
                type: z.string().min(1),
                position: z.number().int().min(0),
                content: z.string().optional(),
                title: z.string().optional(),
                subtitle: z.string().optional(),
            })
        )
        .default([]),
    files: z
        .array(
            z.object({
                blockId: z.string().min(1),
                kind: z.literal('image'),
                caption: z.string().optional(),
            })
        )
        .min(1),
});

export type Meta = z.infer<typeof MetaSchema>;

export function parseMeta(raw: FormDataEntryValue | null): Meta {
    if (!raw || typeof raw !== 'string') {
        throw new AppError(400, 'missing_meta', 'Missing meta');
    }
    try {
        return MetaSchema.parse(JSON.parse(raw));
    } catch (e: any) {
        throw new AppError(400, 'invalid_meta', 'Invalid meta', e?.errors ?? String(e));
    }
}
