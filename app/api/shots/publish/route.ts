import { NextRequest } from 'next/server';
import { respondOk, respondError, AppError } from '@/lib/http/responses';
import { ShotUploadPolicy } from '@/app/upload/uploadPolicy';
import { createSupabaseAdminClient, createSupabaseClient } from '@/lib/supabase/server';
import { parseMeta } from './schemas';
import { collectInputsFromForm, enforceUploadSizeLimits } from './uploadUtils';
import { createShot, insertBlocks, insertMediaSource } from '@/services/shots';
import { processOneFile } from './filePipeline';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    try {
        // Auth
        const supabase = await createSupabaseClient();
        const { data: authData, error: authError } = await supabase.auth.getUser();
        const userId = authData?.user?.id;
        if (authError || !userId) throw new AppError(401, 'unauthorized', 'Unauthorized');

        const supabaseAdmin = await createSupabaseAdminClient();

        // Parse request
        const form = await req.formData();
        const meta = parseMeta(form.get('meta'));

        // Collect files and enforce size limits
        const inputs = await collectInputsFromForm(form);
        if (inputs.length !== meta.files.length) {
            throw new AppError(400, 'files_meta_mismatch', 'files/meta length mismatch');
        }
        enforceUploadSizeLimits(inputs, ShotUploadPolicy);

        // Create shot
        const { shotId } = await createShot(supabaseAdmin, {
            title: meta.title,
            category: meta.category ?? null,
            brief: meta.description ?? null,
            userId,
        });

        // Insert blocks and build mapping client->db via position
        const byPosition = await insertBlocks(supabaseAdmin, shotId, meta.blocks ?? []);
        const clientToDbBlockId = new Map<string, string>();
        for (const b of meta.blocks ?? []) {
            const dbId = byPosition.get(b.position);
            if (dbId) clientToDbBlockId.set(b.id, dbId);
        }

        // Prepare results and per-block position counters
        const perBlockNextIndex = new Map<string, number>();
        const results: Record<
            string,
            {
                items: Array<{
                    hash: string;
                    base_url: string;
                    original_width: number;
                    original_height: number;
                    original_size_bytes: number;
                    original_format: string;
                }>;
            }
        > = {};

        // Process files sequentially (can be parallelized later with p-limit)
        for (let i = 0; i < inputs.length; i++) {
            const { ab, size } = inputs[i];
            const { blockId: clientBlockId } = meta.files[i];

            const dbBlockId = clientToDbBlockId.get(clientBlockId);
            if (!dbBlockId)
                throw new AppError(400, 'unknown_block', 'Unknown blockId in files mapping');

            const position = perBlockNextIndex.get(dbBlockId) ?? 0;
            const out = await processOneFile({
                ab,
                size,
                dbBlockId,
                userId,
                shotId,
                supabaseAdmin,
                position,
            });

            // advance per-block index
            perBlockNextIndex.set(dbBlockId, position + 1);

            // persist media record
            await insertMediaSource(supabaseAdmin, out.dbRecord);

            // collect response per client block id
            (results[clientBlockId] ??= { items: [] }).items.push(out.clientItem as any);
        }

        return respondOk({ ok: true, shotId, results });
    } catch (e) {
        return respondError(e);
    }
}
