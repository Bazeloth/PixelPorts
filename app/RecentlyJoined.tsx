'use client';

import { useEffect, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';
import { formatJoinRelative, pickGradientFromId } from '@/lib/utils/date';
import { initialsFromName } from '@/lib/utils/username';

type UIUser = {
    id: string;
    name: string;
    username: string;
    joinedLabel: string;
    initials: string;
    gradient: string; // Tailwind gradient classes
};

export default function RecentlyJoined() {
    const [users, setUsers] = useState<UIUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [following, setFollowing] = useState<Record<string, boolean>>({});

    useEffect(() => {
        let ignore = false;
        (async () => {
            try {
                const supabase = await createSupabaseClient();
                const { data, error } = await supabase
                    .from('userprofiles')
                    .select('id, name, username, created_at')
                    .order('created_at', { ascending: false })
                    .limit(6);
                if (error) throw error;
                if (ignore) return;
                const mapped: UIUser[] = (data ?? []).map((p: any) => ({
                    id: p.id,
                    name: p.name ?? 'Unknown',
                    username: p.username ?? 'unknown',
                    joinedLabel: formatJoinRelative(p.created_at),
                    initials: initialsFromName(p.name ?? p.username ?? ''),
                    gradient: pickGradientFromId(p.id),
                }));
                setUsers(mapped);
            } catch (e: any) {
                setError(e?.message ?? 'Failed to load recently joined');
            } finally {
                if (!ignore) setLoading(false);
            }
        })();
        return () => {
            ignore = true;
        };
    }, []);

    const toggleFollow = (id: string) => {
        setFollowing((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading &&
                Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100 animate-pulse"
                    >
                        <div className="w-20 h-20 rounded-full bg-gray-200 mx-auto mb-4" />
                        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-2" />
                        <div className="h-3 bg-gray-100 rounded w-1/3 mx-auto mb-4" />
                        <div className="h-9 bg-gray-200 rounded" />
                    </div>
                ))}

            {!loading && error && (
                <div className="col-span-full text-center text-sm text-red-600">{error}</div>
            )}

            {!loading &&
                !error &&
                users.map((user) => {
                    const isFollowing = !!following[user.id];
                    return (
                        <div
                            key={user.id}
                            className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100 transition-all duration-300"
                        >
                            <div className="relative inline-block mb-4">
                                <div
                                    className={`w-20 h-20 rounded-full bg-gradient-to-br ${user.gradient} flex items-center justify-center text-white text-3xl font-semibold`}
                                >
                                    {user.initials}
                                </div>
                                <span className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full border-2 border-white uppercase">
                                    New
                                </span>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {user.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">@{user.username}</p>
                            <p className="text-xs text-gray-400 mb-4">Joined {user.joinedLabel}</p>

                            <button
                                onClick={() => toggleFollow(user.id)}
                                className={
                                    isFollowing
                                        ? 'w-full py-2.5 px-6 rounded-lg text-sm font-semibold transition-all duration-200 bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        : 'w-full py-2.5 px-6 rounded-lg text-sm font-semibold transition-all duration-200 bg-indigo-600 text-white hover:bg-indigo-700'
                                }
                            >
                                {isFollowing ? 'Following' : 'Follow'}
                            </button>
                        </div>
                    );
                })}
        </div>
    );
}
