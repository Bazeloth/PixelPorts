import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { imageSize } from 'image-size';
import {
    ALLOWED_IMAGE_MIME_TYPES,
    MAX_IMAGE_BYTES,
    MAX_TOTAL_BYTES,
    extFromMime,
    normalizeImageType,
} from '@/app/upload/uploadPolicy';
import { z } from 'zod';
import { fileTypeFromBuffer } from 'file-type';
import type { OriginalImageFormat } from '@/app/upload/uploadPolicy';
import {
    createSupabaseAdminClient,
    createSupabaseClient,
    StorageBucket,
} from '@/lib/supabase/server';

export const runtime = 'nodejs';


function sha256Hex(buf: ArrayBuffer) {
    const h = crypto.createHash('sha256');
    h.update(Buffer.from(buf));
    return h.digest('hex');
}

async function uploadOriginal(path: string, data: ArrayBuffer, contentType: string, supabaseAdmin: Awaited<ReturnType<typeof createSupabaseAdminClient>>) {
    const { error } = await supabaseAdmin.storage.from(StorageBucket.Shots).upload(path, data, {
        contentType,
        upsert: false,
        cacheControl: '31536000', // 1 year
    });
    if (error) throw error;
    const { data: urlData } = supabaseAdmin.storage.from(StorageBucket.Shots).getPublicUrl(path);
    return urlData.publicUrl;
}

