'use client';

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { SignInResult, signInWithPassword } from '@/app/login/actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 disabled:opacity-60"
            type="submit"
            disabled={pending}
        >
            {pending ? 'Signing in…' : 'Sign in to your account'}
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
        <form action={formAction} className="mt-8 space-y-6">
            {state && 'error' in state && state.error ? (
                <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
                    {state.error}
                </div>
            ) : null}

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 bg-white placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        type="email"
                        name="email"
                        autoComplete="email"
                        inputMode="email"
                        placeholder="you@example.com"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 bg-white placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        required
                    />
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
                </div>
                <div className="text-sm">
                    <Link href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Forgot your password?</Link>
                </div>
            </div>

            <SubmitButton />

        </form>
    );
}
