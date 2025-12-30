'use client';

import OAuthButtons from '@/app/login/OAuthButtons';
import LoginForm from '@/app/login/LoginForm';
import SignUpForm from '@/app/signup/SignUpForm';
import Link from 'next/link';
import { clientEnv } from '@/env/client';

export type AuthMode = 'signin' | 'signup';

export default function AuthPage({ mode }: { mode: AuthMode }) {
    if (!clientEnv.NEXT_PUBLIC_ENABLE_FULL_SITE) {
        return null;
    }

    const isSignIn = mode === 'signin';

    const header = isSignIn
        ? { title: 'Welcome back', subtitle: 'Sign in to your Pixelports account' }
        : {
              title: 'Welcome to PixelPorts',
              subtitle: 'Join the community of designers and creators',
          };

    const dividerText = isSignIn ? 'Or continue with email' : 'Or create account with email';

    const footer = isSignIn
        ? { label: "Don't have an account? ", href: '/signup', cta: 'Sign up for free' }
        : { label: 'Already have an account? ', href: '/login', cta: 'Sign in' };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
                        {header.title}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">{header.subtitle}</p>
                </div>

                {/* Social */}
                <div className="mt-8 space-y-3">
                    <OAuthButtons />
                </div>

                {/* Divider */}
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center" aria-hidden>
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-50 text-gray-500">{dividerText}</span>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="mt-8 space-y-6">{isSignIn ? <LoginForm /> : <SignUpForm />}</div>

                {/* Footer */}
                <div className="text-center">
                    <span className="text-sm text-gray-600">{footer.label}</span>
                    <Link
                        href={footer.href}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        {footer.cta}
                    </Link>
                </div>
            </div>
        </div>
    );
}
