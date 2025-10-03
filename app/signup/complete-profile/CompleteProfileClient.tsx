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
