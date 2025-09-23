'use client';

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { SignInResult, signInWithPassword } from '@/app/login/actions';
import { useRouter } from 'next/navigation';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            className="rounded bg-black px-4 py-2 text-white hover:bg-gray-800"
            type="submit"
            disabled={pending}
        >
            {pending ? 'Signing in…' : 'Sign in'}
        </button>
    );
}

export default function LoginForm() {
    const action = async (_prevState: SignInResult, formData: FormData) => {
        return await signInWithPassword(formData);
    };

    const [state, formAction] = useActionState<SignInResult, FormData>(action, {
        success: false,
        error: '',
    });
    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            router.replace('/');
        }
    }, [state, router]);

    return (
        <form action={formAction} className="space-y-4">
            {state && 'error' in state && state.error ? (
                <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
                    {state.error}
                </div>
            ) : null}

            <div>
                <label className="mb-1 block text-sm font-medium">Email or username</label>
                <input
                    className="w-full rounded border px-3 py-2"
                    type="text"
                    name="identifier"
                    required
                />
            </div>
            <div>
                <label className="mb-1 block text-sm font-medium">Password</label>
                <input
                    className="w-full rounded border px-3 py-2"
                    type="password"
                    name="password"
                    required
                />
            </div>
            <SubmitButton />
        </form>
    );
}
