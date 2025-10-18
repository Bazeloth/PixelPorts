import { NextRequest } from 'next/server';
import { createSupabaseClient } from '@/lib/supabase/server';
import { fetchShotCardsPage, findFirstImageSource, getTextSnippetFromBlocks } from '@/lib/shotUtils';
import { getAvatarUrl } from '@/lib/avatar';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const cursor = searchParams.get('cursor') ?? undefined;
        // Keeping for future use; currently not filtering by category at the DB level
        const _category = searchParams.get('category') ?? undefined;
        const limitParam = searchParams.get('limit');
        const limit = Math.min(Math.max(Number(limitParam) || 12, 1), 50);

        const { items, nextCursor } = await fetchShotCardsPage({ limit, cursor });
        const supabase = await createSupabaseClient();


        const payload = items.map((shot) => {
            const imageSrc =
                findFirstImageSource(supabase, shot.blocks) ||
                'https://images.unsplash.com/photo-1586717799252-bd134ad00e26?auto=format&fit=crop&w=1200&q=60';

            return {
                id: shot.id,
                title: shot.title,
                description: getTextSnippetFromBlocks(shot.blocks),
                tags: [] as string[],
                designer: {
                    name: shot.author.name,
                    src: getAvatarUrl({
                        supabase,
                        userId: shot.author.id,
                        avatarFileExt: shot.author.avatar_file_ext,
                    }),
                },
                image: {
                    src: imageSrc,
                    alt: shot.alt || shot.title || 'Project image',
                },
            };
        });

        return Response.json({ items: payload, nextCursor });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e?.message || 'Unexpected error' }), {
            status: 500,
        });
    }
}
