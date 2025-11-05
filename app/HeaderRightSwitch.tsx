'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plus } from 'lucide-react';
import Icon from '@/app/Icon';
import UserAvatar from '@/app/UserAvatar';
import ClickAwayCloseDetails from '@/app/ClickAwayCloseDetails';
import { User } from '@/lib/supabase/getUserAndProfile';
import { useUploadActions } from '@/app/upload/UploadActionsContext';

function UploadHeaderActions({ onSave, onPublish }: { onSave: () => void; onPublish: () => void }) {
    return (
        <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium">
                Cancel
            </Link>
            <button
                type="button"
                onClick={onSave}
                className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:border-gray-400 font-medium"
            >
                Save draft
            </button>
            <button
                type="button"
                onClick={onPublish}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 font-medium"
            >
                Publish
            </button>
        </div>
    );
}

function UserHeaderActions({ user }: { user: User }) {
    return (
        <div className="flex items-center space-x-4">
            <Link
                href="/signup/complete-profile"
                className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                aria-label="Upload a new shot"
            >
                <Icon icon={Plus} size="sm" ariaLabel="Upload" className="mr-1" /> Upload
            </Link>

            <ClickAwayCloseDetails>
                <details className="relative" data-close-on-click-away>
                    <summary className="list-none cursor-pointer">
                        <UserAvatar
                            userId={user.id}
                            displayName={user.profile?.name ?? undefined}
                            avatarFileExt={user.profile?.avatar_file_ext ?? undefined}
                            size={36}
                            className="ring-1 ring-neutral-200 hover:ring-neutral-300 transition"
                        />
                    </summary>
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50">
                        <Link
                            href={
                                user.profile?.username
                                    ? `/profile/${user.profile.username}`
                                    : '/signup/complete-profile'
                            }
                            className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                        >
                            Profile
                        </Link>
                        <a
                            href="/logout"
                            className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                            rel="nofollow"
                        >
                            Sign out
                        </a>
                    </div>
                </details>
            </ClickAwayCloseDetails>
        </div>
    );
}

function GuestHeaderActions() {
    return (
        <div className="flex items-center space-x-4">
            <Link
                href="/login"
                className="px-5 py-2.5 bg-transparent text-neutral-900 text-sm font-medium rounded-lg border border-neutral-200 hover:border-neutral-900 transition-colors"
            >
                Sign In
            </Link>
            <Link
                href="/signup"
                className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
                Create Account
            </Link>
        </div>
    );
}

export default function HeaderRightSwitch({ user }: { user: User | null }) {
    const pathname = usePathname();
    const resolvedPage =
        pathname === '/upload' || pathname?.startsWith('/upload/') ? 'upload' : undefined;

    const { saveDraft: onSave, publishShot: onPublish } = useUploadActions();

    if (resolvedPage === 'upload' && user) {
        return <UploadHeaderActions onSave={onSave} onPublish={onPublish} />;
    }

    if (user) {
        return <UserHeaderActions user={user} />;
    }

    return <GuestHeaderActions />;
}
