export type RecentlyJoinedUser = {
    id: string;
    name: string;
    username: string;
    joinedLabel: string;
    initials: string;
    gradient: string; // Tailwind gradient classes
    isFollowing?: boolean;
};
