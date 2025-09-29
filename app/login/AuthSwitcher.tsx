'use client';

import { useState } from 'react';
import OAuthButtons from '@/app/login/OAuthButtons';
import LoginForm from '@/app/login/LoginForm';
import SignUpForm from '@/app/signup/SignUpForm';

export default function AuthSwitcher() {
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');

    const toggleMode = () => setMode((m) => (m === 'signin' ? 'signup' : 'signin'));

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Sign In Form */}
                <div id="signin-form" className={mode === 'signin' ? '' : 'hidden'}>
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
                            Welcome back
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Sign in to your Pixelports account
                        </p>
                    </div>

                    {/* Social Sign In */}
                    <div className="mt-8 space-y-3">
                        <OAuthButtons />
                    </div>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center" aria-hidden>
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-gray-50 text-gray-500">
                                    Or continue with email
                                </span>
                            </div>
                        </div>
                    </div>

                    <LoginForm />

                    <div className="text-center mt-6">
                        <span className="text-sm text-gray-600">Don't have an account? </span>
                        <button
                            type="button"
                            onClick={toggleMode}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Sign up for free
                        </button>
                    </div>
                </div>

                {/* Sign Up Form */}
                <div id="signup-form" className={mode === 'signup' ? '' : 'hidden'}>
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
                            Create your account
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Join Pixelports and showcase your design work
                        </p>
                    </div>

                    {/* Social Sign Up */}
                    <div className="mt-8 space-y-3">
                        <OAuthButtons />
                    </div>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center" aria-hidden>
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-gray-50 text-gray-500">
                                    Or create account with email
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Reuse existing SignUpForm (validations + actions) */}
                    <div className="mt-8 space-y-6">
                        <SignUpForm />
                    </div>

                    <div className="text-center mt-6">
                        <span className="text-sm text-gray-600">Already have an account? </span>
                        <button
                            type="button"
                            onClick={toggleMode}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Sign in
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
