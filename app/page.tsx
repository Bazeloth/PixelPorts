import { ShotThumbnail } from '@/app/components/ShotThumbnail';
import { findFirstImageSource, getShotCardsCached } from '@/lib/shotUtils';
import { getSupabase } from '@/lib/supabase';
import { ShotCard } from '@/lib/ui.types';

export default async function Home() {
    const supabase = await getSupabase();
    const shots = await getShotCardsCached();

    const imageDataByShot = shots
        .map((shot) => {
            const src = findFirstImageSource(supabase, shot.blocks);
            return src ? { ...shot, src } : null;
        })
        .filter((shot): shot is ShotCard & { src: string } => shot != null);

    return (
        <main className="p-6">
            {imageDataByShot.length === 0 ? (
                <div className="text-gray-500">No shots yet.</div>
            ) : (
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {imageDataByShot.map((shot) => (
                        <li key={shot.id} className="rounded-lg border bg-white p-4">
                            <div className="mb-2 text-lg font-medium">{shot.title}</div>
                            <ShotThumbnail src={shot.src} alt={shot.title} />
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}
