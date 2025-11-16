'use client';

import { useActionState, useEffect, useMemo, useState } from 'react';
import { FieldLabel } from '@/app/signup/complete-profile/FieldLabel';
import { UsernameControl } from '@/app/signup/complete-profile/UsernameControl';
import { createUserProfile } from '@/app/actions/user';
import { useRouter } from 'next/navigation';
import { createSupabaseClient } from '@/lib/supabase/client';

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

    type AvatarChoice = 'none' | 'google' | 'uploaded';
    const [choice, setChoice] = useState<AvatarChoice>(googlePictureUrl ? 'google' : 'none');
    const [previewUrl, setPreviewUrl] = useState<string>(googlePictureUrl || '');
    const [uploadedFileExt, setUploadedFileExt] = useState<string>('');

    useEffect(() => {
        if (state && 'success' in state && state.success) {
            router.replace('/');
        }
    }, [state, router]);

    const values = (state && 'values' in state ? state.values : undefined) ?? {};
    const errors = (state && 'errors' in state ? state.errors : undefined) ?? {};

    const initials = useMemo(() => {
        const n = (values.name ?? name ?? '').trim();
        if (!n) return '';
        const parts = n.split(/\s+/);
        return (parts[0][0] + (parts[parts.length - 1]?.[0] || '')).toUpperCase();
    }, [values.name, name]);

    async function handleUploadFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        const supabase = await createSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
        const path = `${user.id}/avatar.${ext}`;

        const { error: uploadError } = await supabase
            .storage
            .from('avatars')
            .upload(path, file, { cacheControl: '3600', upsert: true, contentType: file.type });
        if (uploadError) return;

        const { data: pub } = supabase.storage.from('avatars').getPublicUrl(path);
        setChoice('uploaded');
        setPreviewUrl(pub.publicUrl);
        setUploadedFileExt(ext);
    }

    function clearPhoto() {
        setChoice('none');
        setPreviewUrl('');
        setUploadedFileExt('');
    }

    function useGooglePhoto() {
        if (!googlePictureUrl) return;
        setChoice('google');
        setPreviewUrl(googlePictureUrl);
        setUploadedFileExt('');
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
                        const res = await fetch(`/api/profiles/fetch-and-store-avatar?src=${encodeURIComponent(googlePictureUrl)}`);
                        if (res.ok) {
                            const { fileExt } = await res.json();
                            if (fileExt) fd.set('avatar_file_ext', fileExt);
                        }
                    } catch {}
                }

                await formAction(fd);
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

                    <FieldLabel label="Avatar" sublabel="Optional. Prefilled from Google if available. You can clear or replace it." />
                    <div className="space-y-3">
                        <div className="flex items-center gap-4">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Avatar preview" className="w-16 h-16 rounded-full object-cover border" />
                            ) : (
                                <div
                                    className="w-16 h-16 rounded-full flex items-center justify-center text-white font-semibold border"
                                    style={{
                                        background: 'linear-gradient(135deg, hsl(265,75%,60%), hsl(285,75%,60%))',
                                        fontSize: 16 * 0.6,
                                    }}
                                    aria-label="Avatar preview"
                                >
                                    {(() => {
                                        const n = (values.name ?? name ?? '').trim();
                                        if (!n) return 'PP';
                                        const parts = n.split(/\s+/);
                                        return (parts[0][0] + (parts[parts.length - 1]?.[0] || '')).toUpperCase();
                                    })()}
                                </div>
                            )}

                            <div className="flex flex-wrap gap-2">
                                <label className="px-3 py-1 border rounded cursor-pointer">
                                    <input type="file" accept="image/*" className="hidden" onChange={handleUploadFile} />
                                    Upload photo
                                </label>
                                {googlePictureUrl && choice !== 'google' && (
                                    <button type="button" className="px-3 py-1 border rounded" onClick={useGooglePhoto}>
                                        Use Google photo
                                    </button>
                                )}
                                {previewUrl && (
                                    <button type="button" className="px-3 py-1 border rounded" onClick={clearPhoto}>
                                        Clear photo
                                    </button>
                                )}
                            </div>
                        </div>
                        <input type="hidden" name="avatar_file_ext" value={choice === 'uploaded' ? uploadedFileExt : ''} />
                    </div>

                    <div className="col-span-2">
                        <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white disabled:opacity-50" disabled={isPending}>
                            {isPending ? 'Saving…' : 'Sign Up'}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
