import crypto from 'node:crypto';
import { sniffImage, enforceImagePolicy } from './imagePolicy';
import { ShotUploadPolicy } from '@/app/upload/uploadPolicy';
import type { ShotOriginalImageFormat } from '@/app/upload/uploadPolicy';
import { StorageBucket } from '@/lib/supabase/server';

function sha256Hex(ab: ArrayBuffer) {
    const h = crypto.createHash('sha256');
    h.update(Buffer.from(ab));
    return h.digest('hex');
}

import type { SupabaseServerClient } from '@/lib/supabase/server';

async function uploadOriginal(
    supabaseAdmin: SupabaseServerClient,
    path: string,
    data: ArrayBuffer,
    contentType: string
) {
    const { error } = await supabaseAdmin.storage.from(StorageBucket.Shots).upload(path, data, {
        contentType,
        upsert: false,
        cacheControl: '31536000',
    });
    if (error) throw error;

    const { data: urlData } = supabaseAdmin.storage.from(StorageBucket.Shots).getPublicUrl(path);
    return urlData.publicUrl as string;
}

export async function processOneFile(args: {
    ab: ArrayBuffer;
    size: number;
    dbBlockId: string;
    userId: string;
    shotId: string;
    supabaseAdmin: SupabaseServerClient;
    position: number;
}) {
    const { ab, size, dbBlockId, userId, shotId, supabaseAdmin, position } = args;
    const buf = Buffer.from(ab);

    const { ft, dim } = await sniffImage(buf);
    enforceImagePolicy({ width: dim.width!, height: dim.height!, type: dim.type! });

    const normalized = ShotUploadPolicy.normalizeImageType(dim.type);
    if (!normalized) {
        throw new Error(`Unsupported or unknown image format: ${dim.type}`);
    }
    const format: ShotOriginalImageFormat = normalized;

    const hash = sha256Hex(ab);
    const ext = ft.ext || ShotUploadPolicy.extFromMime(ft.mime);
    const objectPath = `${userId}/${shotId}/${hash}-original.${ext}`;
    const baseUrl = await uploadOriginal(supabaseAdmin, objectPath, ab, ft.mime);

    const dbRecord = {
        user_id: userId,
        shot_id: shotId,
        block_id: dbBlockId,
        position,
        hash,
        object_key: objectPath,
        original_width: dim.width,
        original_height: dim.height,
        original_size_bytes: size,
        original_format: format,
        original_ext: ext,
        original_mime: ft.mime,
    };

    const clientItem = {
        hash,
        base_url: baseUrl,
        original_width: dim.width!,
        original_height: dim.height!,
        original_size_bytes: size,
        original_format: format,
    };

    return { dbRecord, clientItem } as const;
}