export async function POST(req: NextRequest) {
    try {
        // Identify the authenticated user
        const supabase = await createSupabaseClient();
        const { data: authData, error: authError } = await supabase.auth.getUser();
        const userId = authData?.user?.id;
        if (authError || !userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabaseAdmin = await createSupabaseAdminClient();

        const form = await req.formData();
        const metaRaw = form.get('meta');
        if (!metaRaw || typeof metaRaw !== 'string') {
            return NextResponse.json({ error: 'Missing meta' }, { status: 400 });
        }

        const MetaSchema = z.object({
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
                .min(0)
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

        let meta: z.infer<typeof MetaSchema>;
        try {
            meta = MetaSchema.parse(JSON.parse(metaRaw));
        } catch (e: any) {
            return NextResponse.json(
                { error: 'Invalid meta', details: e?.errors ?? String(e) },
                { status: 400 }
            );
        }

        const VALID_MIME = new Set<string>(ALLOWED_IMAGE_MIME_TYPES as unknown as string[]);

        const inputs: { file: File; ab: ArrayBuffer; size: number }[] = [];
        for (const entry of form.getAll('files')) {
            if (entry instanceof File) {
                const ab = await entry.arrayBuffer();
                inputs.push({ file: entry, ab, size: entry.size });
            }
        }

        if (inputs.length !== meta.files.length) {
            return NextResponse.json({ error: 'files/meta length mismatch' }, { status: 400 });
        }

        // Server-side size enforcement
        const totalBytes = inputs.reduce((sum, it) => sum + it.size, 0);
        if (totalBytes > MAX_TOTAL_BYTES) {
            return NextResponse.json(
                { error: 'Total upload size exceeds limit.' },
                { status: 413 }
            );
        }
        for (const it of inputs) {
            if (it.size > MAX_IMAGE_BYTES) {
                return NextResponse.json(
                    { error: 'A file exceeds the per-file size limit.' },
                    { status: 413 }
                );
            }
        }

        // 1) Create the parent shot
        const shotInsert = await supabaseAdmin
            .from('shots')
            .insert({
                title: meta.title,
                category: meta.category ?? null,
                brief: meta.description ?? null,
                user_id: userId,
            })
            .select('id')
            .single();
        if (shotInsert.error || !shotInsert.data) {
            return NextResponse.json({ error: 'Failed to create shot' }, { status: 500 });
        }
        const shotId: string = shotInsert.data.id;

        // 2) Create shot_blocks from meta and map client ids -> DB ids
        const blocksToInsert = (meta.blocks ?? []).map((b) => ({
            shot_id: shotId,
            type: b.type,
            position: b.position,
            content: b.content ?? null,
            title: b.title ?? null,
            subtitle: b.subtitle ?? null,
            upload_id: null, // legacy unused in new pipeline
        }));

        let blockIdByPosition = new Map<number, string>();
        if (blocksToInsert.length > 0) {
            const { data: blocksRows, error: blocksError } = await supabaseAdmin
                .from('shot_blocks')
                .insert(blocksToInsert)
                .select('id, position');
            if (blocksError || !blocksRows) {
                return NextResponse.json({ error: 'Failed to create blocks' }, { status: 500 });
            }
            for (const row of blocksRows) blockIdByPosition.set(row.position, row.id);
        }

        // Also create a mapping from client block id to DB id via position match
        const clientToDbBlockId = new Map<string, string>();
        for (const b of meta.blocks ?? []) {
            const dbId = blockIdByPosition.get(b.position);
            if (dbId) clientToDbBlockId.set(b.id, dbId);
        }

        // 3) Upload originals and insert into shot_media_sources with per-block position
        const perBlockNextIndex = new Map<string, number>(); // dbBlockId -> next position

        const results: Record<
            string,
            {
                items: Array<{
                    hash: string;
                    base_url: string;
                    original_width: number;
                    original_height: number;
                    original_size_bytes: number;
                    original_format: OriginalImageFormat;
                }>;
            }
        > = {};

        const MAX_PIXEL_AREA = 60_000_000; // guard against pathological dimensions (~8k x 8k)

        for (let i = 0; i < inputs.length; i++) {
            const { ab, size } = inputs[i];
            const { blockId: clientBlockId } = meta.files[i];

            const dbBlockId = clientToDbBlockId.get(clientBlockId);
            if (!dbBlockId) {
                return NextResponse.json(
                    { error: 'Unknown blockId in files mapping' },
                    { status: 400 }
                );
            }

            const buf = Buffer.from(ab);
            const ft = await fileTypeFromBuffer(buf);
            if (!ft || !VALID_MIME.has(ft.mime)) {
                return NextResponse.json(
                    { error: `Unsupported or untrusted file type` },
                    { status: 415 }
                );
            }

            const dim = imageSize(buf);
            if (!dim.width || !dim.height || !dim.type) {
                return NextResponse.json(
                    { error: 'Could not parse image metadata.' },
                    { status: 415 }
                );
            }
            if (dim.width * dim.height > MAX_PIXEL_AREA) {
                return NextResponse.json({ error: 'Image dimensions too large' }, { status: 413 });
            }

            const normalized = normalizeImageType(dim.type);
            if (!normalized) {
                return NextResponse.json(
                    { error: `Unsupported or unknown image format: ${dim.type}` },
                    { status: 415 }
                );
            }
            const format: OriginalImageFormat = normalized;

            const hash = sha256Hex(ab);
            const ext = ft.ext || extFromMime(ft.mime);
            const objectPath = `${userId}/${shotId}/${hash}-original.${ext}`;
            const baseUrl = await uploadOriginal(objectPath, ab, ft.mime, supabaseAdmin);

            const position = perBlockNextIndex.get(dbBlockId) ?? 0;
            perBlockNextIndex.set(dbBlockId, position + 1);

            const { error: insertError } = await supabaseAdmin.from('shot_media_sources').insert({
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
            });
            if (insertError) {
                console.error('DB insert failed', insertError);
                return NextResponse.json(
                    { error: 'Failed to save image metadata.' },
                    { status: 500 }
                );
            }

            const item = {
                hash,
                base_url: baseUrl,
                original_width: dim.width,
                original_height: dim.height,
                original_size_bytes: size,
                original_format: format,
            };
            if (!results[clientBlockId]) results[clientBlockId] = { items: [] };
            results[clientBlockId].items.push(item);
        }

        return NextResponse.json({ ok: true, shotId, results });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
    }
}
