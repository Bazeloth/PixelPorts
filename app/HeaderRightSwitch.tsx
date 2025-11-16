'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plus } from 'lucide-react';
import Icon from '@/app/Icon';
import UserAvatar from '@/app/UserAvatar';
import ClickAwayCloseDetails from '@/app/ClickAwayCloseDetails';
import { User } from '@/lib/supabase/getUserAndProfile';
import { useUploadActions } from '@/app/upload/UploadActionsContext';

export const dynamic = 'force-dynamic';

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
                className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
                Publish
            </button>
        </div>
    );
}

function CompleteProfileHeaderActions() {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="flex items-center">
            <button
                type="button"
                onClick={() => setShowModal(true)}
                className="py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
            >
                Sign out
            </button>

            {showModal && (
                <div className="fixed inset-0 z-[60]">
                    <div
                        className="absolute inset-0 bg-black/30"
                        aria-hidden="true"
                        onClick={() => setShowModal(false)}
                    />
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                        <div className="w-full max-w-md rounded-xl bg-white shadow-xl border border-gray-200">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Are you sure?
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Your profile isn't complete yet. You can finish it anytime by
                                    logging back in.
                                </p>
                            </div>
                            <div className="px-6 pb-6 pt-2 flex justify-end gap-3">
                                <button
                                    type="button"
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
                                    onClick={() => setShowModal(false)}
                                >
                                    Continue editing
                                </button>
                                <button
                                    type="button"
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 cursor-pointer"
                                    onClick={() => {
                                        window.location.href = '/logout';
                                    }}
                                >
                                    Yes, sign out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function UserHeaderActions({ user }: { user: User }) {
    return (
        <div className="flex items-center space-x-4">
            {user.profile ? (
                <Link
                    href="/upload"
                    className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    aria-label="Upload a new shot"
                >
                    <Icon icon={Plus} size="sm" ariaLabel="Upload" className="mr-1" /> Upload
                </Link>
            ) : null}

            <ClickAwayCloseDetails>
                <details className="relative" data-close-on-click-away>
                    <summary className="list-none cursor-pointer">
                        {(() => {
                            const ext = user.profile?.avatar_file_ext ?? undefined;
                            const displayName = user.profile?.name ?? undefined;
                            if (ext) {
                                return (
                                    <UserAvatar
                                        userId={user.id}
                                        avatarFileExt={ext}
                                        displayName={displayName}
                                        size={36}
                                        className="ring-1 ring-neutral-200 hover:ring-neutral-300 transition"
                                    />
                                );
                            }
                            return (
                                <UserAvatar
                                    userId={user.id}
                                    displayName={displayName}
                                    size={36}
                                    className="ring-1 ring-neutral-200 hover:ring-neutral-300 transition"
                                />
                            );
                        })()}
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
    const isCompleteProfile = pathname === '/signup/complete-profile';
    const resolvedPage =
        pathname === '/upload' || pathname?.startsWith('/upload/') ? 'upload' : undefined;

    const { saveDraft: onSave, publishShot: onPublish } = useUploadActions();

    if (isCompleteProfile) {
        return <CompleteProfileHeaderActions />;
    }

    if (resolvedPage === 'upload' && user) {
        return <UploadHeaderActions onSave={onSave} onPublish={onPublish} />;
    }

    if (user) {
        return <UserHeaderActions user={user} />;
    }

    return <GuestHeaderActions />;
}
