import {
    fetchShotCardsPage,
    findFirstImageSource,
    getTextSnippetFromBlocks,
} from '@/lib/utils/shot';
import { createSupabaseClient } from '@/lib/supabase/server';

export default async function ShotsGrid({
    category = 'all',
    initialLimit = 12,
}: {
    category?: string;
    initialLimit?: number;
}) {
    // Fetch initial page of shots
    const { items, nextCursor } = await fetchShotCardsPage({ limit: initialLimit });
    const supabase = await createSupabaseClient();

    const cards = items.map((shot) => {
        const imageSrc = // todo: should be an explicit image
            findFirstImageSource(supabase, shot.blocks) ??
            'https://images.unsplash.com/photo-1586717799252-bd134ad00e26?auto=format&fit=crop&w=1200&q=60';

        return {
            key: shot.id,
            title: shot.title,
            description: getTextSnippetFromBlocks(shot.blocks),
            tags: [] as string[],
            designer: {
                name: shot.author.name,
                userId: shot.author.id,
                avatarFileExt: String(shot.author.avatar_file_ext),
            },
            image: {
                src: imageSrc,
                alt: shot.alt || shot.title || 'Project image',
            },
        };
    });

    return (
        <section className="mt-4 px-4 sm:px-6 lg:px-8">
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {cards.map((c) => (
                    <li key={c.key}>
                        {/* Keep link structure simple for now; integrate slugs later */}
                        <ShotCardView
                            title={c.title}
                            description={c.description}
                            tags={c.tags}
                            designer={c.designer}
                            image={c.image}
                        />
                    </li>
                ))}
            </ul>

            {nextCursor && (
                <div className="flex justify-center mt-6">
                    {/* Client loader will append more items under this grid */}
                    <LoadMore initialCursor={nextCursor} category={category} />
                </div>
            )}
        </section>
    );
}

// Lazy import the client component to avoid importing it at the top in a server file
// This pattern uses the RSC allowance to reference a client component symbol below.
import LoadMore from './LoadMore';
import { ShotCardView } from '@/app/ShotCardView';
