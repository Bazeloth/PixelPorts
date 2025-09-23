'use client';

import { useTransition } from 'react';
import { signInWithOAuth } from '@/app/(auth)/actions';

type Provider = 'google' | 'linkedin';

function providerStyles(provider: Provider) {
  const base = 'flex w-full items-center justify-center gap-2 rounded px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  switch (provider) {
    case 'google':
      return {
        btn: `${base} border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 active:bg-gray-100 focus:ring-gray-300`,
        Icon: GoogleIcon,
        label: 'Continue with Google',
      };
    case 'linkedin':
      return {
        btn: `${base} bg-[#0A66C2] text-white hover:bg-[#0959A8] active:bg-[#084C8F] focus:ring-[#0A66C2]`,
        Icon: LinkedInIcon,
        label: 'Continue with LinkedIn',
      };
  }
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" {...props}>
      <path fill="#EA4335" d="M12 10.2v3.9h6.4c-.3 1.9-2.1 5.5-6.4 5.5-3.9 0-7.1-3.2-7.1-7.1S8.1 5.4 12 5.4c2.2 0 3.6.9 4.5 1.7l3.1-3.1C17.8 2 15.1.9 12 .9 5.8.9.9 5.8.9 12S5.8 23.1 12 23.1c6.9 0 11.4-4.8 11.4-11.6 0-.8-.1-1.3-.2-1.9H12z"/>
    </svg>
  );
}

function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" {...props}>
      <path fill="#FFFFFF" d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V23h-4V8.5zM8.5 8.5h3.8v2h.1C13 9.1 14.6 8 16.9 8c4.1 0 4.8 2.7 4.8 6.1V23h-4v-5.3c0-1.3 0-3-1.9-3s-2.2 1.5-2.2 2.9V23h-4V8.5z"/>
    </svg>
  );
}

function OAuthButton({ provider }: { provider: Provider }) {
  const [pending, startTransition] = useTransition();
  const styles = providerStyles(provider)!;

  const onClick = () => {
    startTransition(async () => {
      const res = await signInWithOAuth(provider);
      if (res && 'url' in res && res.url) {
        window.location.href = res.url;
      }
    });
  };

  return (
    <button type="button" onClick={onClick} className={styles.btn} disabled={pending}>
      <styles.Icon />
      {pending ? 'Connecting…' : styles.label}
    </button>
  );
}

export default function OAuthButtons() {
  return (
    <div className="space-y-2">
      <OAuthButton provider="google" />
      <OAuthButton provider="linkedin" />
    </div>
  );
}
