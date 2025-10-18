'use client';

import { useState } from 'react';
import ShotCardClient from '@/app/ShotCardClient';

export type ClientShotCardProps = {
    id: string;
    title: string;
    description: string;
    tags: string[];
    designer: { name: string; src: string };
    image: { src: string; alt: string };
};

export default function LoadMore({
    initialCursor,
    category,
}: {
    initialCursor: string;
    category?: string;
}) {
    const [cursor, setCursor] = useState<string | null>(initialCursor);
    const [items, setItems] = useState<ClientShotCardProps[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!cursor) return null;

    async function load() {
        if (!cursor) return;
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            params.set('cursor', cursor);
            if (category && category !== 'all') params.set('category', category);
            const res = await fetch(`/api/projects?${params.toString()}`, { cache: 'no-store' });
            if (!res.ok) throw new Error(`Failed to load: ${res.status}`);
            const data = (await res.json()) as {
                items: ClientShotCardProps[];
                nextCursor?: string;
            };
            setItems((prev) => [...prev, ...data.items]);
            setCursor(data.nextCursor ?? null);
        } catch (e: any) {
            setError(e?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full flex flex-col items-center">
            {/* Newly loaded items render below the initial grid */}
            {items.length > 0 && (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-6">
                    {items.map((c) => (
                        <li key={c.id}>
                            <ShotCardClient
                                title={c.title}
                                description={c.description}
                                tags={c.tags}
                                designer={c.designer}
                                image={c.image}
                            />
                        </li>
                    ))}
                </ul>
            )}

            {error && <div className="text-sm text-red-600 mt-3">{error}</div>}

            {cursor && (
                <button
                    className="px-4 py-2 rounded-md text-sm bg-slate-900 text-white disabled:opacity-50 mt-4"
                    onClick={load}
                    disabled={loading}
                >
                    {loading ? 'Loading…' : 'Load more'}
                </button>
            )}
        </div>
    );
}
