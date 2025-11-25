import { AppError } from '@/lib/http/responses';
import type { SupabaseServerClient } from '@/lib/supabase/server';
import { logger } from '@/lib/utils/console';

export async function createShot(
    supabaseAdmin: SupabaseServerClient,
    {
        title,
        category,
        brief,
        userId,
    }: {
        title: string;
        category: string | null;
        brief: string | null;
        userId: string;
    }
) {
    const res = await supabaseAdmin
        .from('shots')
        .insert({ title, category, brief, user_id: userId })
        .select('id')
        .single();

    if (res.error || !res.data) {
        throw new AppError(500, 'create_shot_failed', 'Failed to create shot');
    }

    return { shotId: res.data.id as string };
}

export async function insertBlocks(
    supabaseAdmin: SupabaseServerClient,
    shotId: string,
    blocks: Array<{
        id: string;
        type: string;
        position: number;
        content?: string;
        title?: string;
        subtitle?: string;
    }>
) {
    if (!blocks?.length) return new Map<number, string>();

    const toInsert = blocks.map((b) => ({
        shot_id: shotId,
        type: b.type,
        position: b.position,
        content: b.content ?? null,
        title: b.title ?? null,
        subtitle: b.subtitle ?? null,
        upload_id: null,
    }));

    const { data, error } = await supabaseAdmin
        .from('shot_blocks')
        .insert(toInsert)
        .select('id, position');

    if (error || !data) {
        logger.Error('insert_blocks_failed', error);
        throw new AppError(500, 'insert_blocks_failed', 'Failed to create blocks');
    }

    const map = new Map<number, string>();
    for (const row of data) map.set(row.position, row.id);

    return map;
}

export async function insertMediaSource(supabaseAdmin: SupabaseServerClient, record: any) {
    const { error } = await supabaseAdmin.from('shot_media_sources').insert(record);
    if (error) throw new AppError(500, 'insert_media_failed', 'Failed to save image metadata.');
}
