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
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 disabled:opacity-60 cursor-pointer"
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
                router.replace(`/signup/verify?email=${encodeURIComponent(state.email)}`);
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
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="email">
                    Email
                </label>
                <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 bg-white placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
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
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="password">
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 bg-white placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
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
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="confirm">
                    Confirm password
                </label>
                <input
                    id="confirm"
                    name="confirm"
                    type="password"
                    autoComplete="new-password"
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 bg-white placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200"
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
