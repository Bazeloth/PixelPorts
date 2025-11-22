'use client';

import { JSX } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';
import { clientEnv } from '@/env/client';

type Provider = 'google';

type StyleDef = {
    Icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
    label: string;
};

function providerStyles(provider: Provider): StyleDef {
    switch (provider) {
        case 'google':
            return {
                Icon: GoogleIcon,
                label: 'Continue with Google',
            };
    }
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg aria-hidden viewBox="0 0 24 24" {...props}>
            <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            ></path>
            <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            ></path>
            <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            ></path>
            <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            ></path>
        </svg>
    );
}

function OAuthButton({ provider }: { provider: Provider }) {
    const styles = providerStyles(provider)!;

    const onClick = async () => {
        const supabase = await createSupabaseClient();
        const next = '/signup/complete-profile';
        const redirectTo = `${clientEnv.NEXT_PUBLIC_SITE_URL}/auth/callback?next=${encodeURIComponent(next)}`;

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: provider,
            options: { redirectTo },
        });

        if (error) {
            console.error('OAuth sign-in failed:', error);
            return;
        }

        if (data?.url) {
            window.location.assign(data.url);
        }
    };

    return (
        <button
            type="button"
            onClick={onClick}
            className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 cursor-pointer"
        >
            <styles.Icon className="w-5 h-5 mr-2" />
            {styles.label}
        </button>
    );
}

export default function OAuthButtons() {
    return (
        <div className="space-y-3">
            <OAuthButton provider="google" />
        </div>
    );
}
