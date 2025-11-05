'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plus } from 'lucide-react';
import Icon from '@/app/Icon';
import UserAvatar from '@/app/UserAvatar';
import ClickAwayCloseDetails from '@/app/ClickAwayCloseDetails';

// Upload actions (kept here to centralize header right-side variants)
function UploadHeaderActions() {
    const onSave = () => {
        window.dispatchEvent(new CustomEvent('upload:saveDraft'));
    };
    const onPublish = () => {
        window.dispatchEvent(new CustomEvent('upload:publish'));
    };

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

// Logged-in default actions
function UserHeaderActions({ user }: { user: any }) {
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
                            userId={user?.id}
                            displayName={user?.profile?.name ?? undefined}
                            avatarFileExt={user?.profile?.avatar_file_ext ?? undefined}
                            size={36}
                            className="ring-1 ring-neutral-200 hover:ring-neutral-300 transition"
                        />
                    </summary>
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50">
                        <Link
                            href={user?.profile?.username ? `/profile/${user.profile.username}` : '/signup/complete-profile'}
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

// Guest default actions
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

function HeaderRightSwitchBase({
    isLoggedIn,
    page,
    children,
}: {
    isLoggedIn: boolean;
    page?: string;
    children?: React.ReactNode;
}) {
    const pathname = usePathname();
    const resolvedPage = page ?? ((pathname === '/upload' || pathname?.startsWith('/upload/')) ? 'upload' : undefined);

    // Extract named children if provided
    const childArray = React.Children.toArray(children) as React.ReactElement[];
    const uploadChild = childArray.find(
        (c) => React.isValidElement(c) && c.type === UploadHeaderActions
    );
    const userChild = childArray.find(
        (c) => React.isValidElement(c) && c.type === UserHeaderActions
    );
    const guestChild = childArray.find(
        (c) => React.isValidElement(c) && c.type === GuestHeaderActions
    );

    if (resolvedPage === 'upload' && isLoggedIn) {
        return uploadChild ?? <UploadHeaderActions />;
    }
    if (isLoggedIn) {
        return userChild ?? null;
    }
    return guestChild ?? null;
}

// Attach compound subcomponent API
const HeaderRightSwitch = Object.assign(HeaderRightSwitchBase, {
    UploadActions: UploadHeaderActions,
    UserActions: UserHeaderActions,
    GuestActions: GuestHeaderActions,
});

export default HeaderRightSwitch;
