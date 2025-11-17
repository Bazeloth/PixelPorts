import { ShotBlock, ShotCard } from '@/lib/ui.types';
import { createSupabaseClient } from '@/lib/supabase/server';
import { SupabaseClient } from '@supabase/supabase-js';

type SupabaseClientWithStorage = Pick<SupabaseClient<any, any, any, any, any>, 'storage'>;

function getSourceFromShotsStorage(
    supabase: SupabaseClientWithStorage,
    uploadId: string,
    fileExt: string
): string {
    const filePath = `${uploadId}.${fileExt}`;
    return supabase.storage.from('shots').getPublicUrl(filePath, {}).data.publicUrl;
}

export const findFirstImageSource = (
    supabase: SupabaseClientWithStorage,
    shotBlocks: ShotBlock[]
): string | null => {
    // If blocks exist, look for image or carousel blocks
    if (shotBlocks.length > 0) {
        // First, try to find an image block
        const firstImageBlock = shotBlocks.find((block) => block.type === 'image');
        if (firstImageBlock && firstImageBlock.upload) {
            return getSourceFromShotsStorage(
                supabase,
                firstImageBlock.upload.id,
                firstImageBlock.upload.file_ext
            );
        }

        const firstCarouselBlock = shotBlocks.find((block) => {
            return block.type === 'carousel';
        });

        if (
            firstCarouselBlock &&
            firstCarouselBlock.carousel_uploads &&
            firstCarouselBlock.carousel_uploads.length > 0
        ) {
            // Sort carousel uploads by position and use the first one
            const sortedUploads = [...firstCarouselBlock.carousel_uploads].sort(
                (a, b) => a.position - b.position
            );

            // Find the first upload that has valid upload data
            for (const sortedUpload of sortedUploads) {
                if (
                    sortedUpload &&
                    sortedUpload.upload &&
                    sortedUpload.upload.id &&
                    sortedUpload.upload.file_ext
                ) {
                    return getSourceFromShotsStorage(
                        supabase,
                        sortedUpload.upload.id,
                        sortedUpload.upload.file_ext
                    );
                }
            }
        }
    }

    // Return null if no image found
    return null;
};

export async function fetchShotCardsPage({ limit, cursor }: { limit: number; cursor?: string }) {
    const supabase = await createSupabaseClient();

    // Fetch one extra record to determine if there is a next page
    const pageSizePlusOne = limit + 1;

    let query = supabase
        .from('shots')
        .select(
            `
      id,
      title,
      user_id,
      created_at,
      published_at,
      userprofiles (
        username,
        name,
        avatar_file_ext,
        avatar_updated_at
      ),
      shot_blocks (
        id,
        type,
        position,
        content,
        title,
        subtitle,
        upload_id,
        shot_uploads (
          id,
          file_type,
          width,
          height,
          file_ext,
          file_size
        ),
        shot_carousel_uploads (
          position,
          upload_id,
          shot_uploads (
            id,
            file_type,
            width,
            height,
            file_ext,
            file_size
          )
        )
      )
    `
        )
        .order('created_at', { ascending: false })
        .limit(pageSizePlusOne);

    if (cursor) {
        query = query.lt('created_at', cursor);
    }

    const { data, error } = await query;
    if (error || !data) {
        return { items: [], nextCursor: undefined as string | undefined };
    }

    const rows = (data as unknown as any[]) ?? [];
    const mapped: ShotCard[] = rows.map((shot: any) => {
        const shotBlocks: ShotBlock[] = (shot.shot_blocks ?? [])
            .sort((a: any, b: any) => a.position - b.position)
            .map((block: any) => ({
                id: block.id,
                type: block.type,
                position: block.position,
                content: block.content,
                title: block.title ?? undefined,
                subtitle: block.subtitle ?? undefined,
                upload: block.shot_uploads
                    ? {
                          id: block.shot_uploads.id,
                          file_type: block.shot_uploads.file_type,
                          width: block.shot_uploads.width,
                          height: block.shot_uploads.height,
                          file_ext: block.shot_uploads.file_ext,
                          file_size: block.shot_uploads.file_size,
                      }
                    : undefined,
                carousel_uploads: block.shot_carousel_uploads
                    ? block.shot_carousel_uploads
                          .map((cu: any) => ({
                              position: cu.position,
                              upload_id: cu.upload_id,
                              upload: {
                                  id: cu.shot_uploads.id,
                                  file_type: cu.shot_uploads.file_type,
                                  width: cu.shot_uploads.width,
                                  height: cu.shot_uploads.height,
                                  file_ext: cu.shot_uploads.file_ext,
                                  file_size: cu.shot_uploads.file_size,
                              },
                          }))
                          .sort((a: any, b: any) => a.position - b.position)
                    : undefined,
            }));

        return {
            id: shot.id,
            title: shot.title,
            alt: shot.title || 'User shot',
            author: {
                id: shot.user_id,
                username: shot.userprofiles?.username ?? 'Unknown',
                name: shot.userprofiles?.name ?? 'Unknown',
                avatar_file_ext: shot.userprofiles?.avatar_file_ext ?? undefined,
                avatar_updated_at: shot.userprofiles?.avatar_updated_at ?? undefined,
            },
            created_at: shot.created_at ?? undefined,
            published_at: shot.published_at ?? undefined,
            blocks: shotBlocks,
        };
    });

    const hasMore = mapped.length > limit;
    const items = hasMore ? mapped.slice(0, limit) : mapped;
    const nextCursor = hasMore ? items[items.length - 1].created_at : undefined;
    return { items, nextCursor };
}

/**
 * Extract a plain-text snippet from the first text block.
 * - Strips HTML tags
 * - Trims whitespace
 * - Caps length at ~150 chars with an ellipsis (preserves prior behavior)
 */
export function getTextSnippetFromBlocks(
    blocks: { type: string; content?: string | null }[] | any[],
    maxLen = 150
): string {
    if (!Array.isArray(blocks) || blocks.length === 0) return '';
    const text = blocks.find((b) => b?.type === 'text' && b?.content)?.content as
        | string
        | undefined;
    if (!text) return '';
    const trimmed = text.replace(/<[^>]*>?/gm, '').trim();
    if (trimmed.length > maxLen) {
        // Preserve existing behavior exactly when maxLen is 150
        const sliceLen = maxLen === 150 ? 147 : Math.max(0, maxLen - 1);
        return trimmed.slice(0, sliceLen) + '…';
    }
    return trimmed;
}
