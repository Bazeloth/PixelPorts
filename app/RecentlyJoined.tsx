'use client';

import { useState } from 'react';

type User = {
    id: number;
    name: string;
    title: string;
    joined: string;
    initials: string;
    gradient: string; // tailwind gradient classes like 'from-purple-500 to-purple-700'
};

const users: User[] = [
    {
        id: 1,
        name: 'Maya Kowalski',
        title: 'Product Designer',
        joined: '2 hours ago',
        initials: 'MK',
        gradient: 'from-purple-500 to-purple-700',
    },
    {
        id: 2,
        name: 'James Liu',
        title: 'UI/UX Designer',
        joined: '5 hours ago',
        initials: 'JL',
        gradient: 'from-pink-500 to-red-500',
    },
    {
        id: 3,
        name: 'Sofia Patel',
        title: 'Graphic Designer',
        joined: 'today',
        initials: 'SP',
        gradient: 'from-blue-400 to-cyan-400',
    },
    {
        id: 4,
        name: 'Alex Rodriguez',
        title: 'Brand Designer',
        joined: 'today',
        initials: 'AR',
        gradient: 'from-pink-400 to-yellow-400',
    },
];

export default function RecentlyJoined() {
    const [following, setFollowing] = useState<Record<number, boolean>>({});

    const toggleFollow = (id: number) => {
        setFollowing((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {users.map((user) => {
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
                            <p className="text-sm text-gray-600 mb-3">{user.title}</p>
                            <p className="text-xs text-gray-400 mb-4">Joined {user.joined}</p>

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
        </>
    );
}
