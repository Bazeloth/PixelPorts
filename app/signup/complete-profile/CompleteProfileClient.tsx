'use client';

import { useActionState } from 'react';
import { FieldLabel } from '@/app/signup/complete-profile/FieldLabel';
import { UsernameControl } from '@/app/signup/complete-profile/UsernameControl';
import { createUser } from '@/app/actions/user';

export default function CompleteProfileClient() {
    const [state, formAction, isPending] = useActionState(createUser, null);

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
                            className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            placeholder="e.g., Alex Johnson"
                            autoComplete="name"
                            maxLength={60}
                            required
                            defaultValue={
                                state && 'values' in state ? (state.values?.name ?? '') : ''
                            }
                        />
                        {state && 'errors' in state && state.errors?.name?.length ? (
                            <p className="text-xs text-red-500 mt-1">{state.errors.name[0]}</p>
                        ) : null}
                    </div>

                    <FieldLabel label="Username" sublabel="A unique name for your profile." />
                    <UsernameControl
                        serverError={
                            state && 'errors' in state ? state.errors?.username : undefined
                        }
                    />

                    <button type="submit" disabled={isPending}>
                        Sign Up
                    </button>
                </div>
            </div>
        </form>
    );
}
