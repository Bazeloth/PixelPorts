'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { signOutAction } from '@/app/actions/auth';
import { LogOut, User as UserIcon, BarChart3, Settings as SettingsIcon, Crown } from 'lucide-react';

export type UserMenuProps = {
    avatar: ReactNode;
    displayName: string | null;
};

function SignOutForm({ onSubmitted }: { onSubmitted: () => void }) {
    return (
        <form action={signOutAction} onSubmit={() => onSubmitted?.()}>
            <button
                type="submit"
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center w-full text-left"
                role="menuitem"
                aria-label="Sign out"
            >
                <LogOut className="w-4 h-4 mr-3" aria-hidden />
                Sign out
            </button>
        </form>
    );
}

export default function UserMenu({ avatar, displayName }: UserMenuProps) {
    const [open, setOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);

    // Close on outside click
    useEffect(() => {
        function onDocClick(e: MouseEvent) {
            if (!open) return;
            const target = e.target as Node;
            if (buttonRef.current?.contains(target)) return;
            if (menuRef.current?.contains(target)) return;
            setOpen(false);
        }
        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, [open]);

    // Close on Escape
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') setOpen(false);
        }
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, []);

    return (
        <div className="relative ml-3">
            <div>
                <button
                    ref={buttonRef}
                    onClick={() => setOpen((o) => !o)}
                    className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    aria-label={open ? 'Close user menu' : 'Open user menu'}
                    aria-haspopup="menu"
                    aria-expanded={open}
                >
                    {avatar}
                </button>
            </div>

            {open && (
                <div
                    ref={menuRef}
                    role="menu"
                    aria-label="User menu"
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
                >
                    {displayName && (
                        <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                            <div className="font-medium">{displayName}</div>
                        </div>
                    )}

                    <Link
                        href="/profile"
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        role="menuitem"
                    >
                        <UserIcon className="w-4 h-4 mr-3" aria-hidden />
                        Your Profile
                    </Link>
                    <a
                        href="#"
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        role="menuitem"
                    >
                        <BarChart3 className="w-4 h-4 mr-3" aria-hidden />
                        Analytics
                    </a>
                    <a
                        href="#"
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        role="menuitem"
                    >
                        <SettingsIcon className="w-4 h-4 mr-3" aria-hidden />
                        Settings
                    </a>
                    <a
                        href="#"
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        role="menuitem"
                    >
                        <Crown className="w-4 h-4 mr-3" aria-hidden />
                        Upgrade to Pro
                    </a>
                    <div className="border-t border-gray-200">
                        <SignOutForm onSubmitted={() => setOpen(false)} />
                    </div>
                </div>
            )}
        </div>
    );
}
