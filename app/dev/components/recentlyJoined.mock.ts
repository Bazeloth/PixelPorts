export type MockUser = {
    id: number;
    name: string;
    title: string;
    joined: string;
    initials: string;
    gradient: string; // Tailwind gradient classes
};

export const recentlyJoinedMockUsers: MockUser[] = [
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
