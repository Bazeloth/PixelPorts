import {getSupabase} from '@/lib/supabase';
import {logger} from '@/lib/consoleUtils';
import {ShotBlock, ShotCard} from '@/lib/ui.types';
import {unstable_cache} from "next/cache";

/**
 * Gets a resized version of a shot image URL with enhanced options using Supabase's image transformations
 * @param shotUploadId The shot upload ID associated with the image
 * @param fileExt The file extension of the image
 * @param options The transformation options (width, height, quality)
 * @returns The URL with transformation parameters or undefined in case of error
 */
export const getResizedShotUrl = (
    shotUploadId: string,
    fileExt: string,
    options: {
        width?: number;
        height?: number;
        quality?: number;
    }
): string | undefined => {
    try {
        const filePath = `${shotUploadId}.${fileExt}`;
        const { data } = getSupabase()
            .storage.from('shots')
            .getPublicUrl(filePath, {
                transform: {
                    width: options.width,
                    height: options.height,
                    quality: options.quality || 80,
                    resize: 'cover',
                },
            });

        return data.publicUrl;
    } catch (error) {
        logger.Error('Error transforming shot image URL:', error);
        return undefined;
    }
};

export const getShotImageData = (shot: ShotCard): { uploadId: string; fileExt: string } | null => {
    // If blocks exist, look for image or carousel blocks
    if (shot.blocks && shot.blocks.length > 0) {
        // First, try to find an image block
        const firstImageBlock = shot.blocks.find((block) => block.type === 'image');
        if (firstImageBlock && firstImageBlock.upload) {
            return {
                uploadId: firstImageBlock.upload.id,
                fileExt: firstImageBlock.upload.file_ext,
            };
        }

        const firstCarouselBlock = shot.blocks.find((block) => {
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
                    return {
                        uploadId: sortedUpload.upload.id,
                        fileExt: sortedUpload.upload.file_ext,
                    };
                }
            }
        }
    }

    // Return null if no image found
    return null;
};

async function fetchShotCards(userId?: string): Promise<ShotCard[]> {
    let query = getSupabase()
        .from('shots')
        .select(`
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
    `)
        .order('created_at', { ascending: false });

    if (userId) query = query.eq('user_id', userId);

    const { data, error } = await query;
    if (error || !data) {
        return [];
    }

    return data.map((shot) => {
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
}

// Cache the function for 5 minutes and tag it for invalidation.
export const getShotCards = unstable_cache(
    async (userId?: string) => fetchShotCards(userId),
    // cache key parts (vary by userId when provided)
    ['shots'],
    {
        revalidate: 300, // seconds (5 minutes)
        tags: ['shots'], // you can add per-user tags dynamically at callsite if needed
    }
);