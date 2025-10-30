'use client';

import { useActionState, useEffect } from 'react';
import { FieldLabel } from '@/app/signup/complete-profile/FieldLabel';
import { UsernameControl } from '@/app/signup/complete-profile/UsernameControl';
import { createUserProfile } from '@/app/actions/user';
import { useRouter } from 'next/navigation';

export default function CompleteProfileClient() {
    const [state, formAction, isPending] = useActionState(createUserProfile, null);
    const router = useRouter();

    useEffect(() => {
        if (state && 'success' in state && state.success) {
            router.replace('/');
        }
    }, [state, router]);

    const values = (state && 'values' in state ? state.values : undefined) ?? {};
    const errors = (state && 'errors' in state ? state.errors : undefined) ?? {};

    return (
        <form action={formAction}>
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
                            defaultValue={values.name ?? ''}
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
                        defaultValue={values.username ?? ''}
                        serverError={errors.username}
                    />

                    <button type="submit" disabled={isPending}>
                        {isPending ? 'Saving…' : 'Sign Up'}
                    </button>
                </div>
            </div>
        </form>
    );
}
