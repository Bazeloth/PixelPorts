'use client';

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import type { SignUpResult } from '@/app/login/actions';
import { signUpWithEmail } from '@/app/login/actions';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            className="rounded bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-60"
            type="submit"
            disabled={pending}
        >
            {pending ? 'Creating account…' : 'Create account'}
        </button>
    );
}

export default function SignUpForm() {
    const action = async (_prev: SignUpResult, formData: FormData) => signUpWithEmail(formData);

    const [state, formAction] = useActionState<SignUpResult, FormData>(action, {
        success: false,
        error: '',
    } as SignUpResult);

    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            if ('needsVerification' in state && state.needsVerification) {
                const email = state.email ? `?email=${encodeURIComponent(state.email)}` : '';
                router.replace(`/signup/verify${email}`);
            } else {
                router.replace('/');
            }
        }
    }, [state, router]);

    const fe = state && 'fieldErrors' in state ? (state.fieldErrors ?? {}) : {};

    return (
        <form action={formAction} className="space-y-4">
            {state && !state.success && 'error' in state && state.error ? (
                <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
                    {state.error}
                </div>
            ) : null}

            <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="email">
                    Email
                </label>
                <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="w-full rounded border px-3 py-2"
                    required
                    aria-invalid={!!fe.email}
                    aria-describedby={fe.email ? 'email-error' : undefined}
                />
                {fe.email ? (
                    <p id="email-error" className="mt-1 text-xs text-red-600">
                        {fe.email}
                    </p>
                ) : null}
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="password">
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    className="w-full rounded border px-3 py-2"
                    required
                    aria-invalid={!!fe.password}
                    aria-describedby={fe.password ? 'password-error' : undefined}
                />
                {fe.password ? (
                    <p id="password-error" className="mt-1 text-xs text-red-600">
                        {fe.password}
                    </p>
                ) : (
                    <p className="mt-1 text-xs text-gray-500">
                        At least 8 characters with a number
                    </p>
                )}
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="confirm">
                    Confirm password
                </label>
                <input
                    id="confirm"
                    name="confirm"
                    type="password"
                    autoComplete="new-password"
                    className="w-full rounded border px-3 py-2"
                    required
                    aria-invalid={!!fe.confirm}
                    aria-describedby={fe.confirm ? 'confirm-error' : undefined}
                />
                {fe.confirm ? (
                    <p id="confirm-error" className="mt-1 text-xs text-red-600">
                        {fe.confirm}
                    </p>
                ) : null}
            </div>

            <SubmitButton />
        </form>
    );
}
