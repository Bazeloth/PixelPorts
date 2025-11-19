'use client';

import { startTransition, useActionState, useEffect, useMemo, useState } from 'react';
import { FieldLabel } from '@/app/signup/complete-profile/FieldLabel';
import { UsernameControl } from '@/app/signup/complete-profile/UsernameControl';
import { createUserProfile } from '@/app/actions/user';
import { useRouter } from 'next/navigation';
import { createSupabaseClient } from '@/lib/supabase/client';
import { logger } from '@/lib/utils/console';
import UserAvatar from '@/app/UserAvatar';
import { getUserAndProfile } from '@/lib/supabase/getUserAndProfile';

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const ALLOWED_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'webp']);
const MIME_TO_EXT: Record<string, string> = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/webp': 'webp',
};
const MAX_AVATAR_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Single source of truth for the file input accept attribute derived from the constants above
const ACCEPT_FILE_TYPES = [
    ...Array.from(ALLOWED_EXTENSIONS, (ext) => `.${ext}`),
    ...ALLOWED_MIME_TYPES,
].join(',');

type Props = {
    defaultFullName?: string;
    defaultUsername?: string;
    googlePictureUrl?: string;
};

export default function CompleteProfileClient({
    defaultFullName = '',
    defaultUsername = '',
    googlePictureUrl = '',
}: Props) {
    const [state, formAction, isPending] = useActionState(createUserProfile, null);
    const router = useRouter();

    const [name, setName] = useState(defaultFullName);
    const [currentUserId, setCurrentUserId] = useState<string>('');

    type AvatarChoice = 'none' | 'google' | 'uploaded';
    const [choice, setChoice] = useState<AvatarChoice>(googlePictureUrl ? 'google' : 'none');
    const [previewUrl, setPreviewUrl] = useState<string>(googlePictureUrl || '');
    const [uploadedFileExt, setUploadedFileExt] = useState<string>('');
    const [avatarError, setAvatarError] = useState<string>('');

    useEffect(() => {
        if (state && 'success' in state && state.success) {
            router.replace('/');
        }
    }, [state, router]);

    // Fetch current user ID for UserAvatar gradient seeding
    useEffect(() => {
        (async () => {
            const user = await getUserAndProfile();
            if (user?.id) {
                setCurrentUserId(user.id);
                return;
            }

            window.location.href = '/signin';
        })();
    }, []);

    const values = (state && 'values' in state ? state.values : undefined) ?? {};
    const errors = (state && 'errors' in state ? state.errors : undefined) ?? {};
    const message = state && 'message' in state ? state.message : undefined;

    async function handleUploadFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate size
        if (file.size > MAX_AVATAR_FILE_SIZE) {
            setAvatarError(
                `Image is too large. Maximum size is ${Math.round(MAX_AVATAR_FILE_SIZE / (1024 * 1024))}MB.`
            );
            return;
        }

        // Validate MIME and extension
        const mimeOk = ALLOWED_MIME_TYPES.includes(
            file.type as (typeof ALLOWED_MIME_TYPES)[number]
        );
        const nameExt = (file.name.split('.').pop() || '').toLowerCase();
        const extOk = nameExt ? ALLOWED_EXTENSIONS.has(nameExt) : false;
        if (!mimeOk && !extOk) {
            setAvatarError(
                `Unsupported image format. Allowed: ${Array.from(ALLOWED_EXTENSIONS, (ext) => `.${ext}`).join(',')}.`
            );
            return;
        }

        // Prefer extension derived from MIME, fallback to filename ext
        const chosenExt = MIME_TO_EXT[file.type] || (extOk ? nameExt : 'jpg');

        const supabase = await createSupabaseClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
            setAvatarError('You must be signed in to upload an avatar.');
            return;
        }

        const path = `${user.id}.${chosenExt}`;

        const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, {
            cacheControl: '3600',
            upsert: true,
            contentType: file.type || `image/${chosenExt}`,
        });
        if (uploadError) {
            logger.Error('Failed to upload avatar: ', uploadError.message || 'unknown error');
            setAvatarError(uploadError.message || 'Failed to upload image. Please try again.');
            return;
        }

        const { data: pub } = supabase.storage.from('avatars').getPublicUrl(path);
        setChoice('uploaded');
        setPreviewUrl(pub.publicUrl);
        setUploadedFileExt(chosenExt);
        setAvatarError('');
    }

    function clearPhoto() {
        setChoice('none');
        setPreviewUrl('');
        setUploadedFileExt('');
        setAvatarError('');
    }

    return (
        <form
            action={async (fd: FormData) => {
                if (!fd.get('name') && name) fd.set('name', name);
                if (!fd.get('username') && defaultUsername) fd.set('username', defaultUsername);

                if (choice === 'uploaded' && uploadedFileExt) {
                    fd.set('avatar_file_ext', uploadedFileExt);
                } else if (choice === 'google' && googlePictureUrl) {
                    try {
                        const res = await fetch(
                            `/api/profiles/fetch-and-store-avatar?src=${encodeURIComponent(googlePictureUrl)}`
                        );
                        if (res.ok) {
                            const { fileExt } = await res.json();
                            if (fileExt) fd.set('avatar_file_ext', fileExt);
                        }
                    } catch {}
                }

                startTransition(() => {
                    formAction(fd);
                });
            }}
        >
            <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                    Basic Information
                </h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 items-start">
                    <FieldLabel label="Full name" sublabel="Your display name." />
                    <div>
                        <input
                            type="text"
                            name="name"
                            defaultValue={values.name ?? name ?? ''}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            placeholder="e.g., Alex Johnson"
                            autoComplete="name"
                            maxLength={60}
                            required
                        />
                        {errors.name?.length ? (
                            <p className="text-xs text-red-500 mt-1">{errors.name[0]}</p>
                        ) : null}
                    </div>

                    <FieldLabel label="Username" sublabel="A unique name for your profile." />
                    <UsernameControl
                        defaultValue={values.username ?? defaultUsername ?? ''}
                        serverError={errors.username}
                    />

                    <FieldLabel
                        label="Avatar"
                        sublabel="Optional. Prefilled from Google if available. You can clear or replace it."
                    />
                    <div className="space-y-3">
                        <div className="flex items-center gap-4">
                            {(() => {
                                const displayName = (values.name ?? name ?? '') || undefined;
                                if (choice === 'uploaded' && uploadedFileExt) {
                                    return (
                                        <UserAvatar
                                            userId={currentUserId}
                                            avatarFileExt={uploadedFileExt}
                                            displayName={displayName}
                                            size={64}
                                            className="border"
                                        />
                                    );
                                }
                                if (previewUrl) {
                                    return (
                                        <UserAvatar
                                            imageUrl={previewUrl}
                                            displayName={displayName}
                                            size={64}
                                            className="border"
                                        />
                                    );
                                }
                                return (
                                    <UserAvatar
                                        userId={currentUserId}
                                        displayName={displayName}
                                        size={64}
                                        className="border"
                                    />
                                );
                            })()}

                            <div className="flex flex-wrap gap-2">
                                <label className="px-3 py-1 border rounded cursor-pointer">
                                    <input
                                        type="file"
                                        accept={ACCEPT_FILE_TYPES}
                                        className="hidden"
                                        onChange={handleUploadFile}
                                    />
                                    {previewUrl ? 'Change photo' : 'Upload photo'}
                                </label>
                                {previewUrl && (
                                    <button
                                        type="button"
                                        className="px-3 py-1 border rounded"
                                        onClick={clearPhoto}
                                    >
                                        Clear photo
                                    </button>
                                )}
                                {avatarError && (
                                    <p className="w-full text-xs text-red-600 mt-1">
                                        {avatarError}
                                    </p>
                                )}
                            </div>
                        </div>
                        <input
                            type="hidden"
                            name="avatar_file_ext"
                            value={choice === 'uploaded' ? uploadedFileExt : ''}
                        />
                    </div>

                    <div className="col-span-2">
                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-indigo-600 text-white disabled:opacity-50"
                            disabled={isPending}
                        >
                            {isPending ? 'Saving…' : 'Continue'}
                        </button>
                    </div>

                    {message && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                            <svg
                                className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <div className="flex-1">
                                <p className="text-sm text-red-800">{message}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </form>
    );
}
