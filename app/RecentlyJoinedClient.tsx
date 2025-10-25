'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { RecentlyJoinedUser } from '@/app/types';
import { setFollow } from '@/app/actions/follow';
import { track, Events } from '@/lib/analytics';

async function fetchRecentlyJoined(): Promise<RecentlyJoinedUser[]> {
    const res = await fetch('/api/recently-joined', { cache: 'no-store' });
    if (!res.ok) {
        let message = 'Failed to load recently joined';
        try {
            const body = await res.json();
            if (body?.error) message = String(body.error);
        } catch {}
        throw new Error(message);
    }
    const body = await res.json();
    return (body?.users ?? []) as RecentlyJoinedUser[];
}

export default function RecentlyJoinedClient({ users }: { users: RecentlyJoinedUser[] }) {
    const [following, setFollowing] = useState<Record<string, boolean>>({});
    const [pending, setPending] = useState<Record<string, boolean>>({});
    const qc = useQueryClient();

    const { data, error, isLoading, isFetching } = useQuery({
        queryKey: ['recently-joined'],
        queryFn: fetchRecentlyJoined,
        initialData: users,
        staleTime: 60_000,
    });

    const toggleFollow = async (id: string, isCurrentlyFollowing: boolean) => {
        const next = !isCurrentlyFollowing;
        // Optimistic update
        setFollowing((prev) => ({ ...prev, [id]: next }));
        setPending((prev) => ({ ...prev, [id]: true }));

        try {
            const res = await setFollow(id, next);
            if (!('ok' in res) || !res.ok) {
                throw new Error((res as any).error || 'Failed to persist');
            }
            // Track only follow (not unfollow)
            if (next) {
                track(Events.UserFollowed, { target_user_id: id, source: 'recently_joined' });
            }
        } catch (_e) {
            // Revert on error
            setFollowing((prev) => ({ ...prev, [id]: isCurrentlyFollowing }));
        } finally {
            setPending((prev) => ({ ...prev, [id]: false }));
            // Pull fresh truth from the server
            await qc.invalidateQueries({ queryKey: ['recently-joined'] });
        }
    };

    if ((isLoading && !data?.length) || (isFetching && !data?.length)) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
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
            </div>
        );
    }

    if (error && !data?.length) {
        return <div className="col-span-full text-sm text-red-600">{(error as Error).message}</div>;
    }

    if (!data?.length) {
        return (
            <div className="col-span-full text-sm text-gray-500">No recently joined users yet.</div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.map((user) => {
                const isFollowing = following[user.id] ?? user.isFollowing ?? false;
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

                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{user.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">@{user.username}</p>
                        <p className="text-xs text-gray-400 mb-4">Joined {user.joinedLabel}</p>

                        <button
                            disabled={!!pending[user.id]}
                            onClick={() => toggleFollow(user.id, isFollowing)}
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
