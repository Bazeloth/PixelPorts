'use client';

import { createContext, useContext, ReactNode } from 'react';

export type UserDetails = {
    avatar_file_ext: string;
    name: string;
};

export type User = {
    id: string;
    email: string;
    details: UserDetails;
};

const UserContext = createContext<User | null>(null);

export function useUser() {
    return useContext(UserContext);
}

export function UserProvider({ value, children }: { value: User | null; children: ReactNode }) {
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default UserContext;
